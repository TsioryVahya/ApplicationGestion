const ProfilService = require('../services/profilService');

class ProfilController {
  // Obtenir tous les profils
  static async obtenirTousLesProfils(req, res) {
    try {
      const profils = await ProfilService.obtenirTousLesProfils();
      res.json(profils);
    } catch (error) {
      console.error('Erreur lors de la récupération des profils:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des profils' });
    }
  }

  // Obtenir un profil par ID
  static async obtenirProfilParId(req, res) {
    try {
      const { id } = req.params;
      const profil = await ProfilService.obtenirProfilParId(id);
      
      if (!profil) {
        return res.status(404).json({ message: 'Profil non trouvé' });
      }
      
      res.json(profil);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération du profil' });
    }
  }

  // Créer un nouveau profil
  static async creerProfil(req, res) {
    try {
      const { nom, description } = req.body;

      if (!nom || nom.trim() === '') {
        return res.status(400).json({ message: 'Le nom du profil est obligatoire' });
      }

      const nouveauProfil = await ProfilService.creerProfil({ nom: nom.trim(), description });
      res.status(201).json({ 
        message: 'Profil créé avec succès', 
        profil: nouveauProfil 
      });
    } catch (error) {
      console.error('Erreur lors de la création du profil:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: 'Un profil avec ce nom existe déjà' });
      } else {
        res.status(500).json({ message: 'Erreur serveur lors de la création du profil' });
      }
    }
  }

  // Mettre à jour un profil
  static async mettreAJourProfil(req, res) {
    try {
      const { id } = req.params;
      const { nom, description } = req.body;

      if (!nom || nom.trim() === '') {
        return res.status(400).json({ message: 'Le nom du profil est obligatoire' });
      }

      const profilMisAJour = await ProfilService.mettreAJourProfil(id, { 
        nom: nom.trim(), 
        description 
      });
      
      if (!profilMisAJour) {
        return res.status(404).json({ message: 'Profil non trouvé' });
      }
      
      res.json({ 
        message: 'Profil mis à jour avec succès', 
        profil: profilMisAJour 
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: 'Un profil avec ce nom existe déjà' });
      } else {
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du profil' });
      }
    }
  }

  // Supprimer un profil
  static async supprimerProfil(req, res) {
    try {
      const { id } = req.params;
      const resultat = await ProfilService.supprimerProfil(id);
      
      if (!resultat) {
        return res.status(404).json({ message: 'Profil non trouvé' });
      }
      
      res.json({ message: 'Profil supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du profil:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la suppression du profil' });
    }
  }
}

module.exports = ProfilController;
