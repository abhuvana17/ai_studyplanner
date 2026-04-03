import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScheduleForm from './ScheduleForm';
import ScheduleDisplay from './ScheduleDisplay';
import { generateSchedule } from '../api/poeIntegration';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Basic local storage persistence for historical plans
      const savedHistory = JSON.parse(localStorage.getItem(`history_${user.id}`)) || [];
      setHistory(savedHistory);
    }
  }, [user, navigate]);

  const handleGenerate = async (formData) => {
    setLoading(true);
    setError(null);
    setSchedule(null);
    try {
      const data = await generateSchedule(formData);
      setSchedule(data);
      const newHistory = [{ date: new Date().toLocaleString(), formData, data }, ...history];
      setHistory(newHistory);
      localStorage.setItem(`history_${user?.id}`, JSON.stringify(newHistory));
    } catch (err) {
      setError(err.message || 'Failed to generate schedule. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadHistoricalPlan = (plan) => {
    setSchedule(plan.data);
  };

  if (!user) return null;

  return (
    <div className="content-layout" style={{ display: 'flex', gap: '2rem', width: '100%' }}>
      
      {/* Sidebar for Expert Mode Look */}
      <aside className="sidebar" style={{ 
          flex: '0 0 250px', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' 
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: '0' }}>{user.username}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Expert Student</p>
          </div>
        </div>
        
        <h4 style={{ color: 'var(--accent-blue)', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Your Flow State</h4>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
          <li><button onClick={() => setSchedule(null)} className="back-btn" style={{width: '100%', textAlign: 'left', border: 'none', background: !schedule ? 'rgba(255,255,255,0.1)' : 'transparent'}}>✨ New Generator</button></li>
        </ul>

        <h4 style={{ color: 'var(--accent-purple)', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>History Logs</h4>
        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {history.length === 0 ? <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No previous plans.</p> : null}
          {history.map((hist, i) => (
            <div key={i} onClick={() => loadHistoricalPlan(hist)} style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--glass-border)', borderRadius: '8px', marginBottom: '0.5rem', cursor: 'pointer', transition: '0.2s' }}>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>{hist.formData.subject}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{hist.date}</span>
            </div>
          ))}
        </div>

        <button onClick={onLogout} style={{ marginTop: '2rem', width: '100%', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>Disconnect</button>
      </aside>

      {/* Main Generator Section */}
      <main style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
        {!schedule && (
          <div className="form-section fade-in" style={{ marginLeft: '0' }}>
            <ScheduleForm onGenerate={handleGenerate} loading={loading} />
            {error && <div className="error-message">⚠️ {error}</div>}
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Synthesizing your optimal study path...</p>
              </div>
            )}
          </div>
        )}

        {schedule && !loading && (
          <div className="results-section slide-up">
            <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Optimized Timeline</h2>
            <ScheduleDisplay schedule={schedule} />
          </div>
        )}
      </main>

    </div>
  );
};

export default Dashboard;
