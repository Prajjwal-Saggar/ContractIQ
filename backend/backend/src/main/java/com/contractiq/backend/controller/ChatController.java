package com.contractiq.backend.controller;

import com.contractiq.backend.dto.ChatRequest;
import com.contractiq.backend.dto.ChatResponse;
import com.contractiq.backend.service.ChatService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;

    // POST /api/chat/ask
    @PostMapping("/ask")
    public ResponseEntity<ChatResponse> ask(
            @Valid @RequestBody ChatRequest request,
            HttpServletRequest httpRequest) {

        String userEmail = (String)
                httpRequest.getAttribute("userEmail");

        log.info("Chat request from {} on contract {}",
                userEmail, request.getContractId());

        ChatResponse response =
                chatService.askQuestion(
                        request, userEmail);

        return ResponseEntity.ok(response);
    }

    // GET /api/chat/history/{contractId}
    @GetMapping("/history/{contractId}")
    public ResponseEntity<List<ChatResponse>> history(
            @PathVariable Long contractId,
            HttpServletRequest httpRequest) {

        String userEmail = (String)
                httpRequest.getAttribute("userEmail");

        return ResponseEntity.ok(
                chatService.getChatHistory(
                        contractId, userEmail));
    }

    // DELETE /api/chat/history/{contractId}
    @DeleteMapping("/history/{contractId}")
    public ResponseEntity<Map<String, String>> clearHistory(
            @PathVariable Long contractId,
            HttpServletRequest httpRequest) {

        String userEmail = (String)
                httpRequest.getAttribute("userEmail");

        chatService.clearChatHistory(
                contractId, userEmail);

        return ResponseEntity.ok(Map.of(
                "message",
                "Chat history cleared successfully."));
    }

    // GET /api/chat/health
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "chat-service"));
    }
}