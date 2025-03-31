// Composant Footer - Pied de page de l'application
import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Composant de pied de page avec liens et informations de contact
 */
function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">ProductHub</h3>
          <p className="footer-description">
            Votre solution complète pour la gestion de produits et d'inventaire.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <span className="social-icon">📘</span>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <span className="social-icon">📗</span>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <span className="social-icon">📷</span>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <span className="social-icon">📊</span>
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Liens utiles</h3>
          <ul className="footer-links-list">
            <li>
              <Link to="/" className="footer-link">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/produits" className="footer-link">
                Produits
              </Link>
            </li>
            <li>
              <Link to="/panier" className="footer-link">
                Panier
              </Link>
            </li>
            <li>
              <a href="#" className="footer-link">
                À propos
              </a>
            </li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Contact</h3>
          <address className="footer-contact">
            <p>
              <span className="contact-icon">📍</span> 123 Rue du Commerce, 75001 Paris
            </p>
            <p>
              <span className="contact-icon">📞</span> +33 1 23 45 67 89
            </p>
            <p>
              <span className="contact-icon">📧</span> contact@producthub.com
            </p>
          </address>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {currentYear} ProductHub - Tous droits réservés</p>
        <div className="legal-links">
          <a href="#" className="legal-link">
            Mentions légales
          </a>
          <a href="#" className="legal-link">
            Politique de confidentialité
          </a>
          <a href="#" className="legal-link">
            CGV
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
