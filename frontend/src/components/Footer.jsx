import React from 'react';

const Footer = () => {
  return (
    <footer className="glass-card" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', padding: '1.5rem 0', marginTop: 'auto', textAlign: 'center' }}>
      <div className="container">
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} BookStore MERN App. All rights reserved.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
          Built for Sai Harshitha Alla portfolio demonstration.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
