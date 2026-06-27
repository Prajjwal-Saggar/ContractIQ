package com.contractiq.backend.client;

import com.contractiq.backend.dto.ChunkEmbeddingResponse;
import com.contractiq.backend.dto.EmbeddingRequest;
import com.contractiq.backend.dto.EmbeddingResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmbeddingClient {

    private final RestTemplate restTemplate;

    @Value("${embedding.service.url}")
    private String embeddingServiceUrl;

    // ── embed a single text string ─────────────────────────────
    // used during chat — embed the user's question
    public List<Float> embedText(String text) {

        String url = embeddingServiceUrl + "/embed";

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            EmbeddingRequest request =
                    new EmbeddingRequest(text);

            HttpEntity<EmbeddingRequest> entity =
                    new HttpEntity<>(request, headers);

            ResponseEntity<EmbeddingResponse> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            entity,
                            EmbeddingResponse.class);

            if (response.getBody() == null ||
                    response.getBody().getEmbedding() == null) {
                throw new RuntimeException(
                        "Empty response from embedding service");
            }

            return response.getBody().getEmbedding();

        } catch (Exception e) {
            log.error("Failed to embed text: {}", e.getMessage());
            throw new RuntimeException(
                    "Embedding service unavailable. " +
                            "Please try again later.");
        }
    }

    // ── process a full PDF ─────────────────────────────────────
    // used during contract upload — extract + chunk + embed
    public ChunkEmbeddingResponse processDocument(
            MultipartFile file) {

        String url = embeddingServiceUrl + "/process-document";

        try {
            // build multipart request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(
                    MediaType.MULTIPART_FORM_DATA);

            // wrap file bytes for RestTemplate
            ByteArrayResource fileResource =
                    new ByteArrayResource(file.getBytes()) {
                        @Override
                        public String getFilename() {
                            return file.getOriginalFilename();
                        }
                    };

            MultiValueMap<String, Object> body =
                    new LinkedMultiValueMap<>();
            body.add("file", fileResource);

            HttpEntity<MultiValueMap<String, Object>> entity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<ChunkEmbeddingResponse> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            entity,
                            ChunkEmbeddingResponse.class);

            if (response.getBody() == null) {
                throw new RuntimeException(
                        "Empty response from embedding service");
            }

            log.info("Document processed: {} chunks generated",
                    response.getBody().getTotalChunks());

            return response.getBody();

        } catch (IOException e) {
            log.error("Failed to read file bytes: {}",
                    e.getMessage());
            throw new RuntimeException(
                    "Failed to read uploaded file.");
        } catch (Exception e) {
            log.error("Failed to process document: {}",
                    e.getMessage());
            throw new RuntimeException(
                    "Embedding service unavailable. " +
                            "Please try again later.");
        }
    }

    // ── health check ───────────────────────────────────────────
    // called on startup to verify Python service is reachable
    public boolean isEmbeddingServiceHealthy() {
        try {
            String url = embeddingServiceUrl + "/health";
            ResponseEntity<String> response =
                    restTemplate.getForEntity(url, String.class);
            return response.getStatusCode()
                    .equals(HttpStatus.OK);
        } catch (Exception e) {
            log.warn("Embedding service health check failed: {}",
                    e.getMessage());
            return false;
        }
    }

    // ── convert List<Float> to pgvector string format ──────────
    // pgvector expects: "[0.123, 0.456, 0.789, ...]"
    public static String toVectorString(List<Float> embedding) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < embedding.size(); i++) {
            sb.append(embedding.get(i));
            if (i < embedding.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }

    // ── convert List<Float> to float[] for entity storage ──────
    public static float[] toFloatArray(List<Float> embedding) {
        float[] arr = new float[embedding.size()];
        for (int i = 0; i < embedding.size(); i++) {
            arr[i] = embedding.get(i);
        }
        return arr;
    }
}