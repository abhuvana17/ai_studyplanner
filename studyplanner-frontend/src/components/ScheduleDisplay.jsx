import React from 'react';

const ScheduleDisplay = ({ schedule }) => {
  if (!schedule || schedule.length === 0) {
    return <div className="error-message">No tasks generated. Try adjusting your parameters.</div>;
  }

  return (
    <div className="timeline fade-in">
      {schedule.map((task, index) => (
        <div key={index} className="task-card" style={{ animationDelay: `${index * 0.15}s` }}>
          <div className="task-header">
            <h3 className="task-title">{task.taskTitle}</h3>
            <span className={`task-badge priority-${task.priority}`}>
              {task.priority || 'Normal'}
            </span>
          </div>
          <p className="task-desc">{task.description}</p>
          <div className="task-footer">
            <span className="clock-icon">⌚</span>
            <span>{task.timeAllocation}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleDisplay;
