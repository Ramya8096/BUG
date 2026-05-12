package com.bugsprint.bug.controller;

import com.bugsprint.bug.entity.Bug;
import com.bugsprint.bug.entity.Status;
import com.bugsprint.bug.repository.BugRepository;
import com.bugsprint.bug.service.BugService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/bugs")
@RequiredArgsConstructor
public class BugController {

    private final BugRepository bugRepository;
    private final BugService bugService;

    @PostMapping
    public ResponseEntity<Bug> createBug(@RequestBody Bug bug, 
                                       @RequestHeader("X-User-Id") String userId,
                                       @RequestParam("projectKey") String projectKey) {
        bug.setReporterId(UUID.fromString(userId));
        return ResponseEntity.ok(bugService.createBug(bug, projectKey));
    }

    @GetMapping
    public ResponseEntity<List<Bug>> listBugs(@RequestParam UUID projectId,
                                            @RequestParam(required = false) Status status,
                                            @RequestParam(required = false) UUID assigneeId) {
        return ResponseEntity.ok(bugRepository.findWithFilters(projectId, status, assigneeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bug> getBug(@PathVariable UUID id) {
        return bugRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Bug> updateStatus(@PathVariable UUID id, @RequestBody Map<String, Status> body) {
        Bug bug = bugRepository.findById(id).orElseThrow();
        bug.setStatus(body.get("status"));
        bug.setUpdatedAt(Instant.now());
        return ResponseEntity.ok(bugRepository.save(bug));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<Bug> assign(@PathVariable UUID id, @RequestBody Map<String, UUID> body) {
        Bug bug = bugRepository.findById(id).orElseThrow();
        bug.setAssigneeId(body.get("assigneeId"));
        bug.setUpdatedAt(Instant.now());
        Bug savedBug = bugRepository.save(bug);
        
        bugService.sendNotification(savedBug, "BUG_ASSIGNED", "Bug assigned: " + savedBug.getBugKey());
        
        return ResponseEntity.ok(savedBug);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBug(@PathVariable UUID id) {
        bugRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
