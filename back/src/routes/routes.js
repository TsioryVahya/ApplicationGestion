const express = require('express');
const router = express.Router();
const UtilisateursController = require('../controllers/utilisateursController');

// Routes pour les utilisateurs
router.get('/utilisateurs', UtilisateursController.obtenirTousLesUtilisateurs);
router.get('/utilisateurs/:id', UtilisateursController.obtenirUtilisateurParId);
router.post('/utilisateurs', UtilisateursController.creerUtilisateur);

module.exports = router;