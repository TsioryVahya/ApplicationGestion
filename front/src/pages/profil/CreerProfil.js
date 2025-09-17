import React, { useState } from 'react';
import './CreerProfil.css';

function CreerProfil() {
  const [formData, setFormData] = useState({
    nom: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Récupérer le token d'authentification
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('/api/profils', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Profil créé avec succès !');
        setFormData({ nom: '', description: '' });
      } else {
        const errorData = await response.json();
        setMessage(`Erreur: ${errorData.message || 'Erreur lors de la création du profil'}`);
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="creer-profil-container">
      <div className="creer-profil-header">
        <h1>Créer un Nouveau Profil</h1>
        <p>Définissez un nouveau profil de poste pour votre organisation</p>
      </div>

      <div className="creer-profil-form-container">
        <form onSubmit={handleSubmit} className="creer-profil-form">
          <div className="form-group">
            <label htmlFor="nom">Nom du Profil *</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Ex: Développeur Full Stack, Manager Commercial..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez les responsabilités et missions de ce profil..."
              rows="5"
            />
          </div>

          {message && (
            <div className={`message ${message.includes('succès') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading || !formData.nom.trim()}
            >
              {loading ? 'Création...' : 'Créer le Profil'}
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => setFormData({ nom: '', description: '' })}
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreerProfil;
