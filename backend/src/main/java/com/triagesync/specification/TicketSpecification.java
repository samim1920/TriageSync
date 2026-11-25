
package com.triagesync.repository;

import com.triagesync.entity.Ticket;
import com.triagesync.enums.TicketCategory;
import com.triagesync.enums.TicketPriority;
import com.triagesync.enums.TicketStatus;

import jakarta.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class TicketSpecification {

    private TicketSpecification() {
        // Utility class
    }

    public static Specification<Ticket> filterTickets(
            String search,
            TicketCategory category,
            TicketPriority priority,
            TicketStatus status,
            Boolean humanOverride) {

        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            // Search by subject, body or external ID
            if (search != null && !search.trim().isEmpty()) {

                String keyword = "%" + search.trim().toLowerCase() + "%";

                Predicate subjectMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("subject")),
                        keyword
                );

                Predicate bodyMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("body")),
                        keyword
                );

                Predicate externalIdMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("externalId")),
                        keyword
                );

                predicates.add(
                        criteriaBuilder.or(
                                subjectMatch,
                                bodyMatch,
                                externalIdMatch
                        )
                );
            }

            // Filter by category
            if (category != null) {
                predicates.add(
                        criteriaBuilder.equal(
                                root.get("category"),
                                category
                        )
                );
            }

            // Filter by priority
            if (priority != null) {
                predicates.add(
                        criteriaBuilder.equal(
                                root.get("priority"),
                                priority
                        )
                );
            }

            // Filter by status
            if (status != null) {
                predicates.add(
                        criteriaBuilder.equal(
                                root.get("status"),
                                status
                        )
                );
            }

            // Filter by human override
            if (humanOverride != null) {
                predicates.add(
                        criteriaBuilder.equal(
                                root.get("isHumanOverride"),
                                humanOverride
                        )
                );
            }

            return criteriaBuilder.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
}
