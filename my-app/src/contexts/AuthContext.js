"use client"

// Contexte d'authentification - Gère l'état de connexion et les fonctions associées
import { createContext, useState, useContext, useEffect } from "react"

// Création du contexte
const AuthContext = createContext()

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext)
}

// Composant fournisseur d'authentification
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  // Vérifier si l'utilisateur est admin
  const isAdmin = () => {
    return user && user.username === "Mouss42"
  }

  // Fonction de connexion
  const login = async (username, password) => {
    setIsLoading(true)
    setError(null)

    try {
      // Pour les besoins de la démo, on code en dur les identifiants admin
      if (username === "Mouss42" && password === "moussa123") {
        const userData = {
          username,
          isAdmin: true,
          email: "admin@example.com",
          createdAt: new Date().toISOString(),
          avatar: "/placeholder.svg?height=200&width=200",
        }

        // Simuler un token
        const fakeToken = "admin_jwt_token_" + Math.random().toString(36).substring(2)

        localStorage.setItem("token", fakeToken)
        localStorage.setItem("user", JSON.stringify(userData))

        setToken(fakeToken)
        setUser(userData)
        setIsAuthenticated(true)
        setIsLoading(false)
        return true
      }

      // Simulation d'une connexion réussie pour tout utilisateur
      // Dans une vraie application, on vérifierait avec le backend
      const userData = {
        username,
        isAdmin: username === "Mouss42",
        email: `${username}@example.com`, // Email simulé
        createdAt: new Date().toISOString(),
        avatar: "/placeholder.svg?height=200&width=200",
      }

      // Simuler un token
      const fakeToken = "user_jwt_token_" + Math.random().toString(36).substring(2)

      // Stocker le token et les infos utilisateur
      localStorage.setItem("token", fakeToken)
      localStorage.setItem("user", JSON.stringify(userData))

      setToken(fakeToken)
      setUser(userData)
      setIsAuthenticated(true)
      setIsLoading(false)
      return true
    } catch (err) {
      setError(err.message || "Erreur de connexion")
      setIsLoading(false)
      return false
    }
  }

  // Fonction d'inscription
  const register = async (userData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulation d'inscription pour la démo
      console.log("Tentative d'inscription avec:", userData)

      // Simuler un délai de traitement
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simuler une réponse réussie
      setIsLoading(false)
      return true
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription")
      setIsLoading(false)
      return false
    }
  }

  // Mettre à jour le profil utilisateur
  const updateProfile = async (updatedData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Dans une application réelle, vous enverriez ceci à votre API
      const updatedUser = { ...user, ...updatedData }

      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      setIsLoading(false)
      return true
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour du profil")
      setIsLoading(false)
      return false
    }
  }

  // Changer le mot de passe
  const changePassword = async (currentPassword, newPassword) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulation de changement de mot de passe
      console.log("Changement de mot de passe:", { currentPassword, newPassword })

      // Simuler un délai de traitement
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsLoading(false)
      return true
    } catch (err) {
      setError(err.message || "Erreur lors du changement de mot de passe")
      setIsLoading(false)
      return false
    }
  }

  // Supprimer le compte
  const deleteAccount = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulation de suppression de compte
      console.log("Suppression du compte utilisateur")

      // Simuler un délai de traitement
      await new Promise((resolve) => setTimeout(resolve, 1000))

      logout()
      setIsLoading(false)
      return true
    } catch (err) {
      setError(err.message || "Erreur lors de la suppression du compte")
      setIsLoading(false)
      return false
    }
  }

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  // Valeur du contexte
  const value = {
    isAuthenticated,
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    setError,
    isAdmin,
    updateProfile,
    changePassword,
    deleteAccount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

