package com.studyplanner.model;

import lombok.Data;

@Data
public class StudyRequest {
    private String subject;
    private String examDate;
    private String difficultyLevel;
    private int availableStudyHoursPerDay;
}
