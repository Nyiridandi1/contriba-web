import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { sendOTP, verifyOTP } from "../api/api";

import AuthLayout from "../layout/AuthLayout";
import logoIcon from "../../assets/logo-icon.png";

import "../components/auth/AuthForm.css";
import "./Otp.css";
import "./Register.css";

function Otp() {
  const navigate = useNavigate();
  const location = useLocation();

  const { name, phone, email, pin } = location.state || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email || !phone || !pin) {
      navigate("/register", { replace: true });
    }
  }, [email, phone, pin, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setResendCooldown((current) => current - 1);
    }, 1000);

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

  function handleKeyDown(index, event) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(event) {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const newOtp = ["", "", "", "", "", ""];

    pasted.split("").forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);

    const lastIndex = Math.min(pasted.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  }

  const otpValue = otp.join("");
  const isComplete = otpValue.length === 6;

  async function handleVerify() {
    if (!isComplete || loading) return;

    setLoading(true);
    setMessage("");

    try {
      const result = await verifyOTP(
        email,
        otpValue,
        name,
        phone,
        pin
      );

      if (!result.success) {
        setMessage(
          result.message || "Invalid code. Please try again."
        );
        setMessageType("error");
        setOtp(["", "", "", "", "", ""]);

        requestAnimationFrame(() => {
          inputRefs.current[0]?.focus();
        });

        return;
      }

      navigate("/login", {
        replace: true,
        state: {
          accountCreated: true,
          firstName: name?.split(" ")[0] || "",
          phone,
        },
      });
    } catch (error) {
      console.error("OTP verification error:", error);

      setMessage(
        "Something went wrong while creating your account. Please try again."
      );
      setMessageType("error");
      setOtp(["", "", "", "", "", ""]);

      requestAnimationFrame(() => {
        inputRefs.current[0]?.focus();
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!canResend || resendLoading) return;

    setResendLoading(true);
    setMessage("");

    try {
      const result = await sendOTP(name, phone, email);

      if (!result.success) {
        setMessage(result.message || "Failed to resend code.");
        setMessageType("error");
        return;
      }

      setMessage("New verification code sent to your email!");
      setMessageType("success");
      setOtp(["", "", "", "", "", ""]);
      setResendCooldown(60);
      setCanResend(false);

      requestAnimationFrame(() => {
        inputRefs.current[0]?.focus();
      });
    } catch (error) {
      console.error("OTP resend error:", error);

      setMessage(
        "Something went wrong while resending the code. Please try again."
      );
      setMessageType("error");
    } finally {
      setResendLoading(false);
    }
  }

  if (!email || !phone || !pin) {
    return null;
  }

  return (
    <AuthLayout>
      <div className="auth-intro">
        <Link to="/register" className="auth-back" aria-label="Back">
          <ArrowLeft size={20} />
        </Link>

        <img
          src={logoIcon}
          alt="Contriba"
          className="auth-logo-icon"
        />

        <h1>
          Verify
          <br />
          Email
        </h1>

        <p>
          Enter the 6-digit code sent to your email. The code is valid
          for <strong>30 minutes</strong>.
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
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={
                index === 0 ? "one-time-code" : "off"
              }
              maxLength={1}
              value={digit}
              onChange={(event) =>
                handleOtpChange(index, event.target.value)
              }
              onKeyDown={(event) =>
                handleKeyDown(index, event)
              }
              onPaste={handlePaste}
              className={`otp-input ${
                digit ? "filled" : ""
              }`}
              autoFocus={index === 0}
              aria-label={`Verification code digit ${
                index + 1
              }`}
            />
          ))}
        </div>

        {message && (
          <div
            className={`otp-message ${messageType}`}
            role="alert"
          >
            {messageType === "success" ? (
              <ShieldCheck size={16} />
            ) : (
              <ShieldAlert size={16} />
            )}

            <span>{message}</span>
          </div>
        )}

        <button
          type="button"
          className="auth-submit"
          onClick={handleVerify}
          disabled={!isComplete || loading}
        >
          {loading
            ? "Creating your account..."
            : "Verify and Create Account"}
        </button>

        <div className="otp-resend">
          <p>
            Didn&apos;t receive the code? Check your spam folder.
          </p>

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
  );
}

export default Otp;