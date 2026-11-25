
package com.triagesync.service;

import com.triagesync.entity.Ticket;
import com.triagesync.entity.User;
import com.triagesync.enums.TicketCategory;
import com.triagesync.enums.TicketPriority;
import com.triagesync.enums.TicketStatus;
import com.triagesync.repository.TicketRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketClassificationService classificationService;

    public TicketService(
            TicketRepository ticketRepository,
            TicketClassificationService classificationService
    ) {
        this.ticketRepository = ticketRepository;
        this.classificationService = classificationService;
    }

    // Create a new ticket for the logged-in user
    @Transactional
    public Ticket createTicket(
            String externalId,
            String subject,
            String body,
            User user
    ) {

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Logged-in user not found"
            );
        }

        if (externalId == null || externalId.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "External ID is required"
            );
        }

        if (subject == null || subject.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Subject is required"
            );
        }

        if (body == null || body.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ticket body is required"
            );
        }

        externalId = externalId.trim();
        subject = subject.trim();
        body = body.trim();

        if (ticketRepository.existsByExternalId(externalId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ticket already exists with this external ID"
            );
        }

        TicketClassificationService.ClassificationResult result =
                classificationService.classify(subject, body);

        Ticket ticket = new Ticket();

        ticket.setExternalId(externalId);
        ticket.setSubject(subject);
        ticket.setBody(body);

        ticket.setAutoCategory(result.category());
        ticket.setCategory(result.category());
        ticket.setPriority(result.priority());

        ticket.setStatus(TicketStatus.OPEN);

        ticket.setHumanOverride(false);
        ticket.setReviewed(false);

        // Associate ticket with the logged-in user
        ticket.setUser(user);

        return ticketRepository.save(ticket);
    }

    // Get all tickets (ADMIN)
    @Transactional(readOnly = true)
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Get tickets belonging to a specific user
    @Transactional(readOnly = true)
    public List<Ticket> getTicketsByUserId(Long userId) {
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Get ticket by ID
    @Transactional(readOnly = true)
    public Ticket getTicketById(Long ticketId) {

        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ticket not found with ID: " + ticketId
                ));
    }

    // Get ticket by external ID
    @Transactional(readOnly = true)
    public Ticket getTicketByExternalId(String externalId) {

        if (externalId == null || externalId.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "External ID is required"
            );
        }

        return ticketRepository.findByExternalId(externalId.trim())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ticket not found with external ID: " + externalId
                ));
    }

    // Manually update ticket category
    @Transactional
    public Ticket updateCategory(
            Long ticketId,
            TicketCategory category
    ) {

        Ticket ticket = getTicketById(ticketId);

        if (category == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Category is required"
            );
        }

        ticket.setCategory(category);
        ticket.setHumanOverride(true);
        ticket.setReviewed(true);

        return ticketRepository.save(ticket);
    }

    // Update ticket priority
    @Transactional
    public Ticket updatePriority(
            Long ticketId,
            TicketPriority priority
    ) {

        Ticket ticket = getTicketById(ticketId);

        if (priority == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Priority is required"
            );
        }

        ticket.setPriority(priority);
        ticket.setReviewed(true);

        return ticketRepository.save(ticket);
    }

    // Update ticket status
    @Transactional
    public Ticket updateStatus(
            Long ticketId,
            TicketStatus status
    ) {

        Ticket ticket = getTicketById(ticketId);

        if (status == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Status is required"
            );
        }

        ticket.setStatus(status);

        return ticketRepository.save(ticket);
    }

    // Assign ticket to a user
    @Transactional
    public Ticket assignTicket(Long ticketId, Long assigneeId) {

        Ticket ticket = getTicketById(ticketId);

        ticket.setAssigneeId(assigneeId);

        return ticketRepository.save(ticket);
    }

    // Automatically reclassify ticket
    @Transactional
    public Ticket reclassifyTicket(Long ticketId) {

        Ticket ticket = getTicketById(ticketId);

        // Do not overwrite manually selected category
        if (ticket.isHumanOverride()) {
            return ticket;
        }

        TicketClassificationService.ClassificationResult result =
                classificationService.classify(
                        ticket.getSubject(),
                        ticket.getBody()
                );

        ticket.setAutoCategory(result.category());
        ticket.setCategory(result.category());
        ticket.setPriority(result.priority());

        return ticketRepository.save(ticket);
    }

    // Delete ticket
    @Transactional
    public void deleteTicket(Long ticketId) {

        Ticket ticket = getTicketById(ticketId);

        ticketRepository.delete(ticket);
    }
}
