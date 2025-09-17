const express = require('express');
const router = express.Router();
const UtilisateursController = require('../controllers/utilisateursController');
const AuthController = require('../controllers/authController');
const EmployeController = require('../controllers/employeController');
const ProfilController = require('../controllers/profilController');
const CritereController = require('../controllers/critereController');
const CritereProfilController = require('../controllers/critereProfilController');

// Routes d'authentification
router.post('/auth/inscription', AuthController.inscription);
router.post('/auth/connexion', AuthController.connexion);
router.get('/auth/profil', AuthController.verifierToken, AuthController.profil);

// Routes pour les employés
router.get('/employes', EmployeController.obtenirTousLesEmployes);
router.get('/employes/sans-compte', EmployeController.obtenirEmployesSansCompte);
router.get('/employes/:id', EmployeController.obtenirEmployeParId);

// Routes pour les utilisateurs (protégées)
router.get('/utilisateurs', AuthController.verifierToken, UtilisateursController.obtenirTousLesUtilisateurs);
router.get('/utilisateurs/:id', AuthController.verifierToken, UtilisateursController.obtenirUtilisateurParId);
router.post('/utilisateurs', AuthController.verifierToken, UtilisateursController.creerUtilisateur);


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
router.get('/critereprofils/:id', CritereProfilController.getById);
router.post('/critereprofils', CritereProfilController.create);
router.put('/critereprofils/:id', CritereProfilController.update);
router.delete('/critereprofils/:id', CritereProfilController.delete);

// ...existing code...

module.exports = router;