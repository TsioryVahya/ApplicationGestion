import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiCalendar, FiMapPin, FiBriefcase, FiUser } from 'react-icons/fi';
import ModalConnexionCandidat from '../../components/ModalConnexionCandidat';

const OffresClient = () => {
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState('');
  const [filtreType, setFiltreType] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await fetch('/api/client/annonce');
        if (!res.ok) throw new Error('Erreur réseau');
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Erreur serveur');
        setAnnonces(json.data || []);
      } catch (e) {
        setErreur(e.message);
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);

  const annoncesFiltrees = useMemo(() => {
    return annonces.filter(a => {
      const txt = `${a.reference || ''} ${a.nomPoste || a.titre || ''} ${a.description || ''} ${a.nomDepartement || ''} ${a.nomProfil || ''}`.toLowerCase();
      const okRecherche = txt.includes(recherche.toLowerCase());
      const typeNorm = (a.typeAnnonce || '').toLowerCase();
      const okType = filtreType === 'all' || typeNorm === filtreType.toLowerCase();
      return okRecherche && okType;
    });
  }, [annonces, recherche, filtreType]);

  const formatDate = d => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handlePostuler = (annonce) => {
    setSelectedAnnonce(annonce);
    setModalOpen(true);
  };

  const handleLoginSuccess = (data) => {
    // Rediriger vers le formulaire de candidature après connexion réussie
    if (!selectedAnnonce) return;
    const id = selectedAnnonce.idAnnonce || selectedAnnonce.id || selectedAnnonce.annonceId;
    if (!id) {
      console.error('ID annonce manquant dans selectedAnnonce', selectedAnnonce);
      return;
    }
    navigate(`/candidature/${id}` , { state: { idAnnonce: id, annonce: selectedAnnonce } });
  };

  if (loading) return <div style={styles.center}>Chargement des offres...</div>;
  if (erreur) return <div style={{ ...styles.center, color: '#dc2626' }}>Erreur: {erreur}</div>;

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Offres d'emploi disponibles</h1>
        <p style={styles.subtitle}>Consultez les opportunités actuellement ouvertes – aucune inscription requise.</p>
      </div>

      <div style={styles.tools}>
        <div style={styles.searchBox}>
          <FiSearch size={18} color="#64748b" />
          <input
            style={styles.input}
            placeholder="Rechercher (référence, département, profil, mot-clé)..."
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
          />
        </div>
        <div style={styles.filterBox}>
          <FiFilter size={18} color="#64748b" />
          <select
            value={filtreType}
            onChange={e => setFiltreType(e.target.value)}
            style={styles.select}
          >
            <option value="all">Tous les types</option>
            <option value="cdi">CDI</option>
            <option value="cdd">CDD</option>
            <option value="stage">Stage</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>
      </div>

      {annoncesFiltrees.length === 0 && (
        <div style={styles.empty}>
          <FiBriefcase size={46} color="#94a3b8" />
          <h3 style={styles.emptyTitle}>Aucune offre trouvée</h3>
          <p style={styles.emptyText}>Modifiez vos critères de recherche.</p>
        </div>
      )}

      <div style={styles.grid}>
        {annoncesFiltrees.map((a, index) => {
          const statut = new Date(a.dateFin) >= new Date() ? 'Active' : 'Expirée';
          return (
            <div key={`annonce-${a.idAnnonce || index}`} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.ref}>{a.reference || `${a.nomProfil}`}</span>
                <span style={{
                  ...styles.badge,
                  background: statut === 'Active' ? '#059669' : '#64748b'
                }}>{statut}</span>
              </div>
              {(a.nomPoste || a.titre) && (
                <div style={styles.jobTitle}>{a.nomPoste || a.titre}</div>
              )}
              <div style={styles.meta}>
                <div style={styles.metaLine}>
                  <FiBriefcase size={14} color="#475569" />
                  <span>{a.typeAnnonce || 'Type non défini'}</span>
                </div>
                <div style={styles.metaLine}>
                  <FiMapPin size={14} color="#475569" />
                  <span>{a.nomDepartement || 'Département'}</span>
                </div>
                <div style={styles.metaLine}>
                  <FiCalendar size={14} color="#475569" />
                  <span>Du {formatDate(a.dateDebut)} au {formatDate(a.dateFin)}</span>
                </div>
              </div>
              <p style={styles.desc}>
                {a.description || 'Aucune description.'}
              </p>
              <div style={styles.footer}>
                <button
                  onClick={() => handlePostuler(a)}
                  style={styles.postulerBtn}
                  disabled={statut === 'Expirée'}
                >
                  <FiUser size={16} />
                  Postuler
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ModalConnexionCandidat
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleLoginSuccess}
        selectedAnnonce={selectedAnnonce}
      />
    </div>
  );
};

const styles = {
  page: { maxWidth: 1180, margin: '0 auto', padding: '40px 28px', fontFamily: 'Inter, sans-serif' },
  hero: { marginBottom: 32 },
  title: { margin: 0, fontSize: 34, fontWeight: 700, color: '#1e293b' },
  subtitle: { marginTop: 8, color: '#64748b', fontSize: 16, lineHeight: 1.5 },
  tools: { display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 },
  searchBox: { display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: 14, flex: 1, minWidth: 280 },
  input: { border: 'none', outline: 'none', flex: 1, fontSize: 14, background: 'transparent', color: '#1e293b' },
  filterBox: { display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: 14 },
  select: { border: 'none', outline: 'none', fontSize: 14, background: 'transparent', color: '#1e293b' },
  grid: { display: 'grid', gap: 26, gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))' },
  card: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 22, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minHeight: 250 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 12 },
  ref: { fontWeight: 600, fontSize: 18, color: '#1e293b', flex: 1 },
  jobTitle: { fontWeight: 700, fontSize: 18, color: '#0f172a', marginBottom: 8 },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: .5, color: '#fff', textTransform: 'uppercase' },
  meta: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 },
  metaLine: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569', fontWeight: 500 },
  desc: { fontSize: 14, lineHeight: 1.55, color: '#64748b', flex: 1, margin: 0, marginBottom: 12, whiteSpace: 'pre-line' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  profilTag: { background: '#eff6ff', color: '#1e3a8a', fontSize: 12, padding: '6px 12px', borderRadius: 8, fontWeight: 500 },
  postulerBtn: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: 6, 
    background: '#059669', 
    color: '#fff', 
    border: 'none', 
    padding: '8px 16px', 
    borderRadius: 8, 
    fontSize: 13, 
    fontWeight: 600, 
    cursor: 'pointer', 
    transition: 'all 0.2s',
    ':hover': { background: '#047857' },
    ':disabled': { background: '#9ca3af', cursor: 'not-allowed' }
  },
  empty: { textAlign: 'center', padding: '80px 20px', background: '#fff', border: '1px dashed #cbd5e1', borderRadius: 16 },
  emptyTitle: { margin: '18px 0 4px', fontSize: 20, color: '#1e293b' },
  emptyText: { margin: 0, fontSize: 14, color: '#64748b' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', fontSize: 16, color: '#475569' },
  note: { marginTop: 40, fontSize: 13, color: '#94a3b8', textAlign: 'center' }
};

export default OffresClient;
