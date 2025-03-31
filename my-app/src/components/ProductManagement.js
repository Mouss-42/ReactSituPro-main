"use client"

// Composant ProductManagement - Gestion des produits
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"

/**
 * Composant de gestion des produits
 * Permet d'afficher, ajouter, modifier et supprimer des produits
 */
function ProductManagement() {
  const [produits, setProduits] = useState([])
  const [nomproduits, setNomproduits] = useState("")
  const [prix, setPrix] = useState("")
  const [editId, setEditId] = useState(null)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [notification, setNotification] = useState(null)
  const { isAuthenticated, token, isAdmin } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  // Vérifier l'authentification au chargement
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    fetchProduits()
  }, [isAuthenticated, navigate])

  /**
   * Récupère la liste des produits depuis l'API
   */
  const fetchProduits = () => {
    setIsLoading(true)
    // Simulation d'une requête API
    setTimeout(() => {
      const mockProducts = [
        { idproduits: 1, nomproduits: "Ordinateur portable", prix: 899.99 },
        { idproduits: 2, nomproduits: "Smartphone", prix: 499.99 },
        { idproduits: 3, nomproduits: "Casque audio", prix: 129.99 },
        { idproduits: 4, nomproduits: "Clavier mécanique", prix: 89.99 },
        { idproduits: 5, nomproduits: "Souris sans fil", prix: 49.99 },
      ]
      setProduits(mockProducts)
      setIsLoading(false)
    }, 1000)
  }

  /**
   * Affiche une notification temporaire
   * @param {string} message - Le message à afficher
   * @param {string} type - Le type de notification (success, error)
   */
  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  /**
   * Ajoute ou met à jour un produit
   * @param {Event} e - L'événement de soumission
   */
  const ajouterProduit = (e) => {
    e.preventDefault()

    // Validation des champs
    if (!nomproduits || !prix) {
      showNotification("Veuillez remplir tous les champs", "error")
      return
    }

    // Simulation d'ajout/modification
    if (editId) {
      // Mise à jour d'un produit existant
      setProduits((prevProduits) =>
        prevProduits.map((produit) =>
          produit.idproduits === editId ? { ...produit, nomproduits, prix: Number(prix) } : produit,
        ),
      )
      showNotification("Produit mis à jour avec succès!")
    } else {
      // Ajout d'un nouveau produit
      const newId = Math.max(0, ...produits.map((p) => p.idproduits)) + 1
      setProduits((prevProduits) => [...prevProduits, { idproduits: newId, nomproduits, prix: Number(prix) }])
      showNotification("Produit ajouté avec succès!")
    }

    // Réinitialiser le formulaire
    setNomproduits("")
    setPrix("")
    setEditId(null)
    setIsFormVisible(false)
  }

  /**
   * Supprime un produit
   * @param {number} id - L'ID du produit à supprimer
   */
  const supprimerProduit = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit?")) {
      setProduits((prevProduits) => prevProduits.filter((produit) => produit.idproduits !== id))
      showNotification("Produit supprimé avec succès!")
    }
  }

  /**
   * Prépare le formulaire pour modifier un produit
   * @param {Object} produit - Le produit à modifier
   */
  const modifierProduit = (produit) => {
    setNomproduits(produit.nomproduits)
    setPrix(produit.prix)
    setEditId(produit.idproduits)
    setIsFormVisible(true)

    // Scroll vers le formulaire
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  /**
   * Ajoute un produit au panier
   * @param {Object} produit - Le produit à ajouter au panier
   */
  const handleAddToCart = (produit) => {
    addToCart({
      id: produit.idproduits,
      name: produit.nomproduits,
      price: produit.prix,
    })
    showNotification(`${produit.nomproduits} ajouté au panier!`)
  }

  return (
    <div className="products-page">
      {notification && <div className={`notification ${notification.type}`}>{notification.message}</div>}

      <div className="products-header">
        <h1 className="gradient-text">Catalogue de Produits</h1>
        {isAdmin() && (
          <button className="add-product-button" onClick={() => setIsFormVisible(!isFormVisible)}>
            {isFormVisible ? "✕ Annuler" : "➕ Ajouter un produit"}
          </button>
        )}
      </div>

      {isFormVisible && isAdmin() && (
        <div className="form-wrapper slide-down">
          <form onSubmit={ajouterProduit} className="product-form">
            <div className="form-group">
              <label htmlFor="product-name">Nom du produit</label>
              <div className="input-with-icon">
                <span className="input-icon">📦</span>
                <input
                  id="product-name"
                  type="text"
                  placeholder="Entrez le nom du produit"
                  value={nomproduits}
                  onChange={(e) => setNomproduits(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="product-price">Prix (€)</label>
              <div className="input-with-icon">
                <span className="input-icon">💰</span>
                <input
                  id="product-price"
                  type="number"
                  placeholder="Entrez le prix"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="submit-button">
              {editId ? "✅ Mettre à jour" : "✅ Ajouter au catalogue"}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des produits...</p>
        </div>
      ) : (
        <div className="products-grid">
          {produits.length > 0 ? (
            produits.map((produit, index) => (
              <div key={produit.idproduits} className="product-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="product-badge">Produit #{produit.idproduits}</div>
                <div className="product-icon">
                  <span className="icon-placeholder">📦</span>
                </div>
                <h3 className="product-name">{produit.nomproduits}</h3>
                <div className="product-price">{produit.prix} €</div>
                <div className="product-actions">
                  <button
                    className="cart-add-button"
                    onClick={() => handleAddToCart(produit)}
                    aria-label="Ajouter au panier"
                  >
                    🛒 Ajouter
                  </button>

                  {isAdmin() && (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="icon-placeholder large pulse">📦</div>
              <p>Aucun produit dans le catalogue</p>
              {isAdmin() && (
                <button className="add-product-button" onClick={() => setIsFormVisible(true)}>
                  Ajouter votre premier produit
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductManagement

