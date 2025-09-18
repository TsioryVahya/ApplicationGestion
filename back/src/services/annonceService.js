const { pool } = require('../config/database');

class AnnonceService {

  static buildReference(id) {
    return `ANN-${String(id).padStart(4,'0')}`;
  }

  static attachReference(rows) {
    return rows.map(r => ({
      ...r,
      reference: r.reference || AnnonceService.buildReference(r.id)
    }));
  }

  // Récupérer toutes les annonces
  static async obtenirTousLesAnnonces() {
    try {
      const [rows] = await pool.execute(
        `SELECT a.id,
                a.description,
                a.dateDebut,
                a.dateFin,
                a.idDepartement,
                a.idProfil,
                d.nom AS nomDepartement,
                p.nom AS nomProfil
         FROM Annonce a
         LEFT JOIN Departement d ON a.idDepartement = d.id
         LEFT JOIN Profil p ON a.idProfil = p.id
         ORDER BY a.dateDebut DESC`
      );
      return this.attachReference(rows);
    } catch (error) {
      console.error('Erreur SQL obtenirTousLesAnnonces:', error.message);
      throw error;
    }
  }

  // Récupérer une annonce par ID
  static async obtenirAnnonceParId(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT a.id,
                a.description,
                a.dateDebut,
                a.dateFin,
                a.idDepartement,
                a.idProfil,
                d.nom as nomDepartement,
                p.nom as nomProfil
         FROM Annonce a 
         LEFT JOIN Departement d ON a.idDepartement = d.id 
         LEFT JOIN Profil p ON a.idProfil = p.id
         WHERE a.id = ?`,
        [id]
      );
      const annonce = rows[0];
      if (!annonce) return null;
      return { ...annonce, reference: this.buildReference(annonce.id) };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'annonce:', error);
      throw error;
    }
  }

  // Récupérer les annonces actives (date fin >= aujourd'hui)
  static async obtenirAnnoncesActives() {
    try {
      const [rows] = await pool.execute(
        `SELECT a.id,
                a.description,
                a.dateDebut,
                a.dateFin,
                a.idDepartement,
                a.idProfil,
                d.nom AS nomDepartement,
                p.nom AS nomProfil
         FROM Annonce a
         LEFT JOIN Departement d ON a.idDepartement = d.id
         LEFT JOIN Profil p ON a.idProfil = p.id
         WHERE a.dateFin >= CURDATE()
         ORDER BY a.dateDebut DESC`
      );
      return this.attachReference(rows);
    } catch (error) {
      console.error('Erreur SQL obtenirAnnoncesActives:', error.message);
      throw error;
    }
  }

  // Récupérer les annonces par département
  static async obtenirAnnoncesParDepartement(idDepartement) {
    try {
      const [rows] = await pool.execute(
        `SELECT a.id,
                a.description,
                a.dateDebut,
                a.dateFin,
                a.idDepartement,
                a.idProfil,
                d.nom as nomDepartement,
                p.nom as nomProfil
         FROM Annonce a 
         LEFT JOIN Departement d ON a.idDepartement = d.id 
         LEFT JOIN Profil p ON a.idProfil = p.id
         WHERE a.idDepartement = ?
         ORDER BY a.dateDebut DESC`,
        [idDepartement]
      );
      return this.attachReference(rows);
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
        `SELECT a.id,
                a.description,
                a.dateDebut,
                a.dateFin,
                a.idDepartement,
                a.idProfil,
                d.nom as nomDepartement,
                p.nom as nomProfil
         FROM Annonce a 
         LEFT JOIN Departement d ON a.idDepartement = d.id 
         LEFT JOIN Profil p ON a.idProfil = p.id
         WHERE a.description LIKE ? OR d.nom LIKE ?
         ORDER BY a.dateDebut DESC`,
        [searchTerm, searchTerm]
      );
      return this.attachReference(rows);
    } catch (error) {
      console.error('Erreur lors de la recherche d\'annonces:', error);
      throw error;
    }
  }

  // Créer une nouvelle annonce
  static async creerAnnonce(annonceData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const { description, dateDebut, dateFin, reference, nomPoste, idDepartement, idProfil, criteres } = annonceData;
      const finalDescription = description || nomPoste || reference || 'Annonce';

      const [result] = await connection.execute(
        'INSERT INTO Annonce (description, dateDebut, dateFin, idDepartement, idProfil) VALUES (?, ?, ?, ?, ?)',
        [finalDescription, dateDebut, dateFin, idDepartement, idProfil]
      );
      const annonceId = result.insertId;

      // Sauvegarder les critères si fournis
      if (criteres && criteres.length > 0) {
        for (const critere of criteres) {
            await connection.execute(
              'INSERT INTO CritereProfil (idProfil, idCritere, valeurDouble, valeurVarchar, valeurBool, estObligatoire) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE valeurDouble = VALUES(valeurDouble), valeurVarchar = VALUES(valeurVarchar), valeurBool = VALUES(valeurBool)',
              [idProfil, critere.idCritere, critere.valeurDouble || null, critere.valeurVarchar || null, critere.valeurBool || null, critere.estObligatoire || false]
            );
        }
      }

      await connection.commit();
      return await this.obtenirAnnonceParId(annonceId);
    } catch (error) {
      await connection.rollback();
      console.error('Erreur lors de la création de l\'annonce:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Mettre à jour une annonce
  static async mettreAJourAnnonce(id, annonceData) {
    try {
      const { description, dateDebut, dateFin, reference, nomPoste, idDepartement, idProfil } = annonceData;
      const finalDescription = description || nomPoste || reference;
      const [result] = await pool.execute(
        'UPDATE Annonce SET description = ?, dateDebut = ?, dateFin = ?, idDepartement = ?, idProfil = ? WHERE id = ?',
        [finalDescription, dateDebut, dateFin, idDepartement, idProfil, id]
      );
      if (result.affectedRows === 0) return null;
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
        `SELECT a.id,
                a.description,
                a.dateDebut,
                a.dateFin,
                a.idDepartement,
                a.idProfil,
                d.nom as nomDepartement,
                p.nom as nomProfil,
                COUNT(c.id) as nombreCandidats
         FROM Annonce a 
         LEFT JOIN Departement d ON a.idDepartement = d.id 
         LEFT JOIN Profil p ON a.idProfil = p.id
         LEFT JOIN Candidat c ON a.id = c.idAnnonce
         GROUP BY a.id, a.description, a.dateDebut, a.dateFin,
                  a.idDepartement, a.idProfil, d.nom, p.nom
         ORDER BY a.dateDebut DESC`
      );
      return this.attachReference(rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces avec candidats:', error);
      throw error;
    }
  }

  // Obtenir tous les profils
  static async obtenirProfils() {
    try {
      const [rows] = await pool.execute('SELECT id, nom FROM Profil ORDER BY nom');
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des profils:', error);
      throw error;
    }
  }

  // Obtenir les critères d'un profil
  static async obtenirCriteresProfil(idProfil) {
    try {
      const [rows] = await pool.execute(
        `SELECT cp.id, cp.idProfil, cp.idCritere, cp.valeurDouble, cp.valeurVarchar, 
                cp.valeurBool, cp.estObligatoire, c.nom
         FROM CritereProfil cp
         INNER JOIN Critere c ON cp.idCritere = c.id
         WHERE cp.idProfil = ?
         ORDER BY cp.estObligatoire DESC, c.nom`,
        [idProfil]
      );
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des critères du profil:', error);
      throw error;
    }
  }

  // Obtenir tous les critères disponibles
  static async obtenirTousLesCriteres() {
    try {
      const [rows] = await pool.execute('SELECT id as idCritere, nom FROM Critere ORDER BY nom');
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des critères:', error);
      throw error;
    }
  }

  // Obtenir tous les départements
  static async obtenirDepartements() {
    try {
      const [rows] = await pool.execute('SELECT id, nom FROM Departement ORDER BY nom');
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des départements:', error);
      throw error;
    }
  }
}

module.exports = AnnonceService;