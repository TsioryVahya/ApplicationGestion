import React, { useState, useEffect } from 'react';
import './ListeAnnonces.css';

function ListeAnnonces() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/annonces');
      if (response.ok) {
        const data = await response.json();
        setAnnonces(data);
      } else {
        setError('Erreur lors du chargement des annonces');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="liste-annonces-container">
        <div className="loading">Chargement des annonces...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="liste-annonces-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="liste-annonces-container">
      <div className="liste-annonces-header">
        <h1>Liste des Annonces</h1>
        <p>Gérez toutes les offres d'emploi de votre organisation</p>
      </div>

      <div className="annonces-grid">
        {annonces.length === 0 ? (
          <div className="no-annonces">
            <h3>Aucune annonce disponible</h3>
            <p>Commencez par créer votre première annonce d'emploi</p>
          </div>
        ) : (
          annonces.map((annonce) => (
            <div key={annonce.id} className="annonce-card">
              <div className="annonce-header">
                <h3>{annonce.titre}</h3>
                <span className="annonce-type">{annonce.typeAnnonce}</span>
              </div>
              <div className="annonce-content">
                <p className="annonce-description">{annonce.description}</p>
                <div className="annonce-details">
                  <div className="detail-item">
                    <strong>Salaire:</strong> {annonce.salaire || 'Non spécifié'}
                  </div>
                  <div className="detail-item">
                    <strong>Lieu:</strong> {annonce.lieu || 'Non spécifié'}
                  </div>
                  <div className="detail-item">
                    <strong>Date limite:</strong> {annonce.dateLimite ? new Date(annonce.dateLimite).toLocaleDateString() : 'Non spécifiée'}
                  </div>
                </div>
              </div>
              <div className="annonce-actions">
                <button className="btn-view">Voir détails</button>
                <button className="btn-edit">Modifier</button>
                <button className="btn-delete">Supprimer</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ListeAnnonces;
