-- =========================
-- SCRIPT MYSQL RECRUTEMENT (VERSION SIMPLIFIEE QCM)
-- =========================

-- Table Departement
CREATE TABLE Departement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- Table Profil (ex : Informaticien, Manager, etc.)
CREATE TABLE Profil (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- Table Utilisateur
CREATE TABLE Utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    mdp VARCHAR(200) NOT NULL,
    id_profil INT,
    FOREIGN KEY (id_profil) REFERENCES Profil(id)
);

-- Table Critere (liste des critères génériques)
CREATE TABLE Critere (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- Table Critere_profil (valeurs attendues selon le profil)
CREATE TABLE Critere_profil (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_profil INT,
    id_critere INT,
    valeur_int INT NULL,
    valeur_varchar VARCHAR(200) NULL,
    valeur_bool BOOLEAN NULL,
    FOREIGN KEY (id_profil) REFERENCES Profil(id),
    FOREIGN KEY (id_critere) REFERENCES Critere(id)
);

-- Table Annonce
CREATE TABLE Annonce (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    date_debut DATE,
    date_fin DATE,
    nom_poste VARCHAR(100) NOT NULL,
    id_departement INT,
    id_profil INT,
    FOREIGN KEY (id_departement) REFERENCES Departement(id),
    FOREIGN KEY (id_profil) REFERENCES Profil(id)
);

-- Table Statut_candidat
CREATE TABLE Statut_candidat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL
);

-- Table Candidat
CREATE TABLE Candidat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    dtn DATE,
    adresse VARCHAR(200),
    cv TEXT,
    id_annonce INT,
    id_statut INT,
    FOREIGN KEY (id_annonce) REFERENCES Annonce(id),
    FOREIGN KEY (id_statut) REFERENCES Statut_candidat(id)
);

-- Table Employe
CREATE TABLE Employe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    adresse VARCHAR(200),
    id_candidat INT,
    FOREIGN KEY (id_candidat) REFERENCES Candidat(id)
);

-- Table Diplome
CREATE TABLE Diplome (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- Table QCM_Test (test / QCM lié à un profil ou une annonce)
CREATE TABLE QCM_Test (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150),
    id_profil INT NULL,
    id_annonce INT NULL,
    duree_minutes INT NULL,
    FOREIGN KEY (id_profil) REFERENCES Profil(id),
    FOREIGN KEY (id_annonce) REFERENCES Annonce(id)
);

-- Table QCM_Question (questions du test)
CREATE TABLE QCM_Question (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_test INT NOT NULL,
    numero INT NOT NULL,
    question TEXT NOT NULL,
    points_max INT NOT NULL DEFAULT 1,
    obligatoire BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_test) REFERENCES QCM_Test(id)
);

-- Table QCM_Choice (choix possibles pour chaque question)
CREATE TABLE QCM_Choice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_question INT NOT NULL,
    texte VARCHAR(500) NOT NULL,
    points INT NOT NULL DEFAULT 0,
    est_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_question) REFERENCES QCM_Question(id)
);

-- Table QCM_Answer (réponses du candidat)
CREATE TABLE QCM_Answer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_candidat INT NOT NULL,
    id_test INT NOT NULL,
    id_question INT NOT NULL,
    id_choice INT NULL,
    points_obtenus INT DEFAULT 0,
    FOREIGN KEY (id_candidat) REFERENCES Candidat(id),
    FOREIGN KEY (id_test) REFERENCES QCM_Test(id),
    FOREIGN KEY (id_question) REFERENCES QCM_Question(id),
    FOREIGN KEY (id_choice) REFERENCES QCM_Choice(id)
);

-- Table Resultat
CREATE TABLE Resultat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    note INT,
    appreciation VARCHAR(200)
);

-- Table Statut_entretien
CREATE TABLE Statut_entretien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL
);

-- Table Entretien
CREATE TABLE Entretien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_candidat INT,
    date_heure DATETIME,
    id_statut INT,
    id_resultat INT,
    FOREIGN KEY (id_candidat) REFERENCES Candidat(id),
    FOREIGN KEY (id_statut) REFERENCES Statut_entretien(id),
    FOREIGN KEY (id_resultat) REFERENCES Resultat(id)
);

-- Table Historique_entretien
CREATE TABLE Historique_entretien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_entretien INT,
    id_statut INT,
    date_changement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_entretien) REFERENCES Entretien(id),
    FOREIGN KEY (id_statut) REFERENCES Statut_entretien(id)
);

-- Table Historique_candidature
CREATE TABLE Historique_candidature (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_candidat INT,
    id_statut INT,
    date_changement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_candidat) REFERENCES Candidat(id),
    FOREIGN KEY (id_statut) REFERENCES Statut_candidat(id)
);

-- Table Contrat
CREATE TABLE Contrat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_employe INT,
    date_debut DATE,
    nbr_mois INT,
    type_contrat VARCHAR(50),
    FOREIGN KEY (id_employe) REFERENCES Employe(id)
);
