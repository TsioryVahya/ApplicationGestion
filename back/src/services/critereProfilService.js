// const { pool } = require('../config/database');

// class CritereProfilService {

//     static async getAllCritereProfils() {
//         const [rows] = await pool.execute('SELECT * FROM CritereProfil');
//         return rows;
//     }

//     static async getCritereProfilById(id) {
//         const [rows] = await pool.execute('SELECT * FROM CritereProfil WHERE id = ?', [id]);
//         return rows[0];
//     }

//     static async createCritereProfil(idProfil, idCritere ,valeurDouble, valeurVarchar, valeurBool, estObli) {
//         const [ result ] = await pool.execute('INSERT INTO CritereProfil (idProfil, idCritere ,valeurDouble, valeurVarchar, valeurBool, estObli) VALUES (? , ?, ?, ?, ?, ?)',[idProfil, idCritere ,valeurDouble, valeurVarchar, valeurBool, estObli]);
//         return { id: result.insertId, nom, idProfil, idCritere ,valeurDouble, valeurVarchar, valeurBool, estObli };
//     }

//     static async updateCritereProfil(id, idProfil, idCritere ,valeurDouble, valeurVarchar, valeurBool, estObli) {
//         await pool.execute("UPDATE CritereProfil SET idProfil = ?, idCritere = ?, valeurDouble = ?, valeurVarchar = ?, valeurBool = ?, estObli = ? WHERE id = ? ", [idProfil, idCritere ,valeurDouble, valeurVarchar, valeurBool, estObli]);
//         return { idProfil, idCritere ,valeurDouble, valeurVarchar, valeurBool, estObli };
//     }

//     static async deleteCritereProfil(id) {
//         await pool.execute('DELETE FROM CritereProfil WHERE id = ?', [id]);
//         return { message: "CritereProfil supprime avec succes" };
//     }
// }

// module.exports = CritereProfilService;