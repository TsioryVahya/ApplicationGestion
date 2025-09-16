import { useEffect, useState } from "react";

function App() {
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
      <h1 style={styles.title}>Liste des Utilisateurs</h1>
      <div style={styles.userGrid}>
        {users.map(user => (
          <div key={user.id} style={styles.userCard}>
            <div style={styles.userHeader}>
              <h3 style={styles.userName}>{user.prenom} {user.nom}</h3>
              <span style={{...styles.userStatus, ...getStatusStyle(user.statut)}}>{user.statut}</span>
            </div>
            <p style={styles.userEmail}>📧 {user.email}</p>
            <p style={styles.userDate}>📅 Créé le: {formatDate(user.dateCreation)}</p>
            <span style={{...styles.userRole, ...getRoleStyle(user.role)}}>{user.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  },
  title: {
    textAlign: 'center',
    color: '#2d3436',
    marginBottom: '30px',
    fontSize: '2.5rem'
  },
  userGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  userCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
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
    fontSize: '1.3rem'
  },
  userEmail: {
    margin: '0 0 10px 0',
    color: '#636e72',
    fontSize: '0.9rem'
  },
  userDate: {
    margin: '0 0 15px 0',
    color: '#636e72',
    fontSize: '0.8rem'
  },
  userStatus: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  userRole: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textTransform: 'uppercase'
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

export default App;
