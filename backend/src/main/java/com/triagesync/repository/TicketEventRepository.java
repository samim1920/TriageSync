
package com.triagesync.repository;

import com.triagesync.entity.TicketEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketEventRepository
        extends JpaRepository<TicketEvent, Long> {

    List<TicketEvent> findByTicketId(Long ticketId);

    List<TicketEvent> findByUserId(Long userId);

    List<TicketEvent> findByTicketIdOrderByCreatedAtDesc(Long ticketId);
}

