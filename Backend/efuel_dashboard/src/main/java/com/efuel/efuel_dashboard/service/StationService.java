package com.efuel.efuel_dashboard.service;

import com.efuel.efuel_dashboard.model.Station;
import com.efuel.efuel_dashboard.repository.StationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StationService {
    private final StationRepository stationRepository;

    public List<Station> getAllActiveStations() {
        return stationRepository.findByActiveTrue();
    }

    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }

    public Station saveStation(Station station) {
        return stationRepository.save(station);
    }

    public Station updateStation(Station station) {
        station.setUpdatedAt(LocalDateTime.now());
        return stationRepository.save(station);
    }

    public void deleteStation(Long id) {
        stationRepository.deleteById(id);
    }
}