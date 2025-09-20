const { pool } = require('../config/database');

class CritereProfilService {
	// Récupérer tous les CritereProfil
	static async getAll() {
		const [rows] = await pool.execute('SELECT * FROM CritereProfil');
		return rows;
	}

	// Récupérer les associations avec détails des profils et critères
	static async getAllWithDetails() {
		const query = `
			SELECT 
				cp.*,
				p.nom as profilNom,
				c.nom as critereNom
			FROM CritereProfil cp
			LEFT JOIN Profil p ON cp.idProfil = p.id
			LEFT JOIN Critere c ON cp.idCritere = c.id
			ORDER BY p.nom, c.nom
		`;
		const [rows] = await pool.execute(query);
		return rows;
	}

	// Récupérer les associations filtrées
	static async getFiltered(filters = {}) {
		let query = `
			SELECT 
				cp.*,
				p.nom as profilNom,
				c.nom as critereNom
			FROM CritereProfil cp
			LEFT JOIN Profil p ON cp.idProfil = p.id
			LEFT JOIN Critere c ON cp.idCritere = c.id
			WHERE 1=1
		`;
		
		const params = [];
		
		if (filters.idProfil) {
			query += ' AND cp.idProfil = ?';
			params.push(filters.idProfil);
		}
		
		if (filters.idCritere) {
			query += ' AND cp.idCritere = ?';
			params.push(filters.idCritere);
		}
		
		if (filters.estObligatoire !== undefined) {
			query += ' AND cp.estObligatoire = ?';
			params.push(filters.estObligatoire);
		}
		
		if (filters.hasValue) {
			query += ' AND (cp.valeurDouble IS NOT NULL OR cp.valeurVarchar IS NOT NULL OR cp.valeurBool IS NOT NULL)';
		}
		
		if (filters.search) {
			query += ' AND (p.nom LIKE ? OR c.nom LIKE ? OR cp.valeurVarchar LIKE ?)';
			const searchTerm = `%${filters.search}%`;
			params.push(searchTerm, searchTerm, searchTerm);
		}
		
		query += ' ORDER BY p.nom, c.nom';
		
		const [rows] = await pool.execute(query, params);
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