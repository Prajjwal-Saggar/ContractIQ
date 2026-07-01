package com.contractiq.backend.controller;

import com.contractiq.backend.dto.*;
import com.contractiq.backend.service.ContractService;
import com.contractiq.backend.service.RiskFlagService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
@Slf4j
public class ContractController {

    private final ContractService contractService;
    private final RiskFlagService riskFlagService;

    // ── POST /api/contracts/upload ─────────────────────────────
    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ContractUploadResponse> upload(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {

        String userEmail = (String)
                request.getAttribute("userEmail");

        log.info("Upload request from {} — file: {}",
                userEmail, file.getOriginalFilename());

        ContractUploadResponse response =
                contractService.uploadContract(
                        file, userEmail);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ── GET /api/contracts ─────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<ContractResponse>>
    getUserContracts(HttpServletRequest request) {

        String userEmail = (String)
                request.getAttribute("userEmail");

        return ResponseEntity.ok(
                contractService.getUserContracts(
                        userEmail));
    }

    // ── GET /api/contracts/risk-summary ───────────────────────
    // NOTE: this must come BEFORE /{id} mapping
    // otherwise Spring matches "risk-summary" as an ID
    @GetMapping("/risk-summary")
    public ResponseEntity<RiskSummaryResponse> riskSummary(
            HttpServletRequest request) {

        String userEmail = (String)
                request.getAttribute("userEmail");

        return ResponseEntity.ok(
                contractService.getRiskSummary(userEmail));
    }

    // ── GET /api/contracts/{id} ────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<ContractResponse> getContract(
            @PathVariable Long id,
            HttpServletRequest request) {

        String userEmail = (String)
                request.getAttribute("userEmail");

        return ResponseEntity.ok(
                contractService.getContract(
                        id, userEmail));
    }

    // ── GET /api/contracts/{id}/clauses ───────────────────────
    @GetMapping("/{id}/clauses")
    public ResponseEntity<List<ClauseResponse>> getClauses(
            @PathVariable Long id,
            HttpServletRequest request) {

        String userEmail = (String)
                request.getAttribute("userEmail");

        return ResponseEntity.ok(
                contractService.getContractClauses(
                        id, userEmail));
    }

    // ── POST /api/contracts/{id}/analyse-risk ─────────────────
    @PostMapping("/{id}/analyse-risk")
    public ResponseEntity<Map<String, String>> analyseRisk(
            @PathVariable Long id,
            HttpServletRequest request) {

        String userEmail = (String)
                request.getAttribute("userEmail");

        log.info("Risk analysis triggered for " +
                "contract {} by {}", id, userEmail);

        riskFlagService.triggerAnalysis(id, userEmail);

        return ResponseEntity.ok(Map.of(
                "message",
                "Risk analysis complete. " +
                        "Check contract details " +
                        "for flagged clauses."
        ));
    }

    // ── DELETE /api/contracts/{id} ────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(
            @PathVariable Long id,
            HttpServletRequest request) {

        String userEmail = (String)
                request.getAttribute("userEmail");

        contractService.deleteContract(id, userEmail);

        return ResponseEntity.ok(Map.of(
                "message",
                "Contract deleted successfully."));
    }

    // ── GET /api/contracts/health ─────────────────────────────
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "contract-service"));
    }
}