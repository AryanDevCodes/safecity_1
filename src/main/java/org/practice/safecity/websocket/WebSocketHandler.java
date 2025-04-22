package org.practice.safecity.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.practice.safecity.model.Incident;
import org.practice.safecity.model.SOSAlert;
import org.practice.safecity.service.AlertService;
import org.practice.safecity.service.OfficerLocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Controller
public class WebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final OfficerLocationService officerLocationService;
    private final AlertService alertService;
    private final ObjectMapper objectMapper;

    @Autowired
    public WebSocketHandler(
            SimpMessagingTemplate messagingTemplate,
            OfficerLocationService officerLocationService,
            AlertService alertService,
            ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.officerLocationService = officerLocationService;
        this.alertService = alertService;
        this.objectMapper = objectMapper;
    }

    @MessageMapping("/officer.location")
    public void handleOfficerLocation(@Payload Map<String, Object> location, SimpMessageHeaderAccessor headerAccessor) {
        String officerId = location.get("officerId").toString();
        double latitude = Double.parseDouble(location.get("latitude").toString());
        double longitude = Double.parseDouble(location.get("longitude").toString());

        // Update officer location in database
        officerLocationService.updateLocation(officerId, latitude, longitude);

        // Add user information to the location update
        String userEmail = headerAccessor.getUser().getName();
        location.put("userEmail", userEmail);

        // Broadcast to all clients who need to know officer locations
        messagingTemplate.convertAndSend("/topic/officer-locations", Map.of(
                "type", "OFFICER_LOCATION_UPDATE",
                "payload", location));
    }

    @MessageMapping("/sos.trigger")
    @SendTo("/topic/sos")
    public Map<String, Object> handleSOSAlert(@Payload SOSAlert sosAlert, Principal principal) {
        // Process and store the SOS alert
        String alertId = alertService.createSOSAlert(sosAlert);

        // Enhance the alert with additional information
        Map<String, Object> enhancedAlert = objectMapper.convertValue(sosAlert, Map.class);
        enhancedAlert.put("alertId", alertId);
        enhancedAlert.put("timestamp", System.currentTimeMillis());
        enhancedAlert.put("sender", principal.getName());

        return Map.of(
                "type", "SOS_ALERT",
                "payload", enhancedAlert);
    }

    @MessageMapping("/incident.report")
    @SendTo("/topic/incidents")
    public Map<String, Object> handleNewIncident(@Payload Incident incident) {
        // Process new incident report
        return Map.of(
                "type", "NEW_INCIDENT",
                "payload", incident);
    }

    @MessageMapping("/alert.acknowledge")
    public void handleAlertAcknowledge(@Payload Map<String, Object> acknowledgement, Principal principal) {
        String alertId = acknowledgement.get("alertId").toString();
        String officerId = acknowledgement.get("officerId").toString();

        // Update alert status in database
        alertService.acknowledgeAlert(alertId, officerId);

        // Notify relevant parties about the acknowledgement
        messagingTemplate.convertAndSend("/topic/alerts/" + alertId, Map.of(
                "type", "ALERT_ACKNOWLEDGED",
                "payload", Map.of(
                        "alertId", alertId,
                        "officerId", officerId,
                        "timestamp", System.currentTimeMillis(),
                        "acknowledgedBy", principal.getName())));
    }
}