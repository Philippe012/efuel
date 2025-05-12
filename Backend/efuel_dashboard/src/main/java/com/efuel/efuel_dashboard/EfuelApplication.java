package com.efuel.efuel_dashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.efuel.efuel_dashboard.repository")
@EntityScan(basePackages = "com.efuel.efuel_dashboard.model")
public class EfuelApplication {
    public static void main(String[] args) {
        SpringApplication.run(EfuelApplication.class, args);
    }
}