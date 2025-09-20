
-- Script de données pour tester le scénario complet : Création d'annonces et gestion des entretiens
-- Ce script doit être exécuté après base.sql ET Update.sql

-- Nettoyage des données existantes (optionnel)
DELETE FROM HistoriqueEntretien;
DELETE FROM Entretien;
DELETE FROM QcmReponse;
DELETE FROM QcmChoix;
DELETE FROM QcmQuestion;
DELETE FROM QcmTest;
DELETE FROM Candidat;
DELETE FROM Annonce;
DELETE FROM CritereProfil;
DELETE FROM Profil;
DELETE FROM Critere;
DELETE FROM StatutCandidat;
DELETE FROM StatutEntretien;
DELETE FROM Resultat;
DELETE FROM TypeAnnonce;
DELETE FROM Departement;
DELETE FROM Diplome;

-- Reset AUTO_INCREMENT
ALTER TABLE HistoriqueEntretien AUTO_INCREMENT = 1;
ALTER TABLE Entretien AUTO_INCREMENT = 1;
ALTER TABLE QcmReponse AUTO_INCREMENT = 1;
ALTER TABLE QcmChoix AUTO_INCREMENT = 1;
ALTER TABLE QcmQuestion AUTO_INCREMENT = 1;
ALTER TABLE QcmTest AUTO_INCREMENT = 1;
ALTER TABLE Candidat AUTO_INCREMENT = 1;
ALTER TABLE Annonce AUTO_INCREMENT = 1;
ALTER TABLE CritereProfil AUTO_INCREMENT = 1;
ALTER TABLE Profil AUTO_INCREMENT = 1;
ALTER TABLE Critere AUTO_INCREMENT = 1;
ALTER TABLE StatutCandidat AUTO_INCREMENT = 1;
ALTER TABLE StatutEntretien AUTO_INCREMENT = 1;
ALTER TABLE Resultat AUTO_INCREMENT = 1;
ALTER TABLE TypeAnnonce AUTO_INCREMENT = 1;
ALTER TABLE Departement AUTO_INCREMENT = 1;
ALTER TABLE Diplome AUTO_INCREMENT = 1;

-- Insertion des départements
INSERT INTO Departement (nom) VALUES 
('Ressources Humaines'),
('Informatique'),
('Marketing'),
('Finance'),
('Production');

-- Insertion des diplômes
INSERT INTO Diplome (nom) VALUES 
('Baccalauréat'),
('Licence'),
('Master'),
('Doctorat'),
('BTS'),
('DUT');

-- Insertion des types d'annonce (colonne libelle selon Update.sql)
INSERT INTO TypeAnnonce (libelle) VALUES 
('CDI'),
('CDD'),
('Stage'),
('Freelance'),
('Alternance');

-- Insertion des critères
INSERT INTO Critere (nom) VALUES 
('Expérience (années)'),
('Niveau d\'études'),
('Compétences techniques'),
('Langues'),
('Permis de conduire');

-- Insertion des profils
INSERT INTO Profil (nom) VALUES 
('Développeur Full Stack'),
('Chef de projet Marketing'),
('Assistant RH'),
('Comptable Senior'),
('Commercial B2B');

-- Insertion des critères pour chaque profil
INSERT INTO CritereProfil (idProfil, idCritere, valeurVarchar, estObligatoire) VALUES 
-- Développeur Full Stack
(1, 1, '3', TRUE),  -- 3 ans d'expérience minimum
(1, 2, 'Master', FALSE),  -- Master souhaité
(1, 3, 'React, Node.js, JavaScript, SQL', TRUE),  -- Compétences techniques
(1, 4, 'Anglais technique', TRUE),  -- Anglais requis

-- Chef de projet Marketing
(2, 1, '4', TRUE),  -- 4 ans d'expérience minimum
(2, 2, 'Master', TRUE),  -- Master obligatoire
(2, 3, 'Marketing digital, SEO, Analytics', TRUE),  -- Compétences marketing
(2, 4, 'Anglais courant', TRUE),  -- Anglais courant

-- Assistant RH
(3, 1, '2', TRUE),  -- 2 ans d'expérience minimum
(3, 2, 'BTS', TRUE),  -- BTS minimum
(3, 3, 'Gestion administrative, Recrutement', TRUE),  -- Compétences RH
(3, 4, 'Français', TRUE),  -- Français requis

-- Comptable Senior
(4, 1, '5', TRUE),  -- 5 ans d'expérience minimum
(4, 2, 'Master', TRUE),  -- Master obligatoire
(4, 3, 'Comptabilité, Fiscalité, SAP', TRUE),  -- Compétences comptables

