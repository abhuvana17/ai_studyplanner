package com.studyplanner.controller;

import com.studyplanner.model.StudyRequest;
import com.studyplanner.model.StudyTask;
import com.studyplanner.service.PoeApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/studyplanner")
@CrossOrigin(origins = "*")
public class StudyPlannerController {

    @Autowired
    private PoeApiService poeApiService;

    @PostMapping("/generate")
    public List<StudyTask> generateSchedule(@RequestBody StudyRequest request) {
        return poeApiService.generateStudyPlan(request);
    }
}
