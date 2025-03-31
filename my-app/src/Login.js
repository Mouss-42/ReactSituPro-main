import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(false); // Mode Connexion/Inscription

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      // Logique pour l'inscription
      fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, motdepasse }),
      })
        .then((res) => res.json())
        .then((data) => setMessage(data.message))
        .catch((err) => setMessage("Erreur lors de l'inscription"));
    } else {
      // Logique pour la connexion
      fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, motdepasse }),
      })
        .then((res) => res.json())
        .then((data) => setMessage(data.message))
        .catch((err) => setMessage("Erreur lors de la connexion"));
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>{isSignup ? "Inscription" : "Connexion"}</h2>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="motdepasse"
          placeholder="Mot de passe"
          value={motdepasse}
          onChange={(e) => setMotdepasse(e.target.value)}
          required
        />
        <button type="submit">{isSignup ? "S'inscrire" : "Se connecter"}</button>
      </form>

      <p className="toggle-text">
        {isSignup ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
        <span className="toggle-btn" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Connecte-toi" : "Inscris-toi"}
        </span>
      </p>

      <p>{message}</p>
    </div>
  );
}

export default Login;
