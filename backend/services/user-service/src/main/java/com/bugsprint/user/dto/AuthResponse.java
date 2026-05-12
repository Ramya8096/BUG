package com.bugsprint.user.dto;

import com.bugsprint.user.entity.Role;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class AuthResponse {
    private String token;
    private UUID userId;
    private Role role;
}
