package org.practice.safecity.service;

import org.practice.safecity.model.Alert;
import org.practice.safecity.model.OfficerLocation;
import org.practice.safecity.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final OfficerLocationService officerLocationService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public AlertService(
            AlertRepository alertRepository,
            OfficerLocationService officerLocationService,
            SimpMessagingTemplate messagingTemplate) {
        this.alertRepository = alertRepository;
        this.officerLocationService = officerLocationService;
        this.messagingTemplate = messagingTemplate;
    }

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

    public String createSOSAlert(Map<String, Object> alertData) {
        Alert alert = new Alert();
        alert.setType("SOS");
        alert.setStatus("ACTIVE");
        alert.setLatitude(Double.parseDouble(alertData.get("latitude").toString()));
        alert.setLongitude(Double.parseDouble(alertData.get("longitude").toString()));
        alert.setDetails(alertData.get("details").toString());
        alert.setCreatedAt(Instant.now());

        Alert savedAlert = alertRepository.save(alert);

        // Find and notify nearby officers
        List<OfficerLocation> nearbyOfficers = officerLocationService.getNearbyOfficers(
                alert.getLatitude(),
                alert.getLongitude(),
                5.0 // 5km radius
        );

        for (OfficerLocation officer : nearbyOfficers) {
            messagingTemplate.convertAndSendToUser(
                    officer.getOfficerId(),
                    "/queue/alerts",
                    Map.of(
                            "type", "NEARBY_SOS_ALERT",
                            "payload", Map.of(
                                    "alertId", savedAlert.getId(),
                                    "latitude", savedAlert.getLatitude(),
                                    "longitude", savedAlert.getLongitude(),
                                    "details", savedAlert.getDetails(),
                                    "distance", calculateDistance(
                                            officer.getLatitude(),
                                            officer.getLongitude(),
                                            savedAlert.getLatitude(),
                                            savedAlert.getLongitude()))));
        }

        return savedAlert.getId();
    }

    public void acknowledgeAlert(String alertId, String officerId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        alert.setStatus("ACKNOWLEDGED");
        alert.setRespondingOfficerId(officerId);
        alert.setAcknowledgedAt(Instant.now());

        alertRepository.save(alert);
    }

    public void resolveAlert(String alertId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        alert.setStatus("RESOLVED");
        alert.setResolvedAt(Instant.now());

        alertRepository.save(alert);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in kilometers

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}
