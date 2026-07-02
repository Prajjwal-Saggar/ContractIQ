package com.contractiq.backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // validation errors — field level
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String field = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(field, message);
        });
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errors);
    }

    // RestTemplate connection failures (embedding service down)
    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<Map<String, String>> handleResourceAccess(
            ResourceAccessException ex) {
        log.error("Service connection failed: {}", ex.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("error",
                "Embedding service is unreachable. " +
                "Please ensure the embedding service is running " +
                "on port 8000 and try again.");
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(error);
    }

    // business logic errors from services
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(
            RuntimeException ex) {
        log.error("Runtime exception: {}", ex.getMessage());
        Map<String, String> error = new HashMap<>();

        String message = ex.getMessage() != null
                ? ex.getMessage() : "Unknown error";

        // Gemini rate limit → 429
        if (message.contains("GEMINI_RATE_LIMITED")) {
            error.put("error",
                    "AI rate limit reached. Please wait a few " +
                    "seconds and try again.");
            return ResponseEntity
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(error);
        }

        // Gemini API failure (non-429) → 502
        if (message.contains("Gemini API call failed")) {
            error.put("error",
                    "AI service is temporarily unavailable. " +
                    "Please try again shortly.");
            return ResponseEntity
                    .status(HttpStatus.BAD_GATEWAY)
                    .body(error);
        }

        // infrastructure / downstream failures → 503
        if (message.contains("Embedding service unavailable")
                || message.contains("Connection refused")
                || message.contains("embedding service")
                || message.contains("I/O error")) {
            error.put("error",
                    "Embedding service is unavailable. " +
                    "Please ensure the embedding service is running " +
                    "and try again.");
            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(error);
        }

        // business validation errors → 400
        error.put("error", message);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(error);
    }

    // PDF too large
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> handleFileTooLarge(
            MaxUploadSizeExceededException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error",
                "File too large. Maximum size is 20MB.");
        return ResponseEntity
                .status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(error);
    }

    // catch everything else
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneral(
            Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("error",
                "Something went wrong. Please try again.");
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }
}