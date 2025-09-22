
-- Table des types d'annonce (CDI, Freelance, CDD, etc.)
CREATE TABLE TypeAnnonce (
    id INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE
);

-- Modification de la table Annonce pour ajouter la FK vers TypeAnnonce
ALTER TABLE Annonce
ADD COLUMN idTypeAnnonce INT,
ADD CONSTRAINT fk_annonce_type
    FOREIGN KEY (idTypeAnnonce) REFERENCES TypeAnnonce(id);


CREATE TABLE CompteCandidat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    motDePasse VARCHAR(255) NOT NULL
);


ALTER TABLE Candidat
ADD COLUMN idCompteCandidat INT,
ADD CONSTRAINT fk_candidat_comptecandidat
    FOREIGN KEY (idCompteCandidat) REFERENCES CompteCandidat(id);

-- Supprimer la colonne nomPoste de la table Annonce
ALTER TABLE Annonce
DROP COLUMN nomPoste;

-- Ajouter la colonne reference à la table Annonce
ALTER TABLE Annonce
ADD COLUMN reference VARCHAR(50) NOT NULL UNIQUE;



-- Table des lieux
CREATE TABLE Lieu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

-- Ajouter une colonne lieu dans la table Candidature
ALTER TABLE candidat
ADD COLUMN idLieu INT,
ADD CONSTRAINT fk_candidat_lieu
    FOREIGN KEY (idLieu) REFERENCES Lieu(id);


INSERT INTO Lieu (nom) VALUES
('Antananarivo'),
('Toamasina'),
('Mahajanga'),
('Fianarantsoa'),
('Toliara'),
('Antsiranana'),
('Morondava'),
('Antsirabe'),
('Nosy Be'),
('Sainte-Marie'),
('Isalo'),
('Andasibe'),
('Ranomafana'),
('Masoala'),
('Menabe');

-- Insertion des départements
INSERT INTO Departement (nom) VALUES 
('Ressources Humaines'),
('Informatique'),
('Marketing'),
('Finance'),
('Production');

-- Insertion des employés
INSERT INTO Employe (nom, prenom, adresse, idDept) VALUES 
('Dupont', 'Jean', '123 Rue de la Paix, Paris', 2),
('Martin', 'Marie', '456 Avenue des Champs, Lyon', 1),
('Bernard', 'Pierre', '789 Boulevard Saint-Germain, Marseille', 3),
('Leroy', 'Emma', '987 Rue du Faubourg, Bordeaux', 2),
('Roux', 'Thomas', '147 Place Vendôme, Strasbourg', 1),
('Fournier', 'Julie', '258 Rue de la République, Lille', 3);

-- Insertion des profils
INSERT INTO Profil (nom) VALUES 
('Développeur JS Senior'),
('Manager'),
('Comptable'),
('Commercial'),
('Technicien');

-- Insertion des critères
INSERT INTO Critere (nom) VALUES 
('Expérience (années)'),
('Niveau d\'études'),
('Compétences techniques'),
('Langues parlées'),
('Disponibilité'),
('Diplome');



-- Insertion des statuts candidat
INSERT INTO StatutCandidat (nom) VALUES 
('En attente'),
('Accepté'),
('Refusé'),
('En cours d\'évaluation'),
('Candidature reçue'),
('QCM en cours'),
('QCM terminé'),
('Entretien programmé'),
('Entretien terminé');



-- Insertion des types d'annonce
INSERT INTO TypeAnnonce (libelle) VALUES 
('CDI'),
('CDD'),
('Stage'),
('Freelance'),
('Alternance');


INSERT INTO Diplome (nom) VALUES
('CPE'),       -- Certificat de Premier Etude
('BEPC'),      -- Brevet d’Études du Premier Cycle
('BACC'),      -- Baccalauréat
('Licence'),
('Master'),
('Doctorat');


-- Ajouter une colonne de date de création pour les candidats
ALTER TABLE Candidat 
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


INSERT INTO StatutEntretien (nom) VALUES 
('En attente'),
('Confirmé'),
('Reporté'),
('Annulé');

-- ============================================
-- SYSTÈME DE NOTIFICATIONS QCM
-- ============================================
-- Utilise les tables QCM existantes : QcmTest, QcmQuestion, QcmChoix, QcmReponse

-- Table pour les types de notifications
CREATE TABLE IF NOT EXISTS TypeNotification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icone VARCHAR(50) DEFAULT 'bell',
    couleur VARCHAR(7) DEFAULT '#3b82f6'
);

-- Table principale des notifications
CREATE TABLE IF NOT EXISTS Notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    idTypeNotification INT NOT NULL,
    idDestinataire INT NOT NULL, -- ID du CompteCandidat
    idExpediteur INT NULL, -- ID de l'utilisateur admin (optionnel)
    idAnnonce INT NULL, -- Lié à l'annonce concernée
    idQcmTest INT NULL, -- Lié au test QCM à passer
    lue BOOLEAN DEFAULT FALSE,
    dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateExpiration DATETIME NULL, -- Date limite pour passer le test
    donnees JSON NULL, -- Données supplémentaires (URL test, etc.)
    INDEX idx_destinataire_lue (idDestinataire, lue),
    INDEX idx_date_creation (dateCreation)
);

