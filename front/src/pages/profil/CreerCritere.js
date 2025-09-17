import React, { useState } from 'react';
import './CreerCritere.css';

function CreerCritere() {
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
      const response = await fetch('/api/criteres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Critère créé avec succès !');
        setFormData({ nom: '', description: '' });
      } else {
        const errorData = await response.json();
        setMessage(`Erreur: ${errorData.message || 'Erreur lors de la création du critère'}`);
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="creer-critere-container">
      <div className="creer-critere-header">
        <h1>Créer un Nouveau Critère</h1>
        <p>Définissez un nouveau critère d'évaluation pour les profils</p>
      </div>

      <div className="creer-critere-form-container">
        <form onSubmit={handleSubmit} className="creer-critere-form">
          <div className="form-group">
            <label htmlFor="nom">Nom du Critère *</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Ex: Expérience, Compétences techniques, Formation..."
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
              placeholder="Décrivez ce critère et comment il sera évalué..."
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
              {loading ? 'Création...' : 'Créer le Critère'}
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

export default CreerCritere;
