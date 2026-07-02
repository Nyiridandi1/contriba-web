import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Phone,
  ShieldQuestion,
} from "lucide-react";

import AuthLayout from "../layout/AuthLayout";
import logoIcon from "../../assets/logo-icon.png";

import "../components/auth/AuthForm.css";
import "./ForgotPin.css";

function ForgotPin() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const canSubmit = phone.trim().length >= 8;

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!canSubmit) {
      setMessage("Enter your phone number to reset your PIN.");
      return;
    }

    navigate("/reset-pin");
  }

  return (
    <AuthLayout>
      <div className="auth-intro">
        <Link to="/login" className="auth-back" aria-label="Back to login">
          <ArrowLeft size={20} />
        </Link>

        <img src={logoIcon} alt="Contriba" className="auth-logo-icon" />

        <h1>
          Forgot
          <br />
          PIN
        </h1>

        <p>
          No worries. Enter your phone number and we&apos;ll help you create a
          new secure PIN.
        </p>
      </div>

      <div className="auth-form-card forgot-pin-card">
        <span className="auth-mini-label">PIN Recovery</span>

        <h2>Reset your PIN</h2>

        <p className="forgot-pin-subtitle">
          We&apos;ll send a secure verification step to confirm this account
          belongs to you.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="forgot-pin-icon">
            <ShieldQuestion size={25} />
          </div>

          <label>Phone Number *</label>

          <div className="auth-input">
            <Phone size={20} />
            <span className="auth-country">🇷🇼 +250</span>

            <input
              type="tel"
              placeholder="781 234 567"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>

          {message && <p className="auth-message">{message}</p>}

          <button type="submit" className="auth-submit" disabled={!canSubmit}>
            <KeyRound size={20} />
            Continue
          </button>

          <p className="auth-switch">
            Remembered your PIN?
            <Link to="/login">
              Login <ArrowRight size={14} />
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default ForgotPin;