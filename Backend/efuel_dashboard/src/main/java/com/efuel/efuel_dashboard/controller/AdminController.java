package com.efuel.efuel_dashboard.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.stereotype.Controller;

@Controller
public class AdminController {
    @GetMapping("/")
    public String home() {
        return "index.html";
    }
}