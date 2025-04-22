package org.practice.safecity.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.practice.safecity.model.Incident;
import org.practice.safecity.model.SOSAlert;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class WebSocketChannelHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    public WebSocketChannelHandler(SimpMessagingTemplate messagingTemplate, ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
    }

    @MessageMapping("/sos.trigger")
    @SendTo("/topic/sos")
    public Map<String, Object> handleSOSAlert(@Payload SOSAlert sosAlert, SimpMessageHeaderAccessor headerAccessor) {
        return Map.of(
                "type", "SOS_ALERT",
                "payload", sosAlert);
    }

    @MessageMapping("/incident.report")
    @SendTo("/topic/incidents")
    public Map<String, Object> handleNewIncident(@Payload Incident incident) {
        return Map.of(
                "type", "NEW_INCIDENT",
                "payload", incident);
    }

    @MessageMapping("/officer.location")
    public void handleOfficerLocation(@Payload Map<String, Object> location, SimpMessageHeaderAccessor headerAccessor) {
        String userEmail = headerAccessor.getUser().getName();
        location.put("userEmail", userEmail);

        messagingTemplate.convertAndSend("/topic/officer-locations", Map.of(
                "type", "OFFICER_LOCATION_UPDATE",
                "payload", location));
    }

    @MessageMapping("/alert.acknowledge")
    public void handleAlertAcknowledgement(@Payload Map<String, String> acknowledgement) {
        String alertId = acknowledgement.get("alertId");
        String officerId = acknowledgement.get("officerId");

        messagingTemplate.convertAndSend("/topic/alerts/" + alertId, Map.of(
                "type", "ALERT_ACKNOWLEDGED",
                "payload", Map.of(
                        "alertId", alertId,
                        "officerId", officerId,
                        "timestamp", System.currentTimeMillis())));
    }
}