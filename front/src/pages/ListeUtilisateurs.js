import { useEffect, useState } from "react";

const ListeUtilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/utilisateurs")
      .then(res => {
        if (!res.ok) {
          throw new Error('Erreur lors du chargement des utilisateurs');
        }
        return res.json();
      })
      .then(response => {
        if (response.success) {
          setUsers(response.data);
        } else {
          throw new Error(response.message || 'Erreur lors du chargement');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={styles.loading}>Chargement des utilisateurs...</div>;
  if (error) return <div style={styles.error}>Erreur: {error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👥 Liste des Utilisateurs</h1>
        <p style={styles.subtitle}>
          Gérez tous vos utilisateurs depuis cette interface
        </p>
      </div>
      
      <div style={styles.statsBar}>
        <div style={styles.stat}>
          <span style={styles.statNumber}>{users.length}</span>
          <span style={styles.statLabel}>Utilisateurs</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statNumber}>
            {users.filter(u => u.statut === 'Actif').length}
          </span>
          <span style={styles.statLabel}>Actifs</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statNumber}>
            {users.filter(u => u.role === 'Admin').length}
          </span>
          <span style={styles.statLabel}>Admins</span>
        </div>
      </div>

      <div style={styles.userGrid}>
        {users.map(user => (
          <div key={user.id} style={styles.userCard}>
            <div style={styles.userHeader}>
              <h3 style={styles.userName}>{user.prenom} {user.nom}</h3>
              <span style={{...styles.userStatus, ...getStatusStyle(user.statut)}}>{user.statut}</span>
            </div>
            <p style={styles.userEmail}>📧 {user.email}</p>
            <p style={styles.userDate}>📅 Créé le: {formatDate(user.dateCreation)}</p>
            <div style={styles.userFooter}>
              <span style={{...styles.userRole, ...getRoleStyle(user.role)}}>{user.role}</span>
              <div style={styles.userActions}>
                <button style={styles.actionButton}>✏️</button>
                <button style={{...styles.actionButton, ...styles.deleteButton}}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getRoleStyle = (role) => {
  switch(role) {
    case 'Admin':
      return { backgroundColor: '#ff6b6b', color: 'white' };
    case 'Manager':
      return { backgroundColor: '#4ecdc4', color: 'white' };
    default:
      return { backgroundColor: '#95e1d3', color: '#2d3436' };
  }
};

const getStatusStyle = (statut) => {
  switch(statut) {
    case 'Actif':
      return { backgroundColor: '#00b894', color: 'white' };
    case 'Inactif':
      return { backgroundColor: '#e17055', color: 'white' };
    default:
      return { backgroundColor: '#636e72', color: 'white' };
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    minHeight: 'calc(100vh - 70px)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    color: '#2d3436',
    marginBottom: '10px',
    fontSize: '2.5rem'
  },
  subtitle: {
    color: '#636e72',
    fontSize: '1.1rem'
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    marginBottom: '40px',
    flexWrap: 'wrap'
  },
  stat: {
    backgroundColor: 'white',
    padding: '20px 30px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    minWidth: '120px'
  },
  statNumber: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#00b894',
    marginBottom: '5px'
  },
  statLabel: {
    color: '#636e72',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  userGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  userCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 3px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: '1px solid #e9ecef'
  },
  userHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  userName: {
    margin: '0',
    color: '#2d3436',
    fontSize: '1.4rem',
    fontWeight: 'bold'
  },
  userEmail: {
    margin: '0 0 10px 0',
    color: '#636e72',
    fontSize: '0.95rem'
  },
  userDate: {
    margin: '0 0 20px 0',
    color: '#636e72',
    fontSize: '0.85rem'
  },
  userFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userStatus: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  userRole: {
    padding: '6px 15px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  userActions: {
    display: 'flex',
    gap: '8px'
  },
  actionButton: {
    backgroundColor: '#74b9ff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s ease'
  },
  deleteButton: {
    backgroundColor: '#ff7675'
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#636e72',
    marginTop: '50px'
  },
  error: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#d63031',
    marginTop: '50px'
  }
};

export default ListeUtilisateurs;
