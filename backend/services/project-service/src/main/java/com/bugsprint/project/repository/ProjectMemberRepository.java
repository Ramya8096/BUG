package com.bugsprint.project.repository;

import com.bugsprint.project.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, UUID> {
    List<ProjectMember> findByUserId(UUID userId);
    List<ProjectMember> findByProjectId(UUID projectId);
}
