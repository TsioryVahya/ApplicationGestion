import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiBriefcase, FiCalendar, FiMapPin, FiUsers,
  FiMail, FiFileText, FiUser, FiClock, FiCheckCircle,
  FiXCircle, FiAlertCircle, FiFilter, FiSearch, FiX, FiSend,
  FiCheck, FiRefreshCw, FiFilePlus
} from 'react-icons/fi';
import './DetailsAnnonce.css';

const DetailsAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [candidats, setCandidats] = useState([]);
  const [candidatsFiltres, setCandidatsFiltres] = useState([]);
  const [resultatsQcm, setResultatsQcm] = useState([]);
  const [entretiensAnnonce, setEntretiensAnnonce] = useState([]);
  const [lieux, setLieux] = useState([]);
  const [qcms, setQcms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showQcmModal, setShowQcmModal] = useState(false);
  const [showEntretienModal, setShowEntretienModal] = useState(false);
  const [selectedCandidat, setSelectedCandidat] = useState(null);
  const [sendingQcm, setSendingQcm] = useState(false);
  const [creatingEntretien, setCreatingEntretien] = useState(false);
  const [activeTab, setActiveTab] = useState('candidats');
  const [entretienData, setEntretienData] = useState({
    dateHeure: '',
    idStatut: 1
  });
  const [filtres, setFiltres] = useState({
    statut: '', recherche: '', dateDebut: '', dateFin: '',
    ageMin: '', ageMax: '', lieu: '', diplome: ''
  });

  useEffect(() => {
    chargerDetailsAnnonce();
    chargerCandidatsAnnonce();
    chargerLieux();
    chargerQcms();
    chargerResultatsQcm();
    chargerEntretiensAnnonce();
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
      if (data.success) {
        setQcms(data.data);
      } else {
        console.error('❌ Erreur API QCM:', data.message);
      }
    } catch (err) {
      console.error('❌ Erreur lors du chargement des QCM:', err);
    }
  };

  const chargerResultatsQcm = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/qcm/resultats/annonce/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setResultatsQcm(data.data || []);
      } else {
        console.error('Erreur lors du chargement des résultats QCM');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const chargerEntretiensAnnonce = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/entretiens/annonce/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEntretiensAnnonce(data.data || []);
      } else {
        console.error('Erreur lors du chargement des entretiens');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getEntretienStatutColor = (idStatut) => {
    const colors = {
      1: '#3b82f6', // En attente - Bleu
      2: '#10b981', // Confirmé - Vert
      3: '#f59e0b', // Reporté - Orange
      4: '#ef4444'  // Annulé - Rouge
    };
    return colors[idStatut] || '#6b7280';
  };

  const getEntretienStatutIcon = (idStatut) => {
    const icons = {
      1: <FiClock size={14} />,     // En attente
      2: <FiCheck size={14} />,     // Confirmé
      3: <FiRefreshCw size={14} />, // Reporté
      4: <FiX size={14} />          // Annulé
    };
    return icons[idStatut] || <FiClock size={14} />;
  };

  const getResultatColor = (note) => {
    const colors = {
      'basse': '#ef4444',  // Rouge
      'moyen': '#f59e0b',  // Orange
      'bon': '#10b981'     // Vert
    };
    return colors[note] || '#6b7280';
  };

  const naviguerVersContrat = (candidatId, candidatNom, candidatPrenom) => {
    // Naviguer vers la page CandidatsFormulaire avec l'ID du candidat
    navigate(`/contrats/ajouter/${candidatId}`, {
      state: {
        candidatNom: candidatNom,
        candidatPrenom: candidatPrenom,
        annonceId: id,
        annonceReference: annonce?.reference
      }
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

  // Fonctions pour les statuts QCM
  const getQcmStatutIcon = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'terminee': return <FiCheckCircle color="#10b981" size={16} />;
      case 'vue': return <FiAlertCircle color="#f59e0b" size={16} />;
      case 'envoyee': return <FiSend color="#6b7280" size={16} />;
      default: return <FiClock color="#6b7280" size={16} />;
    }
  };

  const getQcmStatutColor = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'terminee': return '#10b981';
      case 'vue': return '#f59e0b';
      case 'envoyee': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getQcmStatutText = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'terminee': return 'Terminé';
      case 'vue': return 'Vu';
      case 'envoyee': return 'Envoyé';
      default: return 'En attente';
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
        // Recharger les résultats QCM
        chargerResultatsQcm();
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

  const creerEntretienCandidat = async () => {
    if (!entretienData.dateHeure) {
      alert('Veuillez sélectionner une date et heure');
      return;
    }

    setCreatingEntretien(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/entretiens', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idCandidat: selectedCandidat.id,
          dateHeure: entretienData.dateHeure,
          idStatut: entretienData.idStatut
        })
      });
      
      const result = await response.json();
      if (result.success) {
        alert(`✅ Entretien programmé avec succès pour ${selectedCandidat.prenom} ${selectedCandidat.nom}`);
        setShowEntretienModal(false);
        setSelectedCandidat(null);
        setEntretienData({ dateHeure: '', idStatut: 1 });
      } else {
        alert(`❌ Erreur lors de la programmation: ${result.message}`);
      }
    } catch (error) {
      console.error('Erreur création entretien:', error);
      alert('❌ Erreur lors de la programmation de l\'entretien');
    } finally {
      setCreatingEntretien(false);
    }
  };

  const handleEntretienInputChange = (e) => {
    const { name, value } = e.target;
    setEntretienData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;
  if (!annonce) return <div className="error">Annonce non trouvée</div>;

  return (
    <div className="container">
      <div className="header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 className="title">Détails de l'Annonce</h1>
      </div>

      <div className="annonce-card">
        <div className="annonce-header">
          <div className="annonce-title">
            <FiBriefcase size={24} color="#3b82f6" />
            <h2 className="annonce-nom">{annonce.reference}</h2>
          </div>
          <div className="annonce-info">
            <div className="info-item">
              <FiMapPin size={16} color="#6b7280" />
              <span>{annonce.nomDepartement}</span>
            </div>
            <div className="info-item">
              <FiUser size={16} color="#6b7280" />
              <span>{annonce.nomProfil}</span>
            </div>
          </div>
        </div>

        <div className="annonce-details">
          <div className="detail-section">
            <h3 className="section-title">Description</h3>
            <p className="description">
              {annonce.description || 'Aucune description disponible'}
            </p>
          </div>

          <div className="date-section">
            <div className="date-item">
              <FiCalendar size={16} color="#6b7280" />
              <div>
                <span className="date-label">Date de début</span>
                <span className="date-value">{formatDate(annonce.dateDebut)}</span>
              </div>
            </div>
            <div className="date-item">
              <FiCalendar size={16} color="#6b7280" />
              <div>
                <span className="date-label">Date de fin</span>
                <span className="date-value">{formatDate(annonce.dateFin)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="candidats-section">
        <div className="candidats-header">
          <div className="candidats-title">
            <FiUsers size={24} color="#3b82f6" />
            <h2>Candidats Associés</h2>
          </div>
        </div>

        {/* Onglets */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'candidats' ? 'active' : ''}`}
            onClick={() => setActiveTab('candidats')}
          >
            <FiUsers size={16} />
            Candidats ({candidatsFiltres.length})
          </button>
          <button
            className={`tab ${activeTab === 'qcm' ? 'active' : ''}`}
            onClick={() => setActiveTab('qcm')}
          >
            <FiFileText size={16} />
            Résultats QCM ({resultatsQcm.length})
          </button>
          <button
            className={`tab ${activeTab === 'entretiens' ? 'active' : ''}`}
            onClick={() => setActiveTab('entretiens')}
          >
            <FiCalendar size={16} />
            Entretiens ({entretiensAnnonce.length})
          </button>
        </div>

        {/* Actions selon l'onglet actif */}
        {activeTab === 'candidats' && (
          <div className="candidats-actions">
            <button
              className={`filter-button ${showFilters ? 'filter-button-active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter size={16} />
              Filtres
            </button>
            <div className="candidats-count">
              {candidatsFiltres.length} / {candidats.length} candidat{candidats.length > 1 ? 's' : ''}
            </div>
          </div>
        )}

        {/* Panneau de filtres */}
        {showFilters && activeTab === 'candidats' && (
          <div className="filters-panel">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">Recherche</label>
                <div className="search-container">
                  <FiSearch size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Nom, prénom ou email..."
                    value={filtres.recherche}
                    onChange={(e) => handleFiltreChange('recherche', e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Statut</label>
                <select
                  value={filtres.statut}
                  onChange={(e) => handleFiltreChange('statut', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Tous les statuts</option>
                  {getStatutsUniques().map(statut => (
                    <option key={statut} value={statut}>{statut}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Date début</label>
                <input
                  type="date"
                  value={filtres.dateDebut}
                  onChange={(e) => handleFiltreChange('dateDebut', e.target.value)}
                  className="filter-select"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Date fin</label>
                <input
                  type="date"
                  value={filtres.dateFin}
                  onChange={(e) => handleFiltreChange('dateFin', e.target.value)}
                  className="filter-select"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Âge minimum</label>
                <input
                  type="number"
                  placeholder="18"
                  value={filtres.ageMin}
                  onChange={(e) => handleFiltreChange('ageMin', e.target.value)}
                  className="filter-select"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Âge maximum</label>
                <input
                  type="number"
                  placeholder="65"
                  value={filtres.ageMax}
                  onChange={(e) => handleFiltreChange('ageMax', e.target.value)}
                  className="filter-select"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Lieu</label>
                <select
                  value={filtres.lieu}
                  onChange={(e) => handleFiltreChange('lieu', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Tous les lieux</option>
                  {lieux.map(lieu => (
                    <option key={lieu.id} value={lieu.id}>{lieu.nom}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Diplôme/Formation</label>
                <input
                  type="text"
                  placeholder="Rechercher dans les CV..."
                  value={filtres.diplome}
                  onChange={(e) => handleFiltreChange('diplome', e.target.value)}
                  className="filter-select"
                />
              </div>
            </div>

            <div className="filter-actions">
              <button className="reset-button" onClick={resetFiltres}>
                <FiX size={14} />
                Réinitialiser
              </button>
              <span className="result-count">
                {candidatsFiltres.length} / {candidats.length} candidat{candidats.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Contenu de l'onglet Candidats */}
        {activeTab === 'candidats' && (
          <>
            {candidats.length === 0 ? (
              <div className="no-candidats">
                <FiUsers size={48} color="#94a3b8" />
                <p>Aucun candidat n'a encore postulé pour cette annonce</p>
              </div>
            ) : candidatsFiltres.length === 0 ? (
              <div className="no-candidats">
                <FiFilter size={48} color="#94a3b8" />
                <p>Aucun candidat ne correspond aux filtres sélectionnés</p>
              </div>
            ) : (
              <div className="candidats-list">
                {candidatsFiltres.map(candidat => (
                  <div key={candidat.id} className="candidat-card">
                    <div className="candidat-header">
                      <div className="candidat-info">
                        <div className="candidat-nom">
                          <FiUser size={20} color="#3b82f6" />
                          <span>{candidat.prenom} {candidat.nom}</span>
                        </div>
                        <div className="candidat-contact">
                          <div className="contact-item">
                            <FiUser size={14} color="#6b7280" />
                            <span>ID: {candidat.id}</span>
                          </div>
                          {candidat.email && (
                            <div className="contact-item">
                              <FiMail size={14} color="#6b7280" />
                              <span>{candidat.email}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="candidat-actions">
                        <div
                          className="statut-badge"
                          style={{
                            backgroundColor: getStatutColor(candidat.statut || candidat.statutNom) + '20',
                            color: getStatutColor(candidat.statut || candidat.statutNom),
                          }}
                        >
                          {getStatutIcon(candidat.statut || candidat.statutNom)}
                          <span>{candidat.statut || candidat.statutNom || 'En attente'}</span>
                        </div>

                        <button
                          className="qcm-button-small"
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

                    <div className="candidat-details">
                      {candidat.dateCandidature && (
                        <div className="detail-item">
                          <FiCalendar size={14} color="#6b7280" />
                          <span className="detail-label">Candidature:</span>
                          <span>{formatDate(candidat.dateCandidature)}</span>
                        </div>
                      )}

                      {candidat.dateNaissance && (
                        <div className="detail-item">
                          <FiUser size={14} color="#6b7280" />
                          <span className="detail-label">Âge:</span>
                          <span>
                            {new Date().getFullYear() - new Date(candidat.dateNaissance).getFullYear()} ans
                          </span>
                        </div>
                      )}

                      {(candidat.nomLieu || candidat.idLieu) && (
                        <div className="detail-item">
                          <FiMapPin size={14} color="#6b7280" />
                          <span className="detail-label">Lieu:</span>
                          <span>
                            {candidat.nomLieu || lieux.find(l => l.id === candidat.idLieu)?.nom || 'Non spécifié'}
                          </span>
                        </div>
                      )}
                    </div>

                    {candidat.cv && (
                      <div className="motivation-section">
                        <div className="motivation-header">
                          <FiFileText size={16} color="#6b7280" />
                          <span>CV / Profil</span>
                        </div>
                        <p className="motivation-text">
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
          </>
        )}

        {/* Contenu de l'onglet QCM */}
        {activeTab === 'qcm' && (
          <div className="qcm-results-list">
            {resultatsQcm.length === 0 ? (
              <div className="no-candidats">
                <FiFileText size={48} color="#94a3b8" />
                <p>Aucun résultat de QCM disponible pour cette annonce</p>
              </div>
            ) : (
              resultatsQcm.map(resultat => (
                <div key={resultat.invitationId} className="qcm-card">
                  <div className="qcm-header">
                    <div className="qcm-candidat-info">
                      <div className="candidat-nom">
                        <FiUser size={20} color="#3b82f6" />
                        <span>{resultat.candidatPrenom} {resultat.candidatNom}</span>
                      </div>
                      <div className="qcm-test-info">
                        <FiFileText size={14} color="#6b7280" />
                        <span>{resultat.testNom}</span>
                      </div>
                    </div>
                    
                    <div className="qcm-score">
                      <div className="score-display">
                        <span className="score-number">{resultat.score || 0}%</span>
                        <span className="score-detail">
                          {resultat.pointsObtenus || 0} / {resultat.pointsMax || 0} pts
                        </span>
                      </div>
                      <div className="qcm-actions">
                        <div
                          className="statut-badge"
                          style={{
                            backgroundColor: getQcmStatutColor(resultat.statut) + '20',
                            color: getQcmStatutColor(resultat.statut),
                          }}
                        >
                          {getQcmStatutIcon(resultat.statut)}
                          <span>{getQcmStatutText(resultat.statut)}</span>
                        </div>
                        
                        <button
                          className="entretien-button-small"
                          onClick={() => {
                            setSelectedCandidat({
                              id: resultat.candidatId,
                              nom: resultat.candidatNom,
                              prenom: resultat.candidatPrenom,
                              email: resultat.candidatEmail || 'Non renseigné'
                            });
                            setEntretienData({ dateHeure: '', idStatut: 1 });
                            setShowEntretienModal(true);
                          }}
                          disabled={creatingEntretien}
                          title={`Programmer un entretien avec ${resultat.candidatPrenom} ${resultat.candidatNom}`}
                        >
                          <FiCalendar size={14} />
                          Entretien
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="qcm-details">
                    <div className="qcm-timeline">
                      {resultat.dateEnvoi && (
                        <div className="timeline-item">
                          <FiSend size={14} color="#6b7280" />
                          <span>Envoyé: {formatDate(resultat.dateEnvoi)}</span>
                        </div>
                      )}
                      {resultat.dateVue && (
                        <div className="timeline-item">
                          <FiCheckCircle size={14} color="#10b981" />
                          <span>Vu: {formatDate(resultat.dateVue)}</span>
                        </div>
                      )}
                      {resultat.dateTerminee && (
                        <div className="timeline-item">
                          <FiFileText size={14} color="#3b82f6" />
                          <span>Terminé: {formatDate(resultat.dateTerminee)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="qcm-stats">
                      <div className="stat-item">
                        <span className="stat-label">Questions:</span>
                        <span>{resultat.nombreQuestions || 0}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Réponses:</span>
                        <span>{resultat.nombreReponses || 0}</span>
                      </div>
                      {resultat.dateExpiration && (
                        <div className="stat-item">
                          <span className="stat-label">Expire:</span>
                          <span>{formatDate(resultat.dateExpiration)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Onglet Entretiens */}
        {activeTab === 'entretiens' && (
          <div className="entretiens-content">
            {entretiensAnnonce.length === 0 ? (
              <div className="no-data">
                <FiCalendar size={48} color="#9ca3af" />
                <p>Aucun entretien programmé pour cette annonce</p>
              </div>
            ) : (
              entretiensAnnonce.map((entretien, index) => (
                <div key={entretien.id} className="entretien-card">
                  <div className="entretien-header">
                    <div className="entretien-candidat">
                      <div className="candidat-name">
                        <FiUser size={16} color="#3b82f6" />
                        <span>{entretien.candidatPrenom} {entretien.candidatNom}</span>
                      </div>
                      <div className="entretien-date">
                        <FiClock size={14} color="#6b7280" />
                        <span>{formatDateTime(entretien.dateHeure)}</span>
                      </div>
                    </div>
                    
                    <div className="entretien-status">
                      <div className="entretien-badges">
                        <div
                          className="statut-badge"
                          style={{
                            backgroundColor: getEntretienStatutColor(entretien.idStatut) + '20',
                            color: getEntretienStatutColor(entretien.idStatut),
                          }}
                        >
                          {getEntretienStatutIcon(entretien.idStatut)}
                          <span>{entretien.statutNom}</span>
                        </div>
                        
                        {entretien.resultatNote && (
                          <div
                            className="resultat-badge"
                            style={{
                              backgroundColor: getResultatColor(entretien.resultatNote) + '20',
                              color: getResultatColor(entretien.resultatNote),
                            }}
                          >
                            <span>Résultat: {entretien.resultatNote}</span>
                          </div>
                        )}
                      </div>
                      
                      <button
                        className="contrat-button-small"
                        onClick={() => naviguerVersContrat(
                          entretien.idCandidat,
                          entretien.candidatNom,
                          entretien.candidatPrenom
                        )}
                        title={`Créer un contrat pour ${entretien.candidatPrenom} ${entretien.candidatNom}`}
                      >
                        <FiFilePlus size={14} />
                        Contrat
                      </button>
                    </div>
                  </div>

                  <div className="entretien-details">
                    <div className="detail-item">
                      <span className="detail-label">Annonce:</span>
                      <span>{entretien.annonceReference}</span>
                    </div>
                    {entretien.resultatAppreciation && (
                      <div className="detail-item">
                        <span className="detail-label">Appréciation:</span>
                        <span>{entretien.resultatAppreciation}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal QCM */}
      {showQcmModal && selectedCandidat && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Envoyer un test QCM</h3>
              <button
                className="close-button"
                onClick={() => {
                  setShowQcmModal(false);
                  setSelectedCandidat(null);
                }}
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                <strong>Candidat:</strong> {selectedCandidat.prenom} {selectedCandidat.nom}
              </p>
              <p>
                <strong>Email:</strong> {selectedCandidat.email}
              </p>
              
              <div className="filter-group">
                <label className="filter-label">Sélectionner un test QCM</label>
                <div className="qcm-list">
                  {qcms.map(qcm => (
                    <div
                      key={qcm.id}
                      className="qcm-option"
                      onClick={() => envoyerTestQCMCandidat(selectedCandidat, qcm.id)}
                    >
                      <FiFileText size={16} color="#3b82f6" />
                      <div>
                        <div style={{ fontWeight: '600' }}>{qcm.nom}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {qcm.description || 'Aucune description'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {qcms.length === 0 && (
                <p style={{ color: '#6b7280', textAlign: 'center' }}>
                  Aucun test QCM disponible
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Entretien */}
      {showEntretienModal && selectedCandidat && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <FiCalendar size={20} />
                Programmer un entretien
              </h3>
              <button
                className="close-button"
                onClick={() => {
                  setShowEntretienModal(false);
                  setSelectedCandidat(null);
                  setEntretienData({ dateHeure: '', idStatut: 1 });
                }}
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="candidat-info-modal">
                <p>
                  <strong>Candidat:</strong> {selectedCandidat.prenom} {selectedCandidat.nom}
                </p>
                <p>
                  <strong>Email:</strong> {selectedCandidat.email}
                </p>
                <p>
                  <strong>Annonce:</strong> {annonce.reference}
                </p>
              </div>
              
              <div className="filter-group">
                <label className="filter-label">
                  <FiClock size={16} />
                  Date et heure de l'entretien
                </label>
                <input
                  type="datetime-local"
                  name="dateHeure"
                  value={entretienData.dateHeure}
                  onChange={handleEntretienInputChange}
                  className="filter-select"
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Statut</label>
                <select
                  name="idStatut"
                  value={entretienData.idStatut}
                  onChange={handleEntretienInputChange}
                  className="filter-select"
                >
                  <option value={1}>En attente</option>
                  <option value={2}>Confirmé</option>
                  <option value={3}>Reporté</option>
                  <option value={4}>Annulé</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => {
                    setShowEntretienModal(false);
                    setSelectedCandidat(null);
                    setEntretienData({ dateHeure: '', idStatut: 1 });
                  }}
                >
                  Annuler
                </button>
                <button
                  className="save-button"
                  onClick={creerEntretienCandidat}
                  disabled={creatingEntretien || !entretienData.dateHeure}
                >
                  <FiCalendar size={16} />
                  {creatingEntretien ? 'Programmation...' : 'Programmer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsAnnonce;
