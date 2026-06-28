package com.contractiq.backend.service;

import com.contractiq.backend.client.EmbeddingClient;
import com.contractiq.backend.dto.*;
import com.contractiq.backend.model.*;
import com.contractiq.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContractService {

    private final ContractRepository contractRepository;
    private final ClauseRepository clauseRepository;
    private final UserRepository userRepository;
    private final EmbeddingClient embeddingClient;

    // ── upload + process ───────────────────────────────────────
    @Transactional
    public ContractUploadResponse uploadContract(
            MultipartFile file,
            String userEmail) {

        // validate file
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty.");
        }
        if (!file.getOriginalFilename()
                .toLowerCase().endsWith(".pdf")) {
            throw new RuntimeException(
                    "Only PDF files are supported.");
        }

        // find user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException(
                        "User not found."));

        // save contract record — status UPLOADED
        Contract contract = Contract.builder()
                .fileName(generateFileName(
                        file.getOriginalFilename()))
                .originalFileName(file.getOriginalFilename())
                .uploadedBy(user)
                .status(ContractStatus.UPLOADED)
                .build();
        Contract saved = contractRepository.save(contract);

        log.info("Contract saved: {} by {}",
                saved.getId(), userEmail);

        // process in same thread for simplicity
        // (async processing is a future enhancement)
        processContract(saved, file);

        return ContractUploadResponse.builder()
                .id(saved.getId())
                .fileName(saved.getFileName())
                .originalFileName(saved.getOriginalFileName())
                .status(saved.getStatus().name())
                .uploadedAt(saved.getUploadedAt())
                .message("Contract uploaded and processed.")
                .build();
    }

    // ── internal processing pipeline ──────────────────────────
    private void processContract(Contract contract,
                                 MultipartFile file) {
        try {
            // update status to PROCESSING
            contract.setStatus(ContractStatus.PROCESSING);
            contractRepository.save(contract);

            // call Python service — extract + chunk + embed
            log.info("Sending contract {} to embedding service",
                    contract.getId());
            ChunkEmbeddingResponse response =
                    embeddingClient.processDocument(file);

            // save each chunk as a Clause entity
            List<Clause> clauses = response.getChunks()
                    .stream()
                    .map(chunk -> Clause.builder()
                            .contract(contract)
                            .clauseText(chunk.getText())
                            .chunkIndex(chunk.getChunkIndex())
                            .embedding(EmbeddingClient
                                    .toFloatArray(
                                            chunk.getEmbedding()))
                            .flagged(false)
                            .build())
                    .collect(Collectors.toList());

            clauseRepository.saveAll(clauses);
            log.info("Saved {} clauses for contract {}",
                    clauses.size(), contract.getId());

            // update contract — READY
            contract.setStatus(ContractStatus.READY);
            contract.setClauseCount(clauses.size());
            contract.setRiskFlagCount(0);
            contractRepository.save(contract);

        } catch (Exception e) {
            log.error("Failed to process contract {}: {}",
                    contract.getId(), e.getMessage());
            contract.setStatus(ContractStatus.FAILED);
            contractRepository.save(contract);
            throw new RuntimeException(
                    "Contract processing failed: "
                            + e.getMessage());
        }
    }

    // ── get all contracts for user ─────────────────────────────
    public List<ContractResponse> getUserContracts(
            String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException(
                        "User not found."));

        return contractRepository
                .findByUploadedByOrderByUploadedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── get single contract ────────────────────────────────────
    public ContractResponse getContract(Long contractId,
                                        String userEmail) {

        Contract contract = findAndValidateOwnership(
                contractId, userEmail);
        return mapToResponseWithClauses(contract);
    }

    // ── get all clauses for a contract ─────────────────────────
    public List<ClauseResponse> getContractClauses(
            Long contractId, String userEmail) {

        Contract contract = findAndValidateOwnership(
                contractId, userEmail);

        return clauseRepository
                .findByContractOrderByChunkIndex(contract)
                .stream()
                .map(this::mapClauseToResponse)
                .collect(Collectors.toList());
    }

    // ── delete contract ────────────────────────────────────────
    @Transactional
    public void deleteContract(Long contractId,
                               String userEmail) {

        Contract contract = findAndValidateOwnership(
                contractId, userEmail);

        clauseRepository.deleteByContract(contract);
        contractRepository.delete(contract);

        log.info("Contract {} deleted by {}",
                contractId, userEmail);
    }

    // ── risk summary ───────────────────────────────────────────
    public RiskSummaryResponse getRiskSummary(
            String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException(
                        "User not found."));

        List<Contract> allContracts =
                contractRepository
                        .findByUploadedByOrderByUploadedAtDesc(
                                user);

        long highRisk = allContracts.stream()
                .filter(c -> c.getRiskFlagCount() != null
                        && c.getRiskFlagCount() > 3)
                .count();

        long medRisk = allContracts.stream()
                .filter(c -> c.getRiskFlagCount() != null
                        && c.getRiskFlagCount() >= 1
                        && c.getRiskFlagCount() <= 3)
                .count();

        List<ContractResponse> riskyContracts =
                contractRepository
                        .findRiskyContractsByUser(user)
                        .stream()
                        .limit(3)
                        .map(this::mapToResponse)
                        .collect(Collectors.toList());

        return RiskSummaryResponse.builder()
                .totalContracts(allContracts.size())
                .readyContracts(allContracts.stream()
                        .filter(c -> c.getStatus()
                                == ContractStatus.READY)
                        .count())
                .processingContracts(allContracts.stream()
                        .filter(c -> c.getStatus()
                                == ContractStatus.PROCESSING)
                        .count())
                .totalRiskFlags(allContracts.stream()
                        .mapToLong(c -> c.getRiskFlagCount()
                                != null
                                ? c.getRiskFlagCount() : 0)
                        .sum())
                .highRiskFlags(highRisk)
                .mediumRiskFlags(medRisk)
                .mostRiskyContracts(riskyContracts)
                .build();
    }

    // ── helpers ────────────────────────────────────────────────
    private Contract findAndValidateOwnership(
            Long contractId, String userEmail) {

        Contract contract = contractRepository
                .findById(contractId)
                .orElseThrow(() -> new RuntimeException(
                        "Contract not found: " + contractId));

        // verify ownership — users can only see their own
        if (!contract.getUploadedBy()
                .getEmail().equals(userEmail)) {
            throw new RuntimeException(
                    "Access denied to contract: "
                            + contractId);
        }

        return contract;
    }

    private String generateFileName(String originalName) {
        return System.currentTimeMillis()
                + "_" + originalName
                .replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    public ContractResponse mapToResponse(Contract c) {
        return ContractResponse.builder()
                .id(c.getId())
                .fileName(c.getFileName())
                .originalFileName(c.getOriginalFileName())
                .status(c.getStatus().name())
                .clauseCount(c.getClauseCount())
                .riskFlagCount(c.getRiskFlagCount())
                .summary(c.getSummary())
                .uploadedAt(c.getUploadedAt())
                .processedAt(c.getProcessedAt())
                .uploadedBy(c.getUploadedBy().getEmail())
                .build();
    }

    private ContractResponse mapToResponseWithClauses(
            Contract c) {

        List<ClauseResponse> flagged = clauseRepository
                .findByContractAndFlaggedTrue(c)
                .stream()
                .map(this::mapClauseToResponse)
                .collect(Collectors.toList());

        long high = clauseRepository
                .findByContractAndRiskLevel(
                        c, RiskLevel.HIGH).size();
        long med = clauseRepository
                .findByContractAndRiskLevel(
                        c, RiskLevel.MEDIUM).size();
        long low = clauseRepository
                .findByContractAndRiskLevel(
                        c, RiskLevel.LOW).size();

        ContractResponse response = mapToResponse(c);
        response.setHighRiskCount(high);
        response.setMediumRiskCount(med);
        response.setLowRiskCount(low);
        response.setFlaggedClauses(flagged);
        return response;
    }

    public ClauseResponse mapClauseToResponse(Clause cl) {
        return ClauseResponse.builder()
                .id(cl.getId())
                .clauseText(cl.getClauseText())
                .chunkIndex(cl.getChunkIndex())
                .clauseType(cl.getClauseType())
                .riskLevel(cl.getRiskLevel() != null
                        ? cl.getRiskLevel().name() : null)
                .riskExplanation(cl.getRiskExplanation())
                .flagged(cl.isFlagged())
                .build();
    }
}