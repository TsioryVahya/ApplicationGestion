import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ListeCandidats = () => {
  const [candidats, setCandidats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch("/api/candidats", {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Erreur réseau ou serveur');
        }
        return res.json(); // Convertir la réponse en JSON
      })
      .then(data => {
        if (data.success) {
          setCandidats(data.data);
        } else {
          throw new Error(data.message || 'Erreur lors du chargement');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

    const handleAjouterContrat = (candidatId) => {
    navigate(`/contrats/ajouter/${candidatId}`);
  };

  if (loading) return <div>Chargement des candidats...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div>
      <h1>Liste des Candidats</h1>
      <p>Gérez les candidatures soumises pour les annonces.</p>
      {candidats.length === 0 ? (
        <p>Aucun candidat trouvé.</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nom</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Prénom</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date de Naissance</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Adresse</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Poste</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Statut</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidats.map(candidat => (
              <tr key={candidat.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{candidat.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{candidat.nom}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{candidat.prenom}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {candidat.dateNaissance
                    ? new Date(candidat.dateNaissance).toLocaleDateString()
                    : 'Non défini'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {candidat.adresse || 'Non défini'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {candidat.nomPoste || 'Non défini'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {candidat.statut || 'Non défini'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => handleAjouterContrat(candidat.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Ajouter un contrat d'essai
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListeCandidats;