import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';

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
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const lineHeight = 10;
    let y = margin;

    // Couleurs
    const blueColor = '#1E3A8A'; // Bleu professionnel
    const grayColor = '#64748B'; // Gris pour sous-titres
    const textColor = '#1E293B'; // Noir pour texte

    // Fond d'en-tête
    doc.setFillColor('#F8FAFC');
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Titre
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(blueColor);
    doc.text('Détails du Contrat', pageWidth / 2, 25, { align: 'center' });

    // Ligne de séparation
    doc.setDrawColor(grayColor);
    doc.setLineWidth(0.5);
    doc.line(margin, 45, pageWidth - margin, 45);

    y = 55;

    // Section Employé
    doc.setFontSize(16);
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
    doc.setFontSize(16);
    doc.setTextColor(blueColor);
    doc.text('Informations du Contrat', margin, y);
    y += lineHeight;

    doc.setFontSize(12);
    doc.setTextColor(textColor);
    doc.text(`ID du Contrat: ${id}`, margin, y);
    y += lineHeight;
    doc.text(`Date de Début: ${contrat.dateDebut ? new Date(contrat.dateDebut).toLocaleDateString() : 'Non défini'}`, margin, y);
    y += lineHeight;
    doc.text(`Nombre de Mois: ${contrat.nombreMois || 'Non défini'}`, margin, y);
    y += lineHeight;
    doc.text(`Type de Contrat: ${contrat.typeContrat || 'Non défini'}`, margin, y);
    y += lineHeight * 2;

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(grayColor);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - margin, { align: 'center' });

    doc.save(`contrat_${id}.pdf`);
  };

  if (loading) return <div style={styles.loading}>Chargement des détails...</div>;
  if (error) return <div style={styles.error}>Erreur : {error}</div>;

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Détails du Contrat</h1>
          <p style={styles.subtitle}>
            Consultez les informations de l'employé et du contrat ID: {id}
          </p>
        </div>
      </div>

      {/* Details Section */}
      {employe ? (
        <div style={styles.detailsContainer}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Informations de l'Employé</h2>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Nom :</span>
                <span style={styles.infoValue}>{employe.nom}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Prénom :</span>
                <span style={styles.infoValue}>{employe.prenom}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Adresse :</span>
                <span style={styles.infoValue}>{employe.adresse || 'Non défini'}</span>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Informations du Contrat</h2>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Date de Début :</span>
                <span style={styles.infoValue}>{contrat.dateDebut
                  ? new Date(contrat.dateDebut).toLocaleDateString()
                  : 'Non défini'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Nombre de Mois :</span>
                <span style={styles.infoValue}>{contrat.nombreMois}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Type de Contrat :</span>
                <span style={styles.infoValue}>{contrat.typeContrat}</span>
              </div>
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button onClick={() => navigate('/contrats')} style={styles.button}>
              <FiArrowLeft size={16} style={{ marginRight: '8px' }} />
              Retour à la liste des contrats
            </button>
            <button onClick={exportToPDF} style={styles.button}>
              <FiDownload size={16} style={{ marginRight: '8px' }} />
              Exporter en PDF
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.emptyMessage}>Aucun employé trouvé pour ce contrat.</div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '32px',
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '32px',
  },
  headerContent: {
    maxWidth: '1200px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    lineHeight: '1.6',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  infoLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748b',
    marginBottom: '4px',
  },
  infoValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
    marginTop: '24px',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#1e40af',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  loading: {
    fontSize: '18px',
    color: '#1e293b',
    textAlign: 'center',
    padding: '20px',
  },
  error: {
    fontSize: '18px',
    color: '#dc2626',
    textAlign: 'center',
    padding: '20px',
  },
  emptyMessage: {
    fontSize: '16px',
    color: '#64748b',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
  },
};

export default DetailsCandidatContrat;