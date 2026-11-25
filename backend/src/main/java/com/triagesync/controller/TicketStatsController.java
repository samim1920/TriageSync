
package com.triagesync.controller;

import com.triagesync.dto.response.StatsResponse;
import com.triagesync.service.StatsService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tickets/stats")
public class TicketStatsController {

    private final StatsService statsService;

    public TicketStatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    // Get ticket statistics
    @GetMapping
    public ResponseEntity<StatsResponse> getTicketStatistics() {

        StatsResponse statistics =
                statsService.getTicketStatistics();

        return ResponseEntity.ok(statistics);
    }
}

