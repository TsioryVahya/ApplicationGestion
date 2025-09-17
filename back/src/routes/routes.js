const express = require('express');
const router = express.Router();
const UtilisateursController = require('../controllers/utilisateursController');
const AuthController = require('../controllers/authController');
const EmployeController = require('../controllers/employeController');
const QcmController = require('../controllers/qcmController');
const ProfilController = require('../controllers/profilController');
const CritereController = require('../controllers/critereController');
const CritereProfilController = require('../controllers/critereProfilController');
const AnnonceController = require('../controllers/annonceController');

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

// Routes pour les profils (protégées)
router.get('/profils', AuthController.verifierToken, ProfilController.obtenirTousLesProfils);
router.get('/profils/:id', AuthController.verifierToken, ProfilController.obtenirProfilParId);
router.post('/profils', AuthController.verifierToken, ProfilController.creerProfil);
router.put('/profils/:id', AuthController.verifierToken, ProfilController.mettreAJourProfil);
router.delete('/profils/:id', AuthController.verifierToken, ProfilController.supprimerProfil);

// Routes pour les critères (protégées)
router.get('/criteres', AuthController.verifierToken, CritereController.obtenirTousLesCriteres);
router.get('/criteres/:id', AuthController.verifierToken, CritereController.obtenirCritereParId);
router.post('/criteres', AuthController.verifierToken, CritereController.creerCritere);
router.put('/criteres/:id', AuthController.verifierToken, CritereController.mettreAJourCritere);
router.delete('/criteres/:id', AuthController.verifierToken, CritereController.supprimerCritere);

// Routes pour les associations critère-profil (protégées)
router.get('/critere-profils', AuthController.verifierToken, CritereProfilController.obtenirTousCriteresProfils);
router.get('/critere-profils/profil/:profilId', AuthController.verifierToken, CritereProfilController.obtenirCriteresParProfil);
router.post('/critere-profils', AuthController.verifierToken, CritereProfilController.creerCritereProfil);
router.put('/critere-profils/:id', AuthController.verifierToken, CritereProfilController.mettreAJourCritereProfil);
router.delete('/critere-profils/:id', AuthController.verifierToken, CritereProfilController.supprimerCritereProfil);
// Routes pour les annonces (protégées)
router.get('/annonces', AuthController.verifierToken, AnnonceController.obtenirToutesLesAnnonces);
router.get('/annonces/actives', AuthController.verifierToken, AnnonceController.obtenirAnnoncesActives);
router.get('/annonces/avec-candidats', AuthController.verifierToken, AnnonceController.obtenirAnnoncesAvecCandidats);
router.get('/annonces/statistiques', AuthController.verifierToken, AnnonceController.obtenirStatistiques);
router.get('/annonces/recherche', AuthController.verifierToken, AnnonceController.rechercherAnnonces);
router.get('/annonces/departement/:idDepartement', AuthController.verifierToken, AnnonceController.obtenirAnnoncesParDepartement);
router.get('/annonces/:id', AuthController.verifierToken, AnnonceController.obtenirAnnonceParId);
router.get('/annonces/:id/candidats', AuthController.verifierToken, AnnonceController.obtenirNombreCandidats);
router.post('/annonces', AuthController.verifierToken, AnnonceController.creerAnnonce);
router.put('/annonces/:id', AuthController.verifierToken, AnnonceController.mettreAJourAnnonce);
router.delete('/annonces/:id', AuthController.verifierToken, AnnonceController.supprimerAnnonce);

module.exports = router;