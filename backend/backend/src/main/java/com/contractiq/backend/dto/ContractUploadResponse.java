package com.contractiq.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractUploadResponse {

    private Long id;
    private String fileName;
    private String originalFileName;
    private String status;
    private LocalDateTime uploadedAt;
    private String message;
}