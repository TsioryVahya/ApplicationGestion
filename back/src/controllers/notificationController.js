const { pool } = require('../config/database');

const NotificationController = {
  // Envoyer un test QCM à un candidat (créer une notification)
  envoyerQcm: async (req, res) => {
    try {
      const { idCandidat, idAnnonce, idQcmTest, dureeValidite = 72 } = req.body;

      // Validation des paramètres
      if (!idCandidat || !idAnnonce || !idQcmTest) {
        return res.status(400).json({
          success: false,
          message: 'Paramètres manquants: idCandidat, idAnnonce et idQcmTest sont requis'
        });
      }

      // Récupérer les informations du candidat et son compte
      const [candidat] = await pool.execute(`
        SELECT c.*, cc.id as idCompteCandidat, cc.email, a.reference as annonceReference
        FROM Candidat c
        LEFT JOIN CompteCandidat cc ON c.idCompteCandidat = cc.id
        LEFT JOIN Annonce a ON a.id = ?
        WHERE c.id = ?
      `, [idAnnonce, idCandidat]);

      if (candidat.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Candidat non trouvé'
        });
      }

      // Récupérer les informations du test QCM
      const [qcmTest] = await pool.execute(`
        SELECT * FROM QcmTest WHERE id = ?
      `, [idQcmTest]);

      if (qcmTest.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Test QCM non trouvé'
        });
      }

      const candidatInfo = candidat[0];
      const testInfo = qcmTest[0];

      // Générer un token unique pour le test
      const token = require('crypto').randomBytes(32).toString('hex');
      const dateExpiration = new Date();
      dateExpiration.setHours(dateExpiration.getHours() + dureeValidite);

      // Créer le lien du test
      const lienTest = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/test/${token}`;

      // Créer la notification pour le candidat (si il a un compte)
      let idNotification = null;
      if (candidatInfo.idCompteCandidat) {
        const [notifResult] = await pool.execute(`
          INSERT INTO Notification (
            titre, message, idTypeNotification, idDestinataire, 
            idAnnonce, idQcmTest, dateExpiration, donnees
          ) VALUES (?, ?, 1, ?, ?, ?, ?, ?)
        `, [
          `Test QCM - ${candidatInfo.annonceReference}`,
          `Vous êtes invité(e) à passer le test "${testInfo.nom}" pour l'annonce ${candidatInfo.annonceReference}. Date limite: ${dateExpiration.toLocaleDateString('fr-FR')}`,
          candidatInfo.idCompteCandidat,
          idAnnonce,
          idQcmTest,
          dateExpiration,
          JSON.stringify({ token, lienTest, dureeValidite })
        ]);
        idNotification = notifResult.insertId;
      }

      // Enregistrer l'invitation QCM
      const [invitationResult] = await pool.execute(`
        INSERT INTO InvitationQCM (
          idCandidat, idAnnonce, idQcmTest, token, 
          dateEnvoi, dateExpiration, statut, idNotification
        ) VALUES (?, ?, ?, ?, NOW(), ?, 'envoyee', ?)
      `, [idCandidat, idAnnonce, idQcmTest, token, dateExpiration, idNotification]);

      console.log(`🔔 Notification QCM créée pour ${candidatInfo.prenom} ${candidatInfo.nom}`);

      res.json({
        success: true,
        message: `Test QCM envoyé avec succès à ${candidatInfo.prenom} ${candidatInfo.nom}`,
        data: {
          idInvitation: invitationResult.insertId,
          idNotification: idNotification,
          lienTest: lienTest,
          dateExpiration: dateExpiration,
          candidat: {
            nom: candidatInfo.nom,
            prenom: candidatInfo.prenom,
            email: candidatInfo.email
          },
          test: {
            nom: testInfo.nom,
            id: testInfo.id
          }
        }
      });

    } catch (error) {
      console.error('Erreur envoi QCM:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi du test QCM',
        error: error.message
      });
    }
  },

  // Obtenir l'historique des invitations QCM (admin)
  obtenirHistorique: async (req, res) => {
    try {
      const [invitations] = await pool.execute(`
        SELECT 
          iq.*,
          c.nom as candidatNom,
          c.prenom as candidatPrenom,
          cc.email as candidatEmail,
          a.reference as annonceReference,
          qt.nom as testNom
        FROM InvitationQCM iq
        LEFT JOIN Candidat c ON iq.idCandidat = c.id
        LEFT JOIN CompteCandidat cc ON c.idCompteCandidat = cc.id
        LEFT JOIN Annonce a ON iq.idAnnonce = a.id
        LEFT JOIN QcmTest qt ON iq.idQcmTest = qt.id
        ORDER BY iq.dateEnvoi DESC
      `);

      res.json({
        success: true,
        data: invitations
      });

    } catch (error) {
      console.error('Erreur récupération historique:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'historique',
        error: error.message
      });
    }
  },

  // Obtenir les notifications d'un candidat (côté client)
  obtenirNotificationsCandidat: async (req, res) => {
    try {
      const idCompteCandidat = req.user.id; // Depuis le token JWT

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
        WHERE n.idDestinataire = ?
        ORDER BY n.dateCreation DESC
      `, [idCompteCandidat]);

      res.json({
        success: true,
        data: notifications
      });

    } catch (error) {
      console.error('Erreur récupération notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des notifications',
        error: error.message
      });
    }
  },

  // Marquer une notification comme lue
  marquerCommeLue: async (req, res) => {
    try {
      const { id } = req.params;
      const idCompteCandidat = req.user.id;

      // Vérifier que la notification appartient au candidat
      const [notification] = await pool.execute(`
        SELECT * FROM Notification WHERE id = ? AND idDestinataire = ?
      `, [id, idCompteCandidat]);

      if (notification.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Notification non trouvée'
        });
      }

      // Marquer comme lue
      await pool.execute(`
        UPDATE Notification SET lue = TRUE WHERE id = ?
      `, [id]);

      res.json({
        success: true,
        message: 'Notification marquée comme lue'
      });

    } catch (error) {
      console.error('Erreur marquage notification:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du marquage de la notification',
        error: error.message
      });
    }
  }
};

module.exports = NotificationController;
