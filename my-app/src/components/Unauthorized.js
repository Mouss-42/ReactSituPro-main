import { Link } from "react-router-dom"

/**
 * Composant de la page d'accès non autorisé
 * Affiché lorsqu'un utilisateur tente d'accéder à une page sans les permissions nécessaires
 */
function Unauthorized() {
  return (
    <div className="page-container">
      <div className="unauthorized-container">
        <div className="unauthorized-icon">🔒</div>
        <h1 className="gradient-text">Accès non autorisé</h1>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <Link to="/" className="home-cta-button primary">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}

export default Unauthorized

