
package com.triagesync.dto.response;

import java.util.Map;

public record StatsResponse(
        Map<String, Long> byCategory,
        Map<String, Long> byPriority,
        Map<String, Long> byStatus,
        long reviewedCount,
        double modelAgreementRate
) {
}
