// const CritereProfilService = require('../services/critereProfilService');

// class CritereProfilController {

//     static async getAll(req, res) {
//         try {
//             const critereProfils = await CritereProfilService.getAllCritereProfils();
//             res.status(200).json({
//                 success: true,
//                 message: "Liste des criteres profils recuperee avec succes",
//                 data: critereProfils,
//                 total: critereProfils.length
//             });
//         } catch (error) {
//             console.error('Erreur lors de la recuperation des criteres des profils', error);
//             res.status(500).json({
//                 success: false, 
//                 message: "Erreur interne du serveur",
//                 error: error.message
//             });
//         }
//     }

//     static async getById(req, res) {
//         try {
//             const { id } = req.params;
//             const critereProfil = await CritereProfilService.getCritereProfilById(id);
//             if (!critereProfil) {
//                 return res.status(404).json({
//                     success: false,
//                     message: "Critere Profil non trouve"
//                 });
//             }
//             res.status(200).json({
//                 success: true,
//                 message:"Critere Profil recupere avec succes",
//                 data: critereProfil
//             });
//         } catch (error) {
//             console.error("Erreur lors de la recuperation du critere profil:", error);
//             res.status(500).json({
//                 success: false,
//                 message: "Erreur interne du serveur",
//                 error: error.message0
//             });
//         }
//     }


//     static async create(req, res) {
//         try {
//             const { valeurDouble } = req.body;
//             const { valeurVarchar } = req.body;
//             const { valeurBool } = req.body;
//             const { estObli } = req.body;

//             const newCritereProfil = await CritereProfilService.createCritereProfil(valeurDouble.trim, valeurVarchar.trim, valeurBool, estObli);
//             res.status(201).json({
//                 success: true,
//                 message: "Critere Profil avec succes",
//                 data: newCritereProfil
//             });
//         } catch (error) {
//             console.error('Erreur lors de la creation du critere des profils', error);
//             res.status(500).json({
//                 success: false,
//                 message: "Erreur interne du serveur",
//                 error: error.message
//             });
//         }
//     }

//     static async update(req, res) {
//         try {
//             const { id } = req.params;
//             const { idProfil } = req.params;
//             const { idCritere } = req.params;
//             const { valeurDouble } = req.body;
//             const { valeurVarchar } = req.body;
//             const { valeurBool } = req.body;
//             const { estObli } = req.body;

//             const existingCritereProfil = await CritereProfilService.getCritereProfilById(id);
//             if (!existingCritereProfil) {
//                 return res.status(404).json({
//                     success:false,
//                     message: "Critere du profil non trouve"
//                 });
//             }

//             const updateCritereProfil = await CritereProfilService.updateCritereProfil(id)


//         } catch (error) {
            
//         }
//     }
// }