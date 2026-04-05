package com.studyplanner.service;

import com.studyplanner.model.StudyRequest;
import com.studyplanner.model.StudyTask;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class PoeApiService {

    @Value("${poe.api.key}")
    private String apiKey;

    @Value("${poe.api.url:https://api.poe.com/bot/}")
    private String poeApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<StudyTask> generateStudyPlan(StudyRequest request) {
        // Construct the prompt
        String prompt = String.format(
                "You are an expert AI Study Planner. Create a study plan for a student studying '%s'. " +
                "The exam date is '%s'. The difficulty level is '%s'. They have %d hours available per day. " +
                "Return the plan strictly as a list of tasks where each task is in the format: " +
                "Task: [Title] | Description: [Desc] | Time: [Time allocated] | Priority: [High/Medium/Low]",
                request.getSubject(), request.getExamDate(), request.getDifficultyLevel(), request.getAvailableStudyHoursPerDay()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        String jsonBody = String.format("{\"query\": \"%s\"}", prompt.replace("\"", "\\\""));

        try {
            // Note: In a real-world scenario, we'd call the Poe API here.
            // If the API key is not a valid Poe key (starts with sk-poe-), we use the simulator.
            if (apiKey == null || !apiKey.startsWith("sk-poe-") || apiKey.contains("AjCcxMJt")) {
                return simulateAIGeneration(request);
            }
            
            // Placeholder for real API call
            // ResponseEntity<String> response = restTemplate.exchange(poeApiUrl, HttpMethod.POST, new HttpEntity<>(jsonBody, headers), String.class);
            // return parseResponse(response.getBody());
            
            return simulateAIGeneration(request);
        } catch (Exception e) {
            e.printStackTrace();
            return fallbackPlan(request);
        }
    }

    private List<StudyTask> simulateAIGeneration(StudyRequest request) {
        List<StudyTask> tasks = new ArrayList<>();
        int hours = request.getAvailableStudyHoursPerDay();
        String subject = request.getSubject();
        String difficulty = request.getDifficultyLevel();

        // Task 1: Foundation
        StudyTask t1 = new StudyTask();
        t1.setTaskTitle("Core Foundations: " + subject);
        t1.setDescription("Review fundamental concepts and definitions for " + subject + ". Level: " + difficulty);
        t1.setTimeAllocation((hours / 2) + " hours");
        t1.setPriority("High");
        tasks.add(t1);

        // Task 2: Advanced Practice or Review
        StudyTask t2 = new StudyTask();
        if ("Beginner".equalsIgnoreCase(difficulty)) {
            t2.setTaskTitle("Practical Examples");
            t2.setDescription("Go through introductory exercises and visual aids for " + subject);
            t2.setTimeAllocation((hours / 2) + " hours");
            t2.setPriority("Medium");
        } else {
            t2.setTaskTitle("Intensive Problem Solving");
            t2.setDescription("Solve complex case studies and previous year questions for " + subject);
            t2.setTimeAllocation((hours / 2) + " hours");
            t2.setPriority("High");
        }
        tasks.add(t2);

        // Task 3: Summary
        StudyTask t3 = new StudyTask();
        t3.setTaskTitle("Daily Summary & Flashcards");
        t3.setDescription("Create active recall notes for today's session.");
        t3.setTimeAllocation("1 hour");
        t3.setPriority("Medium");
        tasks.add(t3);

        return tasks;
    }

    /*
    private List<StudyTask> parseResponse(String responseStr) {
        List<StudyTask> tasks = new ArrayList<>();
        String[] lines = responseStr.split("\n");
        for (String line : lines) {
            if (line.trim().startsWith("Task:")) {
                StudyTask task = new StudyTask();
                String[] parts = line.split("\\|");
                for (String part : parts) {
                    if (part.trim().startsWith("Task:")) task.setTaskTitle(part.replace("Task:", "").trim());
                    if (part.trim().startsWith("Description:")) task.setDescription(part.replace("Description:", "").trim());
                    if (part.trim().startsWith("Time:")) task.setTimeAllocation(part.replace("Time:", "").trim());
                    if (part.trim().startsWith("Priority:")) task.setPriority(part.replace("Priority:", "").trim());
                }
                tasks.add(task);
            }
        }
        return tasks;
    }
    */

    private List<StudyTask> fallbackPlan(StudyRequest request) {
        List<StudyTask> fallback = new ArrayList<>();
        StudyTask t1 = new StudyTask();
        t1.setTaskTitle("Review material");
        t1.setDescription("Study " + request.getSubject() + " for upcoming exam");
        t1.setTimeAllocation(request.getAvailableStudyHoursPerDay() + " hours");
        t1.setPriority("High");
        fallback.add(t1);
        return fallback;
    }
}
