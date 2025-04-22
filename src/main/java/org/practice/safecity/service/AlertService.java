package org.practice.safecity.service;

import org.practice.safecity.model.Alert;
import org.practice.safecity.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertService {
    @Autowired
    private AlertRepository alertRepository;

    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    public Alert createAlert(Alert alert) {
        alert.setId(null); // Ensure new entity
        return alertRepository.save(alert);
    }

    public Alert markAsRead(String id) {
        Alert alert = alertRepository.findById(id).orElseThrow();
        alert.setRead(true);
        return alertRepository.save(alert);
    }

    public void deleteAlert(String id) {
        alertRepository.deleteById(id);
    }

    public List<Alert> getAlertsByType(String type) {
        return alertRepository.findByType(type);
    }

    public List<Alert> getAlertsByIsRead(boolean isRead) {
        return alertRepository.findByIsRead(isRead);
    }

    public List<Alert> getAlertsByUserId(String userId) {
        return alertRepository.findByUserId(userId);
    }

    public List<Alert> getAlertsByUserIdAndIsRead(String userId, boolean isRead) {
        return alertRepository.findByUserIdAndIsRead(userId, isRead);
    }

    public List<Alert> getAlertsByUserIdAndType(String userId, String type) {
        return alertRepository.findByUserIdAndType(userId, type);
    }
}
