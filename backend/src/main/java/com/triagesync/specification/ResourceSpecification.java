
package com.triagesync.repository;

import com.triagesync.entity.Resource;
import com.triagesync.enums.ResourceType;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;

public class ResourceSpecification {

    private ResourceSpecification() {
        // Utility class
    }

    public static Specification<Resource> filterResources(
            String search,
            ResourceType type,
            Boolean active) {

        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            // Search by resource name
            if (search != null && !search.trim().isEmpty()) {

                predicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("name")),
                                "%" + search.trim().toLowerCase() + "%"
                        )
                );
            }

            // Filter by resource type
            if (type != null) {

                predicates.add(
                        criteriaBuilder.equal(
                                root.get("type"),
                                type
                        )
                );
            }

            // Filter by active status
            if (active != null) {

                predicates.add(
                        criteriaBuilder.equal(
                                root.get("isActive"),
                                active
                        )
                );
            }

            return criteriaBuilder.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
}

