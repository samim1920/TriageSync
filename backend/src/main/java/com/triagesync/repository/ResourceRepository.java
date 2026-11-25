
package com.triagesync.repository;

import com.triagesync.entity.Resource;
import com.triagesync.enums.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    Optional<Resource> findByName(String name);

    boolean existsByName(String name);

    List<Resource> findByType(ResourceType type);

    List<Resource> findByIsActiveTrue();

    List<Resource> findByTypeAndIsActiveTrue(ResourceType type);

    long countByIsActiveTrue();
}
