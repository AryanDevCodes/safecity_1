package org.practice.safecity.service;

import org.practice.safecity.model.Report;
import org.practice.safecity.model.enums.ReportStatus;
import org.practice.safecity.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    public Page<Report> getAllReports(Pageable pageable) {
        return reportRepository.findAll(pageable);
    }

    public Report getReportById(String id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));
    }

    public Report createReport(Report report) {
        // Generate unique report number if not provided
        if (report.getReportNumber() == null || report.getReportNumber().isEmpty()) {
            report.setReportNumber("RPT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        // Set default status if not provided
        if (report.getStatus() == null) {
            report.setStatus(ReportStatus.NEW);
        }

        return reportRepository.save(report);
    }

    public Report updateReport(String id, Report reportDetails) {
        Report existingReport = getReportById(id);

        existingReport.setReportType(reportDetails.getReportType());
        existingReport.setDescription(reportDetails.getDescription());
        existingReport.setLocation(reportDetails.getLocation());

        return reportRepository.save(existingReport);
    }

    public Report approveReport(String id) {
        Report report = getReportById(id);
        report.setStatus(ReportStatus.APPROVED);
        return reportRepository.save(report);
    }

    public Report rejectReport(String id) {
        Report report = getReportById(id);
        report.setStatus(ReportStatus.REJECTED);
        return reportRepository.save(report);
    }

    public void deleteReport(String id) {
        Report report = getReportById(id);
        reportRepository.delete(report);
    }

    public Page<Report> getReportsByStatus(ReportStatus status, Pageable pageable) {
        return reportRepository.findByStatus(status, pageable);
    }

    public List<Report> getReportsByUser(String userId) {
        return reportRepository.findByReportedBy(userId);
    }
}