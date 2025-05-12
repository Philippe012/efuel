package com.efuel.efuel_dashboard.repository;

import com.efuel.efuel_dashboard.model.FuelStation;
import com.efuel.efuel_dashboard.model.StationStatus; // Fixed import path
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FuelStationRepository extends JpaRepository<FuelStation, Long> {
    List<FuelStation> findByStatus(StationStatus status);

    long countByStatus(StationStatus status); // Moved inside the interface

    @Query("SELECT fs FROM FuelStation fs WHERE " +
            "6371 * acos(cos(radians(:lat)) * cos(radians(fs.latitude)) * " +
            "cos(radians(fs.longitude) - radians(:lng)) + " +
            "sin(radians(:lat)) * sin(radians(fs.latitude))) <= :radius")
    List<FuelStation> findNearbyStations(@Param("lat") double latitude,
            @Param("lng") double longitude,
            @Param("radius") double radiusInKm);
}