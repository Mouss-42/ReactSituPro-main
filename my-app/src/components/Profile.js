"use client"

import { useState, useEffect } from "react"
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

// Profile main component
export default function Profile() {
  const location = useLocation()

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-nav">
            <Link to="/profile" className={`profile-nav-item ${location.pathname === "/profile" ? "active" : ""}`}>
              <span className="nav-icon">👤</span>
              <span>Informations personnelles</span>
            </Link>

            <Link
              to="/profile/settings"
              className={`profile-nav-item ${location.pathname === "/profile/settings" ? "active" : ""}`}
            >
              <span className="nav-icon">⚙️</span>
              <span>Paramètres du compte</span>
            </Link>

            <Link
              to="/profile/orders"
              className={`profile-nav-item ${location.pathname === "/profile/orders" ? "active" : ""}`}
            >
              <span className="nav-icon">📦</span>
              <span>Mes commandes</span>
            </Link>

            <Link
              to="/profile/security"
              className={`profile-nav-item ${location.pathname === "/profile/security" ? "active" : ""}`}
            >
              <span className="nav-icon">🔒</span>
              <span>Sécurité</span>
            </Link>
          </div>
        </div>

        <div className="profile-content">
          <Routes>
            <Route path="/" element={<ProfileInfo />} />
            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="/orders" element={<ProfileOrders />} />
            <Route path="/security" element={<ProfileSecurity />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

// Profile information component
function ProfileInfo() {
  const { user, updateProfile, isLoading, error, setError } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        bio: user.bio || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.username || !formData.email) {
      setError("Le nom d'utilisateur et l'email sont requis")
      return
    }

    const success = await updateProfile(formData)

    if (success) {
      setIsEditing(false)
      setNotification({
        type: "success",
        message: "Profil mis à jour avec succès!",
      })

      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  return (
    <div className="profile-section">
      <div className="section-header">
        <h2 className="section-title">Informations personnelles</h2>
        <button className={`edit-button ${isEditing ? "cancel" : ""}`} onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Annuler" : "Modifier"}
        </button>
      </div>

      {notification && <div className={`notification ${notification.type}`}>{notification.message}</div>}

      {error && <div className="error-message">{error}</div>}

      <div className="profile-info-container">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <img
              src={user?.avatar || "/placeholder.svg?height=200&width=200"}
              alt="Avatar"
              className="avatar-image-large"
            />
            {user?.isAdmin && <span className="admin-badge-large">Admin</span>}
          </div>

          {isEditing && <button className="change-avatar-button">Changer l'avatar</button>}
        </div>

        <div className="profile-details">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Prénom</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Votre prénom"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Nom</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Votre nom d'utilisateur"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Votre email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Votre numéro de téléphone"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Quelques mots à propos de vous"
                  rows={4}
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
                  Annuler
                </button>
                <button type="submit" className="save-button" disabled={isLoading}>
                  {isLoading ? <span className="button-loader"></span> : "Enregistrer"}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info-list">
              <div className="info-item">
                <div className="info-label">Nom d'utilisateur</div>
                <div className="info-value">{user?.username}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Email</div>
                <div className="info-value">{user?.email}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Nom complet</div>
                <div className="info-value">
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Non renseigné"}
                </div>
              </div>

              <div className="info-item">
                <div className="info-label">Téléphone</div>
                <div className="info-value">{user?.phone || "Non renseigné"}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Bio</div>
                <div className="info-value bio-text">{user?.bio || "Aucune bio renseignée"}</div>
              </div>

              <div className="info-item">
                <div className="info-label">Type de compte</div>
                <div className="info-value">
                  {user?.isAdmin ? (
                    <span className="account-type admin">Administrateur</span>
                  ) : (
                    <span className="account-type user">Utilisateur</span>
                  )}
                </div>
              </div>

              <div className="info-item">
                <div className="info-label">Date d'inscription</div>
                <div className="info-value">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Inconnue"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Profile settings component
function ProfileSettings() {
  const { user, updateProfile, isLoading, error, setError } = useAuth()
  const [notification, setNotification] = useState(null)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    orderUpdates: true,
    darkMode: localStorage.getItem("theme") === "dark",
    language: "fr",
  })

  const handleToggle = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Update theme if changed
    if (settings.darkMode) {
      localStorage.setItem("theme", "dark")
      document.body.setAttribute("data-theme", "dark")
    } else {
      localStorage.setItem("theme", "light")
      document.body.setAttribute("data-theme", "light")
    }

    // Simulate saving settings
    setNotification({
      type: "success",
      message: "Paramètres mis à jour avec succès!",
    })

    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  return (
    <div className="profile-section">
      <div className="section-header">
        <h2 className="section-title">Paramètres du compte</h2>
      </div>

      {notification && <div className={`notification ${notification.type}`}>{notification.message}</div>}

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-group">
          <h3 className="settings-group-title">Notifications</h3>

          <div className="toggle-setting">
            <div className="toggle-info">
              <label htmlFor="emailNotifications">Notifications par email</label>
              <p className="setting-description">Recevoir des emails pour les activités importantes</p>
            </div>
            <div className="toggle-control">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.emailNotifications}
                onChange={() => handleToggle("emailNotifications")}
                className="toggle-checkbox"
              />
              <label htmlFor="emailNotifications" className="toggle-label"></label>
            </div>
          </div>

          <div className="toggle-setting">
            <div className="toggle-info">
              <label htmlFor="marketingEmails">Emails marketing</label>
              <p className="setting-description">Recevoir des offres et promotions par email</p>
            </div>
            <div className="toggle-control">
              <input
                type="checkbox"
                id="marketingEmails"
                checked={settings.marketingEmails}
                onChange={() => handleToggle("marketingEmails")}
                className="toggle-checkbox"
              />
              <label htmlFor="marketingEmails" className="toggle-label"></label>
            </div>
          </div>

          <div className="toggle-setting">
            <div className="toggle-info">
              <label htmlFor="orderUpdates">Mises à jour des commandes</label>
              <p className="setting-description">Recevoir des notifications sur l'état de vos commandes</p>
            </div>
            <div className="toggle-control">
              <input
                type="checkbox"
                id="orderUpdates"
                checked={settings.orderUpdates}
                onChange={() => handleToggle("orderUpdates")}
                className="toggle-checkbox"
              />
              <label htmlFor="orderUpdates" className="toggle-label"></label>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <h3 className="settings-group-title">Préférences</h3>

          <div className="toggle-setting">
            <div className="toggle-info">
              <label htmlFor="darkMode">Mode sombre</label>
              <p className="setting-description">Utiliser le thème sombre pour l'interface</p>
            </div>
            <div className="toggle-control">
              <input
                type="checkbox"
                id="darkMode"
                checked={settings.darkMode}
                onChange={() => handleToggle("darkMode")}
                className="toggle-checkbox"
              />
              <label htmlFor="darkMode" className="toggle-label"></label>
            </div>
          </div>

          <div className="select-setting">
            <div className="select-info">
              <label htmlFor="language">Langue</label>
              <p className="setting-description">Choisir la langue de l'interface</p>
            </div>
            <div className="select-control">
              <select
                id="language"
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="settings-select"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? <span className="button-loader"></span> : "Enregistrer les paramètres"}
          </button>
        </div>
      </form>
    </div>
  )
}

// Profile orders component
function ProfileOrders() {
  const [orders, setOrders] = useState([
    {
      id: "ORD-2023-001",
      date: "2023-05-15",
      status: "delivered",
      total: 129.99,
      items: [
        { id: 1, name: "Ordinateur portable", price: 899, quantity: 1 },
        { id: 2, name: "Écouteurs sans fil", price: 129, quantity: 2 },
      ],
    },
    {
      id: "ORD-2023-002",
      date: "2023-06-22",
      status: "processing",
      total: 49.99,
      items: [{ id: 3, name: "Clavier mécanique", price: 49.99, quantity: 1 }],
    },
    {
      id: "ORD-2023-003",
      date: "2023-07-10",
      status: "shipped",
      total: 199.98,
      items: [{ id: 4, name: 'Moniteur 24"', price: 199.98, quantity: 1 }],
    },
  ])

  const [expandedOrder, setExpandedOrder] = useState(null)

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "processing":
        return { label: "En traitement", className: "status-processing" }
      case "shipped":
        return { label: "Expédié", className: "status-shipped" }
      case "delivered":
        return { label: "Livré", className: "status-delivered" }
      case "cancelled":
        return { label: "Annulé", className: "status-cancelled" }
      default:
        return { label: status, className: "" }
    }
  }

  return (
    <div className="profile-section">
      <div className="section-header">
        <h2 className="section-title">Mes commandes</h2>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">📦</div>
          <p>Vous n'avez pas encore passé de commande</p>
          <Link to="/produits" className="shop-now-button">
            Commencer vos achats
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const { label, className } = getStatusLabel(order.status)

            return (
              <div key={order.id} className="order-card">
                <div className="order-header" onClick={() => toggleOrderDetails(order.id)}>
                  <div className="order-info">
                    <div className="order-id">{order.id}</div>
                    <div className="order-date">
                      {new Date(order.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="order-summary">
                    <div className={`order-status ${className}`}>{label}</div>
                    <div className="order-total">{order.total.toFixed(2)} €</div>
                    <div className="order-toggle">{expandedOrder === order.id ? "▲" : "▼"}</div>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="order-details">
                    <h4 className="details-title">Détails de la commande</h4>

                    <div className="order-items">
                      {order.items.map((item) => (
                        <div key={item.id} className="order-item">
                          <div className="item-info">
                            <div className="item-name">{item.name}</div>
                            <div className="item-price">{item.price.toFixed(2)} €</div>
                          </div>
                          <div className="item-quantity">x{item.quantity}</div>
                          <div className="item-total">{(item.price * item.quantity).toFixed(2)} €</div>
                        </div>
                      ))}
                    </div>

                    <div className="order-actions">
                      <button className="order-action-button">Suivre la commande</button>
                      <button className="order-action-button">Télécharger la facture</button>
                      {order.status !== "delivered" && order.status !== "cancelled" && (
                        <button className="order-action-button cancel">Annuler la commande</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Profile security component
function ProfileSecurity() {
  const { changePassword, deleteAccount, isLoading, error, setError } = useAuth()
  const [notification, setNotification] = useState(null)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const navigate = useNavigate()

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError("Tous les champs sont requis")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères")
      return
    }

    const success = await changePassword(passwordData.currentPassword, passwordData.newPassword)

    if (success) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setNotification({
        type: "success",
        message: "Mot de passe modifié avec succès!",
      })

      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "SUPPRIMER") {
      setError("Veuillez saisir SUPPRIMER pour confirmer")
      return
    }

    const success = await deleteAccount()

    if (success) {
      navigate("/")
    }
  }

  return (
    <div className="profile-section">
      <div className="section-header">
        <h2 className="section-title">Sécurité</h2>
      </div>

      {notification && <div className={`notification ${notification.type}`}>{notification.message}</div>}

      {error && <div className="error-message">{error}</div>}

      <div className="security-section">
        <h3 className="subsection-title">Changer le mot de passe</h3>

        <form onSubmit={handlePasswordSubmit} className="password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Mot de passe actuel</label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Entrez votre mot de passe actuel"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nouveau mot de passe</label>
            <div className="input-with-icon">
              <span className="input-icon">🔑</span>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Entrez votre nouveau mot de passe"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
            <div className="input-with-icon">
              <span className="input-icon">🔑</span>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirmez votre nouveau mot de passe"
                required
              />
            </div>
          </div>

          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? <span className="button-loader"></span> : "Changer le mot de passe"}
          </button>
        </form>
      </div>

      <div className="security-section danger-zone">
        <h3 className="subsection-title">Zone de danger</h3>

        <div className="danger-action">
          <div className="danger-info">
            <h4 className="danger-title">Supprimer le compte</h4>
            <p className="danger-description">
              Cette action est irréversible. Toutes vos données seront définitivement supprimées.
            </p>
          </div>

          {!showDeleteConfirm ? (
            <button className="danger-button" onClick={() => setShowDeleteConfirm(true)}>
              Supprimer mon compte
            </button>
          ) : (
            <div className="delete-confirmation">
              <p className="confirmation-text">
                Pour confirmer, veuillez saisir <strong>SUPPRIMER</strong> ci-dessous:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="SUPPRIMER"
                className="confirmation-input"
              />
              <div className="confirmation-actions">
                <button
                  className="cancel-button"
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText("")
                  }}
                >
                  Annuler
                </button>
                <button className="danger-button" onClick={handleDeleteAccount} disabled={isLoading}>
                  {isLoading ? <span className="button-loader"></span> : "Confirmer la suppression"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

