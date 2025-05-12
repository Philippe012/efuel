package com.efuel.efuel_dashboard.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String username;
    private String email;
    private String password;
}