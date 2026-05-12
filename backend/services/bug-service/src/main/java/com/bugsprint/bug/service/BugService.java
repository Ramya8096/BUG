package com.bugsprint.bug.service;

import com.bugsprint.bug.client.AiClient;
import com.bugsprint.bug.client.NotificationClient;
import com.bugsprint.bug.client.ProjectClient;
import com.bugsprint.bug.entity.Bug;
import com.bugsprint.bug.entity.Priority;
import com.bugsprint.bug.entity.Status;
import com.bugsprint.bug.repository.BugRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BugService {

    private final BugRepository bugRepository;
    private final ProjectClient projectClient;
    private final AiClient aiClient;
    private final NotificationClient notificationClient;

    @Transactional
    public Bug createBug(Bug bug, String projectKey) {
        Integer nextNumber = projectClient.getNextBugNumber(bug.getProjectId());
        bug.setBugKey(projectKey + "-" + nextNumber);
        bug.setStatus(Status.OPEN);
        bug.setCreatedAt(Instant.now());
        bug.setUpdatedAt(Instant.now());
        
        Bug savedBug = bugRepository.save(bug);
        
        // Trigger AI classification and duplicate check
        classifyAndCheckDuplicates(savedBug);
        
        return savedBug;
    }

    @Async
    public void classifyAndCheckDuplicates(Bug bug) {
        try {
            Map<String, String> classification = aiClient.classify(Map.of(
                    "title", bug.getTitle(),
                    "description", bug.getDescription()
            ));
            
            bug.setPriority(Priority.valueOf(classification.get("priority")));
            bug.setCategory(classification.get("category"));
            bugRepository.save(bug);
            
            // Send notification if assigned
            if (bug.getAssigneeId() != null) {
                sendNotification(bug, "BUG_ASSIGNED", "New bug assigned: " + bug.getBugKey());
            }
            
        } catch (Exception e) {
            // Log error
            System.err.println("AI classification failed: " + e.getMessage());
        }
    }

    public void sendNotification(Bug bug, String type, String title) {
        notificationClient.sendNotification(Map.of(
                "userId", bug.getAssigneeId(),
                "type", type,
                "title", title,
                "message", bug.getTitle(),
                "relatedBugId", bug.getId()
        ));
    }
}
