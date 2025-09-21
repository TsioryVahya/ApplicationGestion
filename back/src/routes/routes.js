const express = require('express');
const router = express.Router();
const UtilisateursController = require('../controllers/utilisateursController');
const AuthController = require('../controllers/authController');
const EmployeController = require('../controllers/employeController');
const QcmController = require('../controllers/qcmController');
const AnnonceController = require('../controllers/annonceController');
const ProfilController = require('../controllers/profilController');
const CritereController = require('../controllers/critereController');
const CritereProfilController = require('../controllers/critereProfilController');
const CandidatController = require('../controllers/candidatController');
const EntretienController = require('../controllers/entretienController');
const CompteCandidatController = require('../controllers/compteCandidatController');
const NotificationController = require('../controllers/notificationController');

// Routes d'authentification
router.post('/auth/inscription', AuthController.inscription);
router.post('/auth/connexion', AuthController.connexion);
router.get('/auth/profil', AuthController.verifierToken, AuthController.profil);

// Routes pour les employés
router.get('/employes', EmployeController.obtenirTousLesEmployes);
router.get('/employes/sans-compte', EmployeController.obtenirEmployesSansCompte);
router.get('/employes/:id', EmployeController.obtenirEmployeParId);

// Routes publiques pour les tests QCM (accès candidats)
router.get('/qcm/public/tests/:id', QcmController.obtenirTestParId);

