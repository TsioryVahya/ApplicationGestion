const { pool } = require('../config/database');

class AnnonceService {
  
  // Récupérer toutes les annonces
  static async obtenirTousLesAnnonces() {
    try {
      const [rows] = await pool.execute(
        `SELECT a.id, a.description, a.dateDebut, a.dateFin, a.nomPoste,
                a.idDepartement, a.idProfil, a.idTypeAnnonce,
                d.nom as nomDepartement,
                p.nom as nomProfil,
                t.libelle as typeAnnonce
         FROM Annonce a 
         LEFT JOIN Departement d ON a.idDepartement = d.id 
         LEFT JOIN Profil p ON a.idProfil = p.id
         LEFT JOIN TypeAnnonce t ON a.idTypeAnnonce = t.id
         ORDER BY a.dateDebut DESC`
      );
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces:', error);
      throw error;
    }
  }

  // Récupérer une annonce par ID
  static async obtenirAnnonceParId(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT a.id, a.description, a.dateDebut, a.dateFin, a.nomPoste,
                a.idDepartement, a.idProfil,
                d.nom as nomDepartement,
                p.nom as nomProfil
         FROM Annonce a 
         LEFT JOIN Departement d ON a.idDepartement = d.id 
         LEFT JOIN Profil p ON a.idProfil = p.id
         WHERE a.id = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'annonce:', error);
      throw error;
    }
  }

  // Récupérer les annonces actives (date fin >= aujourd'hui)
  static async obtenirAnnoncesActives() {
    try {
      const [rows] = await pool.execute(
        `SELECT a.id, a.description, a.dateDebut, a.dateFin, a.nomPoste,
                a.idDepartement, a.idProfil,
                d.nom as nomDepartement,
                p.nom as nomProfil
         FROM Annonce a 
         LEFT JOIN Departement d ON a.idDepartement = d.id 
         LEFT JOIN Profil p ON a.idProfil = p.id
         WHERE a.dateFin >= CURDATE()
         ORDER BY a.dateDebut DESC`
      );
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces actives:', error);
      throw error;
    }
  }

  // Récupérer les annonces par département
  static async obtenirAnnoncesParDepartement(idDepartement) {
    try {
      const [rows] = await pool.execute(
        `SELECT a.id, a.description, a.dateDebut, a.dateFin, a.nomPoste,
                a.idDepartement, a.idProfil,
                d.nom as nomDepartement,
                p.nom as nomProfil
         FROM Annonce a 
         LEFT JOIN Departement d ON a.idDepartement = d.id 
         LEFT JOIN Profil p ON a.idProfil = p.id
         WHERE a.idDepartement = ?
         ORDER BY a.dateDebut DESC`,
        [idDepartement]
      );
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces par département:', error);
      throw error;
    }
  }

  // Rechercher des annonces par nom de poste
  static async rechercherAnnonces(terme) {
    try {
      const searchTerm = `%${terme}%`;
      const [rows] = await pool.execute(
        `SELECT a.id, a.description, a.dateDebut, a.dateFin, a.nomPoste,
                a.idDepartement, a.idProfil,
                d.nom as nomDepartement,
                p.nom as nomProfil
         FROM Annonce a 
         LEFT JOIN Departement d ON a.idDepartement = d.id 
         LEFT JOIN Profil p ON a.idProfil = p.id
         WHERE a.nomPoste LIKE ? OR a.description LIKE ? OR d.nom LIKE ?
         ORDER BY a.dateDebut DESC`,
        [searchTerm, searchTerm, searchTerm]
      );
      return rows;
    } catch (error) {
      console.error('Erreur lors de la recherche d\'annonces:', error);
      throw error;
    }
  }

  // Créer une nouvelle annonce
  static async creerAnnonce(annonceData) {
    try {
      const { description, dateDebut, dateFin, nomPoste, idDepartement, idProfil } = annonceData;
      
      const [result] = await pool.execute(
        'INSERT INTO Annonce (description, dateDebut, dateFin, nomPoste, idDepartement, idProfil) VALUES (?, ?, ?, ?, ?, ?)',
        [description, dateDebut, dateFin, nomPoste, idDepartement, idProfil]
      );
      
      return await this.obtenirAnnonceParId(result.insertId);
    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce:', error);
      throw error;
    }
  }

  // Mettre à jour une annonce
  static async mettreAJourAnnonce(id, annonceData) {
    try {
      const { description, dateDebut, dateFin, nomPoste, idDepartement, idProfil } = annonceData;
      
      const [result] = await pool.execute(
        'UPDATE Annonce SET description = ?, dateDebut = ?, dateFin = ?, nomPoste = ?, idDepartement = ?, idProfil = ? WHERE id = ?',
        [description, dateDebut, dateFin, nomPoste, idDepartement, idProfil, id]
      );
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      return await this.obtenirAnnonceParId(id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'annonce:', error);
      throw error;
    }
  }

  // Supprimer une annonce
  static async supprimerAnnonce(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM Annonce WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'annonce:', error);
      throw error;
    }
  }

  // Obtenir le nombre de candidats pour une annonce
  static async obtenirNombreCandidats(idAnnonce) {
    try {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as nombreCandidats FROM Candidat WHERE idAnnonce = ?',
        [idAnnonce]
      );
      return rows[0].nombreCandidats;
    } catch (error) {
      console.error('Erreur lors du comptage des candidats:', error);
      throw error;
    }
  }

  // Obtenir les statistiques des annonces
  static async obtenirStatistiques() {
    try {
      const [stats] = await pool.execute(`
        SELECT 
          COUNT(*) as totalAnnonces,
          COUNT(CASE WHEN dateFin >= CURDATE() THEN 1 END) as annoncesActives,
          COUNT(CASE WHEN dateFin < CURDATE() THEN 1 END) as annoncesExpirees,
          AVG(DATEDIFF(dateFin, dateDebut)) as dureeMoyenne
        FROM Annonce
      `);
      
      const [candidatures] = await pool.execute(`
        SELECT COUNT(*) as totalCandidatures
        FROM Candidat c
        INNER JOIN Annonce a ON c.idAnnonce = a.id
      `);
      
      return {
        ...stats[0],
        totalCandidatures: candidatures[0].totalCandidatures
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // Obtenir les annonces avec le nombre de candidats
  static async obtenirAnnoncesAvecCandidats() {
    try {
      const [rows] = await pool.execute(
        `SELECT a.id, a.description, a.dateDebut, a.dateFin, a.nomPoste,
                a.idDepartement, a.idProfil,
                d.nom as nomDepartement,
                p.nom as nomProfil,
                COUNT(c.id) as nombreCandidats
         FROM Annonce a 
         LEFT JOIN Departement d ON a.idDepartement = d.id 
         LEFT JOIN Profil p ON a.idProfil = p.id
         LEFT JOIN Candidat c ON a.id = c.idAnnonce
         GROUP BY a.id, a.description, a.dateDebut, a.dateFin, a.nomPoste, 
                  a.idDepartement, a.idProfil, d.nom, p.nom
         ORDER BY a.dateDebut DESC`
      );
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces avec candidats:', error);
      throw error;
    }
  }
}

module.exports = AnnonceService;