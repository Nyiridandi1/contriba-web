import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Phone,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import logoIcon from "../../assets/logo-icon.png";

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
    <main className="million-login-page">
      <section className="million-shell">
        <div className="million-hero">
          <div className="million-grid" />
          <div className="million-orb million-orb-one" />
          <div className="million-orb million-orb-two" />
          <div className="million-orb million-orb-three" />

          <div className="million-hero-inner">
            <div className="million-mobile-hero-topbar">
              <Link to="/" className="million-mobile-brand">
                <span className="million-brand-mark">
                  <img src={logoIcon} alt="" />
                </span>
                <span>contriba</span>
              </Link>

              <Link
                to="/"
                className="million-mobile-back"
                aria-label="Back home"
              >
                <ArrowLeft size={17} />
              </Link>
            </div>

            <div className="million-hero-topbar">
              <Link to="/" className="million-brand">
                <span className="million-brand-mark">
                  <img src={logoIcon} alt="" />
                </span>
                <span>contriba</span>
              </Link>

              <Link to="/" className="million-back-link">
                <ArrowLeft size={16} />
                <span>Back home</span>
              </Link>
            </div>

            <div className="million-hero-content">
              <span className="million-eyebrow">
                <Sparkles size={15} />
                Built for modern communities
              </span>

              <h1>
                Manage every contribution
                <span>from one secure workspace.</span>
              </h1>

              <p>
                Create events, track contributors, monitor your wallet and
                understand your fundraising performance with confidence.
              </p>

              <div className="million-feature-list">
                <div>
                  <CheckCircle2 size={18} />
                  <span>Real-time wallet and contribution visibility</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>Professional contributor management</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>Secure access for every organizer</span>
                </div>
              </div>
            </div>

            <div className="million-dashboard-preview" aria-hidden="true">
              <div className="million-preview-top">
                <div>
                  <span>Organizer overview</span>
                  <strong>Good evening, Olivier</strong>
                </div>
                <span className="million-status-dot">Live</span>
              </div>

              <div className="million-preview-grid">
                <div className="million-preview-card">
                  <span className="million-preview-icon">
                    <WalletCards size={18} />
                  </span>
                  <small>Wallet balance</small>
                  <strong>RWF 2.48M</strong>
                  <span className="million-positive">+18.4%</span>
                </div>

                <div className="million-preview-card">
                  <span className="million-preview-icon">
                    <UsersRound size={18} />
                  </span>
                  <small>Contributors</small>
                  <strong>1,284</strong>
                  <span className="million-positive">+126 this month</span>
                </div>

                <div className="million-preview-card">
                  <span className="million-preview-icon">
                    <BarChart3 size={18} />
                  </span>
                  <small>Active events</small>
                  <strong>12</strong>
                  <span className="million-positive">8 performing well</span>
                </div>
              </div>
            </div>

            <p className="million-hero-footer">
              Trusted tools for organizers, families, churches and communities.
            </p>
          </div>
        </div>

        <div className="million-panel">
          <div className="million-panel-inner">
            <div className="million-login-card">
              <div className="million-card-heading">
                <span className="million-kicker">Secure organizer access</span>
                <h2>Welcome back</h2>
                <p>Enter your details to continue to your dashboard.</p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="million-form"
                autoComplete="off"
                noValidate
              >
                <div className="million-field">
                  <label htmlFor="million-phone">Phone number</label>

                  <div className="million-input-shell">
                    <Phone size={18} />
                    <span className="million-code">🇷🇼 +250</span>

                    <input
                      id="million-phone"
                      name="contriba-login-phone"
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

                <div className="million-field">
                  <div className="million-label-row">
                    <label htmlFor="million-pin">PIN</label>
                    <Link to="/forgot-pin">Forgot PIN?</Link>
                  </div>

                  <div className="million-input-shell">
                    <LockKeyhole size={18} />

                    <input
                      id="million-pin"
                      name="contriba-login-pin"
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
                      className="million-eye"
                      onClick={() => setShowPin((current) => !current)}
                      aria-label={showPin ? "Hide PIN" : "Show PIN"}
                    >
                      {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {message && (
                  <p className="million-message" role="alert">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  className="million-submit"
                  disabled={!canSubmit}
                >
                  <span>{loading ? "Signing in..." : "Sign in securely"}</span>
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="million-trust-row">
                <div>
                  <ShieldCheck size={15} />
                  <span>Protected by Contriba</span>
                </div>

                <p>
                  New here?
                  <Link to="/register">Create account</Link>
                </p>
              </div>
            </div>

            <footer className="million-footer">
              <span>© {new Date().getFullYear()} Contriba</span>
              <div>
                <Link to="/privacy">Privacy</Link>
                <Link to="/terms">Terms</Link>
              </div>
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;