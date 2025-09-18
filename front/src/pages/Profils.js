import { useEffect, useState } from "react";
import { FiEdit3, FiTrash2, FiPlus, FiUsers, FiUserCheck, FiShield } from 'react-icons/fi';

const GestionProfils = () => {
  const [profils, setProfils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProfil, setEditingProfil] = useState(null);
  const [formData, setFormData] = useState({ nom: '' });

  useEffect(() => {
    fetchProfils();
  }, []);

  const fetchProfils = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/profils", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des profils (code ' + response.status + ')');
      }
      const data = await response.json();
      console.log('Réponse API profils:', data); 
      if (data.success && Array.isArray(data.data)) {
        setProfils(data.data);
      } else {
        throw new Error(data.message || 'Erreur lors du chargement (réponse inattendue)');
      }
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
      const url = editingProfil ? `/api/profils/${editingProfil.id}` : '/api/profils';
      const method = editingProfil ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(editingProfil ? 'Erreur lors de la modification' : 'Erreur lors de la création');
      }

      const data = await response.json();
      
      if (data.success) {
        setShowModal(false);
        setEditingProfil(null);
        setFormData({ nom: '' });
        fetchProfils(); 
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/profils/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      fetchProfils(); 
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (profil) => {
    setEditingProfil(profil);
    setFormData({ nom: profil.nom });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProfil(null);
    setFormData({ nom: '' });
  };

  if (loading) return <div style={styles.loading}>Chargement des profils...</div>;
  if (error) return <div style={styles.error}>Erreur: {error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Gestion des Profils</h1>
        <p style={styles.subtitle}>
          Gérez les différents profils d'utilisateurs de la plateforme
        </p>
      </div>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiUsers size={24} color="#1e40af" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{profils.length}</div>
            <div style={styles.statLabel}>Total Profils</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiUserCheck size={24} color="#059669" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>
              {profils.filter(p => p.nom.includes('Admin')).length}
            </div>
            <div style={styles.statLabel}>Profils Administratifs</div>
          </div>
        </div>
      </div>

      <div style={styles.actionsBar}>
        <button 
          style={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          <FiPlus size={18} />
          <span>Nouveau Profil</span>
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Nom</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profils.map(profil => (
              <tr key={profil.id} style={styles.tr}>
                <td style={styles.td}>{profil.id}</td>
                <td style={styles.td}>{profil.nom}</td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button 
                      style={styles.editButton}
                      onClick={() => openEditModal(profil)}
                    >
                      <FiEdit3 size={16} />
                    </button>
                    <button 
                      style={styles.deleteButton}
                      onClick={() => handleDelete(profil.id)}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>
              {editingProfil ? 'Modifier le profil' : 'Créer un nouveau profil'}
            </h2>
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nom du profil</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ nom: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={styles.cancelButton}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={styles.saveButton}
                >
                  {editingProfil ? 'Modifier' : 'Créer'}
                </button>
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
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    backgroundColor: '#f8fafc',
    color: '#64748b',
    fontWeight: '600',
    fontSize: '14px',
    borderBottom: '1px solid #e2e8f0'
  },
  tr: {
    borderBottom: '1px solid #e2e8f0'
    // Note: '&:last-child' n'est pas supporté dans les objets de style JS natifs
  },
  td: {
    padding: '16px',
    fontSize: '14px',
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

export default GestionProfils;