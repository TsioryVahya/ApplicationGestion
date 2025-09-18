import { useEffect, useState } from "react";
import { FiEdit3, FiTrash2, FiPlus, FiUsers, FiUserCheck } from "react-icons/fi";

const GestionCritereProfils = () => {
  const [associations, setAssociations] = useState([]);
  const [profils, setProfils] = useState([]);
  const [criteres, setCriteres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    idProfil: '',
    idCritere: '',
    valeurDouble: '',
    valeurVarchar: '',
    valeurBool: false,
    estObligatoire: true
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Fetch associations
      const resAssoc = await fetch('/api/critereprofils', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resAssoc.ok) throw new Error('Erreur chargement associations');
      const dataAssoc = await resAssoc.json();
      // Fetch profils
      const resProfils = await fetch('/api/profils', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resProfils.ok) throw new Error('Erreur chargement profils');
      const dataProfils = await resProfils.json();
      // Fetch criteres
      const resCriteres = await fetch('/api/criteres', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resCriteres.ok) throw new Error('Erreur chargement criteres');
      const dataCriteres = await resCriteres.json();

      setAssociations(Array.isArray(dataAssoc.data) ? dataAssoc.data : []);
      setProfils(Array.isArray(dataProfils.data) ? dataProfils.data : []);
      setCriteres(Array.isArray(dataCriteres.data) ? dataCriteres.data : []);
      setError(null);
    } catch (err) {
      setError('Erreur: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingItem ? `/api/critereprofils/${editingItem.id}` : '/api/critereprofils';
      const method = editingItem ? 'PUT' : 'POST';
      // Préparer les données à envoyer (convertir les types si besoin)
      const dataToSend = {
        idProfil: formData.idProfil,
        idCritere: formData.idCritere,
        valeurDouble: formData.valeurDouble === '' ? null : parseFloat(formData.valeurDouble),
        valeurVarchar: formData.valeurVarchar === '' ? null : formData.valeurVarchar,
        valeurBool: !!formData.valeurBool,
        estObligatoire: !!formData.estObligatoire
      };
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });
      if (!response.ok) throw new Error(editingItem ? 'Erreur modification' : 'Erreur création');
      setShowModal(false);
      setEditingItem(null);
      setFormData({
        idProfil: '',
        idCritere: '',
        valeurDouble: '',
        valeurVarchar: '',
        valeurBool: false,
        estObligatoire: true
      });
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette association ?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/critereprofils/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erreur suppression');
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      idProfil: item.idProfil,
      idCritere: item.idCritere,
      valeurDouble: item.valeurDouble ?? '',
      valeurVarchar: item.valeurVarchar ?? '',
      valeurBool: !!item.valeurBool,
      estObligatoire: item.estObligatoire === undefined ? true : !!item.estObligatoire
    });
    setShowModal(true);
    setError(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      idProfil: '',
      idCritere: '',
      valeurDouble: '',
      valeurVarchar: '',
      valeurBool: false,
      estObligatoire: true
    });
  };

  if (loading) return <div style={styles.loading}>Chargement des associations...</div>;
  if (error) return <div style={styles.error}>Erreur: {error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Gestion des Associations Critère-Profil</h1>
        <p style={styles.subtitle}>Associez des critères à des profils</p>
      </div>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}><FiUsers size={24} color="#1e40af" /></div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{associations.length}</div>
            <div style={styles.statLabel}>Total Associations</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}><FiUserCheck size={24} color="#059669" /></div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{profils.length}</div>
            <div style={styles.statLabel}>Profils</div>
          </div>
        </div>
      </div>

      <div style={styles.actionsBar}>
        <button style={styles.addButton} onClick={() => setShowModal(true)}>
          <FiPlus size={18} />
          <span>Nouvelle Association</span>
        </button>
      </div>

      <div style={styles.cardGrid}>
        {associations.map(a => {
          const profil = profils.find(p => p.id === a.idProfil);
          const critere = criteres.find(c => c.id === a.idCritere);
          return (
            <div key={a.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>{profil?.nom || a.idProfil} <span style={styles.cardSubTitle}>/ {critere?.nom || a.idCritere}</span></div>
                <div style={styles.cardActions}>
                  <button style={styles.editButton} onClick={() => openEditModal(a)}><FiEdit3 size={16} /></button>
                  <button style={styles.deleteButton} onClick={() => handleDelete(a.id)}><FiTrash2 size={16} /></button>
                </div>
              </div>
              <div style={styles.cardBody}>
                <div><b>ID:</b> {a.id}</div>
                <div><b>Valeur Double:</b> {a.valeurDouble !== null && a.valeurDouble !== undefined ? a.valeurDouble : <span style={{color:'#64748b'}}>N/A</span>}</div>
                <div><b>Valeur Varchar:</b> {a.valeurVarchar || <span style={{color:'#64748b'}}>N/A</span>}</div>
                <div><b>Valeur Booléenne:</b> {a.valeurBool === true ? 'Oui' : a.valeurBool === false ? 'Non' : <span style={{color:'#64748b'}}>N/A</span>}</div>
                <div><b>Obligatoire:</b> {a.estObligatoire ? 'Oui' : 'Non'}</div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>{editingItem ? 'Modifier l\'association' : 'Créer une association'}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Profil</label>
                <select
                  value={formData.idProfil}
                  onChange={e => setFormData({ ...formData, idProfil: e.target.value })}
                  style={styles.input}
                  required
                >
                  <option value="">-- Sélectionner --</option>
                  {profils.map(p => (
                    <option key={p.id} value={p.id}>{p.nom}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Critère</label>
                <select
                  value={formData.idCritere}
                  onChange={e => setFormData({ ...formData, idCritere: e.target.value })}
                  style={styles.input}
                  required
                >
                  <option value="">-- Sélectionner --</option>
                  {criteres.map(c => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valeur Double</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valeurDouble}
                  onChange={e => setFormData({ ...formData, valeurDouble: e.target.value })}
                  style={styles.input}
                  placeholder="Ex: 12.34"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valeur Varchar</label>
                <input
                  type="text"
                  value={formData.valeurVarchar}
                  onChange={e => setFormData({ ...formData, valeurVarchar: e.target.value })}
                  style={styles.input}
                  placeholder="Texte libre"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valeur Booléenne</label>
                <select
                  value={formData.valeurBool ? 'true' : 'false'}
                  onChange={e => setFormData({ ...formData, valeurBool: e.target.value === 'true' })}
                  style={styles.input}
                >
                  <option value="false">Non</option>
                  <option value="true">Oui</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Est Obligatoire</label>
                <select
                  value={formData.estObligatoire ? 'true' : 'false'}
                  onChange={e => setFormData({ ...formData, estObligatoire: e.target.value === 'true' })}
                  style={styles.input}
                >
                  <option value="true">Oui</option>
                  <option value="false">Non</option>
                </select>
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={closeModal} style={styles.cancelButton}>Annuler</button>
                <button type="submit" style={styles.saveButton}>{editingItem ? 'Modifier' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '32px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  },
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    lineHeight: '1.6'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.2s ease'
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statContent: {
    flex: 1
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500'
  },
  actionsBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '24px'
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minHeight: '180px',
    position: 'relative'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b'
  },
  cardSubTitle: {
    fontSize: '15px',
    color: '#64748b',
    fontWeight: '400',
    marginLeft: '8px'
  },
  cardActions: {
    display: 'flex',
    gap: '8px'
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '15px',
    color: '#334155'
  },
  actions: {
    display: 'flex',
    gap: '8px'
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  deleteButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    '&:focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '16px'
  },
  cancelButton: {
    padding: '10px 16px',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  saveButton: {
    padding: '10px 16px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    fontSize: '16px',
    color: '#64748b'
  },
  error: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    fontSize: '16px',
    color: '#ef4444'
  }
};

export default GestionCritereProfils;