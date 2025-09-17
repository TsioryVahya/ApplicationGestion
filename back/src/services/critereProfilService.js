const db = require('../config/database');

class CritereProfilService {
  // Obtenir tous les critères-profils avec détails
  static async obtenirTousCriteresProfils() {
    const query = `
      SELECT cp.*, p.nom as nomProfil, c.nom as nomCritere, c.description as descriptionCritere
      FROM CritereProfil cp
      JOIN Profil p ON cp.idProfil = p.id
      JOIN Critere c ON cp.idCritere = c.id
      ORDER BY p.nom, c.nom
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  // Obtenir les critères d'un profil spécifique
  static async obtenirCriteresParProfil(profilId) {
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

  // Obtenir une association critère-profil par ID
  static async obtenirCritereProfilParId(id) {
    const query = `
      SELECT cp.*, p.nom as nomProfil, c.nom as nomCritere, c.description as descriptionCritere
      FROM CritereProfil cp
      JOIN Profil p ON cp.idProfil = p.id
      JOIN Critere c ON cp.idCritere = c.id
      WHERE cp.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Créer une nouvelle association critère-profil
  static async creerCritereProfil(critereProfilData) {
    const { idProfil, idCritere, valeur, estObligatoire } = critereProfilData;
    const query = 'INSERT INTO CritereProfil (idProfil, idCritere, valeur, estObligatoire) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(query, [idProfil, idCritere, valeur, estObligatoire]);
    
    // Retourner l'association créée avec les détails
    return await this.obtenirCritereProfilParId(result.insertId);
  }

  // Mettre à jour une association critère-profil
  static async mettreAJourCritereProfil(id, critereProfilData) {
    const { valeur, estObligatoire } = critereProfilData;
    const query = 'UPDATE CritereProfil SET valeur = ?, estObligatoire = ? WHERE id = ?';
    const [result] = await db.execute(query, [valeur, estObligatoire, id]);
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.obtenirCritereProfilParId(id);
  }

  // Supprimer une association critère-profil
  static async supprimerCritereProfil(id) {
    const query = 'DELETE FROM CritereProfil WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Vérifier si une association existe déjà
  static async associationExiste(idProfil, idCritere) {
    const query = 'SELECT id FROM CritereProfil WHERE idProfil = ? AND idCritere = ?';
    const [rows] = await db.execute(query, [idProfil, idCritere]);
    return rows.length > 0;
  }
}

module.exports = CritereProfilService;
