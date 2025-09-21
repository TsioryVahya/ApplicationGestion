const { pool } = require('../config/database');

class NotificationCandidatController {
  
  // Récupérer les notifications d'un candidat (version simple sans auth)
  static async obtenirNotificationsSimple(req, res) {
    try {
      // Récupérer toutes les notifications pour le destinataire ID 1
      const [notifications] = await pool.execute(`
        SELECT 
          n.*,
          tn.nom as typeNotification,
          tn.icone,
          tn.couleur,
          a.reference as annonceReference,
          qt.nom as qcmTitre
        FROM Notification n
        JOIN TypeNotification tn ON n.idTypeNotification = tn.id
        LEFT JOIN Annonce a ON n.idAnnonce = a.id
        LEFT JOIN QcmTest qt ON n.idQcmTest = qt.id
        WHERE n.idDestinataire = 1
        ORDER BY n.dateCreation DESC
      `);
      
      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Marquer une notification comme lue (version simple sans auth)
  static async marquerCommeLueSimple(req, res) {
    try {
      const { id } = req.params;
      
      // Marquer comme lue
      await pool.execute(`
        UPDATE Notification SET lue = TRUE WHERE id = ?
      `, [id]);
      
      res.json({
        success: true,
        message: 'Notification marquée comme lue'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Debug - Voir toutes les notifications et comptes candidats
  static async debugNotifications(req, res) {
    try {
      // Récupérer toutes les notifications
      const [notifications] = await pool.execute(`
        SELECT 
          n.*,
          tn.nom as typeNotification,
          tn.icone,
          tn.couleur,
          a.reference as annonceReference,
          qt.nom as qcmTitre
        FROM Notification n
        JOIN TypeNotification tn ON n.idTypeNotification = tn.id
        LEFT JOIN Annonce a ON n.idAnnonce = a.id
        LEFT JOIN QcmTest qt ON n.idQcmTest = qt.id
        ORDER BY n.dateCreation DESC
      `);
      
      // Récupérer tous les comptes candidats
      const [comptes] = await pool.execute('SELECT * FROM CompteCandidat');
      
      res.json({
        success: true,
        data: {
          notifications: notifications,
          comptes: comptes
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = NotificationCandidatController;
