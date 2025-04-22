package org.practice.safecity.repository;

import org.practice.safecity.model.Incident;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface IncidentRepository extends MongoRepository<Incident, String> {
    Optional<Incident> findByIncidentNumber(String incidentNumber);

    Page<Incident> findByStatus(String status, Pageable pageable);

    Page<Incident> findByType(String type, Pageable pageable);
}
