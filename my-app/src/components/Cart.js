"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"

/**
 * Composant du panier d'achat
 * Affiche les articles du panier et permet de passer à la caisse
 */
function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, calculateTotal } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  /**
   * Redirige vers la page de paiement
   * Si l'utilisateur n'est pas connecté, redirige vers la page de connexion
   */
  const proceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/panier" } })
      return
    }

    navigate("/checkout")
  }

  // Affichage du panier vide
  if (cartItems.length === 0) {
    return (
      <div className="page-container">
        <div className="cart-container">
          <h1 className="gradient-text">Votre Panier</h1>

          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <p>Votre panier est vide</p>
            <Link to="/produits" className="cart-button primary">
              Parcourir les produits
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="cart-container">
        <h1 className="gradient-text">Votre Panier</h1>

        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={item.id} className="cart-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">{Number(item.price).toFixed(2)} €</div>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-control">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="quantity-btn">
                    +
                  </button>
                </div>

                <div className="cart-item-subtotal">{(Number(item.price) * item.quantity).toFixed(2)} €</div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-item-btn"
                  aria-label="Supprimer du panier"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-total">
            <span>Total:</span>
            <span>{calculateTotal().toFixed(2)} €</span>
          </div>

          <div className="cart-buttons">
            <button onClick={clearCart} className="cart-button secondary">
              Vider le panier
            </button>
            <button onClick={proceedToCheckout} className="cart-button primary">
              Passer à la caisse
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

