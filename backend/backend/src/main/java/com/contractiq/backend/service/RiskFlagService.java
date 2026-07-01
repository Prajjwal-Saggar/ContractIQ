package com.contractiq.backend.service;

import com.contractiq.backend.client.GeminiClient;
import com.contractiq.backend.model.*;
import com.contractiq.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RiskFlagService {

    private final ClauseRepository clauseRepository;
    private final ContractRepository contractRepository;
    private final GeminiClient geminiClient;

    // ── analyse all clauses of a contract ─────────────────────
    @Transactional
    public void analyseContract(Long contractId) {

        Contract contract = contractRepository
                .findById(contractId)
                .orElseThrow(() -> new RuntimeException(
                        "Contract not found."));

        List<Clause> clauses = clauseRepository
                .findByContractOrderByChunkIndex(contract);

        if (clauses.isEmpty()) {
            log.warn("No clauses found for contract {}",
                    contractId);
            return;
        }

        log.info("Analysing {} clauses for risk in " +
                "contract {}", clauses.size(), contractId);

        int flagCount = 0;

        for (Clause clause : clauses) {
            try {
                RiskAnalysis analysis =
                        analyseClause(clause.getClauseText());

                clause.setRiskLevel(analysis.level);
                clause.setClauseType(analysis.type);
                clause.setRiskExplanation(
                        analysis.explanation);
                clause.setFlagged(
                        analysis.level == RiskLevel.HIGH
                                || analysis.level == RiskLevel.MEDIUM);

                clauseRepository.save(clause);

                if (clause.isFlagged()) flagCount++;

            } catch (Exception e) {
                log.error("Failed to analyse clause {}: {}",
                        clause.getId(), e.getMessage());
                // continue to next clause — don't fail all
            }
        }

        // update contract risk flag count
        contract.setRiskFlagCount(flagCount);
        contract.setProcessedAt(LocalDateTime.now());
        contractRepository.save(contract);

        log.info("Risk analysis complete for contract {}." +
                " Flags: {}", contractId, flagCount);
    }

    // ── analyse a single clause ────────────────────────────────
    private RiskAnalysis analyseClause(String clauseText) {

        String prompt = """
                You are a legal risk analyst reviewing \
                contract clauses for an Indian business context.

                Analyse the following contract clause and \
                respond with EXACTLY this format, \
                nothing else:

                RISK_LEVEL: [HIGH/MEDIUM/LOW]
                CLAUSE_TYPE: [type of clause in 3-5 words]
                EXPLANATION: [one sentence explanation \
                if HIGH or MEDIUM risk, else "Low risk clause"]

                Contract clause to analyse:
                %s

                Important rules:
                - HIGH risk: auto-renewal without notice, \
                unlimited liability, one-sided termination, \
                IP ownership transfer, non-compete > 1 year
                - MEDIUM risk: payment penalties, \
                dispute resolution clauses, \
                confidentiality obligations, \
                30+ day notice periods
                - LOW risk: standard definitions, \
                boilerplate language, \
                governing law, standard warranties
                """.formatted(clauseText);

        String response = geminiClient.generateAnswer(prompt);
        return parseRiskResponse(response);
    }

    // ── parse Gemini response ──────────────────────────────────
    private RiskAnalysis parseRiskResponse(String response) {

        RiskAnalysis analysis = new RiskAnalysis();
        analysis.level = RiskLevel.LOW;
        analysis.type = "General Clause";
        analysis.explanation = "Low risk clause";

        try {
            String[] lines = response.split("\n");
            for (String line : lines) {
                line = line.trim();

                if (line.startsWith("RISK_LEVEL:")) {
                    String level = line
                            .replace("RISK_LEVEL:", "")
                            .trim().toUpperCase();
                    if (level.contains("HIGH"))
                        analysis.level = RiskLevel.HIGH;
                    else if (level.contains("MEDIUM"))
                        analysis.level = RiskLevel.MEDIUM;
                    else
                        analysis.level = RiskLevel.LOW;
                }

                if (line.startsWith("CLAUSE_TYPE:")) {
                    analysis.type = line
                            .replace("CLAUSE_TYPE:", "")
                            .trim();
                }

                if (line.startsWith("EXPLANATION:")) {
                    analysis.explanation = line
                            .replace("EXPLANATION:", "")
                            .trim();
                }
            }
        } catch (Exception e) {
            log.warn("Failed to parse risk response: {}",
                    e.getMessage());
        }

        return analysis;
    }

    // ── trigger risk analysis from controller ──────────────────
    @Transactional
    public void triggerAnalysis(Long contractId,
                                String userEmail) {

        Contract contract = contractRepository
                .findById(contractId)
                .orElseThrow(() -> new RuntimeException(
                        "Contract not found."));

        if (!contract.getUploadedBy()
                .getEmail().equals(userEmail)) {
            throw new RuntimeException("Access denied.");
        }

        if (contract.getStatus() != ContractStatus.READY) {
            throw new RuntimeException(
                    "Contract must be READY " +
                            "before risk analysis.");
        }

        analyseContract(contractId);
    }

    // ── internal data class ────────────────────────────────────
    private static class RiskAnalysis {
        RiskLevel level;
        String type;
        String explanation;
    }
}