
package com.triagesync.dto.response;

import java.util.List;
import java.util.Map;

public record AdminStatsResponse(
        long activeResources,
        Map<String, Long> bookingsByStatus,
        List<TopResourceDto> topResources,
        TicketStatsDto ticketStats
) {

    public record TopResourceDto(
            Long id,
            String name,
            long bookingCount
    ) {}

    public record TicketStatsDto(
            long total,
            long open,
            long inProgress,
            long resolved,
            long closed
    ) {}
}
