import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiBarChart2, 
  FiLogOut, 
  FiUser,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { useState } from 'react';

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Tableau de bord', color: '#3B82F6' },
    { path: '/utilisateurs', icon: FiUsers, label: 'Utilisateurs', color: '#10B981' },
    { path: '/rapports', icon: FiBarChart2, label: 'Rapports', color: '#F59E0B' },
    { path: '/parametres', icon: FiSettings, label: 'Paramètres', color: '#6B7280' }
  ];

  return (
    <div style={{...styles.sidebar, width: isCollapsed ? '80px' : '280px'}}>
      {/* Header */}
      <div style={styles.sidebarHeader}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>HR</div>
          {!isCollapsed && <span style={styles.logoText}>HRManager</span>}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={styles.collapseButton}
        >
          {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
        </button>
      </div>

      {/* User Profile */}
      <div style={styles.userProfile}>
        <div style={styles.userAvatar}>
          <FiUser size={24} />
        </div>
        {!isCollapsed && (
          <div style={styles.userDetails}>
            <div style={styles.userName}>{user?.prenom} {user?.nom}</div>
            <div style={styles.userRole}>{user?.nomDepartement}</div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav style={styles.navigation}>
        <div style={styles.menuSection}>
          {!isCollapsed && <div style={styles.sectionTitle}>NAVIGATION</div>}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.menuItem,
                  ...(active ? styles.activeMenuItem : {}),
                  justifyContent: isCollapsed ? 'center' : 'flex-start'
                }}
              >
                <div style={{...styles.menuIcon, color: active ? '#ffffff' : item.color}}>
                  <Icon size={20} />
                </div>
                {!isCollapsed && (
                  <span style={{...styles.menuLabel, color: active ? '#ffffff' : '#64748B'}}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div style={styles.sidebarFooter}>
        <button 
          onClick={onLogout}
          style={{
            ...styles.logoutButton,
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
        >
          <FiLogOut size={20} />
          {!isCollapsed && <span style={styles.logoutText}>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    backgroundColor: '#1e293b',
    transition: 'width 0.3s ease',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)'
  },
  sidebarHeader: {
    padding: '24px 20px',
    borderBottom: '1px solid #334155',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#1e40af',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  logoText: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '600'
  },
  collapseButton: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    transition: 'all 0.2s ease'
  },
  userProfile: {
    padding: '20px',
    borderBottom: '1px solid #334155',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  userAvatar: {
    width: '48px',
    height: '48px',
    backgroundColor: '#1e40af',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff'
  },
  userDetails: {
    flex: 1
  },
  userName: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '4px'
  },
  userRole: {
    color: '#94a3b8',
    fontSize: '14px'
  },
  navigation: {
    flex: 1,
    padding: '20px 0'
  },
  menuSection: {
    paddingLeft: '20px',
    paddingRight: '20px'
  },
  sectionTitle: {
    color: '#64748b',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '16px',
    paddingLeft: '12px'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    margin: '4px 0',
    borderRadius: '10px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  },
  activeMenuItem: {
    backgroundColor: '#1e40af',
    transform: 'translateX(4px)'
  },
  menuIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuLabel: {
    fontSize: '15px',
    fontWeight: '500'
  },
  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid #334155'
  },
  logoutButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: 'transparent',
    border: '1px solid #ef4444',
    borderRadius: '10px',
    color: '#ef4444',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '15px',
    fontWeight: '500'
  },
  logoutText: {
    color: '#ef4444'
  }
};

export default Sidebar;
