import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const DetailsCandidatContrat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employe, setEmploye] = useState(null);
  const [contrat, setContrat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token utilisé pour GET /api/contrats/:id:', token);
    if (!token) {
      setError('Aucun token trouvé. Veuillez vous connecter.');
      setLoading(false);
      return;
    }

    fetch(`/api/contrats/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        console.log('Réponse pour GET /api/contrats/:id:', res.status, res.statusText);
        if (!res.ok) {
          throw new Error(`Erreur réseau ou serveur: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setContrat(data.data);
          console.log('Contrat récupéré:', data.data);
          return fetch(`/api/employes/${data.data.idEmploye}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          throw new Error(data.message || 'Erreur lors du chargement du contrat');
        }
      })
      .then(res => {
        console.log('Réponse pour GET /api/employes/:id:', res.status, res.statusText);
        if (!res.ok) {
          throw new Error(`Erreur réseau ou serveur: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setEmploye(data.data);
          console.log('Employé récupéré:', data.data);
        } else {
          throw new Error(data.message || 'Erreur lors du chargement de l\'employé');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur complète:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const exportToPDF = () => {
    if (!employe || !contrat) return;

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const lineHeight = 10;
    let y = margin;

    // Police et couleurs
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    const blueColor = '#1E3A8A'; // Bleu professionnel
    const textColor = '#000000'; // Noir pour le texte

    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(blueColor);
    doc.text('Détails du Contrat', pageWidth / 2, y, { align: 'center' });
    y += lineHeight;

    doc.setFontSize(12);
    doc.setTextColor(textColor);
    doc.text(`ID du Contrat: ${id}`, pageWidth / 2, y, { align: 'center' });
    y += lineHeight;

    doc.setFontSize(10);
    doc.setTextColor(blueColor);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: 'center' });
    y += lineHeight * 2;

    // Section Employé
    doc.setFontSize(14);
    doc.setTextColor(blueColor);
    doc.text('Informations de l\'Employé', margin, y);
    y += lineHeight;

    doc.setFontSize(12);
    doc.setTextColor(textColor);
    doc.text(`Nom: ${employe.nom || 'Non défini'}`, margin, y);
    y += lineHeight;
    doc.text(`Prénom: ${employe.prenom || 'Non défini'}`, margin, y);
    y += lineHeight;
    doc.text(`Adresse: ${employe.adresse || 'Non défini'}`, margin, y);
    y += lineHeight * 2;

    // Section Contrat
    doc.setFontSize(14);
    doc.setTextColor(blueColor);
    doc.text('Informations du Contrat', margin, y);
    y += lineHeight;

    doc.setFontSize(12);
    doc.setTextColor(textColor);
    doc.text(`Date de Début: ${contrat.dateDebut ? new Date(contrat.dateDebut).toLocaleDateString() : 'Non défini'}`, margin, y);
    y += lineHeight;
    doc.text(`Nombre de Mois: ${contrat.nombreMois || 'Non défini'}`, margin, y);
    y += lineHeight;
    doc.text(`Type de Contrat: ${contrat.typeContrat || 'Non défini'}`, margin, y);

    // Ligne de séparation
    y += lineHeight;
    doc.setDrawColor(blueColor);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);

    // Sauvegarde du PDF
    doc.save(`contrat_${id}.pdf`);
  };

  if (loading) return <div>Chargement des détails...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div>
      <h1>Détails de l'Employé pour le Contrat ID: {id}</h1>
      {employe ? (
        <div>
          <h2>Informations de l'Employé</h2>
          <p><strong>Nom :</strong> {employe.nom}</p>
          <p><strong>Prénom :</strong> {employe.prenom}</p>
          <p><strong>Adresse :</strong> {employe.adresse || 'Non défini'}</p>
          <h2>Informations du Contrat</h2>
          <p><strong>Date de Début :</strong> {contrat.dateDebut
            ? new Date(contrat.dateDebut).toLocaleDateString()
            : 'Non défini'}</p>
          <p><strong>Nombre de Mois :</strong> {contrat.nombreMois}</p>
          <p><strong>Type de Contrat :</strong> {contrat.typeContrat}</p>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => navigate('/contrats')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            >
              Retour à la liste des contrats
            </button>
            <button
              onClick={exportToPDF}
              style={{
                padding: '10px 20px',
                backgroundColor: '#FF5733',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Exporter en PDF
            </button>
          </div>
        </div>
      ) : (
        <p>Aucun employé trouvé pour ce contrat.</p>
      )}
    </div>
  );
};

export default DetailsCandidatContrat;