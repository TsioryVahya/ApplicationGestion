-- =========================
-- Données de test
-- =========================

-- 1. Départements
INSERT INTO Departement (nom) VALUES ('Informatique'), ('Ressources Humaines');

-- 2. Profils
INSERT INTO Profil (nom) VALUES ('Développeur Fullstack'), ('Chef de projet');

-- 3. Critères
INSERT INTO Critere (nom) VALUES ('Années d\'expérience'), ('Langue Anglais'), ('Diplôme requis');

-- 4. CritereProfil
INSERT INTO CritereProfil (idProfil, idCritere, valeurDouble, estObligatoire)
VALUES 
    (1, 1, 2.0, TRUE),     -- Dév Fullstack doit avoir min 2 ans exp
    (1, 2, NULL, TRUE),    -- Anglais obligatoire
    (1, 3, NULL, FALSE);   -- Diplôme facultatif

-- 5. TypeAnnonce
INSERT INTO TypeAnnonce (libelle) VALUES ('CDI'), ('CDD'), ('Freelance');

-- 6. Annonce (exemple pour un poste Développeur Fullstack en CDI)
INSERT INTO Annonce (description, dateDebut, dateFin, nomPoste, idDepartement, idProfil, idTypeAnnonce)
VALUES (
    'Nous recherchons un développeur fullstack expérimenté (Java/React).',
    '2025-09-01',
    '2025-12-31',
    'Développeur Fullstack',
    1,   -- Informatique
    1,   -- Profil Dév Fullstack
    1    -- CDI
);

-- 7. CompteCandidat
INSERT INTO CompteCandidat (email, motDePasse)
VALUES ('candidat1@mail.com', 'hashed_password_123');

-- 8. StatutCandidat
INSERT INTO StatutCandidat (nom) VALUES ('En attente'), ('Retenu'), ('Rejeté');

-- 9. Candidat (candidat postule à l’annonce)
INSERT INTO Candidat (nom, prenom, dateNaissance, adresse, cv, idAnnonce, idStatut, idCompteCandidat)
VALUES (
    'Dupont',
    'Jean',
    '1995-04-12',
    '12 rue de Paris, Antananarivo',
    'Expérience : 3 ans en développement Java/React.',
    1,  -- L’annonce créée ci-dessus
    1,  -- En attente
    1   -- Compte candidat
);

-- 10. CandidatureCritere (le candidat répond aux critères)
INSERT INTO CandidatureCritere (idCandidat, idAnnonce, idCritere, valeurDouble, valeurBool)
VALUES 
    (1, 1, 1, 3.0, NULL),  -- 3 ans d'expérience
    (1, 1, 2, NULL, TRUE), -- Anglais OK
    (1, 1, 3, NULL, TRUE); -- Diplôme présent
