
package com.triagesync.dto.response;

import com.triagesync.entity.Ticket;
import com.triagesync.enums.TicketCategory;
import com.triagesync.enums.TicketPriority;
import com.triagesync.enums.TicketStatus;

import java.time.Instant;

public record TicketResponse(
        Long id,
        String externalId,
        String subject,
        String body,
        TicketCategory autoCategory,
        TicketCategory category,
        boolean humanOverride,
        TicketPriority priority,
        TicketStatus status,
        Long assigneeId,
        boolean reviewed,
        Long userId,
        Instant createdAt,
        Instant updatedAt
) {
    public static TicketResponse fromEntity(Ticket ticket) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getExternalId(),
                ticket.getSubject(),
                ticket.getBody(),
                ticket.getAutoCategory(),
                ticket.getCategory(),
                ticket.isHumanOverride(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getAssigneeId(),
                ticket.isReviewed(),
                ticket.getUser() != null ? ticket.getUser().getId() : null,
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }
}
