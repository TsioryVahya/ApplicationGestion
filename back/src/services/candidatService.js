const { pool } = require('../config/database');

class CandidatService {

  // Obtenir tous les candidats
  static async obtenirTousLesCandidats() {
    try {
      const [rows] = await pool.execute(
        `SELECT c.id, c.nom, c.prenom, c.dateNaissance, c.adresse, 
                c.cv, c.idAnnonce, c.idStatut,
                a.reference as annonceReference,
                s.nom as statutNom
         FROM Candidat c
         LEFT JOIN Annonce a ON c.idAnnonce = a.id
         LEFT JOIN StatutCandidat s ON c.idStatut = s.id
         ORDER BY c.id DESC`
      );
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des candidats:', error);
      throw error;
    }
  }

  // Obtenir les candidats d'une annonce spécifique
  static async obtenirCandidatsParAnnonce(idAnnonce) {
    try {
      const [rows] = await pool.execute(
        `SELECT c.id, c.nom, c.prenom, c.dateNaissance, c.adresse, 
                c.cv, c.idAnnonce, c.idStatut,
                a.reference as annonceReference,
                s.nom as statutNom
         FROM Candidat c
         LEFT JOIN Annonce a ON c.idAnnonce = a.id
         LEFT JOIN StatutCandidat s ON c.idStatut = s.id
         WHERE c.idAnnonce = ?
         ORDER BY c.id DESC`,
        [idAnnonce]
      );
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des candidats de l\'annonce:', error);
      throw error;
    }
  }

  // Obtenir un candidat par ID
  static async obtenirCandidatParId(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT c.id, c.nom, c.prenom, c.dateNaissance, c.adresse, 
                c.cv, c.idAnnonce, c.idStatut,
                a.reference as annonceReference,
                s.nom as statutNom
         FROM Candidat c
         LEFT JOIN Annonce a ON c.idAnnonce = a.id
         LEFT JOIN StatutCandidat s ON c.idStatut = s.id
         WHERE c.id = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Erreur lors de la récupération du candidat:', error);
      throw error;
    }
  }

  // Créer un nouveau candidat
  static async creerCandidat(candidatData) {
    try {
      const { nom, prenom, dateNaissance, adresse, cv, idAnnonce } = candidatData;
      
      // Statut par défaut : "En attente" (ID = 1)
      const idStatutDefaut = 1;
      
      const [result] = await pool.execute(
        `INSERT INTO Candidat (nom, prenom, dateNaissance, adresse, cv, idAnnonce, idStatut)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nom, prenom, dateNaissance, adresse, cv, idAnnonce, idStatutDefaut]
      );

      // Récupérer le candidat créé avec toutes les informations
      return await this.obtenirCandidatParId(result.insertId);
    } catch (error) {
      console.error('Erreur lors de la création du candidat:', error);
      throw error;
    }
  }

  // Mettre à jour le statut d'un candidat
  static async mettreAJourStatutCandidat(id, idStatut) {
    try {
      const [result] = await pool.execute(
        'UPDATE Candidat SET idStatut = ? WHERE id = ?',
        [idStatut, id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return await this.obtenirCandidatParId(id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut du candidat:', error);
      throw error;
    }
  }

  // Supprimer un candidat
  static async supprimerCandidat(id) {
    try {
      const [result] = await pool.execute('DELETE FROM Candidat WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur lors de la suppression du candidat:', error);
      throw error;
    }
  }

  // Obtenir les statistiques des candidats
  static async obtenirStatistiques() {
    try {
      const [stats] = await pool.execute(`
        SELECT 
          COUNT(*) as totalCandidats,
          COUNT(CASE WHEN s.nom = 'En attente' THEN 1 END) as enAttente,
          COUNT(CASE WHEN s.nom = 'Accepté' THEN 1 END) as acceptes,
          COUNT(CASE WHEN s.nom = 'Refusé' THEN 1 END) as refuses,
          COUNT(CASE WHEN s.nom = 'En cours d\'évaluation' THEN 1 END) as enEvaluation
        FROM Candidat c
        LEFT JOIN StatutCandidat s ON c.idStatut = s.id
      `);
      
      const [candidatsParAnnonce] = await pool.execute(`
        SELECT a.reference, COUNT(c.id) as nombreCandidats
        FROM Annonce a
        LEFT JOIN Candidat c ON a.id = c.idAnnonce
        GROUP BY a.id, a.reference
        ORDER BY nombreCandidats DESC
        LIMIT 5
      `);
      
      return {
        ...stats[0],
        candidatsParAnnonce
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // Rechercher des candidats
  static async rechercherCandidats(terme) {
    try {
      const searchTerm = `%${terme}%`;
      const [rows] = await pool.execute(
        `SELECT c.id, c.nom, c.prenom, c.adresse, 
                c.dateNaissance, c.cv, c.idAnnonce, c.idStatut,
                a.reference as annonceReference,
                s.nom as statutNom
         FROM Candidat c
         LEFT JOIN Annonce a ON c.idAnnonce = a.id
         LEFT JOIN StatutCandidat s ON c.idStatut = s.id
         WHERE c.nom LIKE ? OR c.prenom LIKE ? OR c.cv LIKE ? OR a.reference LIKE ?
         ORDER BY c.id DESC`,
        [searchTerm, searchTerm, searchTerm, searchTerm]
      );
      return rows;
    } catch (error) {
      console.error('Erreur lors de la recherche de candidats:', error);
      throw error;
    }
  }
}

module.exports = CandidatService;
