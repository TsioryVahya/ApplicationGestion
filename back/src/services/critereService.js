const { pool } = require('../config/database');

class CritereService {
  // Obtenir tous les critères
  static async obtenirTousLesCriteres() {
    const query = 'SELECT * FROM Critere ORDER BY nom';
    const [rows] = await pool.execute(query);
    return rows;
  }

  // Obtenir un critère par ID
  static async obtenirCritereParId(id) {
    const query = 'SELECT * FROM Critere WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  // Créer un nouveau critère
  static async creerCritere(critereData) {
    const { nom, description } = critereData;
    const query = 'INSERT INTO Critere (nom, description) VALUES (?, ?)';
    const [result] = await pool.execute(query, [nom, description || null]);
    
    // Retourner le critère créé
    return await this.obtenirCritereParId(result.insertId);
  }

  // Mettre à jour un critère
  static async mettreAJourCritere(id, critereData) {
    const { nom, description } = critereData;
    const query = 'UPDATE Critere SET nom = ?, description = ? WHERE id = ?';
    const [result] = await pool.execute(query, [nom, description || null, id]);
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return await this.obtenirCritereParId(id);
  }

  // Supprimer un critère
  static async supprimerCritere(id) {
    const query = 'DELETE FROM Critere WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = CritereService;
