"use client"

// Composant Register - Page d'inscription
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

/**
 * Composant de la page d'inscription
 * Permet aux utilisateurs de créer un nouveau compte
 */
function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    agreeTerms: false,
  })
  const navigate = useNavigate()
  const { register, isLoading, error, setError } = useAuth()

  /**
   * Gère les changements dans les champs du formulaire
   * @param {Event} e - L'événement de changement
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  /**
   * Gère la soumission du formulaire d'inscription
   * @param {Event} e - L'événement de soumission
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    if (!formData.agreeTerms) {
      setError("Vous devez accepter les conditions d'utilisation")
      return
    }

    const success = await register(formData)
    if (success) {
      navigate("/login")
    }
  }

  return (
    <div className="page-container auth-page">
      <div className="auth-container register-container">
        <div className="auth-header">
          <div className="auth-icon">📝</div>
          <h1 className="gradient-text">Inscription</h1>
          <p>Créez un compte pour commencer</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <div className="input-with-icon">
                <span className="input-icon">👤</span>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Votre prénom"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <div className="input-with-icon">
                <span className="input-icon">👤</span>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Votre nom"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">
              Nom d'utilisateur <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon">👤</span>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choisissez un nom d'utilisateur"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon">📧</span>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Entrez votre email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Mot de passe <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Créez un mot de passe"
                required
              />
            </div>
            <div className="password-strength">
              <div
                className={`strength-bar ${formData.password.length > 0 ? (formData.password.length < 6 ? "weak" : formData.password.length < 10 ? "medium" : "strong") : ""}`}
              ></div>
              <span className="strength-text">
                {formData.password.length === 0
                  ? "Force du mot de passe"
                  : formData.password.length < 6
                    ? "Faible"
                    : formData.password.length < 10
                      ? "Moyen"
                      : "Fort"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirmer le mot de passe <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmez votre mot de passe"
                required
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              required
            />
            <label htmlFor="agreeTerms">
              J'accepte les{" "}
              <a href="#" className="terms-link">
                conditions d'utilisation
              </a>{" "}
              et la{" "}
              <a href="#" className="terms-link">
                politique de confidentialité
              </a>
            </label>
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? <span className="button-loader"></span> : "S'inscrire"}
          </button>
        </form>

        <div className="auth-footer">
          <p>Vous avez déjà un compte ?</p>
          <Link to="/login" className="auth-link">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register

