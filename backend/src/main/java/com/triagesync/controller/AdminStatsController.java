
package com.triagesync.controller;

import com.triagesync.dto.response.StatsResponse;
import com.triagesync.service.StatsService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/stats")
public class AdminStatsController {

    private final StatsService statsService;

    public AdminStatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    // Get ticket statistics for admin dashboard
    @GetMapping
    public ResponseEntity<StatsResponse> getStats() {

        StatsResponse stats = statsService.getStats();

        return ResponseEntity.ok(stats);
    }
}

