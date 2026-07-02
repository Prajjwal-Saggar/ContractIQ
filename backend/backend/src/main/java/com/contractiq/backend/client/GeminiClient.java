package com.contractiq.backend.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class GeminiClient {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final OkHttpClient httpClient = new OkHttpClient
            .Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build();

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    public String generateAnswer(String prompt) {

        String url = apiUrl + "/" + model
                + ":generateContent?key=" + apiKey;

        // build request body
        String requestBody = """
                {
                  "contents": [
                    {
                      "parts": [
                        {
                          "text": %s
                        }
                      ]
                    }
                  ],
                  "generationConfig": {
                    "temperature": 0.2,
                    "maxOutputTokens": 1024
                  }
                }
                """.formatted(
                objectMapper.valueToTree(prompt)
                        .toString());

        RequestBody body = RequestBody.create(
                requestBody,
                MediaType.parse("application/json"));

        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = httpClient
                .newCall(request).execute()) {

            if (!response.isSuccessful()) {
                String errorBody = response.body() != null
                        ? response.body().string() : "empty";
                log.error("Gemini API error {}: {}",
                        response.code(), errorBody);
                // surface rate-limit as a distinct signal
                if (response.code() == 429) {
                    throw new RuntimeException(
                            "GEMINI_RATE_LIMITED");
                }
                throw new RuntimeException(
                        "Gemini API call failed: "
                                + response.code());
            }

            String responseBody = response.body().string();
            JsonNode root = objectMapper
                    .readTree(responseBody);

            // extract text from response
            return root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

        } catch (IOException e) {
            log.error("Gemini request failed: {}",
                    e.getMessage());
            throw new RuntimeException(
                    "Failed to get answer from Gemini: "
                            + e.getMessage());
        }
    }
}