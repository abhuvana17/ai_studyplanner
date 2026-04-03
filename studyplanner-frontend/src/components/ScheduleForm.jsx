import React, { useState } from 'react';

const ScheduleForm = ({ onGenerate, loading }) => {
  const [formData, setFormData] = useState({
    subject: '',
    examDate: '',
    difficultyLevel: 'Beginner',
    availableStudyHoursPerDay: 4
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <form className="styled-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Subject Focus</label>
        <input 
          type="text" 
          name="subject"
          className="form-input" 
          placeholder="e.g. Advanced Calculus, Machine Learning..."
          value={formData.subject}
          onChange={handleChange}
          required 
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Exam Date</label>
        <input 
          type="date" 
          name="examDate"
          className="form-input" 
          value={formData.examDate}
          onChange={handleChange}
          required 
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Current Proficiency / Difficulty</label>
        <select 
          name="difficultyLevel"
          className="form-select"
          value={formData.difficultyLevel}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="Beginner">Beginner - Starting fresh</option>
          <option value="Intermediate">Intermediate - Needs practice</option>
          <option value="Advanced">Advanced - Final Review</option>
        </select>
      </div>

      <div className="form-group">
        <label>Available Hours Per Day ({formData.availableStudyHoursPerDay} hrs)</label>
        <input 
          type="range" 
          name="availableStudyHoursPerDay"
          min="1" max="12" step="1"
          className="form-input"
          style={{padding: '0.5rem'}}
          value={formData.availableStudyHoursPerDay}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Optimal Plan'}
      </button>
    </form>
  )
}

export default ScheduleForm;
