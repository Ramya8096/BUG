package com.bugsprint.bug.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "ai-service")
public interface AiClient {
    @PostMapping("/api/ai/classify")
    Map<String, String> classify(@RequestBody Map<String, String> request);

    @PostMapping("/api/ai/similar")
    Object findSimilar(@RequestBody Map<String, Object> request);
}
