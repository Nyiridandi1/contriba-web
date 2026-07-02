import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

function ResetPin() {
  const navigate = useNavigate();

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [message, setMessage] = useState("");

  const canSubmit =
    pin.length >= 4 &&
    confirmPin.length >= 4 &&
    pin === confirmPin;

  function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      setMessage("PINs must match.");
      return;
    }

    // Temporary frontend flow
    navigate("/login");
  }

  return (
    <AuthLayout>
      <div className="auth-intro">
        <Link to="/forgot-pin" className="auth-back">
          <ArrowLeft size={20} />
        </Link>

        <img
          src={logoIcon}
          alt="Contriba"
          className="auth-logo-icon"
        />

        <h1>
          New
          <br />
          PIN
        </h1>

        <p>
          Create a new secure 4-digit PIN for your account.
        </p>
      </div>

      <div className="auth-form-card reset-card">
        <span className="auth-mini-label">
          Secure PIN
        </span>

        <h2>Create new PIN</h2>

        <p className="reset-subtitle">
          Your new PIN will be used every time
          you access Contriba.
        </p>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
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
              maxLength={4}
              onChange={(e) =>
                setPin(e.target.value)
              }
            />

            <button
              type="button"
              className="auth-eye-button"
              onClick={() =>
                setShowPin(!showPin)
              }
            >
              {showPin ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <label>Confirm PIN *</label>

          <div className="auth-input">
            <Lock size={20} />

            <input
              type={
                showConfirmPin
                  ? "text"
                  : "password"
              }
              placeholder="••••"
              value={confirmPin}
              maxLength={4}
              onChange={(e) =>
                setConfirmPin(e.target.value)
              }
            />

            <button
              type="button"
              className="auth-eye-button"
              onClick={() =>
                setShowConfirmPin(
                  !showConfirmPin
                )
              }
            >
              {showConfirmPin ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}

          <button
            className="auth-submit"
            disabled={!canSubmit}
          >
            Save New PIN
          </button>

          <p className="auth-switch">
            Back to
            <Link to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default ResetPin;