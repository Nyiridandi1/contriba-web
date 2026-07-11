import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { sendOTP } from "../api/api";
import logoIcon from "../../assets/logo-icon.png";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const cleanPhone = phone.replace(/[^\d]/g, "");

  const canSubmit =
    fullName.trim().length >= 3 &&
    cleanPhone.length >= 9 &&
    email.includes("@") &&
    pin.length >= 4 &&
    confirmPin.length >= 4 &&
    pin === confirmPin &&
    !loading;

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (fullName.trim().length < 3) {
      setMessage("Please enter your full name.");
      return;
    }

    if (cleanPhone.length < 9) {
      setMessage("Please enter a valid phone number.");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (pin.length < 4) {
      setMessage("PIN must contain at least 4 digits.");
      return;
    }

    if (pin !== confirmPin) {
      setMessage("PINs do not match.");
      return;
    }

    setLoading(true);

    const result = await sendOTP(
      fullName.trim(),
      cleanPhone,
      email.trim()
    );

    setLoading(false);

    if (!result.success) {
      setMessage(result.message || "Failed to send verification code.");
      return;
    }

    navigate("/otp", {
      state: {
        name: fullName.trim(),
        phone: cleanPhone,
        email: email.trim(),
        pin,
      },
    });
  }

  return (
    <main className="million-register-page">
      <section className="million-register-shell">
        <aside className="million-register-hero">
          <div className="million-register-grid" />
          <div className="million-register-orb million-register-orb-one" />
          <div className="million-register-orb million-register-orb-two" />
          <div className="million-register-orb million-register-orb-three" />

          <div className="million-register-hero-inner">
            <div className="million-register-mobile-topbar">
              <Link to="/" className="million-register-mobile-brand">
                <span className="million-register-brand-mark">
                  <img src={logoIcon} alt="" />
                </span>
                <span>contriba</span>
              </Link>

              <Link
                to="/"
                className="million-register-mobile-back"
                aria-label="Back home"
              >
                <ArrowLeft size={17} />
              </Link>
            </div>

            <div className="million-register-hero-topbar">
              <Link to="/" className="million-register-brand">
                <span className="million-register-brand-mark">
                  <img src={logoIcon} alt="" />
                </span>
                <span>contriba</span>
              </Link>

              <Link to="/" className="million-register-back-link">
                <ArrowLeft size={16} />
                <span>Back home</span>
              </Link>
            </div>

            <div className="million-register-hero-content">
              <span className="million-register-eyebrow">
                <Sparkles size={15} />
                Built for modern communities
              </span>

              <h1>
                Start collecting contributions
                <span>with confidence from day one.</span>
              </h1>

              <p>
                Create your organizer account, launch events, manage
                contributors and track every payment from one secure workspace.
              </p>

              <div className="million-register-feature-list">
                <div>
                  <CheckCircle2 size={18} />
                  <span>Launch professional contribution events</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>Track payments, contributors and wallet activity</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>Keep organizer access protected with a secure PIN</span>
                </div>
              </div>
            </div>

            <div className="million-register-preview" aria-hidden="true">
              <div className="million-register-preview-top">
                <div>
                  <span>Organizer workspace</span>
                  <strong>Your new Contriba account</strong>
                </div>
                <span className="million-register-status">Ready</span>
              </div>

              <div className="million-register-preview-grid">
                <div className="million-register-preview-card">
                  <span className="million-register-preview-icon">
                    <WalletCards size={18} />
                  </span>
                  <small>Wallet</small>
                  <strong>Secure</strong>
                  <span>Real-time balance</span>
                </div>

                <div className="million-register-preview-card">
                  <span className="million-register-preview-icon">
                    <UsersRound size={18} />
                  </span>
                  <small>Contributors</small>
                  <strong>Organized</strong>
                  <span>One clear CRM</span>
                </div>

                <div className="million-register-preview-card">
                  <span className="million-register-preview-icon">
                    <BarChart3 size={18} />
                  </span>
                  <small>Reports</small>
                  <strong>Insightful</strong>
                  <span>Better decisions</span>
                </div>
              </div>
            </div>

            <p className="million-register-hero-footer">
              Trusted tools for organizers, families, churches and communities.
            </p>
          </div>
        </aside>

        <section className="million-register-panel">
          <div className="million-register-panel-inner">
            <div className="million-register-card">
              <div className="million-register-card-heading">
                <span className="million-register-kicker">
                  Create organizer account
                </span>
                <h2>Join Contriba</h2>
                <p>
                  Set up your secure account and continue to email verification.
                </p>
              </div>

              <form
                className="million-register-form"
                onSubmit={handleSubmit}
                autoComplete="off"
                noValidate
              >
                <div className="million-register-field">
                  <label htmlFor="register-full-name">Full name</label>

                  <div className="million-register-input-shell">
                    <User size={18} />
                    <input
                      id="register-full-name"
                      name="contriba-register-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                    />
                  </div>
                </div>

                <div className="million-register-field">
                  <label htmlFor="register-phone">Phone number</label>

                  <div className="million-register-input-shell">
                    <Phone size={18} />
                    <span className="million-register-code">🇷🇼 +250</span>

                    <input
                      id="register-phone"
                      name="contriba-register-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="off"
                      data-lpignore="true"
                      data-form-type="other"
                      placeholder="781 234 567"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </div>
                </div>

                <div className="million-register-field">
                  <label htmlFor="register-email">Email address</label>

                  <div className="million-register-input-shell">
                    <Mail size={18} />
                    <input
                      id="register-email"
                      name="contriba-register-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                </div>

                <div className="million-register-pin-note">
                  <Lock size={15} />
                  <span>
                    Create a memorable 4–6 digit PIN. Keep it private and secure.
                  </span>
                </div>

                <div className="million-register-pin-grid">
                  <div className="million-register-field">
                    <label htmlFor="register-pin">Create PIN</label>

                    <div className="million-register-input-shell">
                      <Lock size={18} />

                      <input
                        id="register-pin"
                        name="contriba-register-pin"
                        type={showPin ? "text" : "password"}
                        inputMode="numeric"
                        autoComplete="new-password"
                        placeholder="••••"
                        value={pin}
                        maxLength={6}
                        onChange={(event) => setPin(event.target.value)}
                      />

                      <button
                        type="button"
                        className="million-register-eye"
                        onClick={() => setShowPin((current) => !current)}
                        aria-label={showPin ? "Hide PIN" : "Show PIN"}
                      >
                        {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="million-register-field">
                    <label htmlFor="register-confirm-pin">Confirm PIN</label>

                    <div className="million-register-input-shell">
                      <Lock size={18} />

                      <input
                        id="register-confirm-pin"
                        name="contriba-register-confirm-pin"
                        type={showConfirmPin ? "text" : "password"}
                        inputMode="numeric"
                        autoComplete="new-password"
                        placeholder="••••"
                        value={confirmPin}
                        maxLength={6}
                        onChange={(event) => setConfirmPin(event.target.value)}
                      />

                      <button
                        type="button"
                        className="million-register-eye"
                        onClick={() =>
                          setShowConfirmPin((current) => !current)
                        }
                        aria-label={
                          showConfirmPin ? "Hide PIN" : "Show PIN"
                        }
                      >
                        {showConfirmPin ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {message && (
                  <p className="million-register-message" role="alert">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  className="million-register-submit"
                  disabled={!canSubmit}
                >
                  <span>
                    {loading
                      ? "Sending verification code..."
                      : "Continue securely"}
                  </span>
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="million-register-trust-row">
                <div>
                  <ShieldCheck size={15} />
                  <span>Protected by Contriba</span>
                </div>

                <p>
                  Already registered?
                  <Link to="/login">Login</Link>
                </p>
              </div>
            </div>

            <footer className="million-register-footer">
              <span>© {new Date().getFullYear()} Contriba</span>
              <div>
                <Link to="/privacy">Privacy</Link>
                <Link to="/terms">Terms</Link>
              </div>
            </footer>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Register;