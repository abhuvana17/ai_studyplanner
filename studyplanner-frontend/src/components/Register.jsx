import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/authIntegration';

const Register = () => {
  const [user, setUser] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({...user, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await registerUser(user);
      navigate('/login');
    } catch(err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-section fade-in" style={{marginTop: '4rem'}}>
      <h2 style={{marginBottom: '1rem', textAlign: 'center'}}>Create Expert Account</h2>
      <form className="styled-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" className="form-input" required value={user.username} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" className="form-input" required value={user.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" className="form-input" required value={user.password} onChange={handleChange} />
        </div>
        {error && <div className="error-message">⚠️ {error}</div>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
      </form>
      <p style={{textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)'}}>
        Already have an account? <Link to="/login" style={{color: 'var(--accent-blue)', textDecoration: 'none'}}>Login here</Link>
      </p>
    </div>
  );
};
export default Register;
