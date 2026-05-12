package com.bugsprint.bug.controller;

import com.bugsprint.bug.entity.Comment;
import com.bugsprint.bug.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentRepository commentRepository;

    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment, @RequestHeader("X-User-Id") String userId) {
        comment.setAuthorId(UUID.fromString(userId));
        return ResponseEntity.ok(commentRepository.save(comment));
    }

    @GetMapping("/bug/{bugId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable UUID bugId) {
        return ResponseEntity.ok(commentRepository.findByBugIdOrderByCreatedAtAsc(bugId));
    }
}
