-- Insertion de choix pour les questions QCM existantes

-- Choix pour la question 1: "C est quoi let" (id=1)
INSERT INTO QcmChoix (idQuestion, texte, estCorrect) VALUES
(1, 'Une variable qui peut être redéclarée', false),
(1, 'Une variable de portée de bloc qui ne peut pas être redéclarée', true),
(1, 'Une constante', false),
(1, 'Une fonction', false);

-- Choix pour la question 2: "== est une egalite de types et valeur" (id=2)
INSERT INTO QcmChoix (idQuestion, texte, estCorrect) VALUES
(2, 'Vrai', false),
(2, 'Faux', true),
(2, 'Parfois', false),
(2, 'Ça dépend du navigateur', false);
