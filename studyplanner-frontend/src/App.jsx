import './index.css'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'

function App() {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('studyplanner_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to load user state", e);
      }
    }
    setIsInitializing(false);
  }, []);

  const handleLogin = (u) => {
    setUser(u);
  };

  const handleLogout = () => {
    localStorage.removeItem('studyplanner_user');
    setUser(null);
  };

  if (isInitializing) return <div className="app-container"><div className="spinner"></div></div>;

  return (
    <Router>
      <div className="app-container">
        <div className="glass-panel main-content">
          <header className="app-header">
            <div className="logo">
              <span className="logo-icon">✨</span>
              <h1 className="gradient-text">AI Study Planner Expert</h1>
            </div>
            { !user && <p className="subtitle">Harness Poe AI to create dynamic, personalized schedules instantly.</p> }
          </header>

          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          </Routes>
        </div>
        
        <div className="ambient-background">
          <div className="orb blue-orb"></div>
          <div className="orb purple-orb"></div>
        </div>
      </div>
    </Router>
  )
}

export default App;
