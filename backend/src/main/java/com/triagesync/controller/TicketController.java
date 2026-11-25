
package com.triagesync.controller;

import com.triagesync.dto.response.TicketResponse;
import com.triagesync.entity.Ticket;
import com.triagesync.entity.User;
import com.triagesync.enums.TicketCategory;
import com.triagesync.enums.TicketPriority;
import com.triagesync.enums.TicketStatus;
import com.triagesync.repository.UserRepository;
import com.triagesync.service.TicketService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final UserRepository userRepository;

    public TicketController(
            TicketService ticketService,
            UserRepository userRepository
    ) {
        this.ticketService = ticketService;
        this.userRepository = userRepository;
    }

    public record CreateTicketRequest(
            @NotBlank String externalId,
            @NotBlank String subject,
            @NotBlank String body
    ) {}

    private User getLoggedInUser(Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "User is not authenticated"
            );
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Logged-in user not found"
                ));
    }

    private void checkTicketOwnership(Ticket ticket, User user) {

        boolean isAdmin = user.getRole().name().equals("ADMIN");

        if (!isAdmin &&
                (ticket.getUser() == null ||
                        !ticket.getUser().getId().equals(user.getId()))) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot access another user's ticket"
            );
        }
    }

    // Create a new ticket
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TicketResponse createTicket(
            @Valid @RequestBody CreateTicketRequest request,
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        Ticket ticket = ticketService.createTicket(
                request.externalId(),
                request.subject(),
                request.body(),
                user
        );

        return TicketResponse.fromEntity(ticket);
    }

    // ADMIN sees all tickets; USER sees only their own tickets
    @GetMapping
    public List<TicketResponse> getAllTickets(
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        List<Ticket> tickets;

        if (user.getRole().name().equals("ADMIN")) {
            tickets = ticketService.getAllTickets();
        } else {
            tickets = ticketService.getTicketsByUserId(user.getId());
        }

        return tickets.stream()
                .map(TicketResponse::fromEntity)
                .toList();
    }

    // Get ticket by external ID
    @GetMapping("/external/{externalId}")
    public TicketResponse getTicketByExternalId(
            @PathVariable String externalId,
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        Ticket ticket = ticketService.getTicketByExternalId(externalId);

        checkTicketOwnership(ticket, user);

        return TicketResponse.fromEntity(ticket);
    }

    // Get ticket by ID
    @GetMapping("/{ticketId}")
    public TicketResponse getTicketById(
            @PathVariable Long ticketId,
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        Ticket ticket = ticketService.getTicketById(ticketId);

        checkTicketOwnership(ticket, user);

        return TicketResponse.fromEntity(ticket);
    }

    // Update ticket category
    @PatchMapping("/{ticketId}/category")
    public TicketResponse updateCategory(
            @PathVariable Long ticketId,
            @RequestParam TicketCategory category
    ) {
        return TicketResponse.fromEntity(
                ticketService.updateCategory(ticketId, category)
        );
    }

    // Update ticket priority
    @PatchMapping("/{ticketId}/priority")
    public TicketResponse updatePriority(
            @PathVariable Long ticketId,
            @RequestParam TicketPriority priority
    ) {
        return TicketResponse.fromEntity(
                ticketService.updatePriority(ticketId, priority)
        );
    }

    // Update ticket status
    @PatchMapping("/{ticketId}/status")
    public TicketResponse updateStatus(
            @PathVariable Long ticketId,
            @RequestParam TicketStatus status
    ) {
        return TicketResponse.fromEntity(
                ticketService.updateStatus(ticketId, status)
        );
    }

    // Assign ticket to a user
    @PatchMapping("/{ticketId}/assign/{assigneeId}")
    public TicketResponse assignTicket(
            @PathVariable Long ticketId,
            @PathVariable Long assigneeId
    ) {
        return TicketResponse.fromEntity(
                ticketService.assignTicket(ticketId, assigneeId)
        );
    }

    // Reclassify ticket
    @PostMapping("/{ticketId}/reclassify")
    public TicketResponse reclassifyTicket(
            @PathVariable Long ticketId
    ) {
        return TicketResponse.fromEntity(
                ticketService.reclassifyTicket(ticketId)
        );
    }

    // Delete ticket
    @DeleteMapping("/{ticketId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTicket(@PathVariable Long ticketId) {
        ticketService.deleteTicket(ticketId);
    }
}
