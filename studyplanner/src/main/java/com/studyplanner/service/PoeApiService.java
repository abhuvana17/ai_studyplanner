package com.studyplanner.service;

import com.studyplanner.model.StudyRequest;
import com.studyplanner.model.StudyTask;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

        // This attempts a generic request structure. 
        // Note: The precise Poe API endpoint will depend on their specific bot protocol.
        String jsonBody = String.format("{\"query\": \"%s\"}", prompt.replace("\"", "\\\""));

        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        try {
            // Note: Replace with actual endpoint or mock it if unauthorized.
            // ResponseEntity<String> response = restTemplate.exchange(poeApiUrl, HttpMethod.POST, entity, String.class);
            // String responseBody = response.getBody();
            
            // System fallback mock for now if no real POE api is configured
            String responseBody = "Task: Foundation Review | Description: Read chapter 1 of " + request.getSubject() + " | Time: 2 hours | Priority: High\n" +
                                  "Task: Practice Problems | Description: Solve 20 questions | Time: 2 hours | Priority: Medium";
            
            return parseResponse(responseBody);
        } catch (Exception e) {
            e.printStackTrace();
            return fallbackPlan(request);
        }
    }

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
