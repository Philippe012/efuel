package com.efuel.efuel_dashboard.controller;

import com.efuel.efuel_dashboard.model.Station;
import com.efuel.efuel_dashboard.service.StationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
public class StationController {
    private final StationService stationService;

    @GetMapping
    public ResponseEntity<List<Station>> getAllStations() {
        return ResponseEntity.ok(stationService.getAllActiveStations());
    }

    @RestController
    @RequestMapping("/api/admin/stations")
    @PreAuthorize("hasRole('ADMIN')")
    public class AdminStationController {
        @GetMapping
        public ResponseEntity<List<Station>> getAllStationsForAdmin() {
            return ResponseEntity.ok(stationService.getAllStations());
        }

        @PostMapping
        public ResponseEntity<Station> createStation(@RequestBody Station station) {
            return ResponseEntity.ok(stationService.saveStation(station));
        }

        @PutMapping
        public ResponseEntity<Station> updateStation(@RequestBody Station station) {
            return ResponseEntity.ok(stationService.updateStation(station));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteStation(@PathVariable Long id) {
            stationService.deleteStation(id);
            return ResponseEntity.noContent().build();
        }
    }
}