-- Ajouter les contraintes de clés étrangères après création des tables
ALTER TABLE Notification 
ADD CONSTRAINT fk_notification_type 
    FOREIGN KEY (idTypeNotification) REFERENCES TypeNotification(id) ON DELETE CASCADE;

ALTER TABLE Notification 
ADD CONSTRAINT fk_notification_destinataire 
    FOREIGN KEY (idDestinataire) REFERENCES CompteCandidat(id) ON DELETE CASCADE;

ALTER TABLE Notification 
ADD CONSTRAINT fk_notification_annonce 
    FOREIGN KEY (idAnnonce) REFERENCES Annonce(id) ON DELETE CASCADE;

ALTER TABLE Notification 
ADD CONSTRAINT fk_notification_qcmtest 
    FOREIGN KEY (idQcmTest) REFERENCES QcmTest(id) ON DELETE SET NULL;

-- Table pour les invitations aux tests QCM
CREATE TABLE IF NOT EXISTS InvitationQCM (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idCandidat INT NOT NULL, -- ID du candidat dans la table Candidat
    idAnnonce INT NOT NULL,
    idQcmTest INT NOT NULL,
    idNotification INT NOT NULL,
    statut ENUM('envoyee', 'vue', 'commencee', 'terminee', 'expiree') DEFAULT 'envoyee',
    dateEnvoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateVue DATETIME NULL,
    dateCommencee DATETIME NULL,
    dateTerminee DATETIME NULL,
    dateExpiration DATETIME NOT NULL,
    score DECIMAL(5,2) NULL, -- Score obtenu (si terminé)
    dureePassage INT NULL, -- Durée en secondes
    token VARCHAR(100) UNIQUE NOT NULL, -- Token unique pour accéder au test
    INDEX idx_candidat_annonce (idCandidat, idAnnonce),
    INDEX idx_token (token),
    INDEX idx_statut (statut)
);

-- Ajouter les contraintes de clés étrangères pour InvitationQCM
ALTER TABLE InvitationQCM 
ADD CONSTRAINT fk_invitation_candidat 
    FOREIGN KEY (idCandidat) REFERENCES Candidat(id) ON DELETE CASCADE;

ALTER TABLE InvitationQCM 
ADD CONSTRAINT fk_invitation_annonce 
    FOREIGN KEY (idAnnonce) REFERENCES Annonce(id) ON DELETE CASCADE;

ALTER TABLE InvitationQCM 
ADD CONSTRAINT fk_invitation_qcmtest 
    FOREIGN KEY (idQcmTest) REFERENCES QcmTest(id) ON DELETE CASCADE;

ALTER TABLE InvitationQCM 
ADD CONSTRAINT fk_invitation_notification 
    FOREIGN KEY (idNotification) REFERENCES Notification(id) ON DELETE CASCADE;

-- Table pour l'historique des actions sur les notifications
CREATE TABLE IF NOT EXISTS HistoriqueNotification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idNotification INT NOT NULL,
    action ENUM('creee', 'lue', 'cliquee', 'expiree') NOT NULL,
    dateAction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    adresseIP VARCHAR(45),
    userAgent TEXT,
    INDEX idx_notification_date (idNotification, dateAction)
);

-- Ajouter la contrainte de clé étrangère pour HistoriqueNotification
ALTER TABLE HistoriqueNotification 
ADD CONSTRAINT fk_historique_notification 
    FOREIGN KEY (idNotification) REFERENCES Notification(id) ON DELETE CASCADE;

-- ============================================
-- DONNÉES INITIALES
-- ============================================

-- Types de notifications
INSERT IGNORE INTO TypeNotification (nom, description, icone, couleur) VALUES
('test_qcm', 'Invitation à passer un test QCM', 'clipboard', '#3b82f6'),
('rappel_test', 'Rappel pour un test QCM non passé', 'clock', '#f59e0b'),
('resultat_test', 'Résultat d\'un test QCM', 'check-circle', '#10b981'),
('candidature_acceptee', 'Candidature acceptée', 'user-check', '#10b981'),
('candidature_refusee', 'Candidature refusée', 'user-x', '#ef4444');

-- Tests QCM de démonstration (utilise la table QcmTest existante)
INSERT IGNORE INTO QcmTest (nom, idProfil) VALUES
('Test Technique Développeur', 1),
('Test de Logique', NULL),
('Test de Français', NULL),
('Test Comptabilité', 2),
('Test Marketing', 3);

-- ============================================
-- VUES UTILES
-- ============================================

-- Vue pour les notifications non lues par candidat
CREATE VIEW NotificationsNonLues AS
SELECT 
    n.id,
    n.titre,
    n.message,
    n.dateCreation,
    n.dateExpiration,
    n.idDestinataire,
    tn.nom as typeNotification,
    tn.icone,
    tn.couleur,
    a.reference as annonceReference,
    qt.nom as qcmTitre
FROM Notification n
JOIN TypeNotification tn ON n.idTypeNotification = tn.id
LEFT JOIN Annonce a ON n.idAnnonce = a.id
LEFT JOIN QcmTest qt ON n.idQcmTest = qt.id
WHERE n.lue = FALSE
ORDER BY n.dateCreation DESC;

