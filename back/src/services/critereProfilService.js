const { pool } = require('../config/database');

class CritereProfilService {
	// Récupérer tous les CritereProfil
	static async getAll() {
		const [rows] = await pool.execute('SELECT * FROM CritereProfil');
		return rows;
	}

	// Récupérer un CritereProfil par ID
	static async getById(id) {
		const [rows] = await pool.execute('SELECT * FROM CritereProfil WHERE id = ?', [id]);
		return rows[0];
	}

	// Créer un nouveau CritereProfil
	static async create(data) {
		let { idProfil, idCritere, valeurDouble, valeurVarchar, valeurBool, estObligatoire } = data;
		// Gestion des types et valeurs nulles
		valeurDouble = valeurDouble === '' || valeurDouble === undefined ? null : Number(valeurDouble);
		valeurVarchar = valeurVarchar === '' || valeurVarchar === undefined ? null : valeurVarchar;
		if (valeurBool === '' || valeurBool === undefined) valeurBool = null;
		else valeurBool = Boolean(valeurBool);
		if (estObligatoire === '' || estObligatoire === undefined) estObligatoire = true;
		else estObligatoire = Boolean(estObligatoire);
		const [result] = await pool.execute(
			'INSERT INTO CritereProfil (idProfil, idCritere, valeurDouble, valeurVarchar, valeurBool, estObligatoire) VALUES (?, ?, ?, ?, ?, ?)',
			[idProfil, idCritere, valeurDouble, valeurVarchar, valeurBool, estObligatoire]
		);
		return { id: result.insertId, idProfil, idCritere, valeurDouble, valeurVarchar, valeurBool, estObligatoire };
	}

	// Mettre à jour un CritereProfil
	static async update(id, data) {
		let { idProfil, idCritere, valeurDouble, valeurVarchar, valeurBool, estObligatoire } = data;
		valeurDouble = valeurDouble === '' || valeurDouble === undefined ? null : Number(valeurDouble);
		valeurVarchar = valeurVarchar === '' || valeurVarchar === undefined ? null : valeurVarchar;
		if (valeurBool === '' || valeurBool === undefined) valeurBool = null;
		else valeurBool = Boolean(valeurBool);
		if (estObligatoire === '' || estObligatoire === undefined) estObligatoire = true;
		else estObligatoire = Boolean(estObligatoire);
		await pool.execute(
			'UPDATE CritereProfil SET idProfil=?, idCritere=?, valeurDouble=?, valeurVarchar=?, valeurBool=?, estObligatoire=? WHERE id=?',
			[idProfil, idCritere, valeurDouble, valeurVarchar, valeurBool, estObligatoire, id]
		);
		return { id, idProfil, idCritere, valeurDouble, valeurVarchar, valeurBool, estObligatoire };
	}

	// Supprimer un CritereProfil
	static async delete(id) {
		await pool.execute('DELETE FROM CritereProfil WHERE id = ?', [id]);
		return { message: 'CritereProfil supprimé avec succès' };
	}
}

module.exports = CritereProfilService;