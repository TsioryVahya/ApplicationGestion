import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>🎯 Application de Gestion</h1>
        <p style={styles.subtitle}>
          Plateforme complète pour la gestion des utilisateurs et des ressources
        </p>
      </div>

      <div style={styles.features}>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>👥</div>
          <h3 style={styles.featureTitle}>Gestion des Utilisateurs</h3>
          <p style={styles.featureDescription}>
            Créez, modifiez et gérez facilement tous vos utilisateurs avec une interface intuitive
          </p>
          <Link to="/utilisateurs" style={styles.featureButton}>
            Voir les utilisateurs
          </Link>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>📊</div>
          <h3 style={styles.featureTitle}>Tableau de Bord</h3>
          <p style={styles.featureDescription}>
            Visualisez les statistiques et les métriques importantes de votre application
          </p>
          <button style={{...styles.featureButton, ...styles.disabledButton}}>
            Bientôt disponible
          </button>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>⚙️</div>
          <h3 style={styles.featureTitle}>Configuration</h3>
          <p style={styles.featureDescription}>
            Personnalisez les paramètres et les préférences de votre application
          </p>
          <button style={{...styles.featureButton, ...styles.disabledButton}}>
            Bientôt disponible
          </button>
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>🚀</div>
          <div style={styles.statLabel}>Application Active</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statNumber}>💾</div>
          <div style={styles.statLabel}>Base MySQL</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statNumber}>⚡</div>
          <div style={styles.statLabel}>API REST</div>
        </div>
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          Développé avec ❤️ - Application de Gestion v1.0.0
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    backgroundColor: '#f8f9fa',
    padding: '40px 20px'
  },
  hero: {
    textAlign: 'center',
    marginBottom: '60px'
  },
  title: {
    fontSize: '3rem',
    color: '#2d3436',
    marginBottom: '20px',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: '1.3rem',
    color: '#636e72',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto 60px auto'
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '40px 30px',
    borderRadius: '15px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    cursor: 'pointer'
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '20px'
  },
  featureTitle: {
    fontSize: '1.5rem',
    color: '#2d3436',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  featureDescription: {
    color: '#636e72',
    lineHeight: '1.6',
    marginBottom: '25px'
  },
  featureButton: {
    display: 'inline-block',
    backgroundColor: '#00b894',
    color: 'white',
    padding: '12px 25px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  disabledButton: {
    backgroundColor: '#b2bec3',
    cursor: 'not-allowed'
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    marginBottom: '60px',
    flexWrap: 'wrap'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 3px 15px rgba(0,0,0,0.1)',
    textAlign: 'center',
    minWidth: '150px'
  },
  statNumber: {
    fontSize: '2.5rem',
    marginBottom: '10px'
  },
  statLabel: {
    color: '#636e72',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  footer: {
    textAlign: 'center',
    paddingTop: '40px',
    borderTop: '1px solid #e9ecef'
  },
  footerText: {
    color: '#636e72',
    fontSize: '0.9rem'
  }
};

export default Home;