-- Commercial B2B
(5, 1, '3', TRUE),  -- 3 ans d'expérience minimum
(5, 2, 'Licence', TRUE),  -- Licence minimum
(5, 3, 'Vente B2B, Négociation', TRUE),  -- Compétences commerciales
(5, 5, 'B', TRUE);  -- Permis B obligatoire

-- Insertion des statuts candidat
INSERT INTO StatutCandidat (nom) VALUES 
('Candidature reçue'),
('QCM en cours'),
('QCM terminé'),
('Entretien programmé'),
('Entretien terminé'),
('Accepté'),
('Refusé');

-- Insertion des statuts entretien
INSERT INTO StatutEntretien (nom) VALUES 
('En attente'),
('Confirmé'),
('Reporté'),
('Annulé');

-- Insertion des annonces (structure selon base.sql + Update.sql)
-- Colonnes: description, dateDebut, dateFin, idDepartement, idProfil, reference, idTypeAnnonce
INSERT INTO Annonce (description, dateDebut, dateFin, idDepartement, idProfil, reference, idTypeAnnonce) VALUES 
('Nous recherchons un développeur expérimenté pour rejoindre notre équipe technique. Vous travaillerez sur des projets innovants utilisant React, Node.js et des bases de données modernes.', '2024-01-15', '2024-03-15', 2, 1, 'DEV2024-001', 1),
('Poste de chef de projet pour piloter nos campagnes marketing digital. Expertise en SEO, analytics et gestion d\'équipe requise.', '2024-01-20', '2024-03-20', 3, 2, 'MKT2024-001', 1),
('Assistant RH pour soutenir les activités de recrutement et gestion administrative du personnel.', '2024-01-10', '2024-03-10', 1, 3, 'RH2024-001', 1),
('Comptable expérimenté pour la gestion comptable et fiscale de l\'entreprise. Maîtrise de SAP souhaitée.', '2024-01-25', '2024-03-25', 4, 4, 'FIN2024-001', 1),
('Commercial pour développer notre portefeuille clients entreprises. Secteur géographique : Région Parisienne.', '2024-02-01', '2024-04-01', 3, 5, 'COM2024-001', 1);

-- Insertion des candidats avec différents statuts
INSERT INTO Candidat (nom, prenom, dateNaissance, adresse, cv, idAnnonce, idStatut) VALUES 
-- Candidats éligibles (QCM terminé)
('Dupont', 'Jean', '1990-05-15', '123 Rue de la Paix, 75001 Paris', 'Développeur Full Stack avec 5 ans d\'expérience. Expert en React, Node.js, MongoDB. Diplômé d\'une école d\'ingénieur. Passionné par les nouvelles technologies et l\'innovation.', 1, 3),
('Martin', 'Sophie', '1988-03-22', '456 Avenue des Champs, 69000 Lyon', 'Chef de projet marketing avec 6 ans d\'expérience. Master en marketing digital. Expertise en SEO, Google Analytics, campagnes publicitaires. Résultats prouvés en croissance d\'audience.', 2, 3),
('Durand', 'Pierre', '1992-11-08', '789 Boulevard Saint-Michel, 13000 Marseille', 'Assistant RH avec 3 ans d\'expérience. BTS Assistant de gestion. Compétences en recrutement, gestion administrative, relations sociales. Polyvalent et organisé.', 3, 3),
('Lefevre', 'Marie', '1985-07-12', '321 Rue Victor Hugo, 31000 Toulouse', 'Comptable senior avec 8 ans d\'expérience. Master CCA. Expertise en consolidation, fiscalité, audit. Maîtrise parfaite de SAP et Excel avancé.', 4, 3),
('Bernard', 'Paul', '1987-09-30', '654 Place de la République, 06000 Nice', 'Commercial B2B avec 7 ans d\'expérience. Licence commerciale. Spécialisé dans la vente de solutions technologiques. Portefeuille clients grands comptes.', 5, 3),

-- Candidats non éligibles (autres statuts)
('Moreau', 'Julie', '1991-12-03', '987 Avenue de la Liberté, 67000 Strasbourg', 'Développeuse junior avec 2 ans d\'expérience. Formation autodidacte en développement web. Motivée et en apprentissage continu.', 1, 2),
('Petit', 'Thomas', '1989-04-18', '147 Cours Mirabeau, 13100 Aix-en-Provence', 'Marketing manager avec 4 ans d\'expérience. BTS Communication. Expérience en marketing traditionnel, souhaite évoluer vers le digital.', 2, 1),
('Roux', 'Camille', '1993-08-25', '258 Place Bellecour, 69002 Lyon', 'Assistante administrative avec 1 an d\'expérience. BTS Assistant de direction. Première expérience en RH, très motivée.', 3, 1);

