import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Navbar';
import Home from './pages/Home';
import ListeUtilisateurs from './pages/ListeUtilisateurs';
import TestsQCM from './pages/QCM/TestsQCM';
import CreerTestQCM from './pages/QCM/CreerTestQCM';
import ListeAnnonces from './pages/annonce/ListeAnnonces';
import CreerProfil from './pages/profil/CreerProfil';
import CreerCritere from './pages/profil/CreerCritere';
import CreerCritereProfil from './pages/profil/CreerCritereProfil';
import RepondreTestQCM from './pages/QCM/RepondreTestQCM';
import Login from './pages/Login';
import Inscription from './pages/Inscription';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (loginData) => {
    setIsAuthenticated(true);
    setUser(loginData.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleRegister = () => {
    // Rediriger vers la page de connexion après inscription
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingText}>⏳ Chargement...</div>
      </div>
    );
  }

  return (
    <Router>
      <div style={styles.app}>
        <Routes>
          {/* Route publique pour les tests - toujours sans sidebar */}
          <Route path="/test/:id" element={<RepondreTestQCM />} />
          
          {/* Routes conditionnelles selon l'authentification */}
          <Route path="/*" element={
            isAuthenticated ? (
              <>
                <Sidebar user={user} onLogout={handleLogout} />
                <div style={styles.mainContent}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/utilisateurs" element={<ListeUtilisateurs />} />
                    <Route path="/qcm" element={<TestsQCM />} />
                    <Route path="/qcm/creer" element={<CreerTestQCM />} />
                    <Route path="/profil/creer-profil" element={<CreerProfil />} />
                    <Route path="/profil/creer-critere" element={<CreerCritere />} />
                    <Route path="/profil/creer-critere-profil" element={<CreerCritereProfil />} />
                    <Route path="/annonces" element={<ListeAnnonces />} />
                  </Routes>
                </div>
              </>
            ) : (
              <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/inscription" element={<Inscription onRegister={handleRegister} />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  app: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: '#f1f5f9',
    minHeight: '100vh'
  },
  mainContent: {
    marginLeft: '280px',
    transition: 'margin-left 0.3s ease',
    minHeight: '100vh',
    backgroundColor: '#f1f5f9'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f1f5f9'
  },
  loadingText: {
    fontSize: '1.5rem',
    color: '#64748b'
  }
};

export default App;
