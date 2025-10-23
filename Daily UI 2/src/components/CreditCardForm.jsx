import React, { useRef, useState } from "react";
import { gsap } from "gsap";

const cardBackgrounds = [
  { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80", label: "Mountain" },
  { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", label: "Ocean" },
  { url: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=600&q=80", label: "Forest" },
];

const cardTypes = [
  { name: "Visa", regex: /^4/, logo: "VISA" },
  { name: "Mastercard", regex: /^5[1-5]/, logo: "Mastercard" },
  { name: "Amex", regex: /^3[47]/, logo: "AMEX" },
];

function detectCardType(cardNum) {
  for (const type of cardTypes) {
    if (type.regex.test(cardNum.replace(/\s+/g, ""))) {
      return type;
    }
  }
  return null;
}

export default function CreditCardForm() {
  const cardNumberRef = useRef(null);
  const cvvRef = useRef(null);
  const nameRef = useRef(null);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [bgIndex, setBgIndex] = useState(0);
  const [flipped, setFlipped] = useState(false); 
  const [errors, setErrors] = useState({});

  const yearOptions = Array.from({ length: 12 }, (_, i) => `${2030 + i}`);

  const getMaskedCardNumber = (num) => {
    let cleaned = num.replace(/\D/g, "").slice(0, 16);
    let display = cleaned.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, (_, a, b, c, d) => `${a} **** **** ${d}`);
    return display.trim() || "1234 **** **** 3456";
  };


  const validate = () => {
    const errs = {};
    let cleanedNum = cardNumber.replace(/\D/g, "");
    if (!/^(\d{16})$/.test(cleanedNum)) {
      errs.cardNumber = "Card number must be 16 digits";
    }
    if (cardName.trim().length === 0) {
      errs.cardName = "Cardholder name is required";
    }
    if (!expiryMonth || !expiryYear) {
      errs.expiry = "Expiration date is required";
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      errs.cvv = "CVV must be 3 or 4 digits";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFocus = (ref) => {
    gsap.to(ref.current, { duration: 0.3, borderColor: "#3264fe", boxShadow: "0 0 12px #3264fe33" });
  };
  const handleBlur = (ref) => {
    gsap.to(ref.current, { duration: 0.3, borderColor: "#dde2ee", boxShadow: "none" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Payment submitted!");
    } else {
      gsap.fromTo(
        ".card-form .error-msg",
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.12 }
      );
    }
  };

  const cardType = detectCardType(cardNumber);

  return (
    <div className="credit-card-container">
      <div className="credit-card-box">

        <div className={`card-preview-3d${flipped ? " flipped" : ""}`}>
          <div className="card-inner">
            <div
              className="card-front"
              style={{ backgroundImage: `url(${cardBackgrounds[bgIndex].url})` }}
            >
              <div className="card-number">{getMaskedCardNumber(cardNumber)}</div>
              <div className="card-info-row">
                <div>
                  <div className="card-info-label">Card Holder</div>
                  <div className="card-info-value">{cardName || "JOHN DOE"}</div>
                </div>
                <div>
                  <div className="card-info-label">Expires</div>
                  <div className="card-info-value">
                    {(expiryMonth || "04")}/{(expiryYear ? expiryYear.slice(-2) : "32")}
                  </div>
                </div>
              </div>
              <div className="card-logo">{(cardType && cardType.logo) || "Visa"}</div>
            </div>
            <div
              className="card-back"
              style={{ backgroundImage: `url(${cardBackgrounds[bgIndex].url})` }}
            >
              <div className="card-strip"></div>
              <div className="card-cvv-label">CVV</div>
              <div className="card-cvv-value">{cvv || "123"}</div>
            </div>
          </div>
        </div>

        {/* BG picker */}
        <div className="card-bg-selector">
          {cardBackgrounds.map((bg, idx) => (
            <button
              type="button"
              key={bg.label}
              className={`card-bg-btn${bgIndex === idx ? " active" : ""}`}
              onClick={() => setBgIndex(idx)}
              aria-label={`Select ${bg.label} background`}
            >
              <img src={bg.url} alt={bg.label} />
            </button>
          ))}
        </div>

        {/* Credit Card Form */}
        <form className="card-form" onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            id="cardNumber"
            className={`card-input${errors.cardNumber ? " has-error" : ""}`}
            type="text"
            ref={cardNumberRef}
            maxLength={19}
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())}
            onFocus={() => {
              handleFocus(cardNumberRef);
              setFlipped(false);
            }}
            onBlur={() => handleBlur(cardNumberRef)}
            placeholder="1234 5678 9012 3456"
            inputMode="numeric"
            required
            aria-invalid={!!errors.cardNumber}
            aria-describedby={errors.cardNumber ? "cardNumber-error" : undefined}
          />
          {errors.cardNumber && (
            <div className="error-msg" id="cardNumber-error">{errors.cardNumber}</div>
          )}

          <label htmlFor="cardName">Card Holder</label>
          <input
            id="cardName"
            className={`card-input${errors.cardName ? " has-error" : ""}`}
            type="text"
            ref={nameRef}
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            onFocus={() => {
              handleFocus(nameRef);
              setFlipped(false);
            }}
            onBlur={() => handleBlur(nameRef)}
            placeholder="John Doe"
            required
            aria-invalid={!!errors.cardName}
            aria-describedby={errors.cardName ? "cardName-error" : undefined}
          />
          {errors.cardName && (
            <div className="error-msg" id="cardName-error">{errors.cardName}</div>
          )}

          <div className="card-form-row">
            <div className="card-select-group">
              <label htmlFor="expiryMonth">Expiration Date</label>
              <select
                id="expiryMonth"
                className={`card-select${errors.expiry ? " has-error" : ""}`}
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value)}
                required
                aria-invalid={!!errors.expiry}
              >
                <option value="">MM</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={String(i + 1).padStart(2, "0")}>
                    {String(i + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
            <div className="card-select-group">
              <label htmlFor="expiryYear" className="visually-hidden">
                Expiration Year
              </label>
              <select
                id="expiryYear"
                className={`card-select${errors.expiry ? " has-error" : ""}`}
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value)}
                required
              >
                <option value="">YYYY</option>
                {yearOptions.map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
            <div className="card-select-group">
              <label htmlFor="cvv">CVV</label>
              <input
                id="cvv"
                className={`card-input${errors.cvv ? " has-error" : ""}`}
                type="password"
                ref={cvvRef}
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                onFocus={() => {
                  handleFocus(cvvRef);
                  setFlipped(true); // <--- flip to back!
                }}
                onBlur={() => {
                  handleBlur(cvvRef);
                  setFlipped(false); // <--- restore flip
                }}
                placeholder="123"
                inputMode="numeric"
                required
                aria-invalid={!!errors.cvv}
                aria-describedby={errors.cvv ? "cvv-error" : undefined}
              />
              {errors.cvv && (
                <div className="error-msg" id="cvv-error">{errors.cvv}</div>
              )}
            </div>
          </div>
          {errors.expiry && (
            <div className="error-msg">{errors.expiry}</div>
          )}
          <button type="submit" className="card-form-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

