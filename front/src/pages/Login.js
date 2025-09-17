import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/connexion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Stocker le token dans localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Appeler la fonction de connexion du parent
        onLogin(data.data);
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
      <div style={styles.loginBox}>
        <div style={styles.header}>
          <h1 style={styles.title}>🔐 Connexion</h1>
          <p style={styles.subtitle}>Accédez à votre espace de gestion</p>
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
              placeholder="Votre mot de passe"
              required
            />
          </div>

          {error && (
            <div style={styles.error}>
              ❌ {error}
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
            {loading ? '⏳ Connexion...' : '🚀 Se connecter'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Pas encore de compte ?{' '}
            <Link to="/inscription" style={styles.link}>
              S'inscrire ici
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
  loginBox: {
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

export default Login;
