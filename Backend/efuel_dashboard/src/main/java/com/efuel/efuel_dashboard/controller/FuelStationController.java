package com.efuel.efuel_dashboard.controller;

import com.efuel.efuel_dashboard.model.FuelStation;
import com.efuel.efuel_dashboard.service.FuelStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/stations")
public class FuelStationController {
    @Autowired
    private FuelStationService stationService;

    @GetMapping
    public ResponseEntity<List<FuelStation>> getAllStations() {
        return ResponseEntity.ok(stationService.getAllStations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuelStation> getStationById(@PathVariable Long id) {
        return ResponseEntity.ok(stationService.getStationById(id));
    }

    @PostMapping
    public ResponseEntity<FuelStation> createStation(@RequestBody FuelStation station) {
        return ResponseEntity.ok(stationService.createStation(station));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FuelStation> updateStation(@PathVariable Long id, @RequestBody FuelStation stationDetails) {
        return ResponseEntity.ok(stationService.updateStation(id, stationDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStation(@PathVariable Long id) {
        stationService.deleteStation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(stationService.getDashboardStats());
    }
}