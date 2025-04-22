package org.practice.safecity.repository;

import org.practice.safecity.model.Case;
import org.practice.safecity.model.enums.CaseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CaseRepository extends MongoRepository<Case, String> {
    Optional<Case> findByCaseNumber(String caseNumber);

    Page<Case> findByStatus(CaseStatus caseStatus, Pageable pageable);

    List<Case> findByAssignedTo(String assignedTo);
    boolean existsByCaseNumber(String caseNumber);
}
