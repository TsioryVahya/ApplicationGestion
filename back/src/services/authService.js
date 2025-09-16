const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  
  // Inscription d'un nouvel utilisateur
  static async inscription(userData) {
    try {
      const { email, motDePasse, idProfil = 1 } = userData;
      
      // Vérifier si l'email existe déjà
      const [existingUser] = await pool.execute(
        'SELECT id FROM Utilisateurs WHERE email = ?',
        [email]
      );
      
      if (existingUser.length > 0) {
        throw new Error('Cet email est déjà utilisé');
      }
      
      // Hasher le mot de passe
      const saltRounds = 10;
      const motDePasseHash = await bcrypt.hash(motDePasse, saltRounds);
      
      // Insérer le nouvel utilisateur
      const [result] = await pool.execute(
        'INSERT INTO Utilisateurs (email, motDePasse, idProfil) VALUES (?, ?, ?)',
        [email, motDePasseHash, idProfil]
      );
      
      // Récupérer l'utilisateur créé avec son profil
      const [newUser] = await pool.execute(
        `SELECT u.id, u.email, u.idProfil, p.nom as nomProfil 
         FROM Utilisateurs u 
         LEFT JOIN Profil p ON u.idProfil = p.id 
         WHERE u.id = ?`,
        [result.insertId]
      );
      
      return newUser[0];
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }
  
  // Connexion d'un utilisateur
  static async connexion(email, motDePasse) {
    try {
      // Récupérer l'utilisateur avec son profil
      const [users] = await pool.execute(
        `SELECT u.id, u.email, u.motDePasse, u.idProfil, p.nom as nomProfil 
         FROM Utilisateurs u 
         LEFT JOIN Profil p ON u.idProfil = p.id 
         WHERE u.email = ?`,
        [email]
      );
      
      if (users.length === 0) {
        throw new Error('Email ou mot de passe incorrect');
      }
      
      const user = users[0];
      
      // Vérifier le mot de passe
      const motDePasseValide = await bcrypt.compare(motDePasse, user.motDePasse);
      
      if (!motDePasseValide) {
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Générer un token JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          idProfil: user.idProfil 
        },
        process.env.JWT_SECRET || 'secret_key_default',
        { expiresIn: '24h' }
      );
      
      // Retourner les données utilisateur sans le mot de passe
      const { motDePasse: _, ...userSansMotDePasse } = user;
      
      return {
        user: userSansMotDePasse,
        token
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }
  
  // Vérifier un token JWT
  static verifierToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'secret_key_default');
    } catch (error) {
      throw new Error('Token invalide');
    }
  }
  
  // Récupérer un utilisateur par ID
  static async obtenirUtilisateurParId(id) {
    try {
      const [users] = await pool.execute(
        `SELECT u.id, u.email, u.idProfil, p.nom as nomProfil 
         FROM Utilisateurs u 
         LEFT JOIN Profil p ON u.idProfil = p.id 
         WHERE u.id = ?`,
        [id]
      );
      
      return users[0] || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  }
}

module.exports = AuthService;
