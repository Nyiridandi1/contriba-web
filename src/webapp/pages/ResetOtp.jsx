import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Mail,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { sendOTP } from "../api/api";

import AuthLayout from "../layout/AuthLayout";
import logoIcon from "../../assets/logo-icon.png";

import "../components/auth/AuthForm.css";
import "./Otp.css";

function ResetOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const { phone, email, otp: initialOtp, mode } = location.state || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [displayOtp, setDisplayOtp] = useState(initialOtp || "");
  const [otpCopied, setOtpCopied] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email || !phone) navigate("/forgot-pin");
  }, [email, phone, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  function handleOtpChange(index, value) {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
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
    pasted.split("").forEach((digit, i) => { if (i < 6) newOtp[i] = digit; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  function handleCopyOtp() {
    if (!displayOtp) return;
    navigator.clipboard.writeText(displayOtp);
    setOtpCopied(true);
    // Auto fill the inputs
    const digits = displayOtp.split("");
    setOtp(digits);
    setTimeout(() => setOtpCopied(false), 2000);
  }

  const otpValue = otp.join("");
  const isComplete = otpValue.length === 6;

  function handleVerify() {
    if (!isComplete) return;
    // Navigate to reset PIN screen with verified data
    navigate("/reset-pin", {
      state: { phone, email, otp: otpValue },
    });
  }

  async function handleResend() {
    if (!canResend || resendLoading) return;
    setResendLoading(true);
    setMessage("");

    const result = await sendOTP("PIN Reset", phone, email, true);
    setResendLoading(false);

    if (!result.success) {
      setMessage(result.message || "Failed to resend code.");
      setMessageType("error");
      return;
    }

    setDisplayOtp(result.otp || "");
    setMessage("New verification code sent!");
    setMessageType("success");
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    setResendCooldown(60);
    setCanResend(false);
  }

  if (!email) return null;

  return (
    <AuthLayout>
      <div className="auth-intro">
        <Link to="/forgot-pin" className="auth-back" aria-label="Back">
          <ArrowLeft size={20} />
        </Link>

        <img src={logoIcon} alt="Contriba" className="auth-logo-icon" />

        <h1>
          Verify
          <br />
          Identity
        </h1>

        <p>
          Enter the 6-digit code to verify your identity and reset your PIN.
        </p>
      </div>

      <div className="auth-form-card">
        <span className="auth-mini-label">PIN Reset Verification</span>
        <h2>Enter verification code</h2>

        <div className="otp-email-info">
          <Mail size={18} />
          <div>
            <p>Code sent to</p>
            <strong>{email}</strong>
          </div>
        </div>

        {/* ── SHOW OTP ON SCREEN ── */}
        {displayOtp && (
          <div className="otp-display-box">
            <div className="otp-display-header">
              <ShieldCheck size={16} color="#16a34a" />
              <span>Your verification code</span>
            </div>
            <div className="otp-display-code">
              <strong>{displayOtp}</strong>
              <button type="button" onClick={handleCopyOtp}>
                <Copy size={15} />
                {otpCopied ? "Copied!" : "Copy & Fill"}
              </button>
            </div>
            <p className="otp-display-note">
              Also sent to your email. This code expires in 30 minutes.
            </p>
          </div>
        )}

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
            {messageType === "success" ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
            {message}
          </div>
        )}

        <button
          type="button"
          className="auth-submit"
          onClick={handleVerify}
          disabled={!isComplete}
        >
          Verify and Reset PIN
        </button>

        <div className="otp-resend">
          <p>Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || resendLoading}
            className={canResend ? "active" : ""}
          >
            <RefreshCcw size={14} />
            {resendLoading ? "Sending..." : canResend ? "Resend code" : `Resend in ${resendCooldown}s`}
          </button>
        </div>

        <p className="auth-switch">
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default ResetOtp;