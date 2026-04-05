package com.studyplanner.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of(
            "status", "ACTIVE",
            "message", "AI Study Planner API is running. Please use the frontend to access the application.",
            "health", "/api/health"
        );
    }
}
