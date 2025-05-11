package com.efuel.efuel_dashboard.repository;

import com.efuel.efuel_dashboard.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StationRepository extends JpaRepository<Station, Long> {
    List<Station> findByActiveTrue();
}