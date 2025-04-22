package org.practice.safecity.repository;

import org.practice.safecity.model.Alert;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends MongoRepository<Alert, String> {
    List<Alert> findByType(String type);

    List<Alert> findByIsRead(boolean isRead);

    List<Alert> findByUserId(String userId);

    List<Alert> findByUserIdAndIsRead(String userId, boolean isRead);

    List<Alert> findByUserIdAndType(String userId, String type);

    List<Alert> findByStatus(String status);

    @Query("{'location': {$near: {$geometry: {type: 'Point', coordinates: [?0, ?1]}, $maxDistance: ?2}}}")
    List<Alert> findNearbyAlerts(double latitude, double longitude, double radiusKm);

    @Query("{'status': 'ACTIVE', 'location': {$near: {$geometry: {type: 'Point', coordinates: [?0, ?1]}, $maxDistance: ?2}}}")
    List<Alert> findActiveAlertsNearby(double latitude, double longitude, double radiusKm);
}
