package com.contractiq.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChatRequest {

    @NotNull(message = "Contract ID is required")
    private Long contractId;

    @NotBlank(message = "Question cannot be empty")
    private String question;
}