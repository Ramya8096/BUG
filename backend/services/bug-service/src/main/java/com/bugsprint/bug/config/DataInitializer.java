package com.bugsprint.bug.config;

import com.bugsprint.bug.entity.Bug;
import com.bugsprint.bug.entity.Priority;
import com.bugsprint.bug.entity.Status;
import com.bugsprint.bug.repository.BugRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final BugRepository bugRepository;

    @Override
    public void run(String... args) {
        if (bugRepository.count() == 0) {
            bugRepository.save(Bug.builder()
                    .id(UUID.fromString("c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31"))
                    .bugKey("AUTH-1")
                    .projectId(UUID.fromString("b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21"))
                    .title("Login token expires too soon")
                    .description("JWT token expiration is set to 5 minutes instead of 24 hours.")
                    .status(Status.OPEN)
                    .priority(Priority.HIGH)
                    .category("BACKEND")
                    .reporterId(UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14"))
                    .assigneeId(UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12"))
                    .build());
        }
    }
}
