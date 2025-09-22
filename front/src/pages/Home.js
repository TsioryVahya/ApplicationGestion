import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiBarChart2, 
  FiSettings, 
  FiTrendingUp,
  FiDatabase,
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiFileText,
  FiEdit3
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import './Home.css';

const Home = () => {
  const [statistiques, setStatistiques] = useState({
    totalCandidats: 0,
    totalAnnonces: 0,
    entretiensProgammes: 0,
    totalContrats: 0,
    qcmEnvoyesCeMois: 0
  });
  const [donneesGraphiques, setDonneesGraphiques] = useState({
    candidaturesParMois: [],
    entretiensParStatut: [],
    resultatsQcm: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Charger les statistiques générales
      const statsResponse = await fetch('/api/statistiques/generales', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStatistiques(statsData.data);
      }
      
      // Charger les données graphiques
      const graphiquesResponse = await fetch('/api/statistiques/graphiques', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (graphiquesResponse.ok) {
        const graphiquesData = await graphiquesResponse.json();
        setDonneesGraphiques(graphiquesData.data);
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Couleurs pour les graphiques
  const COLORS = ['#1e40af', '#059669', '#dc2626', '#7c3aed', '#f59e0b'];

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Tableau de Bord RH</h1>
          <p style={styles.subtitle}>
            Gérez efficacement vos ressources humaines avec notre plateforme moderne
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiUsers size={24} color="#1e40af" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{statistiques.totalCandidats}</div>
            <div style={styles.statLabel}>Total Candidats</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiBriefcase size={24} color="#059669" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{statistiques.totalAnnonces}</div>
            <div style={styles.statLabel}>Annonces Actives</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiCalendar size={24} color="#dc2626" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{statistiques.entretiensProgammes}</div>
            <div style={styles.statLabel}>Entretiens Programmés</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiFileText size={24} color="#7c3aed" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{statistiques.totalContrats}</div>
            <div style={styles.statLabel}>Contrats Actifs</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiEdit3 size={24} color="#f59e0b" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{statistiques.qcmEnvoyesCeMois}</div>
            <div style={styles.statLabel}>QCM ce mois</div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div style={styles.chartsSection}>
        <h2 style={styles.sectionTitle}>Analyses et Tendances</h2>
        
        <div style={styles.chartsGrid}>
          {/* Graphique des candidatures par mois */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Candidatures par Mois</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donneesGraphiques.candidaturesParMois}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="nombre" 
                  stroke="#1e40af" 
                  strokeWidth={3}
                  name="Candidatures"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique des entretiens par statut */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Entretiens par Statut</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donneesGraphiques.entretiensParStatut}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({statut, nombre}) => `${statut}: ${nombre}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="nombre"
                >
                  {donneesGraphiques.entretiensParStatut.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique des résultats QCM */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Résultats QCM</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={donneesGraphiques.resultatsQcm}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="note" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="nombre" name="Nombre de candidats">
                  {donneesGraphiques.resultatsQcm.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.note === 'bon' ? '#059669' : 
                      entry.note === 'moyen' ? '#f59e0b' : '#dc2626'
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div style={styles.featuresGrid}>
        <div style={styles.featureCard}>
          <div style={styles.featureHeader}>
            <div style={styles.featureIcon}>
              <FiUsers size={32} color="#1e40af" />
            </div>
            <h3 style={styles.featureTitle}>Gestion des Employés</h3>
          </div>
          <p style={styles.featureDescription}>
            Gérez les profils, les départements et les informations de vos employés en temps réel
          </p>
          <Link to="/utilisateurs" style={styles.featureButton}>
            <span>Accéder</span>
            <FiArrowRight size={16} />
          </Link>
        </div>

                <div style={styles.featureCard}>
          <div style={styles.featureHeader}>
            <div style={styles.featureIcon}>
              <FiUsers size={32} color="#1e40af" />
            </div>
            <h3 style={styles.featureTitle}>Liste des candidats</h3>
          </div>
          <p style={styles.featureDescription}>
            Liste des candidats
          </p>
          <Link to="/candidats" style={styles.featureButton}>
            <span>Accéder</span>
            <FiArrowRight size={16} />
          </Link>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureHeader}>
            <div style={styles.featureIcon}>
              <FiBarChart2 size={32} color="#059669" />
            </div>
            <h3 style={styles.featureTitle}>Rapports & Analytics</h3>
          </div>
          <p style={styles.featureDescription}>
            Analysez les tendances RH et générez des rapports détaillés sur vos équipes
          </p>
          <button style={{...styles.featureButton, ...styles.disabledButton}}>
            <span>Bientôt disponible</span>
          </button>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureHeader}>
            <div style={styles.featureIcon}>
              <FiSettings size={32} color="#dc2626" />
            </div>
            <h3 style={styles.featureTitle}>Configuration</h3>
          </div>
          <p style={styles.featureDescription}>
            Personnalisez les paramètres système et configurez les workflows RH
          </p>
          <button style={{...styles.featureButton, ...styles.disabledButton}}>
            <span>Bientôt disponible</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Actions Rapides</h2>
        <div style={styles.actionsGrid}>
          <button style={styles.actionButton}>
            <FiUsers size={20} />
            <span>Nouvel Employé</span>
          </button>
          <button style={styles.actionButton}>
            <FiBarChart2 size={20} />
            <span>Générer Rapport</span>
          </button>
          <button style={styles.actionButton}>
            <FiSettings size={20} />
            <span>Paramètres</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '32px',
    backgroundColor: '#f1f5f9',
    minHeight: '100vh'
  },
  header: {
    marginBottom: '32px'
  },
  headerContent: {
    maxWidth: '1200px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    lineHeight: '1.6'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '40px'
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.2s ease'
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statContent: {
    flex: 1
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px',
    marginBottom: '40px'
  },
  featureCard: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s ease'
  },
  featureHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px'
  },
  featureIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0
  },
  featureDescription: {
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '24px',
    fontSize: '15px'
  },
  featureButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#1e40af',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px'
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
    cursor: 'not-allowed'
  },
  quickActions: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '20px'
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #1e40af',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  chartsSection: {
    marginBottom: '40px'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    marginTop: '20px'
  },
  chartCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px',
    margin: '0 0 16px 0'
  }
};

export default Home;
