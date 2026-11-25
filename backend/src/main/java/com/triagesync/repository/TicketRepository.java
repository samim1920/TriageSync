
package com.triagesync.repository;

import com.triagesync.entity.Ticket;
import com.triagesync.enums.TicketCategory;
import com.triagesync.enums.TicketPriority;
import com.triagesync.enums.TicketStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends
        JpaRepository<Ticket, Long>,
        JpaSpecificationExecutor<Ticket> {

    Optional<Ticket> findByExternalId(String externalId);

    boolean existsByExternalId(String externalId);

    // Find tickets submitted by a particular user
    List<Ticket> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Find a particular user's ticket
    Optional<Ticket> findByIdAndUserId(Long ticketId, Long userId);

    long countByCategory(TicketCategory category);

    long countByPriority(TicketPriority priority);

    long countByStatus(TicketStatus status);

    long countByReviewedTrue();
}
