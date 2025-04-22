package org.practice.safecity.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class NotificationHandler {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendSOSAlert(String location, String details) {
        WebSocketMessage message = new WebSocketMessage(
                "SOS_ALERT",
                new SOSAlertPayload(location, details));
        messagingTemplate.convertAndSend("/topic/sos", message);
    }

    public void sendIncidentNotification(String incidentId, String description) {
        WebSocketMessage message = new WebSocketMessage(
                "NEW_INCIDENT",
                new IncidentPayload(incidentId, description));
        messagingTemplate.convertAndSend("/topic/incidents", message);
    }

    public void sendReportStatusUpdate(String reportId, String status) {
        WebSocketMessage message = new WebSocketMessage(
                "REPORT_STATUS_CHANGE",
                new ReportStatusPayload(reportId, status));
        messagingTemplate.convertAndSend("/topic/reports", message);
    }

    public void sendOfficerLocationUpdate(String officerId, double lat, double lng) {
        WebSocketMessage message = new WebSocketMessage(
                "OFFICER_LOCATION_UPDATE",
                new OfficerLocationPayload(officerId, lat, lng));
        messagingTemplate.convertAndSend("/topic/officer-locations", message);
    }
}

class WebSocketMessage {
    private String type;
    private Object payload;

    public WebSocketMessage(String type, Object payload) {
        this.type = type;
        this.payload = payload;
    }

    // Getters and setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }
}

class SOSAlertPayload {
    private String location;
    private String details;

    public SOSAlertPayload(String location, String details) {
        this.location = location;
        this.details = details;
    }

    // Getters and setters
    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}

class IncidentPayload {
    private String incidentId;
    private String description;

    public IncidentPayload(String incidentId, String description) {
        this.incidentId = incidentId;
        this.description = description;
    }

    // Getters and setters
    public String getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(String incidentId) {
        this.incidentId = incidentId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

class ReportStatusPayload {
    private String reportId;
    private String status;

    public ReportStatusPayload(String reportId, String status) {
        this.reportId = reportId;
        this.status = status;
    }

    // Getters and setters
    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

class OfficerLocationPayload {
    private String officerId;
    private double latitude;
    private double longitude;

    public OfficerLocationPayload(String officerId, double latitude, double longitude) {
        this.officerId = officerId;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters and setters
    public String getOfficerId() {
        return officerId;
    }

    public void setOfficerId(String officerId) {
        this.officerId = officerId;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}