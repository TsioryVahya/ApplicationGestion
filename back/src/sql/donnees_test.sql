-- =========================
-- DONNÉES DE TEST
-- =========================

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
('Durand', 'Sophie', '321 Rue de Rivoli, Toulouse', 4),
('Moreau', 'Lucas', '654 Avenue Montaigne, Nice', 5),
('Leroy', 'Emma', '987 Rue du Faubourg, Bordeaux', 2),
('Roux', 'Thomas', '147 Place Vendôme, Strasbourg', 1),
('Fournier', 'Julie', '258 Rue de la République, Lille', 3),
('Girard', 'Antoine', '369 Boulevard Haussmann, Nantes', 4),
('Bonnet', 'Camille', '741 Avenue Victor Hugo, Rennes', 5);

-- Insertion des profils
INSERT INTO Profil (nom) VALUES 
('Développeur'),
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
('Disponibilité');

-- Insertion des statuts candidat
INSERT INTO StatutCandidat (nom) VALUES 
('En attente'),
('Accepté'),
('Refusé'),
('En cours d\'évaluation');

-- Insertion des statuts entretien
INSERT INTO StatutEntretien (nom) VALUES 
('Programmé'),
('Terminé'),
('Annulé'),
('Reporté');

-- Insertion des diplômes
INSERT INTO Diplome (nom) VALUES 
('Baccalauréat'),
('BTS/DUT'),
('Licence'),
('Master'),
('Doctorat'),
('École d\'ingénieur'),
('École de commerce');

-- Insertion des types d'annonce
INSERT INTO TypeAnnonce (libelle) VALUES 
('CDI'),
('CDD'),
('Stage'),
('Freelance'),
('Alternance');

-- Insertion des candidats de test
INSERT INTO Candidat (nom, prenom, dateNaissance, adresse, cv, idAnnonce, idStatut) VALUES 
-- Candidats pour l'annonce 1 (Développeur Full-Stack)
('Martin', 'Pierre', '1995-03-15', '15 rue de la Paix, 75001 Paris', 'Développeur Full-Stack avec 5 ans d\'expérience. Compétences: React, Node.js, MongoDB, PostgreSQL. Expérience en startup et méthodes agiles. Passionné par les nouvelles technologies et l\'innovation.', 1, 1),

('Dubois', 'Marie', '1992-07-22', '42 avenue des Champs, 69000 Lyon', 'Ingénieure logiciel spécialisée JavaScript/Python. 6 ans d\'expérience en développement web. Leadership technique sur projets de digitalisation. Expertise en architecture microservices et DevOps.', 1, 2),

('Leroy', 'Thomas', '1990-11-08', '8 place du Marché, 33000 Bordeaux', 'Expert en développement full-stack et architecture système. 8 ans d\'expérience. Spécialités: React, Vue.js, Node.js, Docker, Kubernetes. Certifié AWS Solutions Architect.', 1, 4),

-- Candidats pour l'annonce 2 (Manager Commercial)
('Moreau', 'Sophie', '1988-05-12', '23 boulevard Saint-Germain, 75006 Paris', 'Manager commerciale senior avec 8 ans d\'expérience dans la tech B2B. Expertise en développement d\'équipes commerciales et stratégies de croissance. Résultats: +150% CA sur 3 ans.', 2, 1),

('Bernard', 'Julien', '1985-09-30', '67 rue de la République, 13000 Marseille', 'Commercial B2B expérimenté. 10 ans dans la vente de solutions technologiques. Gestion de portefeuilles clients grands comptes. Expertise en négociation et développement commercial.', 2, 3),

-- Candidats pour l'annonce 3 (Comptable Senior)
('Petit', 'Camille', '1987-12-03', '91 rue Victor Hugo, 59000 Lille', 'Comptable senior spécialisée en consolidation et reporting financier. 7 ans d\'expérience. Maîtrise des normes IFRS, SAP, et outils de contrôle de gestion. Expertise en audit interne.', 3, 1),

('Roux', 'Antoine', '1983-04-18', '34 avenue de la Liberté, 67000 Strasbourg', 'Expert-comptable avec 12 ans d\'expérience cabinet/entreprise. Spécialités: fiscalité, consolidation, contrôle de gestion. Diplômé DSCG. Expérience en management d\'équipe comptable.', 3, 2),

-- Candidats pour l'annonce 4 (Responsable Marketing Digital)
('Fournier', 'Laura', '1991-08-25', '56 place Bellecour, 69002 Lyon', 'Spécialiste marketing digital avec 6 ans d\'expérience. Expertise SEO/SEA, social media, analytics. Résultats: +200% trafic organique, ROI campagnes publicitaires >300%. Certifiée Google Ads.', 4, 4),

('Girard', 'Maxime', '1989-01-14', '78 cours Mirabeau, 13100 Aix-en-Provence', 'Growth hacker et responsable acquisition. 7 ans d\'expérience en marketing digital. Spécialités: funnel optimization, A/B testing, marketing automation. Doublé le trafic en 18 mois.', 4, 1),

-- Candidats pour l'annonce 5 (Technicien Maintenance)
('Michel', 'David', '1986-06-07', '12 rue de l\'Industrie, 38000 Grenoble', 'Technicien maintenance industrielle avec 10 ans d\'expérience. Spécialités: électromécanique, automatismes, maintenance préventive. Habilitations électriques. Autonome et polyvalent.', 5, 1),

