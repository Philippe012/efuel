package com.efuel.efuel_dashboard.service;

import com.efuel.efuel_dashboard.exception.ResourceNotFoundException;
import com.efuel.efuel_dashboard.model.FuelStation;
import com.efuel.efuel_dashboard.model.StationStatus;
import com.efuel.efuel_dashboard.repository.FuelStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FuelStationService {
    @Autowired
    private FuelStationRepository stationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<FuelStation> getAllStations() {
        return stationRepository.findAll();
    }

    public FuelStation getStationById(Long id) {
        return stationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found with id: " + id));
    }

    public FuelStation createStation(FuelStation station) {
        station.setCreatedAt(LocalDateTime.now());
        station.setUpdatedAt(LocalDateTime.now());
        FuelStation savedStation = stationRepository.save(station);
        notifyDashboardUpdate();
        return savedStation;
    }

    public FuelStation updateStation(Long id, FuelStation stationDetails) {
        FuelStation station = getStationById(id);
        station.setName(stationDetails.getName());
        station.setLocation(stationDetails.getLocation());
        station.setStatus(stationDetails.getStatus());
        station.setUpdatedAt(LocalDateTime.now());
        FuelStation updatedStation = stationRepository.save(station);
        notifyDashboardUpdate();
        return updatedStation;
    }

    public void deleteStation(Long id) {
        FuelStation station = getStationById(id);
        stationRepository.delete(station);
        notifyDashboardUpdate();
    }

    private void notifyDashboardUpdate() {
        messagingTemplate.convertAndSend("/topic/stations", "update");
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStations", stationRepository.count());
        stats.put("availableStations", stationRepository.countByStatus(StationStatus.AVAILABLE));
        stats.put("unavailableStations", stationRepository.countByStatus(StationStatus.UNAVAILABLE));
        return stats;
    }
}