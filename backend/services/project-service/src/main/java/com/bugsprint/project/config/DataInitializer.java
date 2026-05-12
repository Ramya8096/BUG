package com.bugsprint.project.config;

import com.bugsprint.project.entity.Project;
import com.bugsprint.project.entity.ProjectMember;
import com.bugsprint.project.repository.ProjectMemberRepository;
import com.bugsprint.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;

    @Override
    public void run(String... args) {
        if (projectRepository.count() == 0) {
            Project authProject = Project.builder()
                    .id(UUID.fromString("b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21"))
                    .projectKey("AUTH")
                    .name("Authentication Module")
                    .description("Handles JWT, OAuth and User sessions.")
                    .ownerId(UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"))
                    .build();
            projectRepository.save(authProject);

            projectMemberRepository.save(ProjectMember.builder()
                    .projectId(authProject.getId())
                    .userId(UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"))
                    .build());
            projectMemberRepository.save(ProjectMember.builder()
                    .projectId(authProject.getId())
                    .userId(UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12"))
                    .build());
        }
    }
}
