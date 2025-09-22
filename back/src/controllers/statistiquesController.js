const StatistiquesService = require('../services/statistiquesService');

class StatistiquesController {
  
  // Récupérer les statistiques générales du tableau de bord
  static async obtenirStatistiquesGenerales(req, res) {
    try {
      const statistiques = await StatistiquesService.obtenirStatistiquesGenerales();
      
      res.json({
        success: true,
        data: statistiques
      });
    } catch (error) {
      console.error('Erreur dans obtenirStatistiquesGenerales:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques'
      });
    }
  }

  // Récupérer les données pour les graphiques
  static async obtenirDonneesGraphiques(req, res) {
    try {
      const donnees = await StatistiquesService.obtenirDonneesGraphiques();
      
      res.json({
        success: true,
        data: donnees
      });
    } catch (error) {
      console.error('Erreur dans obtenirDonneesGraphiques:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des données graphiques'
      });
    }
  }

  // Récupérer les statistiques par mois
  static async obtenirStatistiquesParMois(req, res) {
    try {
      const statistiques = await StatistiquesService.obtenirStatistiquesParMois();
      
      res.json({
        success: true,
        data: statistiques
      });
    } catch (error) {
      console.error('Erreur dans obtenirStatistiquesParMois:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques mensuelles'
      });
    }
  }
}

module.exports = StatistiquesController;
