
package com.triagesync.config;

import com.triagesync.entity.Resource;
import com.triagesync.entity.User;
import com.triagesync.enums.ResourceType;
import com.triagesync.enums.Role;
import com.triagesync.repository.ResourceRepository;
import com.triagesync.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DatabaseSeeder {

    @Value("${app.seed.admin.name:Admin}")
    private String adminName;

    @Value("${app.seed.admin.email:admin@triagesync.com}")
    private String adminEmail;

    @Value("${app.seed.admin.password}")
    private String adminPassword;

    @Bean
    public CommandLineRunner seedDatabase(
            UserRepository userRepository,
            ResourceRepository resourceRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            // =================================
            // CREATE ADMIN USER
            // =================================

            if (!userRepository.existsByEmail(adminEmail)) {

                User admin = new User();

                admin.setName(adminName);
                admin.setEmail(adminEmail);
                admin.setPassword(
                        passwordEncoder.encode(adminPassword)
                );
                admin.setRole(Role.ADMIN);

                userRepository.save(admin);

                System.out.println("ADMIN user created successfully.");
            }

            // =================================
            // SEED RESOURCES
            // =================================

            createResource(
                    resourceRepository,
                    "Conference Room A",
                    ResourceType.ROOM,
                    20,
                    "Main conference room",
                    true
            );

            createResource(
                    resourceRepository,
                    "Meeting Room B",
                    ResourceType.ROOM,
                    10,
                    "Small meeting room",
                    true
            );

            createResource(
                    resourceRepository,
                    "Computer Lab 1",
                    ResourceType.LAB,
                    40,
                    "Computer laboratory with desktop systems",
                    true
            );

            createResource(
                    resourceRepository,
                    "Computer Lab 2",
                    ResourceType.LAB,
                    30,
                    "Advanced programming laboratory",
                    true
            );

            createResource(
                    resourceRepository,
                    "Projector 1",
                    ResourceType.EQUIPMENT,
                    1,
                    "Portable HD projector",
                    true
            );

            createResource(
                    resourceRepository,
                    "Old Projector",
                    ResourceType.EQUIPMENT,
                    1,
                    "Currently inactive projector",
                    false
            );

            System.out.println("Database seeding completed.");
        };
    }

    // =================================
    // CREATE RESOURCE IF NOT EXISTS
    // =================================

    private void createResource(
            ResourceRepository resourceRepository,
            String name,
            ResourceType type,
            Integer capacity,
            String description,
            Boolean active
    ) {

        if (!resourceRepository.existsByName(name)) {

            Resource resource = new Resource();

            resource.setName(name);
            resource.setType(type);
            resource.setCapacity(capacity);
            resource.setDescription(description);
            resource.setIsActive(active);

            resourceRepository.save(resource);
        }
    }
}

