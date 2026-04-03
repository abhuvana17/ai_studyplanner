import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/authIntegration';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({...credentials, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await loginUser(credentials);
      localStorage.setItem('studyplanner_user', JSON.stringify(user));
      onLogin(user);
      navigate('/dashboard');
    } catch(err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-section fade-in" style={{marginTop: '4rem'}}>
      <h2 style={{marginBottom: '1rem', textAlign: 'center'}}>Welcome Back</h2>
      <form className="styled-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" className="form-input" required value={credentials.username} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" className="form-input" required value={credentials.password} onChange={handleChange} />
        </div>
        {error && <div className="error-message">⚠️ {error}</div>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
      <p style={{textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)'}}>
        Don't have an account? <Link to="/register" style={{color: 'var(--accent-blue)', textDecoration: 'none'}}>Register here</Link>
      </p>
    </div>
  );
};
export default Login;
