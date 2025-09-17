const CritereService = require('../services/critereService');

class CritereController {
  // Obtenir tous les critères
  static async obtenirTousLesCriteres(req, res) {
    try {
      const criteres = await CritereService.obtenirTousLesCriteres();
      res.json(criteres);
    } catch (error) {
      console.error('Erreur lors de la récupération des critères:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des critères' });
    }
  }

  // Obtenir un critère par ID
  static async obtenirCritereParId(req, res) {
    try {
      const { id } = req.params;
      const critere = await CritereService.obtenirCritereParId(id);
      
      if (!critere) {
        return res.status(404).json({ message: 'Critère non trouvé' });
      }
      
      res.json(critere);
    } catch (error) {
      console.error('Erreur lors de la récupération du critère:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération du critère' });
    }
  }

  // Créer un nouveau critère
  static async creerCritere(req, res) {
    try {
      const { nom, description } = req.body;

      if (!nom || nom.trim() === '') {
        return res.status(400).json({ message: 'Le nom du critère est obligatoire' });
      }

      const nouveauCritere = await CritereService.creerCritere({ nom: nom.trim(), description });
      res.status(201).json({ 
        message: 'Critère créé avec succès', 
        critere: nouveauCritere 
      });
    } catch (error) {
      console.error('Erreur lors de la création du critère:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: 'Un critère avec ce nom existe déjà' });
      } else {
        res.status(500).json({ message: 'Erreur serveur lors de la création du critère' });
      }
    }
  }

  // Mettre à jour un critère
  static async mettreAJourCritere(req, res) {
    try {
      const { id } = req.params;
      const { nom, description } = req.body;

      if (!nom || nom.trim() === '') {
        return res.status(400).json({ message: 'Le nom du critère est obligatoire' });
      }

      const critereMisAJour = await CritereService.mettreAJourCritere(id, { 
        nom: nom.trim(), 
        description 
      });
      
      if (!critereMisAJour) {
        return res.status(404).json({ message: 'Critère non trouvé' });
      }
      
      res.json({ 
        message: 'Critère mis à jour avec succès', 
        critere: critereMisAJour 
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du critère:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: 'Un critère avec ce nom existe déjà' });
      } else {
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du critère' });
      }
    }
  }

  // Supprimer un critère
  static async supprimerCritere(req, res) {
    try {
      const { id } = req.params;
      const resultat = await CritereService.supprimerCritere(id);
      
      if (!resultat) {
        return res.status(404).json({ message: 'Critère non trouvé' });
      }
      
      res.json({ message: 'Critère supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du critère:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la suppression du critère' });
    }
  }
}

module.exports = CritereController;
