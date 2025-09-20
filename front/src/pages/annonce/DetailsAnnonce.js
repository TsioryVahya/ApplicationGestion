import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiBriefcase, 
  FiCalendar, 
  FiMapPin, 
  FiUsers,
  FiMail,
  FiPhone,
  FiFileText,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle
} from 'react-icons/fi';

const DetailsAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [candidats, setCandidats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    chargerDetailsAnnonce();
    chargerCandidatsAnnonce();
  }, [id]);

  const chargerDetailsAnnonce = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/annonces/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setAnnonce(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur lors du chargement de l\'annonce');
      console.error(err);
    }
  };

  const chargerCandidatsAnnonce = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/candidats/annonce/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      console.log('Réponse API candidats:', data); // Debug
      
      if (data.success) {
        setCandidats(data.data);
        console.log('Candidats chargés:', data.data); // Debug
      } else {
        console.error('Erreur API candidats:', data.message);
      }
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des candidats:', err);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatutIcon = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'accepté':
        return <FiCheckCircle color="#10b981" size={16} />;
      case 'refusé':
        return <FiXCircle color="#ef4444" size={16} />;
      case 'en cours d\'évaluation':
        return <FiAlertCircle color="#f59e0b" size={16} />;
      default:
        return <FiClock color="#6b7280" size={16} />;
    }
  };

  const getStatutColor = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'accepté':
        return '#10b981';
      case 'refusé':
        return '#ef4444';
      case 'en cours d\'évaluation':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  if (loading) return <div style={styles.loading}>Chargement...</div>;
  if (error) return <div style={styles.error}>Erreur: {error}</div>;
  if (!annonce) return <div style={styles.error}>Annonce non trouvée</div>;

  return (
    <div style={styles.container}>
      {/* Header avec bouton retour */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <FiArrowLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 style={styles.title}>Détails de l'Annonce</h1>
      </div>

      {/* Détails de l'annonce */}
      <div style={styles.annonceCard}>
        <div style={styles.annonceHeader}>
          <div style={styles.annonceTitle}>
            <FiBriefcase size={24} color="#3b82f6" />
            <h2 style={styles.annonceNom}>{annonce.reference}</h2>
          </div>
          <div style={styles.annonceInfo}>
            <div style={styles.infoItem}>
              <FiMapPin size={16} color="#6b7280" />
              <span>{annonce.nomDepartement}</span>
            </div>
            <div style={styles.infoItem}>
              <FiUser size={16} color="#6b7280" />
              <span>{annonce.nomProfil}</span>
            </div>
          </div>
        </div>

        <div style={styles.annonceDetails}>
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Description</h3>
            <p style={styles.description}>
              {annonce.description || 'Aucune description disponible'}
            </p>
          </div>

          <div style={styles.dateSection}>
            <div style={styles.dateItem}>
              <FiCalendar size={16} color="#6b7280" />
              <div>
                <span style={styles.dateLabel}>Date de début</span>
                <span style={styles.dateValue}>{formatDate(annonce.dateDebut)}</span>
              </div>
            </div>
            <div style={styles.dateItem}>
              <FiCalendar size={16} color="#6b7280" />
              <div>
                <span style={styles.dateLabel}>Date de fin</span>
                <span style={styles.dateValue}>{formatDate(annonce.dateFin)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Candidats */}
      <div style={styles.candidatsSection}>
        <div style={styles.candidatsHeader}>
          <div style={styles.candidatsTitle}>
            <FiUsers size={24} color="#3b82f6" />
            <h2>Candidats Associés</h2>
          </div>
          <div style={styles.candidatsCount}>
            {candidats.length} candidat{candidats.length > 1 ? 's' : ''}
          </div>
        </div>

        {candidats.length === 0 ? (
          <div style={styles.noCandidats}>
            <FiUsers size={48} color="#94a3b8" />
            <p>Aucun candidat n'a encore postulé pour cette annonce</p>
          </div>
        ) : (
          <div style={styles.candidatsList}>
            {candidats.map(candidat => (
              <div key={candidat.id} style={styles.candidatCard}>
                <div style={styles.candidatHeader}>
                  <div style={styles.candidatInfo}>
                    <div style={styles.candidatNom}>
                      <FiUser size={20} color="#3b82f6" />
                      <span>{candidat.prenom} {candidat.nom}</span>
                    </div>
                    <div style={styles.candidatContact}>
                      <div style={styles.contactItem}>
                        <FiUser size={14} color="#6b7280" />
                        <span>ID: {candidat.id}</span>
                      </div>
                    </div>
                  </div>
                  <div style={styles.candidatStatut}>
                    {getStatutIcon(candidat.statutNom)}
                    <span style={{ color: getStatutColor(candidat.statutNom) }}>
                      {candidat.statutNom || 'En attente'}
                    </span>
                  </div>
                </div>

                <div style={styles.candidatDetails}>
                  {candidat.dateNaissance && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Âge:</span>
                      <span>{new Date().getFullYear() - new Date(candidat.dateNaissance).getFullYear()} ans</span>
                    </div>
                  )}
                  {candidat.adresse && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Adresse:</span>
                      <span>{candidat.adresse}</span>
                    </div>
                  )}
                </div>

                {candidat.cv && (
                  <div style={styles.motivationSection}>
                    <div style={styles.motivationHeader}>
                      <FiFileText size={16} color="#6b7280" />
                      <span>CV / Profil</span>
                    </div>
                    <p style={styles.motivationText}>
                      {candidat.cv.length > 200 
                        ? candidat.cv.substring(0, 200) + '...'
                        : candidat.cv
                      }
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8fafc'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    gap: '20px'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#475569',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#f1f5f9'
    }
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0
  },
  annonceCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '30px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  annonceHeader: {
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '20px',
    marginBottom: '20px'
  },
  annonceTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  annonceNom: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0
  },
  annonceInfo: {
    display: 'flex',
    gap: '24px'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#64748b'
  },
  annonceDetails: {
    display: 'grid',
    gap: '20px'
  },
  detailSection: {
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px'
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#475569',
    margin: 0
  },
  dateSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  dateItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px'
  },
  dateLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500'
  },
  dateValue: {
    display: 'block',
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: '600'
  },
  candidatsSection: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  candidatsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '16px'
  },
  candidatsTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  candidatsCount: {
    fontSize: '14px',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: '500'
  },
  noCandidats: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#64748b'
  },
  candidatsList: {
    display: 'grid',
    gap: '16px'
  },
  candidatCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fafafa'
  },
  candidatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  candidatInfo: {
    flex: 1
  },
  candidatNom: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px'
  },
  candidatContact: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#64748b'
  },
  candidatStatut: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '500'
  },
  candidatDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '16px'
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  detailLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500'
  },
  motivationSection: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '16px'
  },
  motivationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569'
  },
  motivationText: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#64748b',
    fontStyle: 'italic',
    margin: 0
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '16px',
    color: '#64748b'
  },
  error: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '16px',
    color: '#ef4444'
  }
};

export default DetailsAnnonce;
