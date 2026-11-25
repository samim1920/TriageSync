
package com.triagesync.dto.request;

import com.triagesync.enums.TicketCategory;
import com.triagesync.enums.TicketPriority;
import com.triagesync.enums.TicketStatus;

public record TicketPatchRequest(
        TicketCategory category,
        TicketPriority priority,
        TicketStatus status,
        Long assigneeId
) {
}
