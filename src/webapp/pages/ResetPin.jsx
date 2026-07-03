import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
} from "lucide-react";

import AuthLayout from "../layout/AuthLayout";
import logoIcon from "../../assets/logo-icon.png";

import "../components/auth/AuthForm.css";
import "./ResetPin.css";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://contriba-backend-production.up.railway.app";

function ResetPin() {
  const navigate = useNavigate();
  const location = useLocation();

  const { phone, email, otp } = location.state || {};

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const canSubmit =
    pin.length >= 4 &&
    confirmPin.length >= 4 &&
    pin === confirmPin &&
    !loading;

  // Redirect if no state
  if (!phone || !email || !otp) {
    navigate("/forgot-pin");
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (pin !== confirmPin) {
      setMessage("PINs do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/reset-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, email, otp, new_pin: pin }),
      });

      const result = await response.json();

      if (!result.success) {
        setMessage(result.message || "Failed to reset PIN. Please try again.");
        setLoading(false);
        return;
      }

      // Success → go to login
      navigate("/login", {
        state: { message: "PIN reset successfully! Please login with your new PIN." }
      });

    } catch {
      setMessage("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="auth-intro">
        <Link to="/forgot-pin" className="auth-back">
          <ArrowLeft size={20} />
        </Link>

        <img src={logoIcon} alt="Contriba" className="auth-logo-icon" />

        <h1>
          New
          <br />
          PIN
        </h1>

        <p>
          Create a new secure PIN for your Contriba account.
        </p>
      </div>

      <div className="auth-form-card reset-card">
        <span className="auth-mini-label">Secure PIN</span>
        <h2>Create new PIN</h2>

        <p className="reset-subtitle">
          Your new PIN will be used every time you access Contriba.
          Keep it safe — there is no way to recover a forgotten PIN.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="reset-icon">
            <ShieldCheck size={24} />
          </div>

          <label>New PIN *</label>
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

          {message && <p className="auth-message">{message}</p>}

          <button
            type="submit"
            className="auth-submit"
            disabled={!canSubmit}
          >
            {loading ? "Saving..." : "Save New PIN"}
          </button>

          <p className="auth-switch">
            Back to <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default ResetPin;