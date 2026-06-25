package com.contractiq.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClauseResponse {

    private Long id;
    private String clauseText;
    private Integer chunkIndex;
    private String clauseType;
    private String riskLevel;
    private String riskExplanation;
    private boolean flagged;
}