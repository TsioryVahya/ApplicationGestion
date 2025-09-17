const CritereProfilService = require('../services/critereProfilService');

class CritereProfilController {
  // Obtenir tous les critères-profils
  static async obtenirTousCriteresProfils(req, res) {
    try {
      const criteresProfils = await CritereProfilService.obtenirTousCriteresProfils();
      res.json(criteresProfils);
    } catch (error) {
      console.error('Erreur lors de la récupération des critères-profils:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des critères-profils' });
    }
  }

  // Obtenir les critères d'un profil
  static async obtenirCriteresParProfil(req, res) {
    try {
      const { profilId } = req.params;
      const criteres = await CritereProfilService.obtenirCriteresParProfil(profilId);
      res.json(criteres);
    } catch (error) {
      console.error('Erreur lors de la récupération des critères du profil:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des critères du profil' });
    }
  }

  // Créer une nouvelle association critère-profil
  static async creerCritereProfil(req, res) {
    try {
      const { idProfil, idCritere, valeur, estObligatoire } = req.body;

      if (!idProfil || !idCritere || !valeur || valeur.trim() === '') {
        return res.status(400).json({ 
          message: 'Le profil, le critère et la valeur sont obligatoires' 
        });
      }

      const nouveauCritereProfil = await CritereProfilService.creerCritereProfil({
        idProfil,
        idCritere,
        valeur: valeur.trim(),
        estObligatoire: estObligatoire !== undefined ? estObligatoire : true
      });

      res.status(201).json({ 
        message: 'Association critère-profil créée avec succès', 
        critereProfil: nouveauCritereProfil 
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'association critère-profil:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: 'Cette association critère-profil existe déjà' });
      } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        res.status(400).json({ message: 'Profil ou critère invalide' });
      } else {
        res.status(500).json({ message: 'Erreur serveur lors de la création de l\'association critère-profil' });
      }
    }
  }

  // Mettre à jour une association critère-profil
  static async mettreAJourCritereProfil(req, res) {
    try {
      const { id } = req.params;
      const { valeur, estObligatoire } = req.body;

      if (!valeur || valeur.trim() === '') {
        return res.status(400).json({ message: 'La valeur est obligatoire' });
      }

      const critereProfilMisAJour = await CritereProfilService.mettreAJourCritereProfil(id, {
        valeur: valeur.trim(),
        estObligatoire: estObligatoire !== undefined ? estObligatoire : true
      });
      
      if (!critereProfilMisAJour) {
        return res.status(404).json({ message: 'Association critère-profil non trouvée' });
      }
      
      res.json({ 
        message: 'Association critère-profil mise à jour avec succès', 
        critereProfil: critereProfilMisAJour 
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'association critère-profil:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'association critère-profil' });
    }
  }

  // Supprimer une association critère-profil
  static async supprimerCritereProfil(req, res) {
    try {
      const { id } = req.params;
      const resultat = await CritereProfilService.supprimerCritereProfil(id);
      
      if (!resultat) {
        return res.status(404).json({ message: 'Association critère-profil non trouvée' });
      }
      
      res.json({ message: 'Association critère-profil supprimée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'association critère-profil:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'association critère-profil' });
    }
  }
}

module.exports = CritereProfilController;
