const AnnonceService = require('../services/annonceService');

class AnnonceController {
  
  // Récupérer toutes les annonces
  static async obtenirToutesLesAnnonces(req, res) {
    try {
      const annonces = await AnnonceService.obtenirTousLesAnnonces();

      res.status(200).json({
        success: true,
        message: "Liste des annonces récupérée avec succès",
        data: annonces,
        total: annonces.length
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des annonces:', error);
      res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        error: error.message
      });
    }
  }

  // Récupérer les annonces actives
  static async obtenirAnnoncesActives(req, res) {
    try {
      const annonces = await AnnonceService.obtenirAnnoncesActives();

      res.status(200).json({
        success: true,
        message: "Liste des annonces actives récupérée avec succès",
        data: annonces,
        total: annonces.length
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des annonces actives:', error);
      res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        error: error.message
      });
    }
  }

  // Récupérer les annonces avec candidats
  static async obtenirAnnoncesAvecCandidats(req, res) {
    try {
      const annonces = await AnnonceService.obtenirAnnoncesAvecCandidats();

      res.status(200).json({
        success: true,
        message: "Liste des annonces avec candidats récupérée avec succès",
        data: annonces,
        total: annonces.length
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des annonces avec candidats:', error);
      res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        error: error.message
      });
    }
  }

  // Récupérer une annonce par ID
  static async obtenirAnnonceParId(req, res) {
    try {
      const { id } = req.params;
      
      const annonce = await AnnonceService.obtenirAnnonceParId(id);
      
      if (!annonce) {
        return res.status(404).json({
          success: false,
          message: "Annonce non trouvée"
        });
      }

      res.status(200).json({
        success: true,
        message: "Annonce trouvée",
        data: annonce
      });

    } catch (error) {
      console.error('Erreur lors de la récupération de l\'annonce:', error);
      res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        error: error.message
      });
    }
  }

  // Rechercher des annonces
  static async rechercherAnnonces(req, res) {
    try {
      const { terme } = req.query;
      
      if (!terme) {
        return res.status(400).json({
          success: false,
          message: "Le terme de recherche est requis"
        });
      }

      const annonces = await AnnonceService.rechercherAnnonces(terme);

      res.status(200).json({
        success: true,
        message: "Recherche effectuée avec succès",
        data: annonces,
        total: annonces.length
      });

    } catch (error) {
      console.error('Erreur lors de la recherche d\'annonces:', error);
      res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        error: error.message
      });
    }
  }

  // Récupérer les annonces par département
  static async obtenirAnnoncesParDepartement(req, res) {
    try {
      const { idDepartement } = req.params;
      
      const annonces = await AnnonceService.obtenirAnnoncesParDepartement(idDepartement);

      res.status(200).json({
        success: true,
        message: "Annonces du département récupérées avec succès",
        data: annonces,
        total: annonces.length
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des annonces par département:', error);
      res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        error: error.message
      });
    }
  }

  // Créer une nouvelle annonce
  static async creerAnnonce(req, res) {
    try {
      const { description, dateDebut, dateFin, nomPoste, idDepartement, idProfil } = req.body;
      
      // Validation des données
      if (!nomPoste || !dateDebut || !dateFin || !idDepartement) {
        return res.status(400).json({
          success: false,
          message: "Les champs nomPoste, dateDebut, dateFin et idDepartement sont requis"
        });
      }

      // Vérifier que la date de fin est après la date de début
      if (new Date(dateFin) <= new Date(dateDebut)) {
        return res.status(400).json({
          success: false,
          message: "La date de fin doit être postérieure à la date de début"
        });
      }

      const nouvelleAnnonce = await AnnonceService.creerAnnonce({
        description,
        dateDebut,
        dateFin,
        nomPoste,
        idDepartement,
        idProfil
      });

      res.status(201).json({
        success: true,
        message: "Annonce créée avec succès",
        data: nouvelleAnnonce
      });

    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce:', error);
      res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        error: error.message
      });
    }
  }

  // Mettre à jour une annonce
  static async mettreAJourAnnonce(req, res) {
    try {
      const { id } = req.params;
      const { description, dateDebut, dateFin, nomPoste, idDepartement, idProfil } = req.body;
      
      // Validation des données
      if (!nomPoste || !dateDebut || !dateFin || !idDepartement) {
        return res.status(400).json({
          success: false,
          message: "Les champs nomPoste, dateDebut, dateFin et idDepartement sont requis"
        });
      }

      // Vérifier que la date de fin est après la date de début
      if (new Date(dateFin) <= new Date(dateDebut)) {
        return res.status(400).json({
          success: false,
          message: "La date de fin doit être postérieure à la date de début"
        });
      }

      const annonceModifiee = await AnnonceService.mettreAJourAnnonce(id, {
        description,
        dateDebut,
        dateFin,
        nomPoste,
        idDepartement,
        idProfil
      });

      if (!annonceModifiee) {
        return res.status(404).json({
          success: false,
          message: "Annonce non trouvée"
        });
      }

      res.status(200).json({
        success: true,
        message: "Annonce mise à jour avec succès",
        data: annonceModifiee
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'annonce:', error);
      res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        error: error.message
      });
    }
  }

  // Supprimer une annonce
  static async supprimerAnnonce(req, res) {
    try {
      const { id } = req.params;
      
      const supprime = await AnnonceService.supprimerAnnonce(id);
      
      if (!supprime) {
        return res.status(404).json({
          success: false,
          message: "Annonce non trouvée"
        });
      }

      res.status(200).json({
        success: true,
        message: "Annonce supprimée avec succès"
      });

    } catch (error) {
      console.error('Erreur lors de la suppression de l\'annonce:', error);
      res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        error: error.message
      });
    }
  }

  // Obtenir les statistiques des annonces
  static async obtenirStatistiques(req, res) {
    try {
      const statistiques = await AnnonceService.obtenirStatistiques();

      res.status(200).json({
        success: true,
        message: "Statistiques récupérées avec succès",
        data: statistiques
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        error: error.message
      });
    }
  }

  // Obtenir le nombre de candidats pour une annonce
  static async obtenirNombreCandidats(req, res) {
    try {
      const { id } = req.params;
      
      const nombreCandidats = await AnnonceService.obtenirNombreCandidats(id);

      res.status(200).json({
        success: true,
        message: "Nombre de candidats récupéré avec succès",
        data: { nombreCandidats }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de candidats:', error);
      res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        error: error.message
      });
    }
  }
}

module.exports = AnnonceController;