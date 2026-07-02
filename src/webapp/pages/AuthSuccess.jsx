import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import AuthLayout from "../layout/AuthLayout";
import logoIcon from "../../assets/logo-icon.png";

import "../components/auth/AuthForm.css";
import "./AuthSuccess.css";

function AuthSuccess() {
  return (
    <AuthLayout>
      <div className="auth-intro">
        <Link to="/otp" className="auth-back" aria-label="Back to OTP">
          <ArrowLeft size={20} />
        </Link>

        <img src={logoIcon} alt="Contriba" className="auth-logo-icon" />

        <h1>
          Account
          <br />
          Ready
        </h1>

        <p>
          Your phone number has been verified. You can now continue securely
          with Contriba.
        </p>
      </div>

      <div className="auth-form-card success-card">
        <div className="success-icon">
          <CheckCircle2 size={42} />
        </div>

        <span className="auth-mini-label">Verified Successfully</span>

        <h2>Your account is ready</h2>

        <p className="success-text">
          Welcome to Contriba. You can now create events, receive contributions,
          track supporters, manage payments, and view your financial command
          center.
        </p>

        <div className="success-summary">
          <div>
            <ShieldCheck size={18} />
            <span>Phone verified</span>
          </div>

          <div>
            <BadgeCheck size={18} />
            <span>Dashboard unlocked</span>
          </div>
        </div>

        <Link to="/dashboard" className="auth-submit success-button">
          Open Dashboard
          <ArrowRight size={20} />
        </Link>

        <p className="auth-switch">
          Want to explore first?
          <Link to="/events">Browse Events</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default AuthSuccess;