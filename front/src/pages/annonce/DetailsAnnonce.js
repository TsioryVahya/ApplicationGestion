import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiBriefcase, FiCalendar, FiMapPin, FiUsers,
  FiMail, FiFileText, FiUser, FiClock, FiCheckCircle,
  FiXCircle, FiAlertCircle, FiFilter, FiSearch, FiX, FiSend
} from 'react-icons/fi';

const DetailsAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [candidats, setCandidats] = useState([]);
  const [candidatsFiltres, setCandidatsFiltres] = useState([]);
  const [lieux, setLieux] = useState([]);
  const [qcms, setQcms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showQcmModal, setShowQcmModal] = useState(false);
  const [selectedCandidat, setSelectedCandidat] = useState(null);
  const [sendingQcm, setSendingQcm] = useState(false);
  const [filtres, setFiltres] = useState({
    statut: '', recherche: '', dateDebut: '', dateFin: '',
    ageMin: '', ageMax: '', lieu: '', diplome: ''
  });

  useEffect(() => {
    chargerDetailsAnnonce();
    chargerCandidatsAnnonce();
    chargerLieux();
    chargerQcms();
  }, [id]);

  useEffect(() => {
    appliquerFiltres();
  }, [candidats, filtres]);

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
      if (data.success) {
        setCandidats(data.data);
        setCandidatsFiltres(data.data);
      } else {
        console.error('Erreur API candidats:', data.message);
      }
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des candidats:', err);
      setLoading(false);
    }
  };

  const chargerLieux = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/client/lieux', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setLieux(data.data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des lieux:', err);
    }
  };

  const chargerQcms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/qcm/tests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      console.log('🔍 Réponse API QCM:', data); // Debug
      if (data.success) {
        setQcms(data.data);
        console.log('✅ QCMs chargés:', data.data); // Debug
      } else {
        console.error('❌ Erreur API QCM:', data.message);
      }
    } catch (err) {
      console.error('❌ Erreur lors du chargement des QCM:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const getStatutIcon = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'accepté': return <FiCheckCircle color="#10b981" size={16} />;
      case 'refusé': return <FiXCircle color="#ef4444" size={16} />;
      case 'en cours d\'évaluation': return <FiAlertCircle color="#f59e0b" size={16} />;
      default: return <FiClock color="#6b7280" size={16} />;
    }
  };

  const getStatutColor = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'accepté': return '#10b981';
      case 'refusé': return '#ef4444';
      case 'en cours d\'évaluation': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const appliquerFiltres = () => {
    let res = [...candidats];
    if (filtres.statut) {
      res = res.filter(c =>
        c.statut?.toLowerCase() === filtres.statut.toLowerCase() ||
        c.statutNom?.toLowerCase() === filtres.statut.toLowerCase()
      );
    }
    if (filtres.recherche) {
      const r = filtres.recherche.toLowerCase();
      res = res.filter(c =>
        c.nom?.toLowerCase().includes(r) ||
        c.prenom?.toLowerCase().includes(r) ||
        c.email?.toLowerCase().includes(r)
      );
    }
    if (filtres.dateDebut) {
      res = res.filter(c => new Date(c.dateCandidature) >= new Date(filtres.dateDebut));
    }
    if (filtres.dateFin) {
      res = res.filter(c => new Date(c.dateCandidature) <= new Date(filtres.dateFin));
    }
    if (filtres.ageMin) {
      res = res.filter(c => {
        if (!c.dateNaissance) return false;
        const age = new Date().getFullYear() - new Date(c.dateNaissance).getFullYear();
        return age >= parseInt(filtres.ageMin);
      });
    }
    if (filtres.ageMax) {
      res = res.filter(c => {
        if (!c.dateNaissance) return false;
        const age = new Date().getFullYear() - new Date(c.dateNaissance).getFullYear();
        return age <= parseInt(filtres.ageMax);
      });
    }
    if (filtres.lieu) {
      res = res.filter(c => {
        const lieuId = parseInt(filtres.lieu);
        return c.idLieu === lieuId || c.nomLieu?.toLowerCase().includes(filtres.lieu.toLowerCase());
      });
    }
    if (filtres.diplome) {
      const d = filtres.diplome.toLowerCase();
      res = res.filter(c => c.cv?.toLowerCase().includes(d));
    }
    setCandidatsFiltres(res);
  };

  const handleFiltreChange = (key, value) => {
    setFiltres(prev => ({ ...prev, [key]: value }));
  };

  const resetFiltres = () => {
    setFiltres({
      statut: '', recherche: '', dateDebut: '', dateFin: '',
      ageMin: '', ageMax: '', lieu: '', diplome: ''
    });
  };

  const getStatutsUniques = () => {
    const statuts = candidats.map(c => c.statut || c.statutNom).filter(Boolean);
    return [...new Set(statuts)];
  };

  const envoyerTestQCMCandidat = async (candidat, qcmId, dureeValidite = 72) => {
    setSendingQcm(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notifications/envoyer-qcm', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idCandidat: candidat.id,
          idAnnonce: parseInt(id),
          idQcmTest: qcmId,
          dureeValidite
        })
      });
      const result = await response.json();
      if (result.success) {
        alert(`✅ Test QCM envoyé avec succès à ${candidat.prenom} ${candidat.nom}`);
        setShowQcmModal(false);
        setSelectedCandidat(null);
      } else {
        alert(`❌ Erreur lors de l'envoi du test QCM: ${result.message}`);
      }
    } catch (error) {
      console.error('Erreur envoi QCM:', error);
      alert('❌ Erreur lors de l\'envoi du test QCM');
    } finally {
      setSendingQcm(false);
    }
  };

  if (loading) return <div style={styles.loading}>Chargement...</div>;
  if (error) return <div style={styles.error}>Erreur: {error}</div>;
  if (!annonce) return <div style={styles.error}>Annonce non trouvée</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <FiArrowLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 style={styles.title}>Détails de l'Annonce</h1>
      </div>

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

      <div style={styles.candidatsSection}>
        <div style={styles.candidatsHeader}>
          <div style={styles.candidatsTitle}>
            <FiUsers size={24} color="#3b82f6" />
            <h2>Candidats Associés</h2>
          </div>
          <div style={styles.candidatsActions}>
            <button
              style={{ ...styles.filterButton, ...(showFilters ? styles.filterButtonActive : {}) }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter size={16} />
              Filtres
            </button>
            <div style={styles.candidatsCount}>
              {candidatsFiltres.length} / {candidats.length} candidat{candidats.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {showFilters && (
          <div style={styles.filtersPanel}>
            <div style={styles.filtersGrid}>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Recherche</label>
                <div style={styles.searchContainer}>
                  <FiSearch size={16} style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Nom, prénom ou email..."
                    value={filtres.recherche}
                    onChange={(e) => handleFiltreChange('recherche', e.target.value)}
                    style={styles.searchInput}
                  />
                </div>
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Statut</label>
                <select
                  value={filtres.statut}
                  onChange={(e) => handleFiltreChange('statut', e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="">Tous les statuts</option>
                  {getStatutsUniques().map(statut => (
                    <option key={statut} value={statut}>{statut}</option>
                  ))}
                </select>
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Date début</label>
                <input
                  type="date"
                  value={filtres.dateDebut}
                  onChange={(e) => handleFiltreChange('dateDebut', e.target.value)}
                  style={styles.filterSelect}
                />
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Date fin</label>
                <input
                  type="date"
                  value={filtres.dateFin}
                  onChange={(e) => handleFiltreChange('dateFin', e.target.value)}
                  style={styles.filterSelect}
                />
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Âge minimum</label>
                <input
                  type="number"
                  placeholder="Ex: 25"
                  value={filtres.ageMin}
                  onChange={(e) => handleFiltreChange('ageMin', e.target.value)}
                  style={styles.filterSelect}
                  min="18"
                  max="65"
                />
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Âge maximum</label>
                <input
                  type="number"
                  placeholder="Ex: 45"
                  value={filtres.ageMax}
                  onChange={(e) => handleFiltreChange('ageMax', e.target.value)}
                  style={styles.filterSelect}
                  min="18"
                  max="65"
                />
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Lieu</label>
                <select
                  value={filtres.lieu}
                  onChange={(e) => handleFiltreChange('lieu', e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="">Tous les lieux</option>
                  {lieux.map(lieu => (
                    <option key={lieu.id} value={lieu.id}>{lieu.nom}</option>
                  ))}
                </select>
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Diplôme/Formation</label>
                <input
                  type="text"
                  placeholder="Ex: Master, Licence, BTS..."
                  value={filtres.diplome}
                  onChange={(e) => handleFiltreChange('diplome', e.target.value)}
                  style={styles.filterSelect}
                />
              </div>
            </div>

            <div style={styles.filterActions}>
              <button style={styles.resetButton} onClick={resetFiltres}>
                <FiX size={16} />
                Réinitialiser
              </button>
              <span style={styles.resultCount}>
                {candidatsFiltres.length} / {candidats.length} candidat{candidats.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {candidats.length === 0 ? (
          <div style={styles.noCandidats}>
            <FiUsers size={48} color="#94a3b8" />
            <p>Aucun candidat n'a encore postulé pour cette annonce</p>
          </div>
        ) : candidatsFiltres.length === 0 ? (
          <div style={styles.noCandidats}>
            <FiFilter size={48} color="#94a3b8" />
            <p>Aucun candidat ne correspond aux filtres sélectionnés</p>
          </div>
        ) : (
          <div style={styles.candidatsList}>
            {candidatsFiltres.map(candidat => (
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
                      {candidat.email && (
                        <div style={styles.contactItem}>
                          <FiMail size={14} color="#6b7280" />
                          <span>{candidat.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={styles.candidatActions}>
                    <div
                      style={{
                        ...styles.statutBadge,
                        backgroundColor: getStatutColor(candidat.statut || candidat.statutNom) + '20',
                        color: getStatutColor(candidat.statut || candidat.statutNom),
                      }}
                    >
                      {getStatutIcon(candidat.statut || candidat.statutNom)}
                      <span>{candidat.statut || candidat.statutNom || 'En attente'}</span>
                    </div>

                    <button
                      style={styles.qcmButtonSmall}
                      onClick={() => {
                        setSelectedCandidat(candidat);
                        setShowQcmModal(true);
                      }}
                      disabled={sendingQcm}
                      title={`Envoyer un test QCM à ${candidat.prenom} ${candidat.nom}`}
                    >
                      <FiSend size={14} />
                      QCM
                    </button>
                  </div>
                </div>

                <div style={styles.candidatDetails}>
                  {candidat.dateCandidature && (
                    <div style={styles.detailItem}>
                      <FiCalendar size={14} color="#6b7280" />
                      <span style={styles.detailLabel}>Candidature:</span>
                      <span>{formatDate(candidat.dateCandidature)}</span>
                    </div>
                  )}

                  {candidat.dateNaissance && (
                    <div style={styles.detailItem}>
                      <FiUser size={14} color="#6b7280" />
                      <span style={styles.detailLabel}>Âge:</span>
                      <span>
                        {new Date().getFullYear() - new Date(candidat.dateNaissance).getFullYear()} ans
                      </span>
                    </div>
                  )}

                  {(candidat.nomLieu || candidat.idLieu) && (
                    <div style={styles.detailItem}>
                      <FiMapPin size={14} color="#6b7280" />
                      <span style={styles.detailLabel}>Lieu:</span>
                      <span>
                        {candidat.nomLieu || lieux.find(l => l.id === candidat.idLieu)?.nom || 'Non spécifié'}
                      </span>
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
                        : candidat.cv}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showQcmModal && selectedCandidat && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>Envoyer un test QCM</h3>
              <button
                style={styles.closeButton}
                onClick={() => {
                  setShowQcmModal(false);
                  setSelectedCandidat(null);
                }}
              >
                <FiX size={20} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <p>
                Candidat: <strong>{selectedCandidat.prenom} {selectedCandidat.nom}</strong>
              </p>
              <div style={styles.qcmList}>
                <label>Choisir un test QCM :</label>
                {qcms.length === 0 ? (
                  <p style={{color: '#ef4444', fontStyle: 'italic'}}>
                    ❌ Aucun test QCM disponible. Vérifiez la console pour plus de détails.
                  </p>
                ) : (
                  qcms.map(qcm => (
                    <button
                      key={qcm.id}
                      style={styles.qcmOption}
                      onClick={() => envoyerTestQCMCandidat(selectedCandidat, qcm.id)}
                      disabled={sendingQcm}
                    >
                      <FiFileText size={16} />
                      <span>{qcm.nom || qcm.titre}</span>
                      {sendingQcm && <span>Envoi en cours...</span>}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
    transition: 'all 0.2s ease'
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
  candidatsActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  candidatsCount: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500'
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  filterButtonActive: {
    backgroundColor: '#2563eb'
  },
  filtersPanel: {
    marginTop: '16px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  },
  filtersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: '#6b7280',
    zIndex: 1
  },
  searchInput: {
    paddingLeft: '36px',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    color: '#1f2937',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s ease'
  },
  filterSelect: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    color: '#1f2937',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  },
  filterActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb'
  },
  resetButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  resultCount: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500'
  },
  candidatsList: {
    display: 'grid',
    gap: '16px'
  },
  candidatCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '20px'
  },
  candidatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  candidatInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  candidatNom: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 600,
    color: '#1e293b'
  },
  candidatContact: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#64748b',
    fontSize: '13px'
  },
  candidatActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  statutBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid currentColor'
  },
  qcmButtonSmall: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  candidatDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '10px',
    marginTop: '12px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#475569'
  },
  detailLabel: {
    fontWeight: 600,
    color: '#64748b'
  },
  motivationSection: {
    marginTop: '12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px'
  },
  motivationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#6b7280',
    marginBottom: '8px'
  },
  motivationText: {
    margin: 0,
    color: '#475569',
    fontSize: '14px'
  },
  noCandidats: {
    display: 'grid',
    placeItems: 'center',
    padding: '24px',
    color: '#64748b',
    gap: '8px'
  },
  loading: {
    padding: '24px'
  },
  error: {
    padding: '24px',
    color: '#ef4444'
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '520px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '12px'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px'
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  qcmList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  qcmOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};

export default DetailsAnnonce;