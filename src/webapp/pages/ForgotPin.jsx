import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Mail,
  Phone,
  ShieldQuestion,
} from "lucide-react";

import { sendOTP } from "../api/api";
import AuthLayout from "../layout/AuthLayout";
import logoIcon from "../../assets/logo-icon.png";

import "../components/auth/AuthForm.css";
import "./ForgotPin.css";

function ForgotPin() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const cleanPhone = phone.replace(/[^\d]/g, "");
  const canSubmit = cleanPhone.length >= 9 && email.includes("@") && !loading;

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (cleanPhone.length < 9) {
      setMessage("Enter your registered phone number.");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Enter your registered email address.");
      return;
    }

    setLoading(true);

    // Send OTP to email for PIN reset
    const result = await sendOTP("PIN Reset", cleanPhone, email.trim(), true);

    setLoading(false);

    if (!result.success) {
      setMessage(result.message || "Could not verify your account. Check your phone and email.");
      return;
    }

    // Navigate to OTP screen with reset data + show OTP on screen
    navigate("/reset-otp", {
      state: {
        phone: cleanPhone,
        email: email.trim(),
        otp: result.otp, // backend returns OTP for display
        mode: "reset",
      },
    });
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
          Enter your registered phone number and email address. We will send a
          verification code to your email.
        </p>
      </div>

      <div className="auth-form-card forgot-pin-card">
        <span className="auth-mini-label">PIN Recovery</span>
        <h2>Reset your PIN</h2>

        <p className="forgot-pin-subtitle">
          We will verify your identity using the email address you used when
          you registered your account.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="forgot-pin-icon">
            <ShieldQuestion size={25} />
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
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {message && <p className="auth-message">{message}</p>}

          <button type="submit" className="auth-submit" disabled={!canSubmit}>
            <KeyRound size={20} />
            {loading ? "Verifying..." : "Send Verification Code"}
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