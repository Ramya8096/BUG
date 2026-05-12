package com.bugsprint.project.controller;

import com.bugsprint.project.entity.Project;
import com.bugsprint.project.entity.ProjectMember;
import com.bugsprint.project.repository.ProjectMemberRepository;
import com.bugsprint.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<Project> createProject(@RequestBody Project project, @RequestHeader("X-User-Id") String userId) {
        project.setOwnerId(UUID.fromString(userId));
        Project savedProject = projectRepository.save(project);
        
        // Add owner as member
        ProjectMember member = ProjectMember.builder()
                .projectId(savedProject.getId())
                .userId(UUID.fromString(userId))
                .build();
        projectMemberRepository.save(member);
        
        return ResponseEntity.ok(savedProject);
    }

    @GetMapping
    public ResponseEntity<List<Project>> getMyProjects(@RequestHeader("X-User-Id") String userId) {
        List<UUID> projectIds = projectMemberRepository.findByUserId(UUID.fromString(userId))
                .stream().map(ProjectMember::getProjectId).collect(Collectors.toList());
        return ResponseEntity.ok(projectRepository.findAllById(projectIds));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable UUID id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<ProjectMember> addMember(@PathVariable UUID id, @RequestBody Map<String, UUID> body) {
        ProjectMember member = ProjectMember.builder()
                .projectId(id)
                .userId(body.get("userId"))
                .build();
        return ResponseEntity.ok(projectMemberRepository.save(member));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<UUID>> getMembers(@PathVariable UUID id) {
        return ResponseEntity.ok(
                projectMemberRepository.findByProjectId(id).stream()
                        .map(ProjectMember::getUserId)
                        .collect(Collectors.toList())
        );
    }

    @PostMapping("/{id}/next-bug-number")
    @Transactional
    public ResponseEntity<Integer> getNextBugNumber(@PathVariable UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setBugCounter(project.getBugCounter() + 1);
        projectRepository.save(project);
        return ResponseEntity.ok(project.getBugCounter());
    }
}
