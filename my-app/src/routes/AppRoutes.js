"use client"

import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import "./App.css"

// Assuming Login component exists
const Login = () => (
  <div className="page-container">
    <h1>Connexion</h1>
  </div>
)

function Home() {
  return (
    <div className="page-container">
      <div className="home-content">
        <div className="home-icon">
          <div className="icon-placeholder">🛍️</div>
        </div>
        <h1>Bienvenue sur votre gestionnaire de produits</h1>
        <p className="home-subtitle">Gérez votre inventaire facilement et efficacement</p>
        <Link to="/produits" className="home-cta-button">
          Voir mes produits
        </Link>
      </div>
    </div>
  )
}

function GestionProduits() {
  const [produits, setProduits] = useState([])
  const [nomproduits, setNomproduits] = useState("")
  const [prix, setPrix] = useState("")
  const [editId, setEditId] = useState(null)
  const [isFormVisible, setIsFormVisible] = useState(false)

  useEffect(() => {
    fetchProduits()
  }, [])

  const fetchProduits = () => {
    fetch("http://localhost:5000/data")
      .then((response) => response.json())
      .then((data) => setProduits(data))
      .catch((error) => console.error("Erreur:", error))
  }

  const ajouterProduit = (e) => {
    e.preventDefault()
    const method = editId ? "PUT" : "POST"
    const url = editId ? `http://localhost:5000/data/${editId}` : "http://localhost:5000/data"

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nomproduits, prix }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Réponse du serveur:", data)
        fetchProduits()
        setNomproduits("")
        setPrix("")
        setEditId(null)
        setIsFormVisible(false)
      })
      .catch((error) => console.error("Erreur:", error))
  }

  const supprimerProduit = (id) => {
    fetch(`http://localhost:5000/data/${id}`, { method: "DELETE" })
      .then(() => fetchProduits())
      .catch((error) => console.error("Erreur:", error))
  }

  const modifierProduit = (produit) => {
    setNomproduits(produit.nomproduits)
    setPrix(produit.prix)
    setEditId(produit.idproduits)
    setIsFormVisible(true)
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Catalogue de Produits</h1>
        <button className="add-product-button" onClick={() => setIsFormVisible(!isFormVisible)}>
          {isFormVisible ? "✕ Annuler" : "➕ Ajouter un produit"}
        </button>
      </div>

      {isFormVisible && (
        <div className="form-wrapper">
          <form onSubmit={ajouterProduit} className="product-form">
            <div className="form-group">
              <label htmlFor="product-name">Nom du produit</label>
              <input
                id="product-name"
                type="text"
                placeholder="Entrez le nom du produit"
                value={nomproduits}
                onChange={(e) => setNomproduits(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="product-price">Prix (€)</label>
              <input
                id="product-price"
                type="number"
                placeholder="Entrez le prix"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              {editId ? "Mettre à jour" : "Ajouter au catalogue"}
            </button>
          </form>
        </div>
      )}

      <div className="products-grid">
        {produits.length > 0 ? (
          produits.map((produit) => (
            <div key={produit.idproduits} className="product-card">
              <div className="product-icon">
                <span className="icon-placeholder">📦</span>
              </div>
              <h3 className="product-name">{produit.nomproduits}</h3>
              <div className="product-price">{produit.prix} €</div>
              <div className="product-actions">
                <button className="edit-button" onClick={() => modifierProduit(produit)} aria-label="Modifier">
                  ✏️ Modifier
                </button>
                <button
                  className="delete-button"
                  onClick={() => supprimerProduit(produit.idproduits)}
                  aria-label="Supprimer"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="icon-placeholder large">📦</div>
            <p>Aucun produit dans le catalogue</p>
            <button className="add-product-button" onClick={() => setIsFormVisible(true)}>
              Ajouter votre premier produit
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Router>
      <div className="app-container">
        <header className="main-header">
          <div className="logo">
            <span className="logo-icon">🛍️</span>
            <span>ProductHub</span>
          </div>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              🏠 Accueil
            </Link>
            <Link to="/produits" onClick={() => setMenuOpen(false)}>
              📦 Produits
            </Link>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="login-link">
              🔑 Connexion
            </Link>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/produits" element={<GestionProduits />} />
          </Routes>
        </main>

        <footer className="main-footer">
          <p>© {new Date().getFullYear()} ProductHub - Tous droits réservés</p>
        </footer>
      </div>
    </Router>
  )
}

export default App

