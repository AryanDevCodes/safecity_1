package org.practice.safecity.repository;

import org.practice.safecity.model.Alert;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AlertRepository extends MongoRepository<Alert, String> {
    List<Alert> findByType(String type);
    List<Alert> findByIsRead(boolean isRead);
    List<Alert> findByUserId(String userId);
    List<Alert> findByUserIdAndIsRead(String userId, boolean isRead);
    List<Alert> findByUserIdAndType(String userId, String type);
}
