
package com.triagesync.service;

import com.triagesync.enums.TicketCategory;
import com.triagesync.enums.TicketPriority;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class TicketClassificationService {

    // Automatically classify ticket category
    public TicketCategory classifyCategory(String subject, String body) {

        String text = normalize(subject, body);

        if (containsAny(text,
                "payment", "invoice", "refund", "charge",
                "billing", "transaction", "price")) {
            return TicketCategory.BILLING;
        }

        if (containsAny(text,
                "bug", "error", "exception", "crash",
                "issue", "not working", "failed")) {
            return TicketCategory.BUG;
        }

        if (containsAny(text,
                "feature", "enhancement", "suggestion",
                "new functionality", "improvement")) {
            return TicketCategory.FEATURE_REQUEST;
        }

        if (containsAny(text,
                "login", "sign in", "signin", "password",
                "forgot password", "authentication")) {
            return TicketCategory.LOGIN;
        }

        if (containsAny(text,
                "delivery", "shipment", "shipping",
                "tracking", "parcel", "package")) {
            return TicketCategory.DELIVERY;
        }

        if (containsAny(text,
                "network", "wifi", "internet", "router",
                "connection", "vpn", "server")) {
            return TicketCategory.NETWORK;
        }

        if (containsAny(text,
                "computer", "laptop", "keyboard", "mouse",
                "monitor", "printer", "hardware")) {
            return TicketCategory.HARDWARE;
        }

        if (containsAny(text,
                "software", "application", "app",
                "install", "installation", "program")) {
            return TicketCategory.SOFTWARE;
        }

        if (containsAny(text,
                "account", "access", "permission",
                "authorization", "locked", "profile")) {
            return TicketCategory.ACCOUNT;
        }

        if (containsAny(text,
                "email", "outlook", "mailbox",
                "spam", "inbox", "mail")) {
            return TicketCategory.EMAIL;
        }

        return TicketCategory.OTHER;
    }

    // Automatically classify ticket priority
    public TicketPriority classifyPriority(String subject, String body) {

        String text = normalize(subject, body);

        if (containsAny(text,
                "urgent", "emergency", "critical",
                "system down", "security breach",
                "data loss", "all users affected")) {
            return TicketPriority.URGENT;
        }

        if (containsAny(text,
                "high priority", "cannot work",
                "business stopped", "service unavailable",
                "complete failure")) {
            return TicketPriority.HIGH;
        }

        if (containsAny(text,
                "slow", "intermittent",
                "delayed", "frequent error",
                "performance issue")) {
            return TicketPriority.MEDIUM;
        }

        return TicketPriority.LOW;
    }

    // Classify both category and priority
    public ClassificationResult classify(String subject, String body) {

        TicketCategory category = classifyCategory(subject, body);
        TicketPriority priority = classifyPriority(subject, body);

        return new ClassificationResult(category, priority);
    }

    // Normalize input text
    private String normalize(String subject, String body) {

        String safeSubject = subject == null ? "" : subject;
        String safeBody = body == null ? "" : body;

        return (safeSubject + " " + safeBody)
                .toLowerCase(Locale.ROOT)
                .replaceAll("\\s+", " ")
                .trim();
    }

    // Check whether text contains any keyword
    private boolean containsAny(String text, String... keywords) {

        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }

        return false;
    }

    // Result containing category and priority
    public record ClassificationResult(
            TicketCategory category,
            TicketPriority priority
    ) {}
}
