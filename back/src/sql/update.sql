--ajout du colonne estObligatoire dans CritereProfil
ALTER TABLE CritereProfil
ADD COLUMN estObligatoire BOOLEAN DEFAULT TRUE;


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


CREATE TABLE CompteCandidat (fff
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    motDePasse VARCHAR(255) NOT NULL
);


ALTER TABLE Candidat
ADD COLUMN idCompteCandidat INT,
ADD CONSTRAINT fk_candidat_comptecandidat
    FOREIGN KEY (idCompteCandidat) REFERENCES CompteCandidat(id);
