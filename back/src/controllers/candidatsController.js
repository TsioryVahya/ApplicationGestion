const CandidatsService = require('../services/candidatsService');

class CandidatsController {
  static async obtenirTousLesCandidats(req, res) {
    try {
      const candidats = await CandidatsService.obtenirTousLesCandidats();
      res.status(200).json({
        success: true,
        message: 'Liste des candidats récupérée avec succès',
        data: candidats,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des candidats:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message,
      });
    }
  }

    static async ajouterContrat(req, res) {
    try {
      const contratData = req.body;
      const nouveauContrat = await CandidatsService.ajouterContrat(contratData);
      res.status(201).json({
        success: true,
        message: 'Contrat ajouté avec succès',
        data: nouveauContrat,
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du contrat:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message,
      });
    }
  }
}

module.exports = CandidatsController;