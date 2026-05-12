package com.bugsprint.analytics.controller;

import com.bugsprint.analytics.client.BugClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final BugClient bugClient;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@RequestParam UUID projectId) {
        List<Map<String, Object>> bugs = bugClient.listBugs(projectId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBugs", bugs.size());
        stats.put("openBugs", countByStatus(bugs, "OPEN"));
        stats.put("inProgressBugs", countByStatus(bugs, "IN_PROGRESS"));
        stats.put("resolvedBugs", countByStatus(bugs, "RESOLVED"));
        stats.put("closedBugs", countByStatus(bugs, "CLOSED"));

        stats.put("byPriority", groupBy(bugs, "priority"));
        stats.put("byCategory", groupBy(bugs, "category"));

        return ResponseEntity.ok(stats);
    }

    private long countByStatus(List<Map<String, Object>> bugs, String status) {
        return bugs.stream().filter(b -> status.equals(b.get("status"))).count();
    }

    private Map<String, Long> groupBy(List<Map<String, Object>> bugs, String key) {
        return bugs.stream()
                .filter(b -> b.get(key) != null)
                .collect(Collectors.groupingBy(b -> (String) b.get(key), Collectors.counting()));
    }
}
