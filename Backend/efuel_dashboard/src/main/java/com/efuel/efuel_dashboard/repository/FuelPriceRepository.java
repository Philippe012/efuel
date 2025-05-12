package com.efuel.efuel_dashboard.repository;

import com.efuel.efuel_dashboard.model.FuelPrice;
import com.efuel.efuel_dashboard.model.FuelType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FuelPriceRepository extends JpaRepository<FuelPrice, Long> {
    @Query("SELECT fp FROM FuelPrice fp WHERE fp.station.id = :stationId AND fp.fuelType = :fuelType ORDER BY fp.recordedAt DESC")
    List<FuelPrice> findLatestPrices(@Param("stationId") Long stationId, @Param("fuelType") FuelType fuelType);
}