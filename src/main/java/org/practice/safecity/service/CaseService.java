package org.practice.safecity.service;

import org.practice.safecity.model.Case;
import org.practice.safecity.model.CaseNote;
import org.practice.safecity.model.enums.CaseStatus;
import org.practice.safecity.repository.CaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CaseService {

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private AuthService authService;

    public Page<Case> getAllCases(Pageable pageable) {
        return caseRepository.findAll(pageable);
    }

    public Case getCaseById(String id) {
        return caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found with id: " + id));
    }

    public Case createCase(Case caseData) {
        // Generate unique case number if not provided
        if (caseData.getCaseNumber() == null || caseData.getCaseNumber().isEmpty()) {
            String caseNumber;
            do {
                caseNumber = "CASE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            } while (caseRepository.existsByCaseNumber(caseNumber));

            caseData.setCaseNumber(caseNumber);
        }

        // Set default status if not provided
        if (caseData.getStatus() == null) {
            caseData.setStatus(CaseStatus.NEW);
        }

        return caseRepository.save(caseData);
    }

    public Case updateCase(String id, Case caseDetails) {
        Case existingCase = getCaseById(id);

        existingCase.setTitle(caseDetails.getTitle());
        existingCase.setDescription(caseDetails.getDescription());
        existingCase.setStatus(caseDetails.getStatus());
        existingCase.setPriority(caseDetails.getPriority());
        existingCase.setLocation(caseDetails.getLocation());
        existingCase.setDistrict(caseDetails.getDistrict());
        existingCase.setAssignedTo(caseDetails.getAssignedTo());

        return caseRepository.save(existingCase);
    }

    public void deleteCase(String id) {
        Case caseToDelete = getCaseById(id);
        caseRepository.delete(caseToDelete);
    }

    public Case addNoteToCase(String caseId, String noteContent) {
        Case caseToUpdate = getCaseById(caseId);

        CaseNote note = new CaseNote();
        note.setId(UUID.randomUUID().toString());
        note.setContent(noteContent);
        note.setCreatedBy(authService.getCurrentUser().getId());
        note.setCreatedAt(LocalDateTime.now());

        caseToUpdate.getNotes().add(note);

        return caseRepository.save(caseToUpdate);
    }

    public Page<Case> getCasesByStatus(CaseStatus status, Pageable pageable) {
        return caseRepository.findByStatus(status, pageable);
    }

    public List<Case> getCasesAssignedToUser(String userId) {
        return caseRepository.findByAssignedTo(userId);
    }
}