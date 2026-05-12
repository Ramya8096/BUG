package com.bugsprint.bug.repository;

import com.bugsprint.bug.entity.Bug;
import com.bugsprint.bug.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface BugRepository extends JpaRepository<Bug, UUID> {
    List<Bug> findByProjectId(UUID projectId);
    
    @Query("SELECT b FROM Bug b WHERE b.projectId = :projectId " +
           "AND (:status IS NULL OR b.status = :status) " +
           "AND (:assigneeId IS NULL OR b.assigneeId = :assigneeId)")
    List<Bug> findWithFilters(@Param("projectId") UUID projectId, 
                             @Param("status") Status status, 
                             @Param("assigneeId") UUID assigneeId);
}
