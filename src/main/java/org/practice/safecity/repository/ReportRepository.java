package org.practice.safecity.repository;

import org.practice.safecity.model.Report;
import org.practice.safecity.model.enums.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ReportRepository extends MongoRepository<Report,String> {

    Optional<Report> findByReportNumber(String reportNumber);
    Page<Report> findByStatus(ReportStatus status, Pageable pageable);
    List<Report> findByReportedBy(String reportedBy);

}
