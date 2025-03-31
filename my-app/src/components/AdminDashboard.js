import { Link } from "react-router-dom"

/**
 * Composant du tableau de bord administrateur
 * Affiche des statistiques et des liens vers les fonctionnalités d'administration
 */
function AdminDashboard() {
  return (
    <div className="page-container">
      <div className="admin-dashboard">
        <h1 className="gradient-text">Tableau de bord administrateur</h1>
        <p className="admin-subtitle">Gérez votre boutique et vos utilisateurs</p>

        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-value">42</div>
            <div className="stat-label">Produits</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">128</div>
            <div className="stat-label">Utilisateurs</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-value">56</div>
            <div className="stat-label">Commandes</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-value">4,280 €</div>
            <div className="stat-label">Revenus</div>
          </div>
        </div>

        <div className="admin-actions">
          <Link to="/produits" className="admin-action-button">
            <span className="action-icon">📦</span>
            <span>Gérer les produits</span>
          </Link>

          <Link to="/admin/users" className="admin-action-button">
            <span className="action-icon">👥</span>
            <span>Gérer les utilisateurs</span>
          </Link>

          <Link to="/admin/orders" className="admin-action-button">
            <span className="action-icon">🛒</span>
            <span>Gérer les commandes</span>
          </Link>

          <Link to="/admin/settings" className="admin-action-button">
            <span className="action-icon">⚙️</span>
            <span>Paramètres</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