-- Insertion des tests QCM (structure selon base.sql : nom, idProfil)
INSERT INTO QcmTest (nom, idProfil) VALUES 
('Test Technique Développeur', 1),
('Test Marketing Digital', 2),
('Test Compétences RH', 3),
('Test Comptabilité', 4),
('Test Commercial', 5);

-- Insertion des relations TestAnnonce (liaison QcmTest-Annonce)
INSERT INTO TestAnnonce (idTest, idAnnonce) VALUES 
(1, 1), -- Test Développeur pour annonce Développeur
(2, 2), -- Test Marketing pour annonce Marketing
(3, 3), -- Test RH pour annonce RH
(4, 4), -- Test Comptabilité pour annonce Comptabilité
(5, 5); -- Test Commercial pour annonce Commercial

-- Insertion des questions QCM
INSERT INTO QcmQuestion (idTest, numero, question, points) VALUES 
-- Test Développeur
(1, 1, 'Quelle est la différence principale entre let et var en JavaScript ?', 3),
(1, 2, 'Comment créer un composant React fonctionnel ?', 4),
(1, 3, 'Qu\'est-ce qu\'une API REST ?', 3),
(1, 4, 'Quelle est la différence entre SQL et NoSQL ?', 4),
(1, 5, 'Qu\'est-ce que le Virtual DOM en React ?', 6),

-- Test Marketing
(2, 1, 'Que signifie SEO ?', 2),
(2, 2, 'Définissez le marketing mix (4P)', 4),
(2, 3, 'Qu\'est-ce que le taux de conversion ?', 3),
(2, 4, 'Citez 3 KPIs importants en marketing digital', 4),
(2, 5, 'Qu\'est-ce que le retargeting ?', 7),

-- Test RH
(3, 1, 'Qu\'est-ce que la GPEC ?', 3),
(3, 2, 'Citez les étapes du processus de recrutement', 4),
(3, 3, 'Qu\'est-ce que l\'entretien annuel d\'évaluation ?', 3),
(3, 4, 'Définissez le droit du travail', 4),
(3, 5, 'Qu\'est-ce que la formation professionnelle continue ?', 6),

-- Test Comptabilité
(4, 1, 'Qu\'est-ce que le bilan comptable ?', 3),
(4, 2, 'Différence entre charges et produits', 4),
(4, 3, 'Qu\'est-ce que la TVA ?', 3),
(4, 4, 'Définissez l\'amortissement', 4),
(4, 5, 'Qu\'est-ce que la consolidation comptable ?', 6),

-- Test Commercial
(5, 1, 'Qu\'est-ce que la méthode SONCAS ?', 3),
(5, 2, 'Définissez la prospection commerciale', 4),
(5, 3, 'Qu\'est-ce qu\'un CRM ?', 3),
(5, 4, 'Citez les étapes de la vente', 4),
(5, 5, 'Qu\'est-ce que l\'objection en vente ?', 6);

-- Insertion des choix de réponses (exemples pour quelques questions)
INSERT INTO QcmChoix (idQuestion, texte, estCorrect) VALUES 
-- Question 1 Développeur (let vs var)
(1, 'let a une portée de bloc, var a une portée de fonction', TRUE),
(1, 'let et var sont identiques', FALSE),
(1, 'var est plus récent que let', FALSE),
(1, 'let est plus lent que var', FALSE),

-- Question 2 Développeur (Composant React)
(2, 'function MonComposant() { return <div>Hello</div>; }', TRUE),
(2, 'class MonComposant extends Component', FALSE),
(2, 'const MonComposant = new React.Component()', FALSE),
(2, 'React.createComponent("MonComposant")', FALSE),

-- Question 1 Marketing (SEO)
(6, 'Search Engine Optimization', TRUE),
(6, 'Social Engine Optimization', FALSE),
(6, 'System Engine Optimization', FALSE),
(6, 'Site Engine Optimization', FALSE),

-- Question 1 RH (GPEC)
(11, 'Gestion Prévisionnelle des Emplois et Compétences', TRUE),
(11, 'Gestion des Processus et Contrôles', FALSE),
(11, 'Gestion Préventive des Emplois Collectifs', FALSE),
(11, 'Gestion Publique des Entreprises Commerciales', FALSE);

-- Insertion des réponses QCM (candidats ayant terminé avec succès)
INSERT INTO QcmReponse (idCandidat, idTest, idQuestion, idChoix, pointsObtenus) VALUES 
-- Jean Dupont (Développeur) - Score: 16/20
(1, 1, 1, 1, 3),  -- Bonne réponse
(1, 1, 2, 5, 4),  -- Bonne réponse
(1, 1, 3, NULL, 3),  -- Question ouverte - points attribués
(1, 1, 4, NULL, 3),  -- Question ouverte - points attribués
(1, 1, 5, NULL, 3),  -- Question ouverte - points partiels

