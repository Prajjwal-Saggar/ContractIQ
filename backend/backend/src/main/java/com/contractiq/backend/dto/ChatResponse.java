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
public class ChatResponse {

    private Long id;
    private String question;
    private String answer;

    // the actual clause texts used to generate the answer
    private List<ClauseResponse> sourceClauses;

    private LocalDateTime askedAt;
    private String contractName;
}