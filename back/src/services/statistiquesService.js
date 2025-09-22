const { pool } = require('../config/database');

class StatistiquesService {
  
  // Récupérer les statistiques générales
  static async obtenirStatistiquesGenerales() {
    try {
      // Nombre total de candidats
      const [candidats] = await pool.execute('SELECT COUNT(*) as total FROM Candidat');
      
      // Nombre total d'annonces (pas de colonne statut dans la table)
      const [annonces] = await pool.execute('SELECT COUNT(*) as total FROM Annonce');
      
      // Nombre d'entretiens programmés (statut En attente ou Confirmé)
      const [entretiens] = await pool.execute(`
        SELECT COUNT(*) as total 
        FROM Entretien e 
        LEFT JOIN StatutEntretien se ON e.idStatut = se.id 
        WHERE se.nom IN ('En attente', 'Confirmé') OR e.idStatut IN (1, 2)
      `);
      
      // Nombre de contrats actifs
      const [contrats] = await pool.execute('SELECT COUNT(*) as total FROM Contrat');
      
      // Nombre de tests QCM (pas de colonne dateEnvoi dans QcmTest)
      const [qcmEnvoyes] = await pool.execute('SELECT COUNT(*) as total FROM QcmTest');
      
      return {
        totalCandidats: candidats[0].total,
        totalAnnonces: annonces[0].total,
        entretiensProgammes: entretiens[0].total,
        totalContrats: contrats[0].total,
        qcmEnvoyesCeMois: qcmEnvoyes[0].total
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques générales:', error);
      throw error;
    }
  }

  // Récupérer les données pour les graphiques
  static async obtenirDonneesGraphiques() {
    try {
      // Candidatures par mois (6 derniers mois)
      const [candidaturesParMois] = await pool.execute(`
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as mois,
          COUNT(*) as nombre
        FROM Candidat 
        WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY mois ASC
      `);
      
      // Entretiens par statut
      const [entretiensParStatut] = await pool.execute(`
        SELECT 
          COALESCE(se.nom, 'Non défini') as statut,
          COUNT(*) as nombre
        FROM Entretien e
        LEFT JOIN StatutEntretien se ON e.idStatut = se.id
        GROUP BY se.nom
      `);
      
      // Résultats d'entretiens par note (depuis la table Entretien avec Resultat)
      const [resultatsQcm] = await pool.execute(`
        SELECT 
          r.note,
          COUNT(*) as nombre
        FROM Entretien e
        JOIN Resultat r ON e.idResultat = r.id
        WHERE r.note IS NOT NULL
        GROUP BY r.note
      `);
      
      return {
        candidaturesParMois: candidaturesParMois,
        entretiensParStatut: entretiensParStatut,
        resultatsQcm: resultatsQcm
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des données graphiques:', error);
      throw error;
    }
  }

  // Récupérer les statistiques par mois
  static async obtenirStatistiquesParMois() {
    try {
      const [stats] = await pool.execute(`
        SELECT 
          DATE_FORMAT(c.created_at, '%Y-%m') as mois,
          COUNT(DISTINCT c.id) as candidatures,
          COUNT(DISTINCT e.id) as entretiens,
          COUNT(DISTINCT ct.id) as contrats
        FROM Candidat c
        LEFT JOIN Entretien e ON c.id = e.idCandidat 
          AND MONTH(e.dateHeure) = MONTH(c.created_at) 
          AND YEAR(e.dateHeure) = YEAR(c.created_at)
        LEFT JOIN Contrat ct ON c.id = ct.idEmploye 
          AND MONTH(ct.dateDebut) = MONTH(c.created_at) 
          AND YEAR(ct.dateDebut) = YEAR(c.created_at)
        WHERE c.created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(c.created_at, '%Y-%m')
        ORDER BY mois ASC
      `);
      
      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques mensuelles:', error);
      throw error;
    }
  }
}

module.exports = StatistiquesService;
