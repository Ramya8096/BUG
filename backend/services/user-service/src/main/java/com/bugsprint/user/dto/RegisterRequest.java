package com.bugsprint.user.dto;

import com.bugsprint.user.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private Role role;
}
