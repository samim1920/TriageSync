
package com.triagesync.service;

import com.triagesync.dto.response.StatsResponse;
import com.triagesync.enums.TicketCategory;
import com.triagesync.enums.TicketPriority;
import com.triagesync.enums.TicketStatus;
import com.triagesync.repository.TicketRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class StatsService {

    private final TicketRepository ticketRepository;

    public StatsService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Transactional(readOnly = true)
    public StatsResponse getTicketStatistics() {

        Map<String, Long> byCategory = new LinkedHashMap<>();

        for (TicketCategory category : TicketCategory.values()) {
            byCategory.put(
                    category.name(),
                    ticketRepository.countByCategory(category)
            );
        }

        Map<String, Long> byPriority = new LinkedHashMap<>();

        for (TicketPriority priority : TicketPriority.values()) {
            byPriority.put(
                    priority.name(),
                    ticketRepository.countByPriority(priority)
            );
        }

        Map<String, Long> byStatus = new LinkedHashMap<>();

        for (TicketStatus status : TicketStatus.values()) {
            byStatus.put(
                    status.name(),
                    ticketRepository.countByStatus(status)
            );
        }

        long reviewedCount =
                ticketRepository.countByReviewedTrue();

        long totalTickets = ticketRepository.count();

        double modelAgreementRate = 0.0;

        if (totalTickets > 0) {
            modelAgreementRate =
                    (reviewedCount * 100.0) / totalTickets;
        }

        modelAgreementRate =
                Math.round(modelAgreementRate * 100.0) / 100.0;

        return new StatsResponse(
                byCategory,
                byPriority,
                byStatus,
                reviewedCount,
                modelAgreementRate
        );
    }

    public StatsResponse getStats() {
        return getTicketStatistics();
    }
}
