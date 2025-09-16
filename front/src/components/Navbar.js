import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <h2 style={styles.brandText}>📋 Gestion App</h2>
        </div>
        
        <div style={styles.menu}>
          <Link 
            to="/" 
            style={{
              ...styles.menuItem,
              ...(isActive('/') ? styles.activeItem : {})
            }}
          >
            🏠 Accueil
          </Link>
          
          <Link 
            to="/utilisateurs" 
            style={{
              ...styles.menuItem,
              ...(isActive('/utilisateurs') ? styles.activeItem : {})
            }}
          >
            👥 Utilisateurs
          </Link>
        </div>

        <div style={styles.userSection}>
          <span style={styles.userInfo}>
            👤 {user?.email}
          </span>
          <button 
            onClick={onLogout}
            style={styles.logoutButton}
          >
            🚪 Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#2d3436',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px'
  },
  brand: {
    display: 'flex',
    alignItems: 'center'
  },
  brandText: {
    color: '#ffffff',
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  menu: {
    display: 'flex',
    gap: '30px'
  },
  menuItem: {
    color: '#b2bec3',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '10px 15px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  activeItem: {
    backgroundColor: '#00b894',
    color: '#ffffff',
    transform: 'translateY(-2px)'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  userInfo: {
    color: '#b2bec3',
    fontSize: '0.9rem'
  },
  logoutButton: {
    backgroundColor: '#e17055',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};

export default Navbar;
