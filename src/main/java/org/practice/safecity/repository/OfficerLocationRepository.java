package org.practice.safecity.repository;

import org.practice.safecity.model.OfficerLocation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface OfficerLocationRepository extends MongoRepository<OfficerLocation, String> {
    Optional<OfficerLocation> findByOfficerId(String officerId);

    @Query("{'location': {$near: {$geometry: {type: 'Point', coordinates: [?0, ?1]}, $maxDistance: ?2}}}")
    List<OfficerLocation> findNearbyOfficers(double latitude, double longitude, double radiusKm);

    @Query("{'lastUpdated': {$gte: ?0}}")
    List<OfficerLocation> findActiveOfficers(Instant since);
}