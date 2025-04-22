package org.practice.safecity.controller;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;
import org.practice.safecity.model.Report;
import org.practice.safecity.model.enums.ReportStatus;
import org.practice.safecity.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // DTO for paginated response
    @Setter
    @Getter
    public static class PageResponse<T> {
        private List<T> content;
        private int page;
        private int size;
        private long totalElements;
        private int totalPages;

    }

    @GetMapping
    public ResponseEntity<PageResponse<Report>> getAllReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<Report> reports = reportService.getAllReports(pageable);
        PageResponse<Report> response = new PageResponse<>();
        response.setContent(reports.getContent());
        response.setPage(reports.getNumber());
        response.setSize(reports.getSize());
        response.setTotalElements(reports.getTotalElements());
        response.setTotalPages(reports.getTotalPages());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable String id) {
        Report report = reportService.getReportById(id);
        return ResponseEntity.ok(report);
    }

    @PostMapping
    public ResponseEntity<Report> createReport(@Valid @RequestBody Report report) {
        // Autofill reportType if missing
        if (report.getReportType() == null || report.getReportType().isEmpty()) {
            report.setReportType("GENERAL"); // or any default value you prefer
        }

        // Autofill reportedBy if missing
        if (report.getReportedBy() == null || report.getReportedBy().isEmpty()) {
            // If you have authentication, set from logged-in user
            // Otherwise, set as "anonymous"
            report.setReportedBy("anonymous");
        }

        // Status should always be set
        if (report.getStatus() == null) {
            report.setStatus(ReportStatus.NEW); // or your default status
        }

        Report createdReport = reportService.createReport(report);
        return ResponseEntity.ok(createdReport);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<Report> updateReport(@PathVariable String id, @Valid @RequestBody Report reportDetails) {
        Report updatedReport = reportService.updateReport(id, reportDetails);
        return ResponseEntity.ok(updatedReport);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<Report> approveReport(@PathVariable String id) {
        Report approvedReport = reportService.approveReport(id);
        return ResponseEntity.ok(approvedReport);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<Report> rejectReport(@PathVariable String id) {
        Report rejectedReport = reportService.rejectReport(id);
        return ResponseEntity.ok(rejectedReport);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteReport(@PathVariable String id) {
        reportService.deleteReport(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<PageResponse<Report>> getReportsByStatus(
            @PathVariable ReportStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Report> reports = reportService.getReportsByStatus(status, pageable);
        PageResponse<Report> response = new PageResponse<>();
        response.setContent(reports.getContent());
        response.setPage(reports.getNumber());
        response.setSize(reports.getSize());
        response.setTotalElements(reports.getTotalElements());
        response.setTotalPages(reports.getTotalPages());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Report>> getReportsByUser(@PathVariable String userId) {
        List<Report> reports = reportService.getReportsByUser(userId);
        return ResponseEntity.ok(reports);
    }

    // Public endpoint for anonymous reporting
    @PostMapping("/public/submit")
    public ResponseEntity<Report> submitPublicReport(@Valid @RequestBody Report report) {
        report.setReportedBy("anonymous");
        Report createdReport = reportService.createReport(report);
        return ResponseEntity.ok(createdReport);
    }
}