import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChefHat, LogOut, User as UserIcon, PlusCircle, Compass, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="nav-bar">
      <div className="nav-container">
        
        <Link to="/" className="logo-link">
          <ChefHat size={28} className="text-gradient" style={{ stroke: 'var(--primary)' }} />
          <span className="serif-title" style={{ letterSpacing: '0.05em' }}>
            Flavor<span style={{ color: 'var(--primary)' }}>Share</span>
          </span>
        </Link>

        <div className="desktop-nav">
          <Link 
            to="/" 
            className="nav-link"
            style={{ color: isActive('/') ? 'var(--primary)' : 'var(--text-secondary)' }}
          >
            <Compass size={18} />
            <span>Discover</span>
          </Link>

          {user ? (
            <>
              <Link 
                to="/create" 
                className="nav-link"
                style={{ color: isActive('/create') ? 'var(--primary)' : 'var(--text-secondary)' }}
              >
                <PlusCircle size={18} />
                <span>Share Recipe</span>
              </Link>

              <Link 
                to="/profile" 
                className="nav-link"
                style={{ color: isActive('/profile') ? 'var(--primary)' : 'var(--text-secondary)' }}
              >
                {user.profileImage ? (
                  <img 
                    src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5001${user.profileImage}`} 
                    alt="avatar" 
                    className="avatar" 
                    style={{ width: '24px', height: '24px' }}
                  />
                ) : (
                  <UserIcon size={18} />
                )}
                <span>My Kitchen</span>
              </Link>

              <button onClick={handleLogout} className="btn btn-secondary nav-btn-logout">
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="nav-auth-group">
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Join Free
              </Link>
            </div>
          )}
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="btn btn-secondary mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav-panel animate-fade-in">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: isActive('/') ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            <Compass size={18} />
            <span>Discover</span>
          </Link>

          {user ? (
            <>
              <Link 
                to="/create" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: isActive('/create') ? 'var(--primary)' : 'var(--text-secondary)'
                }}
              >
                <PlusCircle size={18} />
                <span>Share Recipe</span>
              </Link>

              <Link 
                to="/profile" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: isActive('/profile') ? 'var(--primary)' : 'var(--text-secondary)'
                }}
              >
                {user.profileImage ? (
                  <img 
                    src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5001${user.profileImage}`} 
                    alt="avatar" 
                    className="avatar" 
                    style={{ width: '22px', height: '22px' }}
                  />
                ) : (
                  <UserIcon size={18} />
                )}
                <span>My Kitchen</span>
              </Link>

              <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                Join Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
