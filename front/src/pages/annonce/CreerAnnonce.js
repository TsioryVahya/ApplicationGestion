import { useState, useEffect } from 'react';
import { 
  FiBriefcase, 
  FiCalendar, 
  FiMapPin, 
  FiSave, 
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiCheckCircle,
  FiX
} from 'react-icons/fi';

const CreerAnnonce = ({ onRetour }) => {
  const [formData, setFormData] = useState({
    reference: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    idDepartement: '',
    idProfil: '',
    idTypeAnnonce: ''
  });

  const [profils, setProfils] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [typesAnnonce, setTypesAnnonce] = useState([]);
  const [criteresDisponibles, setCriteresDisponibles] = useState([]);
  const [tousLesCriteres, setTousLesCriteres] = useState([]);
  const [criteresSelectionnes, setCriteresSelectionnes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    chargerDonneesInitiales();
  }, []);

  useEffect(() => {
    if (formData.idProfil) {
      chargerCriteresProfil(formData.idProfil);
    }
  }, [formData.idProfil]);

  const chargerDonneesInitiales = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Charger les profils
      const profilsResponse = await fetch('/api/annonces/profils', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profilsData = await profilsResponse.json();
      if (profilsData.success) {
        setProfils(profilsData.data);
      }

      // Charger les départements
      const deptsResponse = await fetch('/api/annonces/departements', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const deptsData = await deptsResponse.json();
      if (deptsData.success) {
        setDepartements(deptsData.data);
      }

      // Charger tous les critères disponibles
      const criteresResponse = await fetch('/api/annonces/criteres', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const criteresData = await criteresResponse.json();
      if (criteresData.success) {
        setTousLesCriteres(criteresData.data);
      }

      // Charger les types d'annonce
      const typesResponse = await fetch('/api/annonces/types', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const typesData = await typesResponse.json();
      if (typesData.success) {
        setTypesAnnonce(typesData.data);
      }
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    }
  };

  const chargerCriteresProfil = async (idProfil) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/annonces/profils/${idProfil}/criteres`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setCriteresDisponibles(data.data);
        // Pré-remplir les critères obligatoires
        const criteresObligatoires = data.data
          .filter(critere => critere.estObligatoire)
          .map(critere => ({
            idCritere: critere.idCritere,
            nom: critere.nom,
            valeurDouble: critere.valeurDouble || '',
            valeurVarchar: critere.valeurVarchar || '',
            valeurBool: critere.valeurBool || false,
            estObligatoire: true
          }));
        setCriteresSelectionnes(criteresObligatoires);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des critères:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const ajouterCritere = (critere) => {
    if (!criteresSelectionnes.find(c => c.idCritere === critere.idCritere)) {
      setCriteresSelectionnes(prev => [...prev, {
        idCritere: critere.idCritere,
        nom: critere.nom,
        valeurDouble: critere.valeurDouble || '',
        valeurVarchar: critere.valeurVarchar || '',
        valeurBool: critere.valeurBool || false,
        estObligatoire: false
      }]);
    }
  };

  const supprimerCritere = (idCritere) => {
    setCriteresSelectionnes(prev => 
      prev.filter(c => c.idCritere !== idCritere || c.estObligatoire)
    );
  };

  const modifierValeurCritere = (idCritere, champ, valeur) => {
    setCriteresSelectionnes(prev =>
      prev.map(c => 
        c.idCritere === idCritere 
          ? { ...c, [champ]: valeur }
          : c
      )
    );
  };

  const renderChampCritere = (critere) => {
    const critereOriginal = criteresDisponibles.find(c => c.idCritere === critere.idCritere);
    
    if (critereOriginal?.valeurBool !== null) {
      return (
        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id={`critere-${critere.idCritere}`}
            checked={critere.valeurBool}
            onChange={(e) => modifierValeurCritere(critere.idCritere, 'valeurBool', e.target.checked)}
            style={styles.checkbox}
          />
          <label htmlFor={`critere-${critere.idCritere}`} style={styles.checkboxLabel}>
            {critere.nom}
          </label>
        </div>
      );
    }
    
    if (critereOriginal?.valeurDouble !== null) {
      return (
        <div style={styles.inputGroup}>
          <label style={styles.label}>{critere.nom}</label>
          <input
            type="number"
            step="0.01"
            value={critere.valeurDouble}
            onChange={(e) => modifierValeurCritere(critere.idCritere, 'valeurDouble', e.target.value)}
            style={styles.input}
            placeholder="Entrez une valeur numérique"
          />
        </div>
      );
    }
    
    return (
      <div style={styles.inputGroup}>
        <label style={styles.label}>{critere.nom}</label>
        <input
          type="text"
          value={critere.valeurVarchar}
          onChange={(e) => modifierValeurCritere(critere.idCritere, 'valeurVarchar', e.target.value)}
          style={styles.input}
          placeholder="Entrez une valeur"
        />
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/annonces', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          criteres: criteresSelectionnes
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Annonce créée avec succès !');
        if (onRetour) onRetour();
      } else {
        setError(data.message || 'Erreur lors de la création');
      }
    } catch (err) {
      setError('Erreur lors de la création de l\'annonce');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onRetour} style={styles.backButton}>
          <FiArrowLeft size={20} />
          <span>Retour</span>
        </button>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Créer une Nouvelle Annonce</h1>
          <p style={styles.subtitle}>
            Sélectionnez un profil et configurez les critères pour votre annonce
          </p>
        </div>
      </div>

      {error && (
        <div style={styles.errorAlert}>
          <FiX size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGrid}>
          {/* Informations de base */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <FiBriefcase size={20} />
              Informations de Base
            </h3>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Référence de l'annonce *</label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                style={styles.input}
                required
                placeholder="Ex: REF-2024-001"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                style={styles.textarea}
                rows={4}
                placeholder="Décrivez le poste et les responsabilités..."
              />
            </div>

            <div style={styles.inputRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Date de début *</label>
                <input
                  type="date"
                  name="dateDebut"
                  value={formData.dateDebut}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Date de fin *</label>
                <input
                  type="date"
                  name="dateFin"
                  value={formData.dateFin}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.inputRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Département *</label>
                <select
                  name="idDepartement"
                  value={formData.idDepartement}
                  onChange={handleInputChange}
                  style={styles.select}
                  required
                >
                  <option value="">Sélectionnez un département</option>
                  {departements.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Profil recherché *</label>
                <select
                  name="idProfil"
                  value={formData.idProfil}
                  onChange={handleInputChange}
                  style={styles.select}
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
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Type d'annonce *</label>
              <select
                name="idTypeAnnonce"
                value={formData.idTypeAnnonce}
                onChange={handleInputChange}
                style={styles.select}
                required
              >
                <option value="">Sélectionnez un type d'annonce</option>
                {typesAnnonce.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.libelle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Critères dynamiques */}
          {formData.idProfil && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                <FiCheckCircle size={20} />
                Critères du Profil
              </h3>

              {/* Critères sélectionnés */}
              <div style={styles.criteresContainer}>
                {criteresSelectionnes.map(critere => (
                  <div key={critere.idCritere} style={styles.critereCard}>
                    <div style={styles.critereHeader}>
                      {!critere.estObligatoire && (
                        <button
                          type="button"
                          onClick={() => supprimerCritere(critere.idCritere)}
                          style={styles.removeCritereButton}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                      {critere.estObligatoire && (
                        <span style={styles.obligatoireTag}>Obligatoire</span>
                      )}
                    </div>
                    {renderChampCritere(critere)}
                  </div>
                ))}
              </div>

              {/* Critères disponibles à ajouter */}
              <div style={styles.criteresDisponibles}>
                <h4 style={styles.subTitle}>Ajouter des critères supplémentaires :</h4>
                <div style={styles.criteresGrid}>
                  {tousLesCriteres
                    .filter(critere => !criteresSelectionnes.find(c => c.idCritere === critere.idCritere))
                    .map(critere => (
                      <button
                        key={critere.idCritere}
                        type="button"
                        onClick={() => ajouterCritere(critere)}
                        style={styles.addCritereButton}
                      >
                        <FiPlus size={16} />
                        <span>{critere.nom}</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={styles.formActions}>
          <button
            type="button"
            onClick={onRetour}
            style={styles.cancelButton}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            style={styles.submitButton}
          >
            <FiSave size={20} />
            <span>{loading ? 'Création...' : 'Créer l\'Annonce'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '32px',
    backgroundColor: '#f1f5f9',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '32px'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
    transition: 'all 0.2s ease'
  },
  headerContent: {
    flex: 1
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
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    color: '#dc2626',
    marginBottom: '24px'
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  },
  formGrid: {
    display: 'grid',
    gap: '32px'
  },
  section: {
    marginBottom: '24px'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '24px',
    paddingBottom: '12px',
    borderBottom: '2px solid #e2e8f0'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  inputRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1f2937',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s ease'
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1f2937',
    backgroundColor: '#ffffff',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1f2937',
    backgroundColor: '#ffffff'
  },
  criteresContainer: {
    display: 'grid',
    gap: '16px',
    marginBottom: '24px'
  },
  critereCard: {
    padding: '20px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    position: 'relative'
  },
  critereHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '12px'
  },
  removeCritereButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  obligatoireTag: {
    padding: '4px 8px',
    backgroundColor: '#1e40af',
    color: '#ffffff',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  checkboxLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer'
  },
  criteresDisponibles: {
    marginTop: '24px'
  },
  subTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px'
  },
  criteresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px'
  },
  addCritereButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    transition: 'all 0.2s ease'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e2e8f0'
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    transition: 'all 0.2s ease'
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#1e40af',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  }
};

export default CreerAnnonce;
