import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CandidatsFormulaire = () => {
  const { id } = useParams(); // Récupère l'ID du candidat depuis l'URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idEmploye: id,
    dateDebut: '',
    nombreMois: '',
    typeContrat: 'Essai', // Valeur par défaut
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/contrats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du contrat');
      }

      const data = await response.json();
      if (data.success) {
        alert('Contrat d\'essai ajouté avec succès !');
        navigate('/candidats'); // Redirige vers la liste des candidats
      } else {
        throw new Error(data.message || 'Erreur lors de la création');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Ajouter un contrat d'essai</h1>
      <p>Remplissez les détails du contrat pour le candidat ID: {id}</p>
      {error && <div style={{ color: 'red' }}>Erreur : {error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Date de début :
            <input
              type="date"
              name="dateDebut"
              value={formData.dateDebut}
              onChange={handleChange}
              required
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Nombre de mois :
            <input
              type="number"
              name="nombreMois"
              value={formData.nombreMois}
              onChange={handleChange}
              min="1"
              required
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Type de contrat :
            <select
              name="typeContrat"
              value={formData.typeContrat}
              onChange={handleChange}
              required
              style={{ marginLeft: '10px' }}
            >
              <option value="Essai">Essai</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
            </select>
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Envoi en cours...' : 'Ajouter le contrat'}
        </button>
      </form>
    </div>
  );
};

export default CandidatsFormulaire;