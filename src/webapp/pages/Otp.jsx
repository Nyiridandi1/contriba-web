import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { sendOTP, verifyOTP } from "../api/api";

import AuthLayout from "../layout/AuthLayout";
import logoIcon from "../../assets/logo-icon.png";

import "../components/auth/AuthForm.css";
import "./Otp.css";
import "./Register.css";

function Otp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const { name, phone, email, pin } = location.state || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredName, setRegisteredName] = useState("");
  const [registeredPin, setRegisteredPin] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email || !phone || !pin) {
      navigate("/register");
    }
  }, [email, phone, pin, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  function handleOtpChange(index, value) {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });
    setOtp(newOtp);
    const lastIndex = Math.min(pasted.length, 5);
    inputRefs.current[lastIndex]?.focus();
  }

  const otpValue = otp.join("");
  const isComplete = otpValue.length === 6;

  async function handleVerify() {
    if (!isComplete) return;
    setLoading(true);
    setMessage("");

    const result = await verifyOTP(email, otpValue, name, phone, pin);

    setLoading(false);

    if (!result.success) {
      setMessage(result.message || "Invalid code. Please try again.");
      setMessageType("error");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      return;
    }

    if (login) {
      await login(phone, pin);
    }

    setRegisteredName(name?.split(" ")[0] || "there");
    setRegisteredPin(pin);
    setShowSuccess(true);
  }

  async function handleResend() {
    if (!canResend || resendLoading) return;
    setResendLoading(true);
    setMessage("");

    const result = await sendOTP(name, phone, email);

    setResendLoading(false);

    if (!result.success) {
      setMessage(result.message || "Failed to resend code.");
      setMessageType("error");
      return;
    }

    setMessage("New verification code sent to your email!");
    setMessageType("success");
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    setResendCooldown(60);
    setCanResend(false);
  }

  function handleContinue() {
    setShowSuccess(false);
    navigate("/home");
  }

  if (!email) return null;

  return (
    <>
      {/* ── SUCCESS MODAL ── */}
      {showSuccess && (
        <div className="register-success-overlay">
          <div className="register-success-modal">
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

            <div className="register-success-body">
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

              <div className="register-pin-display">
                <span>Your PIN</span>
                <strong>{registeredPin}</strong>
              </div>

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
          <Link to="/register" className="auth-back" aria-label="Back">
            <ArrowLeft size={20} />
          </Link>

          <img src={logoIcon} alt="Contriba" className="auth-logo-icon" />

          <h1>
            Verify
            <br />
            Email
          </h1>

          <p>
            Enter the 6-digit code sent to your email.
            The code is valid for <strong>30 minutes</strong>.
          </p>
        </div>

        <div className="auth-form-card">
          <span className="auth-mini-label">Email Verification</span>
          <h2>Check your email</h2>

          <div className="otp-email-info">
            <Mail size={18} />
            <div>
              <p>Code sent to</p>
              <strong>{email}</strong>
            </div>
          </div>

          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`otp-input ${digit ? "filled" : ""}`}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {message && (
            <div className={`otp-message ${messageType}`}>
              {messageType === "success" ? (
                <ShieldCheck size={16} />
              ) : (
                <ShieldAlert size={16} />
              )}
              {message}
            </div>
          )}

          <button
            type="button"
            className="auth-submit"
            onClick={handleVerify}
            disabled={!isComplete || loading}
          >
            {loading ? "Verifying..." : "Verify and Create Account"}
          </button>

          <div className="otp-resend">
            <p>Didn't receive the code? Check your spam folder.</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || resendLoading}
              className={canResend ? "active" : ""}
            >
              <RefreshCcw size={14} />
              {resendLoading
                ? "Sending..."
                : canResend
                ? "Resend code"
                : `Resend in ${resendCooldown}s`}
            </button>
          </div>

          <p className="auth-switch">
            Wrong details?
            <Link to="/register">Go back</Link>
          </p>
        </div>
      </AuthLayout>
    </>
  );
}

export default Otp;