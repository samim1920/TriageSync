
package com.triagesync.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.triagesync.enums.ResourceType;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ResourceRequest(

        @NotBlank(message = "Resource name is required")
        @Size(min = 3, max = 150,
                message = "Resource name must be between 3 and 150 characters")
        String name,

        @NotNull(message = "Resource type is required")
        ResourceType type,

        @NotNull(message = "Capacity is required")
        @Min(value = 1, message = "Capacity must be at least 1")
        @Max(value = 500, message = "Capacity must be at most 500")
        Integer capacity,

        @Size(max = 300, message = "Description must be at most 300 characters")
        String description,

        @JsonProperty("isActive")
        Boolean isActive

) {
    public ResourceRequest {
        if (name != null) {
            name = name.trim();
        }

        if (description != null) {
            description = description.trim();
        }
    }
}

