package com.bugsprint.user.config;

import com.bugsprint.user.entity.Role;
import com.bugsprint.user.entity.User;
import com.bugsprint.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            userRepository.save(User.builder()
                    .id(UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"))
                    .email("admin@bugsprint.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .fullName("System Admin")
                    .role(Role.ADMIN)
                    .build());

            userRepository.save(User.builder()
                    .id(UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12"))
                    .email("dev1@bugsprint.com")
                    .passwordHash(passwordEncoder.encode("dev123"))
                    .fullName("John Dev")
                    .role(Role.DEVELOPER)
                    .build());

            userRepository.save(User.builder()
                    .id(UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14"))
                    .email("user1@bugsprint.com")
                    .passwordHash(passwordEncoder.encode("user123"))
                    .fullName("Alice Reporter")
                    .role(Role.USER)
                    .build());
        }
    }
}
