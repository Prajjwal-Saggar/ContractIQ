package com.contractiq.backend.service;

import com.contractiq.backend.client.EmbeddingClient;
import com.contractiq.backend.client.GeminiClient;
import com.contractiq.backend.dto.ChatRequest;
import com.contractiq.backend.dto.ChatResponse;
import com.contractiq.backend.dto.ClauseResponse;
import com.contractiq.backend.model.*;
import com.contractiq.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ContractRepository contractRepository;
    private final ClauseRepository clauseRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final EmbeddingClient embeddingClient;
    private final GeminiClient geminiClient;
    private final ContractService contractService;

    private static final int TOP_K_CLAUSES = 5;

    @Transactional
    public ChatResponse askQuestion(ChatRequest request,
                                    String userEmail) {

        // ── Step 1: validate contract + ownership ──────────
        Contract contract = contractRepository
                .findById(request.getContractId())
                .orElseThrow(() -> new RuntimeException(
                        "Contract not found."));

        if (!contract.getUploadedBy()
                .getEmail().equals(userEmail)) {
            throw new RuntimeException(
                    "Access denied to this contract.");
        }

        if (contract.getStatus() != ContractStatus.READY) {
            throw new RuntimeException(
                    "Contract is not ready yet. " +
                            "Current status: "
                            + contract.getStatus().name());
        }

        // ── Step 2: embed the question ─────────────────────
        log.info("Embedding question for contract {}",
                contract.getId());

        List<Float> questionEmbedding =
                embeddingClient.embedText(
                        request.getQuestion());

        String vectorString = EmbeddingClient
                .toVectorString(questionEmbedding);

        // ── Step 3: similarity search in pgvector ──────────
        log.info("Running similarity search...");

        List<Clause> similarClauses = clauseRepository
                .findSimilarClauses(
                        contract.getId(),
                        vectorString,
                        TOP_K_CLAUSES);

        if (similarClauses.isEmpty()) {
            throw new RuntimeException(
                    "No relevant clauses found " +
                            "for your question.");
        }

        log.info("Found {} similar clauses",
                similarClauses.size());

        // ── Step 4: build RAG prompt ───────────────────────
        String prompt = buildRagPrompt(
                request.getQuestion(),
                similarClauses,
                contract.getOriginalFileName());

        // ── Step 5: call Gemini LLM ────────────────────────
        log.info("Calling Gemini for answer...");
        String answer = geminiClient.generateAnswer(prompt);

        // ── Step 6: save chat message ──────────────────────
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException(
                        "User not found."));

        String sourceClauseIds = similarClauses.stream()
                .map(c -> c.getId().toString())
                .collect(Collectors.joining(","));

        ChatMessage message = ChatMessage.builder()
                .contract(contract)
                .user(user)
                .question(request.getQuestion())
                .answer(answer)
                .sourceClauses(sourceClauseIds)
                .build();

        ChatMessage saved =
                chatMessageRepository.save(message);

        // ── Step 7: build response with citations ──────────
        List<ClauseResponse> sourceClauseResponses =
                similarClauses.stream()
                        .map(contractService
                                ::mapClauseToResponse)
                        .collect(Collectors.toList());

        return ChatResponse.builder()
                .id(saved.getId())
                .question(request.getQuestion())
                .answer(answer)
                .sourceClauses(sourceClauseResponses)
                .askedAt(saved.getAskedAt())
                .contractName(
                        contract.getOriginalFileName())
                .build();
    }

    // ── get chat history for a contract ───────────────────────
    public List<ChatResponse> getChatHistory(
            Long contractId, String userEmail) {

        Contract contract = contractRepository
                .findById(contractId)
                .orElseThrow(() -> new RuntimeException(
                        "Contract not found."));

        if (!contract.getUploadedBy()
                .getEmail().equals(userEmail)) {
            throw new RuntimeException(
                    "Access denied.");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException(
                        "User not found."));

        return chatMessageRepository
                .findByContractAndUserOrderByAskedAtAsc(
                        contract, user)
                .stream()
                .map(msg -> ChatResponse.builder()
                        .id(msg.getId())
                        .question(msg.getQuestion())
                        .answer(msg.getAnswer())
                        .askedAt(msg.getAskedAt())
                        .contractName(
                                contract.getOriginalFileName())
                        .build())
                .collect(Collectors.toList());
    }

    // ── clear chat history ─────────────────────────────────────
    @Transactional
    public void clearChatHistory(Long contractId,
                                 String userEmail) {

        Contract contract = contractRepository
                .findById(contractId)
                .orElseThrow(() -> new RuntimeException(
                        "Contract not found."));

        if (!contract.getUploadedBy()
                .getEmail().equals(userEmail)) {
            throw new RuntimeException("Access denied.");
        }

        chatMessageRepository.deleteByContract(contract);
        log.info("Chat history cleared for contract {}",
                contractId);
    }

    // ── RAG prompt builder ─────────────────────────────────────
    private String buildRagPrompt(
            String question,
            List<Clause> clauses,
            String contractName) {

        StringBuilder context = new StringBuilder();
        for (int i = 0; i < clauses.size(); i++) {
            context.append("Clause ")
                    .append(i + 1)
                    .append(":\n")
                    .append(clauses.get(i).getClauseText())
                    .append("\n\n");
        }

        return """
                You are a legal document assistant helping \
                users understand their contracts.

                Contract name: %s

                Below are the most relevant sections from \
                the contract, retrieved based on semantic \
                similarity to the user's question:

                --- RELEVANT CONTRACT SECTIONS ---
                %s
                --- END OF SECTIONS ---

                User's question: %s

                Instructions:
                - Answer the question based ONLY on the \
                contract sections provided above
                - Be precise and cite which clause \
                contains the information
                - If the answer is not found in the \
                provided sections, say: "This information \
                was not found in the relevant sections \
                of this contract."
                - Keep your answer concise and professional
                - Do not make up information not present \
                in the contract

                Answer:
                """.formatted(
                contractName,
                context.toString(),
                question);
    }
}