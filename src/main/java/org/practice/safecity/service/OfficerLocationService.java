package org.practice.safecity.service;

import org.practice.safecity.model.OfficerLocation;
import org.practice.safecity.repository.OfficerLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class OfficerLocationService {

    private final OfficerLocationRepository locationRepository;

    @Autowired
    public OfficerLocationService(OfficerLocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public void updateLocation(String officerId, double latitude, double longitude) {
        OfficerLocation location = locationRepository.findByOfficerId(officerId)
                .orElse(new OfficerLocation());

        location.setOfficerId(officerId);
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        location.setLastUpdated(Instant.now());

        locationRepository.save(location);
    }

    public List<OfficerLocation> getNearbyOfficers(double latitude, double longitude, double radiusKm) {
        return locationRepository.findNearbyOfficers(latitude, longitude, radiusKm);
    }

    public List<OfficerLocation> getActiveOfficers() {
        return locationRepository.findActiveOfficers(Instant.now().minusSeconds(300)); // Active in last 5 minutes
    }
}