package com.bugsprint.analytics.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@FeignClient(name = "bug-service")
public interface BugClient {
    @GetMapping("/api/bugs")
    List<Map<String, Object>> listBugs(@RequestParam("projectId") UUID projectId);
}
