const { pool } = require('../config/database');

class EntretienService {
  
  // Récupérer tous les entretiens pour le calendrier
  static async obtenirTousLesEntretiens() {
    try {
      const [rows] = await pool.execute(
        `SELECT e.id, e.dateHeure, e.idCandidat, e.idStatut,
                c.nom as candidatNom, c.prenom as candidatPrenom,
                a.reference as annonceReference,
                s.nom as statutNom
         FROM Entretien e
         LEFT JOIN Candidat c ON e.idCandidat = c.id
         LEFT JOIN Annonce a ON c.idAnnonce = a.id
         LEFT JOIN StatutEntretien s ON e.idStatut = s.id
         ORDER BY e.dateHeure ASC`
      );
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des entretiens:', error);
      throw error;
    }
  }

  // Récupérer un entretien par ID
  static async obtenirEntretienParId(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT e.id, e.dateHeure, e.idCandidat, e.idStatut,
                c.nom as candidatNom, c.prenom as candidatPrenom,
                a.reference as annonceReference,
                s.nom as statutNom
         FROM Entretien e
         LEFT JOIN Candidat c ON e.idCandidat = c.id
         LEFT JOIN Annonce a ON c.idAnnonce = a.id
         LEFT JOIN StatutEntretien s ON e.idStatut = s.id
         WHERE e.id = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'entretien:', error);
      throw error;
    }
  }

  // Créer un nouvel entretien
  static async creerEntretien(entretienData) {
    try {
      const { idCandidat, dateHeure, idStatut } = entretienData;
      
      const [result] = await pool.execute(
        'INSERT INTO Entretien (idCandidat, dateHeure, idStatut) VALUES (?, ?, ?)',
        [idCandidat, dateHeure, idStatut || 1] // Statut par défaut : 1 (En attente)
      );
      
      return await this.obtenirEntretienParId(result.insertId);
    } catch (error) {
      console.error('Erreur lors de la création de l\'entretien:', error);
      throw error;
    }
  }

  // Mettre à jour un entretien
  static async mettreAJourEntretien(id, entretienData) {
    try {
      const { idCandidat, dateHeure, idStatut } = entretienData;
      
      const [result] = await pool.execute(
        'UPDATE Entretien SET idCandidat = ?, dateHeure = ?, idStatut = ? WHERE id = ?',
        [idCandidat, dateHeure, idStatut, id]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Entretien non trouvé');
      }
      
      return await this.obtenirEntretienParId(id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'entretien:', error);
      throw error;
    }
  }

  // Supprimer un entretien
  static async supprimerEntretien(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM Entretien WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'entretien:', error);
      throw error;
    }
  }

  // Récupérer les candidats disponibles pour planifier un entretien
  static async obtenirCandidatsDisponibles() {
    try {
      const [rows] = await pool.execute(
        `SELECT c.id, c.nom, c.prenom, a.reference as annonceReference
         FROM Candidat c
         LEFT JOIN Annonce a ON c.idAnnonce = a.id
         WHERE c.id NOT IN (
           SELECT DISTINCT idCandidat FROM Entretien WHERE idCandidat IS NOT NULL
         )
         ORDER BY c.nom, c.prenom`
      );
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des candidats disponibles:', error);
      throw error;
    }
  }

  // Récupérer tous les candidats (pour modification d'entretien)
  static async obtenirTousLesCandidats() {
    try {
      const [rows] = await pool.execute(
        `SELECT c.id, c.nom, c.prenom, a.reference as annonceReference
         FROM Candidat c
         LEFT JOIN Annonce a ON c.idAnnonce = a.id
         ORDER BY c.nom, c.prenom`
      );
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des candidats:', error);
      throw error;
    }
  }

  // Récupérer les statuts d'entretien
  static async obtenirStatutsEntretien() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, nom FROM StatutEntretien ORDER BY id'
      );
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des statuts:', error);
      throw error;
    }
  }

  // Récupérer les candidats éligibles pour entretien (QCM terminé avec succès)
  static async obtenirCandidatsEligiblesEntretien() {
    try {
      const query = `
        SELECT DISTINCT 
          c.id,
          c.nom,
          c.prenom,
          c.dateNaissance,
          c.adresse,
          c.cv,
          c.idAnnonce,
          a.reference as annonceReference,
          a.titre as annonceTitle,
          sc.nom as statutNom,
          AVG(qr.pointsObtenus) as moyenneQcm,
          COUNT(qr.id) as nombreReponses
        FROM Candidat c
        INNER JOIN StatutCandidat sc ON c.idStatut = sc.id
        INNER JOIN Annonce a ON c.idAnnonce = a.id
        INNER JOIN QcmReponse qr ON c.id = qr.idCandidat
        WHERE sc.nom = 'QCM terminé'
        GROUP BY c.id, c.nom, c.prenom, c.dateNaissance, c.adresse, c.cv, c.idAnnonce, a.reference, a.titre, sc.nom
        HAVING moyenneQcm >= 10
        ORDER BY moyenneQcm DESC
      `;
      
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      console.error('Erreur dans obtenirCandidatsEligiblesEntretien:', error);
      throw error;
    }
  }

}

module.exports = EntretienService;
