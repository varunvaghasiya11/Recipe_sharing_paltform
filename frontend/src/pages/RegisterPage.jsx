import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const { registerUser, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLocalLoading(true);
    try {
      await registerUser(username, email, password);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create account. Username or email might be taken.'
      );
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="auth-wrapper animate-fade-in">
      <div className="glass-panel auth-card">
        <div className="auth-header">
          <h2 className="serif-title">Create Account</h2>
          <p>Join our community to share and save gourmet recipes</p>
        </div>

        {error && (
          <div className="error-box">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username-input">Username</label>
            <div className="input-container">
              <User size={18} className="input-icon" />
              <input
                id="username-input"
                type="text"
                className="form-input input-with-icon"
                placeholder="gourmet_chef"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <div className="input-container">
              <Mail size={18} className="input-icon" />
              <input
                id="email-input"
                type="email"
                className="form-input input-with-icon"
                placeholder="chef@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">Password</label>
            <div className="input-container">
              <Lock size={18} className="input-icon" />
              <input
                id="password-input"
                type="password"
                className="form-input input-with-icon"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="confirm-password-input">Confirm Password</label>
            <div className="input-container">
              <Lock size={18} className="input-icon" />
              <input
                id="confirm-password-input"
                type="password"
                className="form-input input-with-icon"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-submit"
            disabled={localLoading}
          >
            {localLoading ? <div className="spinner" /> : (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
