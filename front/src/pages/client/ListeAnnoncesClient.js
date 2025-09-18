import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListeAnnoncesClient.css';

const ListeAnnoncesClient = () => {
  const [annonces, setAnnonces] = useState([]);
  const [annoncesFiltrees, setAnnoncesFiltrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();

  // Charger les emplois sauvegardés depuis localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(saved);
  }, []);

  // Charger les annonces depuis l'API publique
  useEffect(() => {
    const chargerAnnonces = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/client/annonces');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des annonces');
        }

        const data = await response.json();
        
        if (data.success) {
          // Transformer les données pour correspondre au format attendu
          const annoncesTransformees = data.data.map(annonce => ({
            id: annonce.id,
            titre: annonce.nomPoste || annonce.nomProfil || 'Poste non spécifié',
            entreprise: annonce.nomDepartement || 'Entreprise non spécifiée',
            lieu: 'Madagascar', // Valeur par défaut
            type: 'CDI', // Valeur par défaut
            salaire: 'À négocier', // Valeur par défaut
            datePublication: annonce.dateDebut,
            dateExpiration: annonce.dateFin,
            description: annonce.description || 'Description non disponible',
            competences: [], // Valeur par défaut
            statut: new Date(annonce.dateFin) >= new Date() ? 'active' : 'expired',
            isNew: isNewJob(annonce.dateDebut),
            isUrgent: isUrgentJob(annonce.dateFin),
            daysRemaining: calculateDaysRemaining(annonce.dateFin)
          }));
          
          setAnnonces(annoncesTransformees);
          setAnnoncesFiltrees(annoncesTransformees);
        } else {
          throw new Error(data.message || 'Erreur lors du chargement');
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    chargerAnnonces();
  }, []);

  // Fonctions utilitaires
  const isNewJob = (dateDebut) => {
    const jobDate = new Date(dateDebut);
    const now = new Date();
    const diffTime = Math.abs(now - jobDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const isUrgentJob = (dateFin) => {
    const endDate = new Date(dateFin);
    const now = new Date();
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 5 && diffDays > 0;
  };

  const calculateDaysRemaining = (dateFin) => {
    const endDate = new Date(dateFin);
    const now = new Date();
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Filtrage des annonces
  useEffect(() => {
    let filtered = annonces.filter(annonce => annonce.statut === 'active');

    if (searchTerm) {
      filtered = filtered.filter(annonce =>
        annonce.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        annonce.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
        annonce.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType) {
      filtered = filtered.filter(annonce => annonce.type === filterType);
    }

    if (filterLocation) {
      filtered = filtered.filter(annonce =>
        annonce.lieu.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    setAnnoncesFiltrees(filtered);
  }, [annonces, searchTerm, filterType, filterLocation]);

  // Sauvegarder/Désauvegarder un emploi
  const toggleSaveJob = (jobId) => {
    let newSavedJobs;
    if (savedJobs.includes(jobId)) {
      newSavedJobs = savedJobs.filter(id => id !== jobId);
    } else {
      newSavedJobs = [...savedJobs, jobId];
    }
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
  };

  // Postuler à une annonce
  const handleApply = (annonceId) => {
    navigate(`/candidature/${annonceId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des offres d'emploi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Erreur de chargement</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="liste-annonces-client">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Trouvez votre emploi idéal</h1>
          <p>Découvrez les meilleures opportunités de carrière</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{annonces.filter(a => a.statut === 'active').length}</span>
              <span className="stat-label">Offres actives</span>
            </div>
            <div className="stat">
              <span className="stat-number">{annonces.filter(a => a.type === 'CDI').length}</span>
              <span className="stat-label">Postes CDI</span>
            </div>
            <div className="stat">
              <span className="stat-number">{annonces.filter(a => a.isNew).length}</span>
              <span className="stat-label">Nouvelles offres</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher par titre, entreprise ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les types</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Stage">Stage</option>
            <option value="Freelance">Freelance</option>
          </select>

          <input
            type="text"
            placeholder="Localisation"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      {/* Liste des annonces */}
      <div className="annonces-container">
        {annoncesFiltrees.length === 0 ? (
          <div className="no-results">
            <h3>Aucune offre trouvée</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="annonces-grid">
            {annoncesFiltrees.map((annonce) => (
              <div key={annonce.id} className="annonce-card">
                <div className="card-header">
                  <div className="badges">
                    {annonce.isNew && <span className="badge badge-new">Nouveau</span>}
                    {annonce.isUrgent && <span className="badge badge-urgent">Urgent</span>}
                  </div>
                  <button
                    className={`save-btn ${savedJobs.includes(annonce.id) ? 'saved' : ''}`}
                    onClick={() => toggleSaveJob(annonce.id)}
                  >
                    ♥
                  </button>
                </div>

                <div className="card-content">
                  <h3 className="job-title">{annonce.titre}</h3>
                  <p className="company-name">{annonce.entreprise}</p>
                  <div className="job-details">
                    <span className="location">📍 {annonce.lieu}</span>
                    <span className="job-type">{annonce.type}</span>
                    <span className="salary">💰 {annonce.salaire}</span>
                  </div>
                  
                  <p className="job-description">
                    {annonce.description.length > 150
                      ? `${annonce.description.substring(0, 150)}...`
                      : annonce.description
                    }
                  </p>

                  {annonce.competences.length > 0 && (
                    <div className="skills">
                      {annonce.competences.slice(0, 3).map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <div className="job-meta">
                    <span className="publish-date">
                      Publié le {new Date(annonce.datePublication).toLocaleDateString()}
                    </span>
                    {annonce.daysRemaining > 0 && (
                      <span className="days-remaining">
                        {annonce.daysRemaining} jour{annonce.daysRemaining > 1 ? 's' : ''} restant{annonce.daysRemaining > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <button
                    className="apply-btn"
                    onClick={() => handleApply(annonce.id)}
                  >
                    Postuler
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeAnnoncesClient;
