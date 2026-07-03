import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  UserPlus,
} from "lucide-react";

import { useState } from "react";
import { sendOTP } from "../api/api";

import AuthLayout from "../layout/AuthLayout";
import logoIcon from "../../assets/logo-icon.png";

import "../components/auth/AuthForm.css";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const cleanPhone = phone.replace(/[^\d]/g, "");

  const canSubmit =
    fullName.trim().length >= 3 &&
    cleanPhone.length >= 9 &&
    email.includes("@") &&
    pin.length >= 4 &&
    confirmPin.length >= 4 &&
    pin === confirmPin &&
    !loading;

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (fullName.trim().length < 3) {
      setMessage("Please enter your full name.");
      return;
    }

    if (cleanPhone.length < 9) {
      setMessage("Please enter a valid phone number.");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (pin.length < 4) {
      setMessage("PIN must contain at least 4 digits.");
      return;
    }

    if (pin !== confirmPin) {
      setMessage("PINs do not match.");
      return;
    }

    setLoading(true);

    // Send OTP to email
    const result = await sendOTP(fullName.trim(), cleanPhone, email.trim());

    setLoading(false);

    if (!result.success) {
      setMessage(result.message || "Failed to send verification code.");
      return;
    }

    // Navigate to OTP screen with all data
    navigate("/otp", {
      state: {
        name: fullName.trim(),
        phone: cleanPhone,
        email: email.trim(),
        pin,
      },
    });
  }

  return (
    <AuthLayout>
      <div className="auth-intro">
        <Link to="/" className="auth-back" aria-label="Back to home">
          <ArrowLeft size={20} />
        </Link>

        <img src={logoIcon} alt="Contriba" className="auth-logo-icon" />

        <h1>
          Create
          <br />
          Account
        </h1>

        <p>
          Start collecting event contributions beautifully,
          securely and easily.
        </p>
      </div>

      <div className="auth-form-card register-card">
        <span className="auth-mini-label">Create Account</span>
        <h2>Create your account</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Full Name *</label>
          <div className="auth-input">
            <User size={20} />
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <label>Phone Number *</label>
          <div className="auth-input">
            <Phone size={20} />
            <span className="auth-country">+250</span>
            <input
              type="tel"
              placeholder="781 234 567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <label>Email Address *</label>
          <div className="auth-input">
            <Mail size={20} />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-pin-note">
            <Lock size={16} />
            Create a secure 4-digit PIN. You cannot recover it if lost.
          </div>

          <label>Create PIN *</label>
          <div className="auth-input">
            <Lock size={20} />
            <input
              type={showPin ? "text" : "password"}
              placeholder="••••"
              value={pin}
              maxLength={6}
              onChange={(e) => setPin(e.target.value)}
            />
            <button
              type="button"
              className="auth-eye-button"
              onClick={() => setShowPin(!showPin)}
            >
              {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <label>Confirm PIN *</label>
          <div className="auth-input">
            <Lock size={20} />
            <input
              type={showConfirmPin ? "text" : "password"}
              placeholder="••••"
              value={confirmPin}
              maxLength={6}
              onChange={(e) => setConfirmPin(e.target.value)}
            />
            <button
              type="button"
              className="auth-eye-button"
              onClick={() => setShowConfirmPin(!showConfirmPin)}
            >
              {showConfirmPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {message && (
            <p className="auth-message">{message}</p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={!canSubmit}
          >
            <UserPlus size={20} />
            {loading ? "Sending verification code..." : "Continue"}
          </button>

          <p className="auth-switch">
            Already have an account?
            <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Register;