package com.contractiq.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskSummaryResponse {

    private long totalContracts;
    private long readyContracts;
    private long processingContracts;
    private long totalRiskFlags;
    private long highRiskFlags;
    private long mediumRiskFlags;
    private long lowRiskFlags;

    // top 3 riskiest contracts
    private List<ContractResponse> mostRiskyContracts;
}