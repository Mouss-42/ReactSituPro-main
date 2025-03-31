"use client"

// Contexte du panier - Gère l'état du panier et les fonctions associées
import { createContext, useState, useContext, useEffect } from "react"

// Création du contexte
const CartContext = createContext()

// Hook personnalisé pour utiliser le contexte du panier
export const useCart = () => {
  return useContext(CartContext)
}

// Composant fournisseur du panier
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      setCartItems(parsedCart)
      updateCartCount(parsedCart)
    }
  }, [])

  // Sauvegarder le panier dans localStorage quand il change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
    updateCartCount(cartItems)
  }, [cartItems])

  // Mettre à jour le compteur du panier
  const updateCartCount = (items) => {
    const count = items.reduce((total, item) => total + item.quantity, 0)
    setCartCount(count)
  }

  // Ajouter un article au panier
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Vérifier si l'article existe déjà dans le panier
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        // Augmenter la quantité si l'article existe
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // Ajouter un nouvel article avec quantité 1
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
  }

  // Supprimer un article du panier
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // Mettre à jour la quantité d'un article
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return

    setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // Vider le panier
  const clearCart = () => {
    setCartItems([])
  }

  // Calculer le total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0)
  }

  // Valeur du contexte
  const value = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

