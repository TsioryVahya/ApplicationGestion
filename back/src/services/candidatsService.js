const { pool } = require('../config/database');

class CandidatsService {

    static async obtenirTousLesCandidats() {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM Candidat'
            );
            return rows;
        } catch (error) {
            console.error('Erreur lors de la recuperation des candidats')
            throw error;
        }
    }

      static async ajouterContrat(contratData) {
        try {
            const { idEmploye, dateDebut, nombreMois, typeContrat } = contratData;
            const [result] = await pool.execute(
                'INSERT INTO Contrat (idEmploye, dateDebut, nombreMois, typeContrat) VALUES (?, ?, ?, ?)',
                [idEmploye, dateDebut, nombreMois, typeContrat]
            );
            return { id: result.insertId, ...contratData };
    } catch (error) {
        console.error('Erreur lors de l\'ajout du contrat:', error.message, error.stack);
        throw error;
    }
  }

}

module.exports = CandidatsService;