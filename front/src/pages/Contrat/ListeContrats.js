import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ListeContrats = () => {
  const [contrats, setContrats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token utilisé pour GET /api/contrats:', token); // Log pour déboguer
    if (!token) {
      setError('Aucun token trouvé. Veuillez vous connecter.');
      setLoading(false);
      return;
    }

    fetch('/api/contrats', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erreur réseau ou serveur: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setContrats(data.data);
        } else {
          throw new Error(data.message || 'Erreur lors du chargement des contrats');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur complète:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

    const handleVoirDetails = (contratId) => {
    navigate(`/contrats/details/${contratId}`);
  };

  if (loading) return <div>Chargement des contrats...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div>
           <h1>Liste des Contrats</h1>
      <p>Consultez tous les contrats enregistrés.</p>
      {contrats.length === 0 ? (
        <p>Aucun contrat trouvé.</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID Employé</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date de Début</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nombre de Mois</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type de Contrat</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {contrats.map(contrat => (
              <tr key={contrat.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contrat.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contrat.idEmploye}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {contrat.dateDebut
                    ? new Date(contrat.dateDebut).toLocaleDateString()
                    : 'Non défini'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contrat.nombreMois}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{contrat.typeContrat}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => handleVoirDetails(contrat.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#007BFF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Voir détails
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

export default ListeContrats;