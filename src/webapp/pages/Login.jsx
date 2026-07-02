import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Phone,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import AuthLayout from "../layout/AuthLayout";
import logoIcon from "../../assets/logo-icon.png";

import "../components/auth/AuthForm.css";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const canSubmit =
    phone.trim().length >= 8 && pin.trim().length >= 4 && !loading;

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!canSubmit) {
      setMessage("Enter your phone number and 4-digit PIN.");
      return;
    }

    setLoading(true);

    const result = await login(phone, pin);

    setLoading(false);

    if (!result.success) {
      setMessage(result.message || "Login failed. Please try again.");
      return;
    }

    navigate("/dashboard");
  }

  return (
    <AuthLayout>
      <div className="auth-intro">
        <Link to="/" className="auth-back" aria-label="Back to home">
          <ArrowLeft size={20} />
        </Link>

        <img src={logoIcon} alt="Contriba" className="auth-logo-icon" />

        <h1>
          Welcome
          <br />
          Back
        </h1>

        <p>
          Login securely and continue managing your events, wallet and
          contributions.
        </p>
      </div>

      <div className="auth-form-card login-card">
        <span className="auth-mini-label">Secure Login</span>

        <h2>Access your account</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Phone Number *</label>

          <div className="auth-input">
            <Phone size={20} />
            <span className="auth-country">🇷🇼 +250</span>

            <input
              type="tel"
              placeholder="781 234 567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <label>PIN *</label>

          <div className="auth-input">
            <LockKeyhole size={20} />

            <input
              type={showPin ? "text" : "password"}
              placeholder="Enter your PIN"
              value={pin}
              maxLength={6}
              onChange={(e) => setPin(e.target.value)}
            />

            <button
              type="button"
              className="auth-eye-button"
              onClick={() => setShowPin(!showPin)}
              aria-label="Toggle PIN visibility"
            >
              {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* NEW FORGOT PIN LINK */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "-2px",
              marginBottom: "6px",
            }}
          >
            <Link
              to="/forgot-pin"
              style={{
                color: "#E50914",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "13px",
              }}
            >
              Forgot PIN?
            </Link>
          </div>

          {message && <p className="auth-message">{message}</p>}

          <button
            type="submit"
            className="auth-submit"
            disabled={!canSubmit}
          >
            <LogIn size={20} />
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="auth-switch">
            Don&apos;t have an account?
            <Link to="/register">Create Account</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;