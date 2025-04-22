package org.practice.safecity.service;

import org.practice.safecity.model.Incident;
import org.practice.safecity.repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class IncidentService {

    @Autowired
    private IncidentRepository incidentRepository;

    public Page<Incident> getAllIncidents(Pageable pageable) {
        return incidentRepository.findAll(pageable);
    }

    public Incident getIncidentById(String id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found with id: " + id));
    }

    public Incident createIncident(Incident incident) {
        // Generate unique incident number if not provided
        if (incident.getIncidentNumber() == null || incident.getIncidentNumber().isEmpty()) {
            incident.setIncidentNumber("INC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        // Set default status if not provided
        if (incident.getStatus() == null) {
            incident.setStatus("NEW");
        }

        return incidentRepository.save(incident);
    }

    public Incident updateIncident(String id, Incident incidentDetails) {
        Incident existingIncident = getIncidentById(id);

        existingIncident.setTitle(incidentDetails.getTitle());
        existingIncident.setDescription(incidentDetails.getDescription());
        existingIncident.setType(incidentDetails.getType());
        existingIncident.setSeverity(incidentDetails.getSeverity());
        existingIncident.setLocation(incidentDetails.getLocation());
        existingIncident.setStatus(incidentDetails.getStatus());

        return incidentRepository.save(existingIncident);
    }

    public void deleteIncident(String id) {
        Incident incident = getIncidentById(id);
        incidentRepository.delete(incident);
    }

    public Page<Incident> getIncidentsByStatus(String status, Pageable pageable) {
        return incidentRepository.findByStatus(status, pageable);
    }

    public Page<Incident> getIncidentsByType(String type, Pageable pageable) {
        return incidentRepository.findByType(type, pageable);
    }
}