-- Vue pour le tableau de bord des invitations QCM
CREATE VIEW TableauBordQCM AS
SELECT 
    iq.id,
    iq.statut,
    iq.dateEnvoi,
    iq.dateExpiration,
    iq.score,
    c.nom as candidatNom,
    c.prenom as candidatPrenom,
    cc.email as candidatEmail,
    a.reference as annonceReference,
    qt.nom as qcmTitre,
    DATEDIFF(iq.dateExpiration, NOW()) as joursRestants
FROM InvitationQCM iq
JOIN Candidat c ON iq.idCandidat = c.id
JOIN CompteCandidat cc ON c.idCompteCandidat = cc.id
JOIN Annonce a ON iq.idAnnonce = a.id
JOIN QcmTest qt ON iq.idQcmTest = qt.id
ORDER BY iq.dateEnvoi DESC;

-- ============================================
-- FONCTIONS UTILES
-- ============================================

-- Fonction pour générer un token unique
DELIMITER //
CREATE FUNCTION GenererTokenQCM() 
RETURNS VARCHAR(100)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE token VARCHAR(100);
    DECLARE done INT DEFAULT 0;
    
    REPEAT
        SET token = CONCAT(
            'qcm_',
            SUBSTRING(MD5(CONCAT(NOW(), RAND())), 1, 20),
            '_',
            UNIX_TIMESTAMP()
        );
        
        SELECT COUNT(*) INTO done FROM InvitationQCM WHERE token = token;
    UNTIL done = 0 END REPEAT;
    
    RETURN token;
END //
DELIMITER ;

-- ============================================
-- PROCÉDURES STOCKÉES
-- ============================================

-- Procédure pour envoyer une invitation QCM
DELIMITER //
CREATE PROCEDURE EnvoyerInvitationQCM(
    IN p_idCandidat INT,
    IN p_idAnnonce INT,
    IN p_idQcmTest INT,
    IN p_dureeValidite INT, -- en heures
    IN p_idExpediteur INT
)
BEGIN
    DECLARE v_idNotification INT;
    DECLARE v_token VARCHAR(100);
    DECLARE v_dateExpiration DATETIME;
    DECLARE v_idCompteCandidat INT;
    DECLARE v_annonceRef VARCHAR(100);
    DECLARE v_qcmTitre VARCHAR(200);
    
    -- Récupérer les informations nécessaires
    SELECT c.idCompteCandidat, a.reference, qt.nom
    INTO v_idCompteCandidat, v_annonceRef, v_qcmTitre
    FROM Candidat c
    JOIN Annonce a ON c.idAnnonce = a.id
    JOIN QcmTest qt ON qt.id = p_idQcmTest
    WHERE c.id = p_idCandidat AND a.id = p_idAnnonce;
    
    -- Calculer la date d'expiration
    SET v_dateExpiration = DATE_ADD(NOW(), INTERVAL p_dureeValidite HOUR);
    
    -- Générer le token
    SET v_token = GenererTokenQCM();
    
    -- Créer la notification
    INSERT INTO Notification (
        titre, 
        message, 
        idTypeNotification, 
        idDestinataire, 
        idExpediteur, 
        idAnnonce, 
        idQcmTest,
        dateExpiration,
        donnees
    ) VALUES (
        CONCAT('Test QCM - ', v_annonceRef),
        CONCAT('Vous êtes invité(e) à passer le test "', v_qcmTitre, '" pour l\'annonce ', v_annonceRef, '. Vous avez jusqu\'au ', DATE_FORMAT(v_dateExpiration, '%d/%m/%Y à %H:%i'), ' pour le compléter.'),
        1, -- Type 'test_qcm'
        v_idCompteCandidat,
        p_idExpediteur,
        p_idAnnonce,
        p_idQcmTest,
        v_dateExpiration,
        JSON_OBJECT('token', v_token, 'dureeValidite', p_dureeValidite)
    );
    
    SET v_idNotification = LAST_INSERT_ID();
    
    -- Créer l'invitation QCM
    INSERT INTO InvitationQCM (
        idCandidat,
        idAnnonce,
        idQcmTest,
        idNotification,
        dateExpiration,
        token
    ) VALUES (
        p_idCandidat,
        p_idAnnonce,
        p_idQcmTest,
        v_idNotification,
        v_dateExpiration,
        v_token
    );
    
    -- Enregistrer l'historique
    INSERT INTO HistoriqueNotification (idNotification, action) 
    VALUES (v_idNotification, 'creee');
    
    SELECT v_token as token, v_idNotification as idNotification;
END //
DELIMITER ;

-- Procédure pour marquer une notification comme lue
DELIMITER //
CREATE PROCEDURE MarquerNotificationLue(IN p_idNotification INT)
BEGIN
    UPDATE Notification 
    SET lue = TRUE 
    WHERE id = p_idNotification;
    
    INSERT INTO HistoriqueNotification (idNotification, action) 
    VALUES (p_idNotification, 'lue');
END //
DELIMITER ;
