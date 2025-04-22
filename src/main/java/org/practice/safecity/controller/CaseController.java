package org.practice.safecity.controller;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;
import org.practice.safecity.model.Case;
import org.practice.safecity.model.enums.CaseStatus;
import org.practice.safecity.service.CaseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
public class CaseController {

    private final CaseService caseService;

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

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
    public ResponseEntity<PageResponse<Case>> getAllCases(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<Case> cases = caseService.getAllCases(pageable);
        PageResponse<Case> response = new PageResponse<>();
        response.setContent(cases.getContent());
        response.setPage(cases.getNumber());
        response.setSize(cases.getSize());
        response.setTotalElements(cases.getTotalElements());
        response.setTotalPages(cases.getTotalPages());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Case> getCaseById(@PathVariable String id) {
        Case caseData = caseService.getCaseById(id);
        return ResponseEntity.ok(caseData);
    }

    @PostMapping
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<Case> createCase(@Valid @RequestBody Case caseData) {
        Case createdCase = caseService.createCase(caseData);
        return ResponseEntity.ok(createdCase);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<Case> updateCase(@PathVariable String id, @Valid @RequestBody Case caseDetails) {
        Case updatedCase = caseService.updateCase(id, caseDetails);
        return ResponseEntity.ok(updatedCase);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCase(@PathVariable String id) {
        caseService.deleteCase(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/notes")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<Case> addNoteToCase(@PathVariable String id, @RequestBody NoteRequest noteRequest) {
        Case updatedCase = caseService.addNoteToCase(id, noteRequest.getContent());
        return ResponseEntity.ok(updatedCase);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<PageResponse<Case>> getCasesByStatus(
            @PathVariable CaseStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Case> cases = caseService.getCasesByStatus(status, pageable);
        PageResponse<Case> response = new PageResponse<>();
        response.setContent(cases.getContent());
        response.setPage(cases.getNumber());
        response.setSize(cases.getSize());
        response.setTotalElements(cases.getTotalElements());
        response.setTotalPages(cases.getTotalPages());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/assigned/{userId}")
    public ResponseEntity<List<Case>> getCasesAssignedToUser(@PathVariable String userId) {
        List<Case> cases = caseService.getCasesAssignedToUser(userId);
        return ResponseEntity.ok(cases);
    }

    // DTO for note request
    public static class NoteRequest {
        private String content;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}