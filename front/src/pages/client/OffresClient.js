import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiCalendar, FiMapPin, FiBriefcase, FiUser, FiHome, FiClock } from 'react-icons/fi';
import ModalConnexionCandidat from '../../components/ModalConnexionCandidat';
import ClientNavbar from '../../components/client/ClientNavbar';

const OffresClient = () => {
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState('');
  const [filtreType, setFiltreType] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await fetch('/api/client/annonce');
        if (!res.ok) throw new Error('Erreur réseau');
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Erreur serveur');
        setAnnonces(json.data || []);
      } catch (e) {
        setErreur(e.message);
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);

  const annoncesFiltrees = useMemo(() => {
    return annonces.filter(a => {
      const txt = `${a.reference || ''} ${a.nomPoste || a.titre || ''} ${a.description || ''} ${a.nomDepartement || ''} ${a.nomProfil || ''}`.toLowerCase();
      const okRecherche = txt.includes(recherche.toLowerCase());
      const typeNorm = (a.typeAnnonce || '').toLowerCase();
      const okType = filtreType === 'all' || typeNorm === filtreType.toLowerCase();
      return okRecherche && okType;
    });
  }, [annonces, recherche, filtreType]);

  const formatDate = d => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handlePostuler = (annonce) => {
    setSelectedAnnonce(annonce);
    setModalOpen(true);
  };

  const handleLoginSuccess = (data) => {
    if (!selectedAnnonce) return;
    const id = selectedAnnonce.idAnnonce || selectedAnnonce.id || selectedAnnonce.annonceId;
    if (!id) {
      console.error('ID annonce manquant dans selectedAnnonce', selectedAnnonce);
      return;
    }
    navigate(`/candidature/${id}` , { state: { idAnnonce: id, annonce: selectedAnnonce } });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <ClientNavbar />
        <div style={styles.loading}>
          <div style={styles.loadingSpinner}></div>
          <p>Chargement des annonces...</p>
        </div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div style={styles.container}>
        <ClientNavbar />
        <div style={styles.error}>
          <h2>Erreur</h2>
          <p>{erreur}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <ClientNavbar />
      
      <section style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Annonces d'emploi</h1>
          <p style={styles.headerSubtitle}>
            {annoncesFiltrees.length} annonce{annoncesFiltrees.length > 1 ? 's' : ''} disponible{annoncesFiltrees.length > 1 ? 's' : ''}
          </p>
        </div>
      </section>

      <section style={styles.searchSection}>
        <div style={styles.searchContent}>
          <div style={styles.searchBar}>
            <div style={styles.searchInput}>
              <FiSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Rechercher par référence, description, profil..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.filterBox}>
              <FiFilter size={20} />
              <select
                value={filtreType}
                onChange={e => setFiltreType(e.target.value)}
                style={styles.select}
              >
                <option value="all">Tous les types</option>
                <option value="cdi">CDI</option>
                <option value="cdd">CDD</option>
                <option value="stage">Stage</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.annoncesSection}>
        <div style={styles.annoncesContent}>
          {annoncesFiltrees.length === 0 ? (
            <div style={styles.noResults}>
              <FiBriefcase size={64} color="#6b7280" />
              <h3>Aucune annonce trouvée</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div style={styles.annoncesGrid}>
              {annoncesFiltrees.map((a, index) => {
                const statut = new Date(a.dateFin) >= new Date() ? 'Active' : 'Expirée';
                return (
                  <div key={`annonce-${a.idAnnonce || index}`} style={styles.annonceCard}>
                    <div style={styles.cardHeader}>
                      <div style={styles.cardLogo}>
                        <FiBriefcase size={24} color="#1e3a8a" />
                      </div>
                      <div style={styles.cardType}>
                        {a.typeAnnonce || 'CDI'}
                      </div>
                    </div>
                    
                    <div style={styles.cardContent}>
                      <h3 style={styles.cardTitle}>
                        Référence: {a.reference}
                      </h3>
                      <p style={styles.cardDescription}>
                        {a.description}
                      </p>
                      
                      <div style={styles.cardDetails}>
                        <div style={styles.cardDetail}>
                          <FiUser size={16} color="#6b7280" />
                          <span>{a.nomProfil || 'Profil non spécifié'}</span>
                        </div>
                        <div style={styles.cardDetail}>
                          <FiHome size={16} color="#6b7280" />
                          <span>{a.nomDepartement || 'Département non spécifié'}</span>
                        </div>
                        <div style={styles.cardDetail}>
                          <FiCalendar size={16} color="#6b7280" />
                          <span>Début: {formatDate(a.dateDebut)}</span>
                        </div>
                        <div style={styles.cardDetail}>
                          <FiClock size={16} color="#6b7280" />
                          <span>Fin: {formatDate(a.dateFin)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={styles.cardFooter}>
                      <button 
                        style={styles.viewButton}
                        onClick={() => navigate(`/HireHub/annonces/${a.id || a.idAnnonce}`)}
                      >
                        Voir les détails
                      </button>
                      <button 
                        style={styles.applyButton}
                        onClick={() => handlePostuler(a)}
                        disabled={statut === 'Expirée'}
                      >
                        Postuler
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <ModalConnexionCandidat
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleLoginSuccess}
        selectedAnnonce={selectedAnnonce}
      />
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '20px'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #1e3a8a',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '20px',
    textAlign: 'center'
  },
  header: {
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    padding: '60px 0 40px'
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    textAlign: 'center'
  },
  headerTitle: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '16px'
  },
  headerSubtitle: {
    fontSize: '18px',
    opacity: 0.9
  },
  searchSection: {
    backgroundColor: '#ffffff',
    padding: '30px 0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  searchContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  searchBar: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  },
  searchInput: {
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  searchIcon: {
    color: '#6b7280',
    fontSize: '20px'
  },
  input: {
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    color: '#1f2937',
    backgroundColor: 'transparent',
    width: '100%'
  },
  filterBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#0ea5e9',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  select: {
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    backgroundColor: 'transparent',
    color: '#ffffff'
  },
  annoncesSection: {
    padding: '40px 0'
  },
  annoncesContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  noResults: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '60px 20px',
    gap: '16px'
  },
  annoncesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '24px'
  },
  annonceCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  cardLogo: {
    width: '50px',
    height: '50px',
    backgroundColor: '#dbeafe',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardType: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500'
  },
  cardContent: {
    marginBottom: '24px'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '12px'
  },
  cardDescription: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
    marginBottom: '16px'
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  cardDetail: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#6b7280'
  },
  cardFooter: {
    display: 'flex',
    gap: '12px'
  },
  viewButton: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#1e3a8a',
    border: '1px solid #1e3a8a',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

export default OffresClient;
