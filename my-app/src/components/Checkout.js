"use client"

import { useState, useEffect } from "react"
import { Routes, Route, Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"

// Composant principal de checkout
export default function Checkout() {
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <Routes>
          <Route path="/" element={<CheckoutSteps />} />
          <Route path="/success" element={<OrderSuccess />} />
        </Routes>
      </div>
    </div>
  )
}

// Composant des étapes de paiement
function CheckoutSteps() {
  const { user } = useAuth()
  const { cartItems, calculateTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Informations de livraison
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",

    // Informations de facturation
    sameAsShipping: true,
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingCity: "",
    billingPostalCode: "",
    billingCountry: "France",

    // Informations de paiement
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    savePaymentInfo: false,
  })

  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/panier")
    }
  }, [cartItems, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))

      // Effacer l'erreur lorsque le champ est modifié
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }))
      }
    }

    // Si sameAsShipping est coché, copier les infos de livraison vers facturation
    if (name === "sameAsShipping" && checked) {
      setFormData((prev) => ({
        ...prev,
        billingFirstName: prev.firstName,
        billingLastName: prev.lastName,
        billingAddress: prev.address,
        billingCity: prev.city,
        billingPostalCode: prev.postalCode,
        billingCountry: prev.country,
      }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      // Valider les informations de livraison
      if (!formData.firstName) newErrors.firstName = "Le prénom est requis"
      if (!formData.lastName) newErrors.lastName = "Le nom est requis"
      if (!formData.email) newErrors.email = "L'email est requis"
      if (!formData.phone) newErrors.phone = "Le téléphone est requis"
      if (!formData.address) newErrors.address = "L'adresse est requise"
      if (!formData.city) newErrors.city = "La ville est requise"
      if (!formData.postalCode) newErrors.postalCode = "Le code postal est requis"
    } else if (step === 2 && !formData.sameAsShipping) {
      // Valider les informations de facturation si différentes de la livraison
      if (!formData.billingFirstName) newErrors.billingFirstName = "Le prénom est requis"
      if (!formData.billingLastName) newErrors.billingLastName = "Le nom est requis"
      if (!formData.billingAddress) newErrors.billingAddress = "L'adresse est requise"
      if (!formData.billingCity) newErrors.billingCity = "La ville est requise"
      if (!formData.billingPostalCode) newErrors.billingPostalCode = "Le code postal est requis"
    } else if (step === 3) {
      // Valider les informations de paiement
      if (!formData.cardName) newErrors.cardName = "Le nom sur la carte est requis"
      if (!formData.cardNumber) newErrors.cardNumber = "Le numéro de carte est requis"
      if (!formData.cardExpiry) newErrors.cardExpiry = "La date d'expiration est requise"
      if (!formData.cardCVC) newErrors.cardCVC = "Le code de sécurité est requis"

      // Validation supplémentaire de la carte
      if (formData.cardNumber && !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Le numéro de carte doit contenir 16 chiffres"
      }
      if (formData.cardExpiry && !/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = "Format invalide (MM/YY)"
      }
      if (formData.cardCVC && !/^\d{3,4}$/.test(formData.cardCVC)) {
        newErrors.cardCVC = "Le code de sécurité doit contenir 3 ou 4 chiffres"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value)
    setFormData((prev) => ({
      ...prev,
      cardNumber: formattedValue,
    }))

    if (errors.cardNumber) {
      setErrors((prev) => ({
        ...prev,
        cardNumber: "",
      }))
    }
  }

  const handleCardExpiryChange = (e) => {
    let { value } = e.target
    value = value.replace(/\D/g, "")

    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4)
    }

    setFormData((prev) => ({
      ...prev,
      cardExpiry: value,
    }))

    if (errors.cardExpiry) {
      setErrors((prev) => ({
        ...prev,
        cardExpiry: "",
      }))
    }
  }

  const placeOrder = () => {
    if (validateStep(currentStep)) {
      setIsProcessing(true)

      // Simuler le traitement de la commande
      setTimeout(() => {
        clearCart()
        navigate("/checkout/success")
      }, 2000)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="checkout-step shipping-step">
            <h3 className="step-title">Informations de livraison</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">
                  Prénom <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? "error" : ""}
                />
                {errors.firstName && <div className="error-text">{errors.firstName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">
                  Nom <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? "error" : ""}
                />
                {errors.lastName && <div className="error-text">{errors.lastName}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <div className="error-text">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Téléphone <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && <div className="error-text">{errors.phone}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">
                Adresse <span className="required">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? "error" : ""}
              />
              {errors.address && <div className="error-text">{errors.address}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">
                  Ville <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? "error" : ""}
                />
                {errors.city && <div className="error-text">{errors.city}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="postalCode">
                  Code postal <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className={errors.postalCode ? "error" : ""}
                />
                {errors.postalCode && <div className="error-text">{errors.postalCode}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="country">Pays</label>
              <select id="country" name="country" value={formData.country} onChange={handleChange}>
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Canada">Canada</option>
                <option value="Luxembourg">Luxembourg</option>
              </select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="checkout-step billing-step">
            <h3 className="step-title">Informations de facturation</h3>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="sameAsShipping"
                name="sameAsShipping"
                checked={formData.sameAsShipping}
                onChange={handleChange}
              />
              <label htmlFor="sameAsShipping">Utiliser la même adresse que pour la livraison</label>
            </div>

            {!formData.sameAsShipping && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="billingFirstName">
                      Prénom <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="billingFirstName"
                      name="billingFirstName"
                      value={formData.billingFirstName}
                      onChange={handleChange}
                      className={errors.billingFirstName ? "error" : ""}
                    />
                    {errors.billingFirstName && <div className="error-text">{errors.billingFirstName}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="billingLastName">
                      Nom <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="billingLastName"
                      name="billingLastName"
                      value={formData.billingLastName}
                      onChange={handleChange}
                      className={errors.billingLastName ? "error" : ""}
                    />
                    {errors.billingLastName && <div className="error-text">{errors.billingLastName}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="billingAddress">
                    Adresse <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="billingAddress"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleChange}
                    className={errors.billingAddress ? "error" : ""}
                  />
                  {errors.billingAddress && <div className="error-text">{errors.billingAddress}</div>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="billingCity">
                      Ville <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="billingCity"
                      name="billingCity"
                      value={formData.billingCity}
                      onChange={handleChange}
                      className={errors.billingCity ? "error" : ""}
                    />
                    {errors.billingCity && <div className="error-text">{errors.billingCity}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="billingPostalCode">
                      Code postal <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="billingPostalCode"
                      name="billingPostalCode"
                      value={formData.billingPostalCode}
                      onChange={handleChange}
                      className={errors.billingPostalCode ? "error" : ""}
                    />
                    {errors.billingPostalCode && <div className="error-text">{errors.billingPostalCode}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="billingCountry">Pays</label>
                  <select
                    id="billingCountry"
                    name="billingCountry"
                    value={formData.billingCountry}
                    onChange={handleChange}
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Canada">Canada</option>
                    <option value="Luxembourg">Luxembourg</option>
                  </select>
                </div>
              </>
            )}
          </div>
        )

      case 3:
        return (
          <div className="checkout-step payment-step">
            <h3 className="step-title">Informations de paiement</h3>

            <div className="payment-methods">
              <div className="payment-method selected">
                <input type="radio" id="creditCard" name="paymentMethod" checked readOnly />
                <label htmlFor="creditCard">Carte de crédit</label>
              </div>

              <div className="payment-method disabled">
                <input type="radio" id="paypal" name="paymentMethod" disabled />
                <label htmlFor="paypal">PayPal</label>
              </div>

              <div className="payment-method disabled">
                <input type="radio" id="bankTransfer" name="paymentMethod" disabled />
                <label htmlFor="bankTransfer">Virement bancaire</label>
              </div>
            </div>

            <div className="credit-card-form">
              <div className="form-group">
                <label htmlFor="cardName">
                  Nom sur la carte <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="Ex: JEAN DUPONT"
                  className={errors.cardName ? "error" : ""}
                />
                {errors.cardName && <div className="error-text">{errors.cardName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">
                  Numéro de carte <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="XXXX XXXX XXXX XXXX"
                  maxLength="19"
                  className={errors.cardNumber ? "error" : ""}
                />
                {errors.cardNumber && <div className="error-text">{errors.cardNumber}</div>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cardExpiry">
                    Date d'expiration <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="cardExpiry"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleCardExpiryChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    className={errors.cardExpiry ? "error" : ""}
                  />
                  {errors.cardExpiry && <div className="error-text">{errors.cardExpiry}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="cardCVC">
                    Code de sécurité <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="cardCVC"
                    name="cardCVC"
                    value={formData.cardCVC}
                    onChange={handleChange}
                    placeholder="CVC"
                    maxLength="4"
                    className={errors.cardCVC ? "error" : ""}
                  />
                  {errors.cardCVC && <div className="error-text">{errors.cardCVC}</div>}
                </div>
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="savePaymentInfo"
                  name="savePaymentInfo"
                  checked={formData.savePaymentInfo}
                  onChange={handleChange}
                />
                <label htmlFor="savePaymentInfo">Sauvegarder ces informations pour mes prochains achats</label>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="checkout-step review-step">
            <h3 className="step-title">Récapitulatif de la commande</h3>

            <div className="order-summary">
              <div className="summary-section">
                <h4 className="summary-title">Articles</h4>
                <div className="summary-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="summary-item">
                      <div className="item-info">
                        <div className="item-name">{item.name}</div>
                        <div className="item-price">{Number(item.price).toFixed(2)} €</div>
                      </div>
                      <div className="item-quantity">x{item.quantity}</div>
                      <div className="item-total">{(Number(item.price) * item.quantity).toFixed(2)} €</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="summary-section">
                <h4 className="summary-title">Livraison</h4>
                <div className="address-summary">
                  <p>
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p>{formData.address}</p>
                  <p>
                    {formData.postalCode} {formData.city}
                  </p>
                  <p>{formData.country}</p>
                  <p>Tél: {formData.phone}</p>
                </div>
              </div>

              <div className="summary-section">
                <h4 className="summary-title">Facturation</h4>
                <div className="address-summary">
                  {formData.sameAsShipping ? (
                    <p>Identique à l'adresse de livraison</p>
                  ) : (
                    <>
                      <p>
                        {formData.billingFirstName} {formData.billingLastName}
                      </p>
                      <p>{formData.billingAddress}</p>
                      <p>
                        {formData.billingPostalCode} {formData.billingCity}
                      </p>
                      <p>{formData.billingCountry}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="summary-section">
                <h4 className="summary-title">Paiement</h4>
                <div className="payment-summary">
                  <p>Carte de crédit</p>
                  <p>**** **** **** {formData.cardNumber.slice(-4)}</p>
                  <p>Expire: {formData.cardExpiry}</p>
                </div>
              </div>

              <div className="summary-section totals">
                <div className="total-row">
                  <span>Sous-total:</span>
                  <span>{calculateTotal().toFixed(2)} €</span>
                </div>
                <div className="total-row">
                  <span>Frais de livraison:</span>
                  <span>5.99 €</span>
                </div>
                <div className="total-row">
                  <span>TVA (20%):</span>
                  <span>{(calculateTotal() * 0.2).toFixed(2)} €</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>{(calculateTotal() + 5.99).toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <h1 className="gradient-text">Finaliser votre commande</h1>

      <div className="checkout-progress">
        <div className={`progress-step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
          <div className="step-number">1</div>
          <div className="step-label">Livraison</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
          <div className="step-number">2</div>
          <div className="step-label">Facturation</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 3 ? "active" : ""} ${currentStep > 3 ? "completed" : ""}`}>
          <div className="step-number">3</div>
          <div className="step-label">Paiement</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 4 ? "active" : ""}`}>
          <div className="step-number">4</div>
          <div className="step-label">Récapitulatif</div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-form">
          {renderStepContent()}

          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" className="back-button" onClick={prevStep}>
                Retour
              </button>
            )}

            {currentStep < 4 ? (
              <button type="button" className="next-button" onClick={nextStep}>
                Continuer
              </button>
            ) : (
              <button type="button" className="place-order-button" onClick={placeOrder} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <span className="button-loader"></span>
                    <span>Traitement en cours...</span>
                  </>
                ) : (
                  "Passer la commande"
                )}
              </button>
            )}
          </div>
        </div>

        <div className="checkout-sidebar">
          <div className="order-summary-card">
            <h3 className="summary-title">Récapitulatif</h3>

            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="item-name">
                    {item.name} <span className="item-quantity">x{item.quantity}</span>
                  </div>
                  <div className="item-price">{(Number(item.price) * item.quantity).toFixed(2)} €</div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Sous-total:</span>
                <span>{calculateTotal().toFixed(2)} €</span>
              </div>
              <div className="total-row">
                <span>Livraison:</span>
                <span>5.99 €</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>{(calculateTotal() + 5.99).toFixed(2)} €</span>
              </div>
            </div>

            <Link to="/panier" className="edit-cart-link">
              Modifier le panier
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

// Composant de succès de commande
function OrderSuccess() {
  const navigate = useNavigate()
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`

  return (
    <div className="order-success">
      <div className="success-icon">✓</div>
      <h1 className="gradient-text">Commande confirmée !</h1>
      <p className="success-message">
        Merci pour votre commande. Votre numéro de commande est <strong>{orderNumber}</strong>.
      </p>
      <p className="success-details">Vous recevrez un email de confirmation avec les détails de votre commande.</p>

      <div className="success-actions">
        <button className="view-order-button" onClick={() => navigate("/profile/orders")}>
          Voir mes commandes
        </button>
        <button className="continue-shopping-button" onClick={() => navigate("/produits")}>
          Continuer mes achats
        </button>
      </div>
    </div>
  )
}

