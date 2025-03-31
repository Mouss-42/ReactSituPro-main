// Composant Login - Page de connexion
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Composant de la page de connexion
 * Permet aux utilisateurs de se connecter à leur compte
 */
function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()
  const { login, isLoading, error, setError } = useAuth()
  
  /**
   * Gère la soumission du formulaire de connexion
   * @param {Event} e - L'événement de soumission
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation des champs
    if (!username || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }
    
    // Tentative de connexion
    const success = await login(username, password)
    if (success) {
      navigate('/produits')
    }
  }
  
  return (
    <div className="page-container auth-page">
      <div className="auth-container login-container">
        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h1 className="gradient-text">Connexion</h1>
          <p>Connectez-vous pour gérer vos produits</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <div className="input-with-icon">
              <span className="input-icon">👤</span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Entrez votre nom d'utilisateur"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>
          </div>
          
          <div className="form-options">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me">Se souvenir de moi</label>
            </div>
            <a href="#" className="forgot-password">
              Mot de passe oublié ?
            </a>
          </div>
          
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? <span className="button-loader"></span> : 'Se connecter'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Vous n'avez pas de compte ?</p>
          <Link to="/register" className="auth-link">
            Créer un compte
          </Link>
        </div>
        
        <div className="auth-note">
          <p>
            <strong>Note:</strong> Pour tester les fonctionnalités admin, connectez-vous avec:
          </p>
          <p>
            Nom d'utilisateur: <strong>Mouss42</strong>
          </p>
          <p>
            Mot de passe: <strong>moussa123</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
