package com.contractiq.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractResponse {

    private Long id;
    private String fileName;
    private String originalFileName;
    private String status;
    private Integer clauseCount;
    private Integer riskFlagCount;
    private String summary;
    private LocalDateTime uploadedAt;
    private LocalDateTime processedAt;
    private String uploadedBy;

    // risk breakdown by level
    private Long highRiskCount;
    private Long mediumRiskCount;
    private Long lowRiskCount;

    // flagged clauses for quick preview
    private List<ClauseResponse> flaggedClauses;
}