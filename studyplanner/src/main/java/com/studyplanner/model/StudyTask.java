package com.studyplanner.model;

import lombok.Data;

@Data
public class StudyTask {
    private String taskTitle;
    private String description;
    private String timeAllocation;
    private String priority;
}
