import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiBriefcase, 
  FiUser, 
  FiMenu, 
  FiX,
  FiSearch,
  FiLogIn,
  FiUserPlus
} from 'react-icons/fi';

const ClientNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/HireHub', icon: FiHome, label: 'Accueil' },
    { path: '/HireHub/annonces', icon: FiBriefcase, label: 'Annonces' },
    { path: '/HireHub/profil', icon: FiUser, label: 'Mon Profil' }
  ];

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/HireHub" style={styles.logo}>
          <div style={styles.logoIcon}>H</div>
          <span style={styles.logoText}>HireHub</span>
        </Link>

        {/* Desktop Menu */}
        <div style={styles.desktopMenu}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.menuItem,
                  ...(active ? styles.activeMenuItem : {})
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons */}
        <div style={styles.authButtons}>
          <Link to="/HireHub/connexion" style={styles.loginButton}>
            <FiLogIn size={18} />
            <span>Connexion</span>
          </Link>
          <Link to="/HireHub/inscription" style={styles.signupButton}>
            <FiUserPlus size={18} />
            <span>Inscription</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          style={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={styles.mobileMenu}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.mobileMenuItem,
                  ...(active ? styles.activeMobileMenuItem : {})
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div style={styles.mobileAuthButtons}>
            <Link 
              to="/HireHub/connexion" 
              style={styles.mobileLoginButton}
              onClick={() => setIsMenuOpen(false)}
            >
              <FiLogIn size={18} />
              <span>Connexion</span>
            </Link>
            <Link 
              to="/HireHub/inscription" 
              style={styles.mobileSignupButton}
              onClick={() => setIsMenuOpen(false)}
            >
              <FiUserPlus size={18} />
              <span>Inscription</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid #e5e7eb'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    color: '#1f2937'
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#1e3a8a',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937'
  },
  desktopMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#6b7280',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  },
  activeMenuItem: {
    color: '#1e3a8a',
    backgroundColor: '#dbeafe'
  },
  authButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#1e3a8a',
    fontSize: '16px',
    fontWeight: '500',
    border: '1px solid #1e3a8a',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  },
  signupButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '500',
    backgroundColor: '#1e3a8a',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  },
  mobileMenuButton: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '8px',
    '@media (max-width: 768px)': {
      display: 'block'
    }
  },
  mobileMenu: {
    display: 'block',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    padding: '20px',
    '@media (min-width: 769px)': {
      display: 'none'
    }
  },
  mobileMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    textDecoration: 'none',
    color: '#6b7280',
    fontSize: '16px',
    fontWeight: '500',
    borderBottom: '1px solid #f3f4f6'
  },
  activeMobileMenuItem: {
    color: '#1e3a8a'
  },
  mobileAuthButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb'
  },
  mobileLoginButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#1e3a8a',
    fontSize: '16px',
    fontWeight: '500',
    border: '1px solid #1e3a8a',
    textAlign: 'center'
  },
  mobileSignupButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '500',
    backgroundColor: '#1e3a8a',
    textAlign: 'center'
  }
};

export default ClientNavbar;
