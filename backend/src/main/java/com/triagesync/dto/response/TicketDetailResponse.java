
package com.triagesync.dto.response;

import com.triagesync.entity.Ticket;
import com.triagesync.entity.TicketEvent;

import java.util.List;

public record TicketDetailResponse(
        Ticket ticket,
        List<TicketEvent> events
) {
    public static TicketDetailResponse of(
            Ticket ticket,
            List<TicketEvent> events
    ) {
        return new TicketDetailResponse(ticket, events);
    }
}
