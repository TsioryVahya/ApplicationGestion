const db = require('../config/database');

class ProfilService {
  // Obtenir tous les profils
  static async obtenirTousLesProfils() {
    const query = 'SELECT * FROM Profil ORDER BY nom';
    const [rows] = await db.execute(query);
    return rows;
  }

  // Obtenir un profil par ID
  static async obtenirProfilParId(id) {
    const query = 'SELECT * FROM Profil WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Créer un nouveau profil
  static async creerProfil(profilData) {
    const { nom, description } = profilData;
    const query = 'INSERT INTO Profil (nom, description) VALUES (?, ?)';
    const [result] = await db.execute(query, [nom, description || null]);
    
    // Retourner le profil créé
    return await this.obtenirProfilParId(result.insertId);
  }

  // Mettre à jour un profil
  static async mettreAJourProfil(id, profilData) {
    const { nom, description } = profilData;
    const query = 'UPDATE Profil SET nom = ?, description = ? WHERE id = ?';
    const [result] = await db.execute(query, [nom, description || null, id]);
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.obtenirProfilParId(id);
  }

  // Supprimer un profil
  static async supprimerProfil(id) {
    const query = 'DELETE FROM Profil WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Obtenir les critères d'un profil
  static async obtenirCriteresProfil(profilId) {
    const query = `
      SELECT cp.*, c.nom as nomCritere, c.description as descriptionCritere
      FROM CritereProfil cp
      JOIN Critere c ON cp.idCritere = c.id
      WHERE cp.idProfil = ?
      ORDER BY c.nom
    `;
    const [rows] = await db.execute(query, [profilId]);
    return rows;
  }
}

module.exports = ProfilService;