('Garcia', 'Nicolas', '1993-10-19', '45 avenue de la Gare, 31000 Toulouse', 'Technicien maintenance junior avec 3 ans d\'expérience. Formation BTS Maintenance Industrielle. Compétences: mécanique, hydraulique, pneumatique. Motivé et adaptable aux nouveaux équipements.', 5, 3);

-- Mise à jour des annonces avec les types
UPDATE Annonce SET idTypeAnnonce = 1 WHERE id = 1; -- CDI
UPDATE Annonce SET idTypeAnnonce = 1 WHERE id = 2; -- CDI  
UPDATE Annonce SET idTypeAnnonce = 2 WHERE id = 3; -- CDD
UPDATE Annonce SET idTypeAnnonce = 1 WHERE id = 4; -- CDI
UPDATE Annonce SET idTypeAnnonce = 2 WHERE id = 5; -- CDD;


-- Insertion de critères supplémentaires pour les annonces
INSERT INTO CritereProfil (idProfil, idCritere, valeurVarchar, estObligatoire) VALUES 
-- Pour le profil Développeur (id=1)
(1, 3, 'React, Node.js, MySQL', TRUE),
(1, 4, 'Français, Anglais technique', TRUE),
(1, 1, '2-5 ans', TRUE),

-- Pour le profil Manager (id=2)  
(2, 1, '5+ ans', TRUE),
(2, 4, 'Français, Anglais', TRUE),
(2, 2, 'Master en Management', FALSE),

-- Pour le profil Comptable (id=3)
(3, 3, 'Sage, Excel avancé', TRUE),
(3, 1, '3+ ans', TRUE),
(3, 2, 'BTS/DUT Comptabilité', TRUE),

-- Pour le profil Commercial (id=4)
(4, 1, '1-3 ans', TRUE),
(4, 4, 'Français, Malgache', TRUE),
(4, 5, 'Disponible pour déplacements', TRUE),

-- Pour le profil Technicien (id=5)
(5, 3, 'Électromécanique, Maintenance préventive', TRUE),
(5, 1, '2+ ans', TRUE),
(5, 2, 'CAP/BEP Électromécanique', TRUE);

-- Insertion des tests QCM
INSERT INTO QcmTest (nom, idProfil) VALUES 
('Test Développement Web', 1),
('Test Management', 2),
('Test Comptabilité', 3),
('Test Commercial', 4),
('Test Technique', 5);

-- Insertion des questions QCM (exemple pour le test développement)
INSERT INTO QcmQuestion (idTest, numero, question, points) VALUES 
(1, 1, 'Qu\'est-ce que React ?', 2),
(1, 2, 'Comment déclarer une variable en JavaScript ?', 1),
(1, 3, 'Quelle est la différence entre let et const ?', 2);

-- Insertion des choix pour les questions
INSERT INTO QcmChoix (idQuestion, texte, estCorrect) VALUES 
-- Question 1
(1, 'Une librairie JavaScript pour créer des interfaces utilisateur', true),
(1, 'Un langage de programmation', false),
(1, 'Un framework CSS', false),
(1, 'Un serveur web', false),
-- Question 2
(2, 'var nom = "valeur"', true),
(2, 'variable nom = "valeur"', false),
(2, 'declare nom = "valeur"', false),
(2, 'nom := "valeur"', false),
-- Question 3
(3, 'let permet la réassignation, const non', true),
(3, 'Aucune différence', false),
(3, 'const permet la réassignation, let non', false),
(3, 'let est pour les nombres, const pour les chaînes', false);

-- Insertion des annonces d'emploi (avec colonne reference)
INSERT INTO Annonce (description, dateDebut, dateFin, reference, idDepartement, idProfil) VALUES 
('Recherche développeur Full Stack avec 3 ans d\'expérience minimum en React, Node.js et bases de données', '2024-01-15', '2024-03-15', 'DEV-2024-001', 2, 1),
('Poste de manager pour équipe RH avec expérience en gestion d\'équipe et recrutement', '2024-02-01', '2024-04-01', 'MAN-2024-001', 1, 2),
('Comptable expérimenté pour département finance avec maîtrise des logiciels comptables', '2024-01-20', '2024-03-20', 'CPT-2024-001', 4, 3),
('Commercial terrain secteur Sud-Est avec permis B obligatoire', '2024-02-10', '2024-04-10', 'COM-2024-001', 3, 4),
('Technicien maintenance industrielle avec formation en électromécanique', '2024-01-25', '2024-03-25', 'TEC-2024-001', 5, 5);

-- Insertion des résultats
INSERT INTO Resultat (note, appreciation) VALUES 
(85, 'Très bon niveau technique'),
(92, 'Excellent profil management'),
(78, 'Compétences solides en comptabilité'),
(88, 'Très bon commercial'),
(82, 'Bonnes compétences techniques');

-- Insertion des entretiens
INSERT INTO Entretien (idCandidat, dateHeure, idStatut, idResultat) VALUES 
(1, '2024-02-15 14:00:00', 2, 1),
(2, '2024-02-20 10:30:00', 2, 2),
(3, '2024-02-18 16:00:00', 1, NULL),
(4, '2024-02-22 09:00:00', 2, 4),
(5, '2024-02-25 11:00:00', 1, NULL);
