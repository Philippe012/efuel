package com.efuel.efuel_dashboard.repository;

import com.efuel.efuel_dashboard.model.ERole;
import com.efuel.efuel_dashboard.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(ERole name);
}