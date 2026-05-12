package com.bugsprint.bug.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.UUID;

@FeignClient(name = "project-service")
public interface ProjectClient {
    @PostMapping("/api/projects/{id}/next-bug-number")
    Integer getNextBugNumber(@PathVariable("id") UUID id);

    @GetMapping("/api/projects/{id}")
    Object getProjectById(@PathVariable("id") UUID id);
}
