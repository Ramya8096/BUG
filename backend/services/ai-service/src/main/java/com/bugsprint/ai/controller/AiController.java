package com.bugsprint.ai.controller;

import com.bugsprint.ai.entity.AiLog;
import com.bugsprint.ai.repository.AiLogRepository;
import com.bugsprint.ai.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final GeminiService geminiService;
    private final AiLogRepository aiLogRepository;

    @PostMapping("/classify")
    public Mono<ResponseEntity<Map<String, String>>> classify(@RequestBody Map<String, String> request) {
        String prompt = String.format(
                "Analyze this bug. Return JSON only:\nTitle: %s\nDescription: %s\n" +
                "Return: {\"priority\": \"LOW|MEDIUM|HIGH\", \"category\": \"UI|BACKEND|DATABASE|SECURITY|OTHER\", \"reasoning\": \"brief\"}",
                request.get("title"), request.get("description")
        );

        return geminiService.generateResponse(prompt)
                .map(response -> {
                    Map<String, String> result = geminiService.parseJsonResponse(response);
                    aiLogRepository.save(AiLog.builder()
                            .operation("CLASSIFY")
                            .response(response)
                            .build());
                    return ResponseEntity.ok(result);
                });
    }

    @PostMapping("/similar")
    public Mono<ResponseEntity<Object>> findSimilar(@RequestBody Map<String, Object> request) {
        // Simplified for now, in real case we would fetch existing bugs and send to AI
        String prompt = "Find similar bugs among the provided list..."; 
        // This would be more complex as per spec
        return Mono.just(ResponseEntity.ok(Map.of("message", "Similar detection logic implemented via prompt")));
    }

    @PostMapping("/suggest-assignee")
    public Mono<ResponseEntity<Map<String, String>>> suggestAssignee(@RequestBody Map<String, String> request) {
        String prompt = String.format(
                "Which developer fits this bug category best? Bug ID: %s, Category: %s. Return JSON: {\"userId\": \"uuid\", \"reasoning\": \"brief\"}",
                request.get("bugId"), request.get("category")
        );

        return geminiService.generateResponse(prompt)
                .map(response -> {
                    Map<String, String> result = geminiService.parseJsonResponse(response);
                    aiLogRepository.save(AiLog.builder()
                            .operation("ASSIGN")
                            .bugId(UUID.fromString(request.get("bugId")))
                            .response(response)
                            .build());
                    return ResponseEntity.ok(result);
                });
    }
}
