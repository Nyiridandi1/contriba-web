import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import AuthLayout from "../layout/AuthLayout";

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

  async function handleSubmit(event) {
    event.preventDefault();
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
      <section className="auth-intro login-intro">
        <div className="login-intro-top">
          <Link
            to="/"
            className="auth-back login-back"
            aria-label="Back to home"
          >
            <ArrowLeft size={19} />
          </Link>
        </div>

        <div className="login-intro-copy">
          <span className="login-eyebrow">
            <ShieldCheck size={15} />
            Secure organizer access
          </span>

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
      </section>

      <section className="auth-form-card login-card">
        <span className="auth-mini-label">Secure Login</span>

        <h2>Access your account</h2>

        <form onSubmit={handleSubmit} className="auth-form login-form">
          <label htmlFor="login-phone">Phone Number *</label>

          <div className="auth-input login-input">
            <Phone size={20} />

            <span className="auth-country login-country">
              <span aria-hidden="true">🇷🇼</span>
              +250
            </span>

            <input
              id="login-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="781 234 567"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>

          <div className="login-label-row">
            <label htmlFor="login-pin">PIN *</label>

            <Link to="/forgot-pin" className="login-forgot-link">
              Forgot PIN?
            </Link>
          </div>

          <div className="auth-input login-input">
            <LockKeyhole size={20} />

            <input
              id="login-pin"
              type={showPin ? "text" : "password"}
              inputMode="numeric"
              autoComplete="current-password"
              placeholder="Enter your PIN"
              value={pin}
              maxLength={6}
              onChange={(event) => setPin(event.target.value)}
            />

            <button
              type="button"
              className="auth-eye-button"
              onClick={() => setShowPin((current) => !current)}
              aria-label={showPin ? "Hide PIN" : "Show PIN"}
            >
              {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {message && (
            <p className="auth-message login-message" role="alert">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit login-submit"
            disabled={!canSubmit}
          >
            <LogIn size={20} />
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="auth-switch login-switch">
            Don&apos;t have an account?
            <Link to="/register">Create Account</Link>
          </p>
        </form>
      </section>
    </AuthLayout>
  );
}

export default Login;