-- Sophie Martin (Marketing) - Score: 14/20
(2, 2, 6, 9, 2),  -- Bonne réponse
(2, 2, 7, NULL, 4),  -- Question ouverte - points attribués
(2, 2, 8, NULL, 3),  -- Question ouverte - points attribués
(2, 2, 9, NULL, 3),  -- Question ouverte - points attribués
(2, 2, 10, NULL, 2), -- Question ouverte - points partiels

-- Pierre Durand (RH) - Score: 12/20
(3, 3, 11, 13, 3), -- Bonne réponse
(3, 3, 12, NULL, 3),  -- Question ouverte - points attribués
(3, 3, 13, NULL, 2),  -- Question ouverte - points attribués
(3, 3, 14, NULL, 2),  -- Question ouverte - points attribués
(3, 3, 15, NULL, 2),  -- Question ouverte - points partiels

-- Marie Lefevre (Comptabilité) - Score: 15/20
(4, 4, 16, NULL, 3),  -- Question ouverte - points attribués
(4, 4, 17, NULL, 4),  -- Question ouverte - points attribués
(4, 4, 18, NULL, 3),  -- Question ouverte - points attribués
(4, 4, 19, NULL, 3),  -- Question ouverte - points attribués
(4, 4, 20, NULL, 2),  -- Question ouverte - points partiels

-- Paul Bernard (Commercial) - Score: 13/20
(5, 5, 21, NULL, 3),  -- Question ouverte - points attribués
(5, 5, 22, NULL, 3),  -- Question ouverte - points attribués
(5, 5, 23, NULL, 2),  -- Question ouverte - points attribués
(5, 5, 24, NULL, 3),  -- Question ouverte - points attribués
(5, 5, 25, NULL, 2);  -- Question ouverte - points partiels

-- Insertion des résultats d'entretien
INSERT INTO Resultat (note, appreciation) VALUES 
(16, 'Excellent candidat, compétences techniques solides et expérience pertinente'),
(14, 'Bon profil marketing, expérience intéressante en digital'),
(12, 'Candidat RH correct, bonnes bases à développer'),
(15, 'Très bon profil comptable, expertise confirmée'),
(13, 'Commercial expérimenté, bonnes techniques de vente');

-- Insertion des entretiens programmés (dates futures pour les tests)
INSERT INTO Entretien (idCandidat, dateHeure, idStatut, idResultat) VALUES 
(1, '2025-09-22 10:00:00', 2, NULL), -- Jean Dupont - Confirmé (demain)
(2, '2025-09-23 14:30:00', 1, NULL), -- Sophie Martin - En attente
(3, '2025-09-24 09:00:00', 2, NULL), -- Pierre Durand - Confirmé
(4, '2025-09-25 11:00:00', 1, NULL), -- Marie Lefevre - En attente
(5, '2025-09-26 15:00:00', 2, NULL); -- Paul Bernard - Confirmé

-- Insertion de l'historique des entretiens
INSERT INTO HistoriqueEntretien (idEntretien, idStatut) VALUES 
-- Historique pour Jean Dupont
(1, 1), -- Initialement en attente
(1, 2), -- Puis confirmé

-- Historique pour Sophie Martin
(2, 1), -- En attente

-- Historique pour Pierre Durand
(3, 1), -- Initialement en attente
(3, 2), -- Puis confirmé

-- Historique pour Marie Lefevre
(4, 1), -- En attente

-- Historique pour Paul Bernard
(5, 1), -- Initialement en attente
(5, 2); -- Puis confirmé

-- Affichage des résultats pour vérification
SELECT 'CANDIDATS ÉLIGIBLES POUR ENTRETIEN' as Info;
SELECT 
    c.id,
    c.prenom,
    c.nom,
    a.reference,
    AVG(qr.pointsObtenus) as scoreQCM,
    sc.nom as statut
FROM Candidat c
JOIN Annonce a ON c.idAnnonce = a.id
JOIN StatutCandidat sc ON c.idStatut = sc.id
LEFT JOIN QcmReponse qr ON c.id = qr.idCandidat
WHERE sc.nom = 'QCM terminé'
GROUP BY c.id, c.prenom, c.nom, a.reference, sc.nom
HAVING scoreQCM >= 10
ORDER BY scoreQCM DESC;

SELECT 'ENTRETIENS PROGRAMMÉS' as Info;
SELECT 
    e.id,
    c.prenom,
    c.nom,
    a.reference,
    e.dateHeure,
    se.nom as statut
FROM Entretien e
JOIN Candidat c ON e.idCandidat = c.id
JOIN Annonce a ON c.idAnnonce = a.id
JOIN StatutEntretien se ON e.idStatut = se.id
ORDER BY e.dateHeure;