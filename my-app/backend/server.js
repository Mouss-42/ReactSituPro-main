const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const mysql = require('mysql2');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(cors());
app.use(express.json()); // 🚨 Permet de lire le JSON des requêtes POST

// Créer la connexion à la base de données
const db = mysql.createConnection({
  host: 'localhost',     // L'adresse du serveur MariaDB
  user: 'root',          // L'utilisateur de la base de données
  password: '', // Le mot de passe de l'utilisateur
  database: 'ecommerce'  // Le nom de la base de données
});

// Vérifier la connexion
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connexion à la base de données réussie !');
});

// Utilise CORS pour autoriser les requêtes depuis localhost:5000
app.use(cors());

// Route pour l'inscription
app.post("/register", async (req, res) => {
  const { username, motdepasse } = req.body;

  if (!username || !motdepasse) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  // Vérifier si l'utilisateur existe déjà
  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, result) => {
    if (result.length > 0) {
      return res.status(400).json({ message: "Nom d'utilisateur déjà pris" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(motdepasse, 10);

    // Insérer l'utilisateur
    db.query("INSERT INTO users (username, motdepasse) VALUES (?, ?)", [username, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ message: "Erreur lors de l'inscription" });
      res.status(201).json({ message: "Inscription réussie !" });
    });
  });
});

// Route pour la connexion
app.post("/login", (req, res) => {
  const { username, motdepasse } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, result) => {
    if (result.length === 0) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(motdepasse, user.motdepasse);

    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user.id, username: user.username }, "secretkey", { expiresIn: "1h" });

    res.json({ message: "Connexion réussie !", token });
  });
});


// Route de base pour éviter l'erreur "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur Express !');
});

// Exemple de route pour récupérer des données
app.get('/data', (req, res) => {
  const query = 'SELECT * FROM produits'; // Assurez-vous que la table 'produits' existe

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête:', err);
      res.status(500).json({ message: 'Erreur interne du serveur' });
      return;
    }

    if (results.length > 0) {
      res.json(results); // Renvoie les résultats sous forme de JSON
    } else {
      res.json({ message: 'Aucun utilisateur trouvé' });
    }
  });
});

// Exemple de route pour récupérer des données (users)
app.get('/register', (req, res) => {
  const query = 'SELECT * FROM users'; // Assurez-vous que la table 'users' existe

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête:', err);
      res.status(500).json({ message: 'Erreur interne du serveur' });
      return;
    }

    if (results.length > 0) {
      res.json(results); // Renvoie les résultats sous forme de JSON
    } else {
      res.json({ message: 'Aucun utilisateur trouvé' });
    }
  });
});

// ✅ Ajouter un produit
app.post("/data", (req, res) => {
  const { nomproduits, prix } = req.body;
  if (!nomproduits || !prix) {
    return res.status(400).send({ message: "Champs manquants" });
  }
  db.query(
    "INSERT INTO produits (nomproduits, prix) VALUES (?, ?)",
    [nomproduits, prix],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Erreur serveur" });
        return;
      }
      res.send({ message: "Produit ajouté avec succès", id: result.insertId });
    }
  );
});

// ✅ Modifier un produit
app.put("/data/:id", (req, res) => {
  const { nomproduits, prix } = req.body;
  const { id } = req.params;
  db.query(
    "UPDATE produits SET nomproduits = ?, prix = ? WHERE idproduits = ?",
    [nomproduits, prix, id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Erreur serveur" });
        return;
      }
      res.send({ message: "Produit modifié avec succès" });
    }
  );
});

// ✅ Supprimer un produit
app.delete("/data/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM produits WHERE idproduits = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Erreur serveur" });
      return;
    }
    res.send({ message: "Produit supprimé avec succès" });
  });
});

// ✅ Ajouter un user
app.post("/register", (req, res) => {
  const { username, motdepasse } = req.body;
  if (!username || !motdepasse) {
    return res.status(400).send({ message: "Champs manquants" });
  }
  db.query(
    "INSERT INTO users (username, motdepasse) VALUES (?, ?)",
    [username, motdepasse],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Erreur serveur" });
        return;
      }
      res.send({ message: "Utilisateur ajouté avec succès", id: result.insertId });
    }
  );
});


// Lancer le serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
