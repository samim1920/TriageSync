
package com.triagesync.controller;

import com.triagesync.entity.Resource;
import com.triagesync.enums.ResourceType;
import com.triagesync.service.ResourceService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    // Create resource (ADMIN)
    @PostMapping
    public ResponseEntity<Resource> createResource(
            @Valid @RequestBody Resource resource
    ) {
        Resource savedResource =
                resourceService.createResource(resource);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedResource);
    }

    // Get all resources
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(
                resourceService.getAllResources()
        );
    }

    // Get active resources
    @GetMapping("/active")
    public ResponseEntity<List<Resource>> getActiveResources() {
        return ResponseEntity.ok(
                resourceService.getActiveResources()
        );
    }

    // Get resources by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Resource>> getResourcesByType(
            @PathVariable ResourceType type
    ) {
        return ResponseEntity.ok(
                resourceService.getResourcesByType(type)
        );
    }

    // Get active resources by type
    @GetMapping("/active/type/{type}")
    public ResponseEntity<List<Resource>> getActiveResourcesByType(
            @PathVariable ResourceType type
    ) {
        return ResponseEntity.ok(
                resourceService.getActiveResourcesByType(type)
        );
    }

    // Get resource by ID
    @GetMapping("/{resourceId}")
    public ResponseEntity<Resource> getResourceById(
            @PathVariable Long resourceId
    ) {
        return ResponseEntity.ok(
                resourceService.getResourceById(resourceId)
        );
    }

    // Update resource
    @PutMapping("/{resourceId}")
    public ResponseEntity<Resource> updateResource(
            @PathVariable Long resourceId,
            @Valid @RequestBody Resource resource
    ) {
        return ResponseEntity.ok(
                resourceService.updateResource(resourceId, resource)
        );
    }

    // Activate or deactivate resource (ADMIN)
    @PatchMapping("/{resourceId}/status")
    public ResponseEntity<Resource> updateResourceStatus(
            @PathVariable Long resourceId,
            @RequestParam boolean active
    ) {
        return ResponseEntity.ok(
                resourceService.updateResourceStatus(resourceId, active)
        );
    }

    // Delete resource (ADMIN)
    @DeleteMapping("/{resourceId}")
    public ResponseEntity<Void> deleteResource(
            @PathVariable Long resourceId
    ) {
        resourceService.deleteResource(resourceId);
        return ResponseEntity.noContent().build();
    }
}

