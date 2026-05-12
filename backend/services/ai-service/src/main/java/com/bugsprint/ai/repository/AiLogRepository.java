package com.bugsprint.ai.repository;

import com.bugsprint.ai.entity.AiLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AiLogRepository extends JpaRepository<AiLog, UUID> {
}
