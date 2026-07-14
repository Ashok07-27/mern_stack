import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, ShoppingCart, User, LogOut, Sun, Moon } from 'lucide-react';

const Navbar = ({ cartCount }) => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return 'dark'; // Dark theme default
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  // Set default theme attribute on mount
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar-header glass-card" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none', padding: '1rem 0', position: 'sticky', top: '0', zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: '800', fontSize: '1.4rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          <BookOpen size={28} className="text-cyan" style={{ color: 'var(--accent-secondary)' }} />
          <span>Book<span style={{ color: 'var(--accent-primary)' }}>Store</span></span>
        </Link>

        {/* Action Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          
          {/* Light/Dark Toggle */}
          <button onClick={toggleTheme} className="btn-icon" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Cart link */}
          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="badge badge-indigo" style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                padding: '0.2rem 0.4rem',
                fontSize: '0.65rem',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                color: 'white',
                minWidth: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Section */}
          {userInfo ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to={userInfo.isAdmin ? "/admin" : "/dashboard"} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <User size={18} />
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{userInfo.username}</span>
              </Link>
              {userInfo.isAdmin && (
                <Link to="/admin" className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Admin</Link>
              )}
              <button onClick={handleLogout} className="btn-icon" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }} title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-sm" style={{ padding: '0.4rem 1rem' }}>
              Login
            </Link>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;
