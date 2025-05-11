package com.efuel.efuel_dashboard.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "stations")
public class Station {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "electric_price", nullable = false)
    private Double electricPrice;

    @Column(name = "petrol_price", nullable = false)
    private Double petrolPrice;

    @Column(name = "diesel_price", nullable = false)
    private Double dieselPrice;

    @Column(name = "gas_price", nullable = false)
    private Double gasPrice;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}