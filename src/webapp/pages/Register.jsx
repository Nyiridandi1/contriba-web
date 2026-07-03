import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Phone,
  ShieldAlert,
  User,
  UserPlus,
} from "lucide-react";

import { useState } from "react";

import { useAuth } from "../context/AuthContext";

import AuthLayout from "../layout/AuthLayout";
import logoIcon from "../../assets/logo-icon.png";

import "../components/auth/AuthForm.css";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ── SUCCESS MODAL STATE ──
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredName, setRegisteredName] = useState("");
  const [registeredPin, setRegisteredPin] = useState("");

  const cleanPhone = phone.replace(/[^\d]/g, "");

  const canSubmit =
    fullName.trim().length >= 3 &&
    cleanPhone.length >= 9 &&
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

    if (pin.length < 4) {
      setMessage("PIN must contain at least 4 digits.");
      return;
    }

    if (pin !== confirmPin) {
      setMessage("PINs do not match.");
      return;
    }

    setLoading(true);

    const result = await register(fullName.trim(), cleanPhone, pin);

    setLoading(false);

    if (!result.success) {
      setMessage(result.message || "Registration failed.");
      return;
    }

    // ── Show success modal ──
    setRegisteredName(fullName.trim().split(" ")[0]);
    setRegisteredPin(pin);
    setShowSuccess(true);
  }

  function handleContinue() {
    setShowSuccess(false);
    navigate("/home");
  }

  return (
    <>
      {/* ── SUCCESS MODAL ── */}
      {showSuccess && (
        <div className="register-success-overlay">
          <div className="register-success-modal">

            {/* Dark header with Contriba branding */}
            <div className="register-success-header">
              <div className="register-success-brand">
                <img src={logoIcon} alt="Contriba" />
                <span>Contriba</span>
              </div>

              <div className="register-success-check">
                <CheckCircle2 size={32} color="#16a34a" />
              </div>

              <h2>Account Created Successfully</h2>
              <p>
                Welcome to Contriba, <strong>{registeredName}</strong>.
                Your organizer account is ready.
              </p>
            </div>

            {/* Body */}
            <div className="register-success-body">

              {/* PIN Warning */}
              <div className="register-pin-warning">
                <div className="register-pin-warning-header">
                  <ShieldAlert size={18} color="#E50914" />
                  <strong>Save Your PIN — No Recovery Option</strong>
                </div>
                <p>
                  Your PIN is <strong>{registeredPin}</strong>. Contriba has
                  <strong> no OTP, no email reset</strong> and no way to
                  recover a forgotten PIN.
                </p>
                <div className="register-pin-tips">
                  <p>+ Write it down somewhere safe</p>
                  <p>+ Save it in your phone notes</p>
                  <p>+ Tell a trusted person</p>
                  <p>- Never share with anyone</p>
                </div>
              </div>

              {/* PIN Display */}
              <div className="register-pin-display">
                <span>Your PIN</span>
                <strong>{registeredPin}</strong>
              </div>

              {/* Continue button */}
              <button
                type="button"
                className="register-continue-btn"
                onClick={handleContinue}
              >
                I have saved my PIN — Continue
              </button>

              <p className="register-success-note">
                You will need this PIN every time you log in to Contriba.
              </p>
            </div>
          </div>
        </div>
      )}

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
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="auth-switch">
              Already have an account?
              <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </AuthLayout>
    </>
  );
}

export default Register;