import { useState } from 'react';
import { Link } from 'react-router-dom';

const Inscription = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: '',
    confirmMotDePasse: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation côté client
    if (formData.motDePasse !== formData.confirmMotDePasse) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.motDePasse.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setFormData({
          email: '',
          motDePasse: '',
          confirmMotDePasse: ''
        });
        
        // Optionnel: rediriger vers login après 2 secondes
        setTimeout(() => {
          if (onRegister) {
            onRegister();
          }
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.registerBox}>
        <div style={styles.header}>
          <h1 style={styles.title}>📝 Inscription</h1>
          <p style={styles.subtitle}>Créez votre compte pour accéder à l'application</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>📧 Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="votre.email@exemple.com"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>🔒 Mot de passe</label>
            <input
              type="password"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
              style={styles.input}
              placeholder="Au moins 6 caractères"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>🔒 Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmMotDePasse"
              value={formData.confirmMotDePasse}
              onChange={handleChange}
              style={styles.input}
              placeholder="Répétez votre mot de passe"
              required
            />
          </div>

          {error && (
            <div style={styles.error}>
              ❌ {error}
            </div>
          )}

          {success && (
            <div style={styles.success}>
              ✅ {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading ? styles.disabledButton : {})
            }}
          >
            {loading ? '⏳ Inscription...' : '🚀 S\'inscrire'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Déjà un compte ?{' '}
            <Link to="/login" style={styles.link}>
              Se connecter ici
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  registerBox: {
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '450px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    color: '#2d3436',
    fontSize: '2.2rem',
    marginBottom: '10px',
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#636e72',
    fontSize: '1rem',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    color: '#2d3436',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  input: {
    padding: '12px 15px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
    outline: 'none'
  },
  submitButton: {
    backgroundColor: '#00b894',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '15px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px'
  },
  disabledButton: {
    backgroundColor: '#b2bec3',
    cursor: 'not-allowed'
  },
  error: {
    backgroundColor: '#ff7675',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '0.9rem'
  },
  success: {
    backgroundColor: '#00b894',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '0.9rem'
  },
  footer: {
    textAlign: 'center',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e9ecef'
  },
  footerText: {
    color: '#636e72',
    fontSize: '0.9rem',
    margin: 0
  },
  link: {
    color: '#00b894',
    textDecoration: 'none',
    fontWeight: 'bold'
  }
};

export default Inscription;
