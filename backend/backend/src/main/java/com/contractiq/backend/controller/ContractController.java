package com.contractiq.backend.controller;

import com.contractiq.backend.dto.*;
import com.contractiq.backend.service.ContractService;
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

    // POST /api/contracts/upload
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

    // GET /api/contracts
    @GetMapping
    public ResponseEntity<List<ContractResponse>>
    getUserContracts(HttpServletRequest request) {

        String userEmail = (String)
                request.getAttribute("userEmail");

        return ResponseEntity.ok(
                contractService.getUserContracts(userEmail));
    }

    // GET /api/contracts/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ContractResponse> getContract(
            @PathVariable Long id,
            HttpServletRequest request) {

        String userEmail = (String)
                request.getAttribute("userEmail");

        return ResponseEntity.ok(
                contractService.getContract(id, userEmail));
    }

    // GET /api/contracts/{id}/clauses
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

    // DELETE /api/contracts/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(
            @PathVariable Long id,
            HttpServletRequest request) {

        String userEmail = (String)
                request.getAttribute("userEmail");

        contractService.deleteContract(id, userEmail);

        return ResponseEntity.ok(Map.of(
                "message", "Contract deleted successfully."));
    }

    // GET /api/contracts/risk-summary
    @GetMapping("/risk-summary")
    public ResponseEntity<RiskSummaryResponse> riskSummary(
            HttpServletRequest request) {

        String userEmail = (String)
                request.getAttribute("userEmail");

        return ResponseEntity.ok(
                contractService.getRiskSummary(userEmail));
    }

    // GET /api/contracts/health
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "contract-service"));
    }
}