import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

import AuthLayout from "../layout/AuthLayout";
import logoIcon from "../../assets/logo-icon.png";

import "../components/auth/AuthForm.css";
import "./Otp.css";

function Otp() {
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(119);
  const [message, setMessage] = useState("");

  const otpCode = otp.join("");
  const canVerify = otpCode.length === 6;

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  function formatTime(value) {
    const minutes = Math.floor(value / 60);
    const remainingSeconds = value % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  function handleChange(index, value) {
    const digit = value.replace(/\D/g, "");

    if (!digit) {
      const updatedOtp = [...otp];
      updatedOtp[index] = "";
      setOtp(updatedOtp);
      return;
    }

    const updatedOtp = [...otp];
    updatedOtp[index] = digit.slice(-1);
    setOtp(updatedOtp);

    if (index < 5) {
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

    const pastedCode = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedCode) return;

    const updatedOtp = ["", "", "", "", "", ""];

    pastedCode.split("").forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);

    const nextIndex = pastedCode.length >= 6 ? 5 : pastedCode.length;
    inputRefs.current[nextIndex]?.focus();
  }

  function handleResend() {
    setSeconds(119);
    setOtp(["", "", "", "", "", ""]);
    setMessage("A new verification code has been sent.");
    inputRefs.current[0]?.focus();
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!canVerify) {
      setMessage("Please enter the 6-digit verification code.");
      return;
    }

    // Temporary frontend flow
    // OTP verification will be connected here.
    navigate("/success");
  }

  return (
    <AuthLayout>
      <div className="auth-intro">
        <Link to="/register" className="auth-back" aria-label="Back to register">
          <ArrowLeft size={20} />
        </Link>

        <img src={logoIcon} alt="Contriba" className="auth-logo-icon" />

        <h1>
          Verify
          <br />
          Phone
        </h1>

        <p>
          Enter the secure code sent to your phone number to protect your
          Contriba account.
        </p>
      </div>

      <div className="auth-form-card otp-card">
        <span className="auth-mini-label">Phone Verification</span>

        <h2>Enter OTP code</h2>

        <p className="otp-subtitle">
          We sent a 6-digit code to your phone number.
        </p>

        <form onSubmit={handleSubmit} className="auth-form otp-form">
          <div className="otp-icon-box">
            <ShieldCheck size={24} />
          </div>

          <div className="otp-inputs" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>

          <div className="otp-timer-row">
            <div className="otp-timer">
              <LockKeyhole size={15} />
              Code expires in <strong>{formatTime(seconds)}</strong>
            </div>

            <button
              type="button"
              className="otp-resend"
              onClick={handleResend}
              disabled={seconds > 0}
            >
              <RefreshCcw size={15} />
              Resend
            </button>
          </div>

          {message && <p className="auth-message">{message}</p>}

          <button type="submit" className="auth-submit" disabled={!canVerify}>
            <CheckCircle2 size={20} />
            Verify Code
          </button>

          <p className="auth-switch">
            Wrong number?
            <Link to="/register">
              Edit phone <ArrowRight size={14} />
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Otp;