// Route pour accéder au test QCM par token
router.get('/qcm/public/token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { pool } = require('../config/database');
    
    // Vérifier si le token existe et est valide
    const [invitations] = await pool.execute(`
      SELECT iq.*, qt.*, c.nom as candidatNom, c.prenom as candidatPrenom
      FROM InvitationQCM iq
      JOIN QcmTest qt ON iq.idQcmTest = qt.id
      JOIN Candidat c ON iq.idCandidat = c.id
      WHERE iq.token = ? AND iq.dateExpiration > NOW() AND iq.statut != 'terminee'
    `, [token]);
    
    if (invitations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Token invalide ou expiré"
      });
    }
    
    const invitation = invitations[0];
    
    // Récupérer les questions du test
    const [questions] = await pool.execute(`
      SELECT q.*, GROUP_CONCAT(c.texte ORDER BY c.id SEPARATOR '|||') as reponses,
             GROUP_CONCAT(c.estCorrect ORDER BY c.id SEPARATOR '|||') as corrections
      FROM QcmQuestion q
      LEFT JOIN QcmChoix c ON q.id = c.idQuestion
      WHERE q.idTest = ?
      GROUP BY q.id
      ORDER BY q.numero
    `, [invitation.idQcmTest]);
    
    // Formater les questions avec leurs réponses
    const questionsFormatees = questions.map(q => ({
      ...q,
      reponses: q.reponses ? q.reponses.split('|||').map((texte, index) => ({
        texte,
        estCorrecte: q.corrections.split('|||')[index] === '1'
      })) : []
    }));
    
    // Marquer comme vue si pas encore vue
    if (!invitation.dateVue) {
      await pool.execute(`
        UPDATE InvitationQCM SET dateVue = NOW(), statut = 'vue' WHERE token = ?
      `, [token]);
    }
    
    res.json({
      success: true,
      data: {
        test: {
          id: invitation.idQcmTest,
          nom: invitation.nom,
          description: invitation.description || 'Test QCM',
          dureeMinutes: invitation.dureeMinutes || 30,
          notePassage: invitation.notePassage || 50
        },
        questions: questionsFormatees,
        candidat: {
          nom: invitation.candidatNom,
          prenom: invitation.candidatPrenom
        },
        invitation: {
          dateExpiration: invitation.dateExpiration,
          statut: invitation.statut
        }
      }
    });
    
  } catch (error) {
    console.error('Erreur accès test par token:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Route de test pour vérifier les tokens QCM
router.get('/qcm/public/tests/:token/debug', async (req, res) => {
  try {
    const { token } = req.params;
    const { pool } = require('../config/database');
    
    // Chercher le token dans InvitationQCM
    const [invitations] = await pool.execute(`
      SELECT iq.*, qt.nom as testNom, c.nom as candidatNom, c.prenom as candidatPrenom
      FROM InvitationQCM iq
      LEFT JOIN QcmTest qt ON iq.idQcmTest = qt.id
      LEFT JOIN Candidat c ON iq.idCandidat = c.id
      WHERE iq.token = ?
    `, [token]);
    
    // Récupérer aussi les questions et choix
    let questions = [];
    let choix = [];
    if (invitations.length > 0) {
      const testId = invitations[0].idQcmTest;
      
      [questions] = await pool.execute(`
        SELECT * FROM QcmQuestion WHERE idTest = ? ORDER BY numero
      `, [testId]);
      
      [choix] = await pool.execute(`
        SELECT c.*, q.numero as questionNumero 
        FROM QcmChoix c 
        JOIN QcmQuestion q ON c.idQuestion = q.id 
        WHERE q.idTest = ?
        ORDER BY q.numero, c.id
      `, [testId]);
    }
    
    res.json({
      success: true,
      data: {
        token: token,
        invitations: invitations,
        questions: questions,
        choix: choix,
        found: invitations.length > 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Routes pour les tests QCM (protégées)
router.get('/qcm/tests', AuthController.verifierToken, QcmController.obtenirTousLesTests);
router.get('/qcm/tests/:id', AuthController.verifierToken, QcmController.obtenirTestParId);
router.post('/qcm/tests', AuthController.verifierToken, QcmController.creerTest);
router.post('/qcm/tests/:id/questions', AuthController.verifierToken, QcmController.ajouterQuestion);
router.get('/qcm/profils', AuthController.verifierToken, QcmController.obtenirTousLesProfils);
router.delete('/qcm/tests/:id', AuthController.verifierToken, QcmController.supprimerTest);

// Routes pour les utilisateurs (protégées)
router.get('/utilisateurs', AuthController.verifierToken, UtilisateursController.obtenirTousLesUtilisateurs);
router.get('/utilisateurs/:id', AuthController.verifierToken, UtilisateursController.obtenirUtilisateurParId);
router.post('/utilisateurs', AuthController.verifierToken, UtilisateursController.creerUtilisateur);

// Routes publiques pour les clients (sans authentification)
router.get('/client/annonce', AnnonceController.obtenirAnnoncesActives);
router.get('/client/annonce/:id', AnnonceController.obtenirAnnonceParId);

// Routes pour les annonces (protégées)
router.get('/annonces', AuthController.verifierToken, AnnonceController.obtenirToutesLesAnnonces);
router.get('/annonces/actives', AuthController.verifierToken, AnnonceController.obtenirAnnoncesActives);
router.get('/annonces/avec-candidats', AuthController.verifierToken, AnnonceController.obtenirAnnoncesAvecCandidats);
router.get('/annonces/statistiques', AuthController.verifierToken, AnnonceController.obtenirStatistiques);
router.get('/annonces/recherche', AuthController.verifierToken, AnnonceController.rechercherAnnonces);
router.get('/annonces/profils', AuthController.verifierToken, AnnonceController.obtenirProfils);
router.get('/annonces/profils/:idProfil/criteres', AuthController.verifierToken, AnnonceController.obtenirCriteresProfil);
router.get('/annonces/criteres', AuthController.verifierToken, AnnonceController.obtenirTousLesCriteres);
router.get('/annonces/departements', AuthController.verifierToken, AnnonceController.obtenirDepartements);
router.get('/annonces/types', AuthController.verifierToken, AnnonceController.obtenirTypesAnnonce);

// Endpoints publics pour le côté client
router.get('/client/departements', AnnonceController.obtenirDepartements);
router.get('/client/types', AnnonceController.obtenirTypesAnnonce);
router.get('/client/lieux', AnnonceController.obtenirLieux);
router.get('/client/diplomes', AnnonceController.obtenirDiplomes);

// Test endpoint pour vérifier les données
router.get('/client/test-data', async (req, res) => {
  try {
    const { pool } = require('../config/database');
    const [depts] = await pool.execute('SELECT id, nom FROM Departement ORDER BY nom');
    const [types] = await pool.execute('SELECT id, libelle FROM TypeAnnonce ORDER BY libelle');
    
    res.json({
      success: true,
      data: {
        departements: depts,
        typesAnnonce: types
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
router.get('/annonces/departement/:idDepartement', AuthController.verifierToken, AnnonceController.obtenirAnnoncesParDepartement);
router.get('/annonces/:id', AuthController.verifierToken, AnnonceController.obtenirAnnonceParId);
router.get('/annonces/:id/candidats', AuthController.verifierToken, AnnonceController.obtenirNombreCandidats);
router.post('/annonces', AuthController.verifierToken, AnnonceController.creerAnnonce);
router.put('/annonces/:id', AuthController.verifierToken, AnnonceController.mettreAJourAnnonce);
router.delete('/annonces/:id', AuthController.verifierToken, AnnonceController.supprimerAnnonce);

// CRUD Profil
router.get('/profils', ProfilController.getAll);
router.get('/profils/:id', ProfilController.getById);
router.post('/profils', ProfilController.create);
router.put('/profils/:id', ProfilController.update);
router.delete('/profils/:id', ProfilController.delete);

// CRUD Critere
router.get('/criteres', CritereController.getAll);
router.get('/criteres/:id', CritereController.getById);
router.post('/criteres', CritereController.create);
router.put('/criteres/:id', CritereController.update);
router.delete('/criteres/:id', CritereController.delete);

// CRUD CritereProfil (association)
router.get('/critereprofils', CritereProfilController.getAll);
router.get('/critereprofils/details', CritereProfilController.getAllWithDetails);
router.get('/critereprofils/filter', CritereProfilController.getFiltered);
router.get('/critereprofils/duplicates/stats', AuthController.verifierToken, CritereProfilController.getDuplicatesStats);
router.post('/critereprofils/duplicates/cleanup', AuthController.verifierToken, CritereProfilController.cleanupDuplicates);
router.post('/critereprofils/fix-zero-values', AuthController.verifierToken, CritereProfilController.fixZeroValues);
router.get('/critereprofils/:id', CritereProfilController.getById);
router.post('/critereprofils', CritereProfilController.create);
router.put('/critereprofils/:id', CritereProfilController.update);
router.delete('/critereprofils/:id', CritereProfilController.delete);

// Routes pour les entretiens (ordre important : routes spécifiques avant routes avec paramètres)
router.get('/entretiens/candidats/eligibles', AuthController.verifierToken, EntretienController.obtenirCandidatsEligiblesEntretien);
router.get('/entretiens/candidats/disponibles', AuthController.verifierToken, EntretienController.obtenirCandidatsDisponibles);
router.get('/entretiens/candidats/tous', AuthController.verifierToken, EntretienController.obtenirTousLesCandidats);
router.get('/entretiens/statuts/tous', AuthController.verifierToken, EntretienController.obtenirStatutsEntretien);
router.get('/entretiens/:id/historique', AuthController.verifierToken, EntretienController.obtenirHistoriqueEntretien);
router.get('/entretiens', AuthController.verifierToken, EntretienController.obtenirTousLesEntretiens);
router.get('/entretiens/:id', AuthController.verifierToken, EntretienController.obtenirEntretienParId);
router.post('/entretiens', AuthController.verifierToken, EntretienController.creerEntretien);
router.put('/entretiens/:id', AuthController.verifierToken, EntretienController.mettreAJourEntretien);
router.delete('/entretiens/:id', AuthController.verifierToken, EntretienController.supprimerEntretien);

// Routes pour les candidats (protégées)
router.get('/candidats', AuthController.verifierToken, CandidatController.obtenirTousLesCandidats);
router.get('/candidats/annonce/:idAnnonce', AuthController.verifierToken, CandidatController.obtenirCandidatsParAnnonce);
router.get('/candidats/statistiques', AuthController.verifierToken, CandidatController.obtenirStatistiques);
router.get('/candidats/:id', AuthController.verifierToken, CandidatController.obtenirCandidatParId);
router.post('/candidats', AuthController.verifierToken, CandidatController.creerCandidat);
router.put('/candidats/:id/statut', AuthController.verifierToken, CandidatController.mettreAJourStatutCandidat);
router.delete('/candidats/:id', AuthController.verifierToken, CandidatController.supprimerCandidat);

// Routes pour les comptes candidats
router.post('/candidats/inscription', CompteCandidatController.inscription);
router.post('/candidats/connexion', CompteCandidatController.connexion);
router.get('/candidats/profil', CompteCandidatController.verifierTokenCandidat, CompteCandidatController.obtenirProfil);
router.put('/candidats/mot-de-passe', CompteCandidatController.verifierTokenCandidat, CompteCandidatController.mettreAJourMotDePasse);
router.delete('/candidats/compte', CompteCandidatController.verifierTokenCandidat, CompteCandidatController.supprimerCompte);
router.post('/candidats/candidature', CompteCandidatController.verifierTokenCandidat, CompteCandidatController.soumettreCandidat);

// Routes d'administration pour les comptes candidats
router.get('/candidats/admin/comptes', AuthController.verifierToken, CompteCandidatController.obtenirTousLesComptes);
router.get('/candidats/admin/statistiques', AuthController.verifierToken, CompteCandidatController.obtenirStatistiques);

// Routes pour les notifications QCM (protégées - admin)
router.post('/notifications/envoyer-qcm', AuthController.verifierToken, NotificationController.envoyerQcm);
router.get('/notifications/historique', AuthController.verifierToken, NotificationController.obtenirHistorique);

// Routes pour les notifications côté client (candidats)
router.get('/candidats/notifications', CompteCandidatController.verifierTokenCandidat, NotificationController.obtenirNotificationsCandidat);
router.put('/candidats/notifications/:id/lue', CompteCandidatController.verifierTokenCandidat, NotificationController.marquerCommeLue);

// Route temporaire sans authentification pour debug
router.get('/candidats/notifications/simple', async (req, res) => {
  try {
    const { pool } = require('../config/database');
    
    // Récupérer toutes les notifications pour le destinataire ID 1
    const [notifications] = await pool.execute(`
      SELECT 
        n.*,
        tn.nom as typeNotification,
        tn.icone,
        tn.couleur,
        a.reference as annonceReference,
        qt.nom as qcmTitre
      FROM Notification n
      JOIN TypeNotification tn ON n.idTypeNotification = tn.id
      LEFT JOIN Annonce a ON n.idAnnonce = a.id
      LEFT JOIN QcmTest qt ON n.idQcmTest = qt.id
      WHERE n.idDestinataire = 1
      ORDER BY n.dateCreation DESC
    `);
    
    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Route temporaire pour marquer comme lue (sans authentification)
router.put('/candidats/notifications/:id/lue/simple', async (req, res) => {
  try {
    const { id } = req.params;
    const { pool } = require('../config/database');
    
    // Marquer comme lue
    await pool.execute(`
      UPDATE Notification SET lue = TRUE WHERE id = ?
    `, [id]);
    
    res.json({
      success: true,
      message: 'Notification marquée comme lue'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Route pour insérer des données de test QCM
router.post('/qcm/insert-test-data', async (req, res) => {
  try {
    const { pool } = require('../config/database');
    
    // Insérer les choix pour la question 1
    await pool.execute(`
      INSERT IGNORE INTO QcmChoix (idQuestion, texte, estCorrect) VALUES
      (1, 'Une variable qui peut être redéclarée', false),
      (1, 'Une variable de portée de bloc qui ne peut pas être redéclarée', true),
      (1, 'Une constante', false),
      (1, 'Une fonction', false)
    `);
    
    // Insérer les choix pour la question 2
    await pool.execute(`
      INSERT IGNORE INTO QcmChoix (idQuestion, texte, estCorrect) VALUES
      (2, 'Vrai', false),
      (2, 'Faux', true),
      (2, 'Parfois', false),
      (2, 'Ça dépend du navigateur', false)
    `);
    
    res.json({
      success: true,
      message: 'Données de test QCM insérées avec succès'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Route de debug pour les notifications (temporaire)
router.get('/candidats/notifications/debug', async (req, res) => {
  try {
    const { pool } = require('../config/database');
    
    // Récupérer toutes les notifications
    const [notifications] = await pool.execute(`
      SELECT 
        n.*,
        tn.nom as typeNotification,
        tn.icone,
        tn.couleur,
        a.reference as annonceReference,
        qt.nom as qcmTitre
      FROM Notification n
      JOIN TypeNotification tn ON n.idTypeNotification = tn.id
      LEFT JOIN Annonce a ON n.idAnnonce = a.id
      LEFT JOIN QcmTest qt ON n.idQcmTest = qt.id
      ORDER BY n.dateCreation DESC
    `);
    
    // Récupérer tous les comptes candidats
    const [comptes] = await pool.execute('SELECT * FROM CompteCandidat');
    
    res.json({
      success: true,
      data: {
        notifications: notifications,
        comptes: comptes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;