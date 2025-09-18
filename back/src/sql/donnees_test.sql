-- =========================
-- DONNÉES DE TEST
-- =========================

-- Insertion des utilisateurs (pour l'authentification)
-- Mot de passe: 'password123' (hashé avec bcrypt)
INSERT INTO Utilisateurs (email, motDePasse, idEmploye) VALUES 
('jean.dupont@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('marie.martin@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2),
('admin@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3);

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
('Freelance');

-- Insertion des annonces d'emploi (avec colonne reference)
INSERT INTO Annonce (description, dateDebut, dateFin, reference, idDepartement, idProfil, idTypeAnnonce) VALUES 
('Recherche développeur Full Stack avec 3 ans d\'expérience minimum en React, Node.js et bases de données', '2024-01-15', '2024-03-15', 'DEV-2024-001', 2, 1, 1),
('Poste de manager pour équipe RH avec expérience en gestion d\'équipe et recrutement', '2024-02-01', '2024-04-01', 'MAN-2024-001', 1, 2, 1),
('Comptable expérimenté pour département finance avec maîtrise des logiciels comptables', '2024-01-20', '2024-03-20', 'CPT-2024-001', 4, 3, 1),
('Commercial terrain secteur Sud-Est avec permis B obligatoire', '2024-02-10', '2024-04-10', 'COM-2024-001', 3, 4, 2),
('Technicien maintenance industrielle avec formation en électromécanique', '2024-01-25', '2024-03-25', 'TEC-2024-001', 5, 5, 2);

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

-- Insertion des candidats
INSERT INTO Candidat (nom, prenom, dateNaissance, adresse, cv, idAnnonce, idStatut) VALUES 
('Petit', 'Alexandre', '1995-05-15', '12 Rue des Lilas, Paris', 'CV développeur junior avec formation React', 1, 1),
('Garnier', 'Léa', '1988-08-22', '34 Avenue Mozart, Lyon', 'CV manager avec 8 ans d\'expérience RH', 2, 2),
('Mercier', 'David', '1992-03-10', '56 Boulevard Voltaire, Marseille', 'CV comptable certifié avec expertise fiscale', 3, 1),
('Blanc', 'Sarah', '1990-11-30', '78 Rue Pasteur, Toulouse', 'CV commerciale terrain avec résultats prouvés', 4, 4),
('Rousseau', 'Maxime', '1987-07-18', '90 Place de la Mairie, Nice', 'CV technicien maintenance avec certifications', 5, 1);

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
