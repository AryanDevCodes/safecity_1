package org.practice.safecity.websocket;

import org.practice.safecity.model.User;
import org.practice.safecity.security.JwtTokenProvider;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketEventHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final JwtTokenProvider tokenProvider;
    private final Map<String, String> userSessions = new ConcurrentHashMap<>();

    public WebSocketEventHandler(SimpMessagingTemplate messagingTemplate, JwtTokenProvider tokenProvider) {
        this.messagingTemplate = messagingTemplate;
        this.tokenProvider = tokenProvider;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sessionId = headers.getSessionId();

        // Get token from connect message
        String token = headers.getFirstNativeHeader("token");
        if (token != null && tokenProvider.validateToken(token)) {
            String userEmail = tokenProvider.getUserEmailFromToken(token);
            userSessions.put(sessionId, userEmail);

            // Notify other users about officer connection if applicable
            User user = tokenProvider.getUserFromToken(token);
            if (user != null && user.getRole().name().equals("ROLE_OFFICER")) {
                messagingTemplate.convertAndSend("/topic/officer-status", Map.of(
                        "type", "OFFICER_CONNECTED",
                        "officerId", user.getId(),
                        "name", user.getName()));
            }
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        String userEmail = userSessions.remove(sessionId);

        if (userEmail != null) {
            // Notify about officer disconnection if applicable
            User user = tokenProvider.getUserByEmail(userEmail);
            if (user != null && user.getRole().name().equals("ROLE_OFFICER")) {
                messagingTemplate.convertAndSend("/topic/officer-status", Map.of(
                        "type", "OFFICER_DISCONNECTED",
                        "officerId", user.getId()));
            }
        }
    }
}