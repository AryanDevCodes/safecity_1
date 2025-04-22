package org.practice.safecity.controller;

import jakarta.validation.Valid;
import org.practice.safecity.model.Alert;
import org.practice.safecity.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {
    @Autowired
    private AlertService alertService;

    @GetMapping
    public List<Alert> getAlerts(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean unread,
            @RequestParam(required = false) String userId
    ) {
        if (userId != null && unread != null) {
            return alertService.getAlertsByUserIdAndIsRead(userId, unread);
        } else if (userId != null && type != null) {
            return alertService.getAlertsByUserIdAndType(userId, type);
        } else if (userId != null) {
            return alertService.getAlertsByUserId(userId);
        } else if (type != null) {
            return alertService.getAlertsByType(type);
        } else if (unread != null) {
            return alertService.getAlertsByIsRead(unread);
        } else {
            return alertService.getAllAlerts();
        }
    }

    @PostMapping
    public Alert createAlert(@Valid @RequestBody Alert alert) {
        return alertService.createAlert(alert);
    }

    @PatchMapping("/{id}/read")
    public Alert markAsRead(@PathVariable String id) {
        return alertService.markAsRead(id);
    }

    @DeleteMapping("/{id}")
    public void deleteAlert(@PathVariable String id) {
        alertService.deleteAlert(id);
    }
}
