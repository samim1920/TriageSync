
package com.triagesync.service;

import com.triagesync.entity.Resource;
import com.triagesync.enums.ResourceType;
import com.triagesync.repository.ResourceRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    // Create a new resource
    @Transactional
    public Resource createResource(Resource resource) {

        if (resourceRepository.existsByName(resource.getName())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Resource name already exists"
            );
        }

        if (resource.getCapacity() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Resource capacity must be greater than zero"
            );
        }

        resource.setName(resource.getName().trim());
        resource.setIsActive(true);

        return resourceRepository.save(resource);
    }

    // Get all resources
    @Transactional(readOnly = true)
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    // Get only active resources
    @Transactional(readOnly = true)
    public List<Resource> getActiveResources() {
        return resourceRepository.findByIsActiveTrue();
    }

    // Get resources by type
    @Transactional(readOnly = true)
    public List<Resource> getResourcesByType(ResourceType type) {
        return resourceRepository.findByType(type);
    }

    // Get active resources by type
    @Transactional(readOnly = true)
    public List<Resource> getActiveResourcesByType(ResourceType type) {
        return resourceRepository.findByTypeAndIsActiveTrue(type);
    }

    // Get resource by ID
    @Transactional(readOnly = true)
    public Resource getResourceById(Long resourceId) {
        return resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Resource not found"
                ));
    }

    // Update resource
    @Transactional
    public Resource updateResource(Long resourceId, Resource updatedResource) {

        Resource resource = getResourceById(resourceId);

        if (updatedResource.getName() == null ||
                updatedResource.getName().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Resource name is required"
            );
        }

        String newName = updatedResource.getName().trim();

        if (!resource.getName().equalsIgnoreCase(newName)) {
            if (resourceRepository.existsByName(newName)) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Resource name already exists"
                );
            }
        }

        if (updatedResource.getCapacity() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Resource capacity must be greater than zero"
            );
        }

        resource.setName(newName);
        resource.setType(updatedResource.getType());
        resource.setCapacity(updatedResource.getCapacity());
        resource.setDescription(updatedResource.getDescription());

        return resourceRepository.save(resource);
    }

    // Activate or deactivate resource
    @Transactional
    public Resource updateResourceStatus(Long resourceId, boolean active) {

        Resource resource = getResourceById(resourceId);
        resource.setIsActive(active);

        return resourceRepository.save(resource);
    }

    // Delete resource
    @Transactional
    public void deleteResource(Long resourceId) {

        Resource resource = getResourceById(resourceId);
        resourceRepository.delete(resource);
    }
}

