import React, { useState, useEffect } from 'react';
import './CreerCritereProfil.css';

function CreerCritereProfil() {
  const [formData, setFormData] = useState({
    idProfil: '',
    idCritere: '',
    valeur: '',
    estObligatoire: true
  });

  const [profils, setProfils] = useState([]);
  const [criteres, setCriteres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Charger les profils et critères disponibles
    const fetchData = async () => {
      try {
        const [profilsResponse, criteresResponse] = await Promise.all([
          fetch('http://localhost:3001/api/profils'),
          fetch('http://localhost:3001/api/criteres')
        ]);

        if (profilsResponse.ok) {
          const profilsData = await profilsResponse.json();
          setProfils(profilsData);
        }

        if (criteresResponse.ok) {
          const criteresData = await criteresResponse.json();
          setCriteres(criteresData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/critere-profils', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Critère profil créé avec succès !');
        setFormData({ idProfil: '', idCritere: '', valeur: '', estObligatoire: true });
      } else {
        const errorData = await response.json();
        setMessage(`Erreur: ${errorData.message || 'Erreur lors de la création du critère profil'}`);
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="creer-critere-profil-container">
      <div className="creer-critere-profil-header">
        <h1>Associer un Critère à un Profil</h1>
        <p>Définissez les critères spécifiques requis pour un profil donné</p>
      </div>

      <div className="creer-critere-profil-form-container">
        <form onSubmit={handleSubmit} className="creer-critere-profil-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="idProfil">Profil *</label>
              <select
                id="idProfil"
                name="idProfil"
                value={formData.idProfil}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un profil</option>
                {profils.map(profil => (
                  <option key={profil.id} value={profil.id}>
                    {profil.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="idCritere">Critère *</label>
              <select
                id="idCritere"
                name="idCritere"
                value={formData.idCritere}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un critère</option>
                {criteres.map(critere => (
                  <option key={critere.id} value={critere.id}>
                    {critere.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="valeur">Valeur Requise *</label>
            <input
              type="text"
              id="valeur"
              name="valeur"
              value={formData.valeur}
              onChange={handleChange}
              placeholder="Ex: 3+ ans, Bac+5, Maîtrise d'Excel..."
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="estObligatoire"
                checked={formData.estObligatoire}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Ce critère est obligatoire
            </label>
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
              disabled={loading || !formData.idProfil || !formData.idCritere || !formData.valeur.trim()}
            >
              {loading ? 'Création...' : 'Associer le Critère'}
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => setFormData({ idProfil: '', idCritere: '', valeur: '', estObligatoire: true })}
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreerCritereProfil;
