package com.bugsprint.bug.repository;

import com.bugsprint.bug.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByBugIdOrderByCreatedAtAsc(UUID bugId);
}
