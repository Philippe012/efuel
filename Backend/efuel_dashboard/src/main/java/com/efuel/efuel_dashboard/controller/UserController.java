package com.efuel.efuel_dashboard.controller;

import com.efuel.efuel_dashboard.Security.Services.UserDetailsImpl;
import com.efuel.efuel_dashboard.model.User;
import com.efuel.efuel_dashboard.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.efuel.efuel_dashboard.dto.ProfileUpdateRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/update-profile")
    public ResponseEntity<User> updateProfile(
            @RequestBody ProfileUpdateRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        User updatedUser = userService.updateUserProfile(
            userDetails.getId(), 
            request.getUsername(),
            request.getEmail(),
            request.getPassword()
        );
        
        return ResponseEntity.ok(updatedUser);
    }
}