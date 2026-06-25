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
public class ChunkEmbeddingResponse {

    // list of chunks, each with text + embedding
    private List<ChunkData> chunks;
    private int totalChunks;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChunkData {
        private int chunkIndex;
        private String text;
        private List<Float> embedding;
    }
}