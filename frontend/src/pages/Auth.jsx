import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userInfo, login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration specific states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    // If user is already logged in, send them to target route
    if (userInfo) {
      navigate(redirect, { replace: true });
    }
  }, [userInfo, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(emailOrUsername, password);
      } else {
        await register(username, email, password);
      }
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
      
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        
        {/* Toggle tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              padding: '0.75rem 0',
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              fontSize: '1.1rem',
              color: isLogin ? 'var(--accent-secondary)' : 'var(--text-secondary)',
              borderBottom: isLogin ? '2px solid var(--accent-secondary)' : 'none',
              cursor: 'pointer'
            }}
          >
            Log In
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              padding: '0.75rem 0',
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              fontSize: '1.1rem',
              color: !isLogin ? 'var(--accent-secondary)' : 'var(--text-secondary)',
              borderBottom: !isLogin ? '2px solid var(--accent-secondary)' : 'none',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </div>

        {error && <div className="badge badge-danger" style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem', justifyContent: 'center' }}>{error}</div>}

        {/* Auth form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {isLogin ? (
            <>
              {/* Login fields */}
              <div className="form-group">
                <label className="form-label">Email or Username</label>
                <input 
                  type="text" 
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="form-input" 
                  placeholder="e.g. customer or user@example.com"
                  required 
                />
              </div>
            </>
          ) : (
            <>
              {/* Register fields */}
              <div className="form-group">
                <label className="form-label">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input" 
                  placeholder="e.g. johndoe"
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input" 
                  placeholder="e.g. john@example.com"
                  required 
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input" 
              placeholder="••••••••"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
          </button>

        </form>

        {/* Demo Credentials Alert box */}
        {isLogin && (
          <div className="glass-card" style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', fontSize: '0.8rem', borderColor: 'var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>💡 Demo Credentials:</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Customer:</span>
              <code>user@example.com / user123</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Admin:</span>
              <code>admin@example.com / admin123</code>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default Auth;
