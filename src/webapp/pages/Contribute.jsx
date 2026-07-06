import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CreditCard,
  Eye,
  Heart,
  LockKeyhole,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  WalletCards,
  Zap,
} from "lucide-react";

import { getEvent, initiateContribution } from "../api/api";

import mtnLogo from "../../assets/mtn.png";
import airtelLogo from "../../assets/airtel.jpg";
import visaLogo from "../../assets/Visa.png";

import "./Contribute.css";

const fallbackImage =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

const quickAmounts = [5000, 10000, 20000, 50000, 100000];

const paymentMethods = [
  {
    id: "mtn",
    name: "MTN Mobile Money",
    label: "Instant mobile money payment",
    logo: mtnLogo,
  },
  {
    id: "airtel",
    name: "Airtel Money",
    label: "Fast Airtel money transfer",
    logo: airtelLogo,
  },
  {
    id: "card",
    name: "Visa / Mastercard",
    label: "Card payment coming soon",
    logo: visaLogo,
  },
];

function formatDate(value) {
  if (!value) return "Date not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function normalizeEvent(event) {
  return {
    id: event.id,
    title: event.title || "Untitled Event",
    category: event.type || event.category || "Event",
    location: event.location || "Rwanda",
    date: formatDate(event.date),
    organizer: event.creator?.name || "Organizer",
    ownerPhone: event.owner_phone || event.creator?.phone || "Phone not available",
    image: event.cover_image || event.photo2_url || event.photo3_url || fallbackImage,
  };
}

function Contribute() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageMessage, setPageMessage] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(10000);
  const [message, setMessage] = useState("");
  const [publicContribution, setPublicContribution] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("mtn");

  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const normalizedEvent = useMemo(() => {
    if (!event) return null;
    return normalizeEvent(event);
  }, [event]);

  const fee = useMemo(() => Math.round(amount * 0.01), [amount]);
  const ownerReceives = useMemo(() => Math.max(amount - fee, 0), [amount, fee]);

  const cleanPhone = phone.replace(/[^\d]/g, "");

  const isValid =
    cleanPhone.length >= 9 &&
    amount > 0 &&
    (publicContribution ? name.trim().length >= 2 : true) &&
    !submitting;

  useEffect(() => {
    async function loadEvent() {
      setLoading(true);
      setPageMessage("");

      const result = await getEvent(id);

      if (!result.success) {
        setPageMessage(result.message || "Failed to load event.");
        setLoading(false);
        return;
      }

      setEvent(result.event);
      setLoading(false);
    }

    loadEvent();
  }, [id]);

  function formatMoney(value) {
    return `RWF ${Number(value || 0).toLocaleString()}`;
  }

  function handleAmountInput(value) {
    const clean = value.replace(/[^\d]/g, "");
    setAmount(clean ? Number(clean) : 0);
  }

  async function handleContinue() {
    setFormMessage("");

    if (!isValid) {
      setFormMessage("Please complete your name, phone number and amount.");
      return;
    }

    if (paymentMethod === "card") {
      setFormMessage("Card payment is coming soon.");
      return;
    }

    setSubmitting(true);

    const payload = {
      event_id: id,
      contributor_name: publicContribution ? name.trim() : "Anonymous",
      contributor_phone: phone,
      amount,
      payment_method: paymentMethod,
      message,
      is_anonymous: !publicContribution,
    };

    const result = await initiateContribution(payload);

    if (!result.success) {
      setFormMessage(result.message || "Failed to start contribution.");
      setSubmitting(false);
      return;
    }

    const checkoutData = {
      event_id: id,
      event: normalizedEvent,
      contribution: result.contribution,
      amount,
      fee,
      ownerReceives,
      phone,
      name: publicContribution ? name.trim() : "Anonymous",
      message,
      paymentMethod,
      isAnonymous: !publicContribution,
    };

    sessionStorage.setItem(
      "contriba_checkout",
      JSON.stringify(checkoutData)
    );

    setSubmitting(false);
    navigate(`/events/${id}/payment-confirm`);
  }

  if (loading) {
    return (
      <main className="contribute-page">
        <div className="contribute-shell">
          <Link to={`/events/${id}`} className="contribute-back">
            <ArrowLeft size={18} />
            Back to event
          </Link>

          <section className="contribute-header contribute-skeleton-header" aria-hidden="true">
            <span className="contribute-skeleton-badge"></span>
            <div className="contribute-skeleton-title"></div>
            <div className="contribute-skeleton-copy"></div>
            <div className="contribute-skeleton-copy short"></div>
          </section>

          <section className="contribute-layout contribute-skeleton-layout" aria-hidden="true">
            <div className="contribute-main">
              <div className="contribute-event-card contribute-skeleton-event-card">
                <div className="contribute-event-image contribute-skeleton-block"></div>
                <div className="contribute-event-info">
                  <span className="contribute-skeleton-line title"></span>
                  <span className="contribute-skeleton-line medium"></span>
                  <div className="contribute-skeleton-meta">
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>

              <div className="contribute-card contribute-skeleton-card">
                <span className="contribute-skeleton-line heading"></span>
                <span className="contribute-skeleton-input"></span>
                <span className="contribute-skeleton-input"></span>
                <span className="contribute-skeleton-row"></span>
              </div>

              <div className="contribute-card contribute-skeleton-card">
                <span className="contribute-skeleton-line heading"></span>
                <span className="contribute-skeleton-amount"></span>
                <div className="contribute-skeleton-chips">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>

            <aside className="contribute-summary">
              <div className="summary-card contribute-skeleton-card">
                <span className="contribute-skeleton-line heading"></span>
                <span className="contribute-skeleton-money"></span>
                <span className="contribute-skeleton-input"></span>
                <span className="contribute-skeleton-input"></span>
                <span className="contribute-skeleton-button"></span>
              </div>
            </aside>
          </section>
        </div>
      </main>
    );
  }

  if (!normalizedEvent) {
    return (
      <main className="contribute-page">
        <div className="contribute-shell">
          <Link to={`/events/${id}`} className="contribute-back">
            <ArrowLeft size={18} />
            Back to event
          </Link>

          <section className="contribute-header">
            <span>
              <Sparkles size={16} />
              Secure contribution
            </span>

            <h1>Event not found</h1>

            <p>{pageMessage || "This event could not be loaded."}</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="contribute-page">
      <div className="contribute-shell">
        <Link to={`/events/${id}`} className="contribute-back">
          <ArrowLeft size={18} />
          Back to event
        </Link>

        <section className="contribute-header">
          <span>
            <Sparkles size={16} />
            Secure contribution
          </span>

          <h1>Contribute to {normalizedEvent.title}</h1>

          <p>
            Support this event securely with MTN MoMo, Airtel Money or card.
            Your contribution is protected through Contriba.
          </p>
        </section>

        <section className="contribute-layout">
          <div className="contribute-main">
            <div className="contribute-event-card">
              <div className="contribute-event-image">
                <img src={normalizedEvent.image} alt={normalizedEvent.title} />
                <span>{normalizedEvent.category}</span>
              </div>

              <div className="contribute-event-info">
                <h2>{normalizedEvent.title}</h2>

                <div className="contribute-event-meta">
                  <span>
                    <CalendarDays size={16} />
                    {normalizedEvent.date}
                  </span>

                  <span>
                    <MapPin size={16} />
                    {normalizedEvent.location}
                  </span>
                </div>

                <div className="contribute-owner-row">
                  <div>
                    <UserRound size={18} />
                  </div>

                  <span>
                    Organizer
                    <strong>{normalizedEvent.organizer}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="contribute-card">
              <div className="contribute-card-heading">
                <span>01</span>
                <div>
                  <h2>Your information</h2>
                  <p>No account required. You can contribute as a guest.</p>
                </div>
              </div>

              <label>Your Name</label>
              <div className="contribute-input">
                <UserRound size={19} />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={!publicContribution}
                />
              </div>

              <label>Phone Number *</label>
              <div className="contribute-input">
                <Phone size={19} />
                <span>🇷🇼 +250</span>
                <input
                  type="tel"
                  placeholder="781 234 567"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>

              <button
                className={`contribute-visibility ${
                  publicContribution ? "active" : ""
                }`}
                onClick={() => setPublicContribution(!publicContribution)}
                type="button"
              >
                <div>
                  <Eye size={20} />
                </div>

                <span>
                  <strong>
                    {publicContribution
                      ? "Contribute Publicly"
                      : "Contribute Anonymously"}
                  </strong>
                  {publicContribution
                    ? "Your name will be visible to others."
                    : "Your name will be hidden from public contributors."}
                </span>

                <small>{publicContribution ? "ON" : "OFF"}</small>
              </button>
            </div>

            <div className="contribute-card">
              <div className="contribute-card-heading">
                <span>02</span>
                <div>
                  <h2>Contribution amount</h2>
                  <p>Choose a quick amount or enter your own.</p>
                </div>
              </div>

              <label>Enter Amount (RWF)</label>
              <input
                className="contribute-amount-input"
                value={amount.toLocaleString()}
                onChange={(event) => handleAmountInput(event.target.value)}
              />

              <div className="contribute-quick-grid">
                {quickAmounts.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={amount === item ? "active" : ""}
                    onClick={() => setAmount(item)}
                  >
                    {item.toLocaleString()}
                  </button>
                ))}
              </div>

              <label>Message</label>
              <textarea
                className="contribute-message"
                placeholder="Write a message to the event owner..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </div>

            <div className="contribute-card">
              <div className="contribute-card-heading">
                <span>03</span>
                <div>
                  <h2>Payment method</h2>
                  <p>Select how you want to send your contribution.</p>
                </div>
              </div>

              <div className="payment-methods">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    className={paymentMethod === method.id ? "active" : ""}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="payment-logo">
                      <img src={method.logo} alt={method.name} />
                    </div>

                    <span>
                      <strong>{method.name}</strong>
                      {method.label}
                    </span>

                    <div className="payment-check">
                      {paymentMethod === method.id && <Check size={17} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="contribute-summary">
            <div className="summary-card">
              <span className="summary-label">Payment summary</span>

              <div className="summary-amount">
                <small>You pay</small>
                <strong>{formatMoney(amount)}</strong>
              </div>

              <div className="summary-line">
                <span>Contriba fee (1%)</span>
                <strong>- {formatMoney(fee)}</strong>
              </div>

              <div className="summary-line">
                <span>Organizer receives</span>
                <strong className="green">{formatMoney(ownerReceives)}</strong>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-flow">
                <div>
                  <UserRound size={17} />
                  From you
                </div>

                <ArrowRight size={18} />

                <div>
                  <WalletCards size={17} />
                  {normalizedEvent.ownerPhone}
                </div>
              </div>

              {formMessage && (
                <p
                  style={{
                    color: "#E50914",
                    fontSize: "13px",
                    fontWeight: 900,
                    marginBottom: "12px",
                    lineHeight: 1.5,
                  }}
                >
                  {formMessage}
                </p>
              )}

              <button
                type="button"
                className="summary-button"
                onClick={handleContinue}
                disabled={submitting}
              >
                Continue
                <ArrowRight size={18} />
                {submitting ? "Preparing..." : formatMoney(amount)}
              </button>

              <div className="summary-trust">
                <span>
                  <ShieldCheck size={15} />
                  Secure payment
                </span>

                <span>
                  <Zap size={15} />
                  Instant confirmation
                </span>

                <span>
                  <LockKeyhole size={15} />
                  Encrypted checkout
                </span>

                <span>
                  <CreditCard size={15} />
                  MoMo / Airtel / Card
                </span>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <div className="contribute-bottom-bar">
        <div>
          <span>You pay</span>
          <strong>{formatMoney(amount)}</strong>
        </div>

        <button type="button" onClick={handleContinue} disabled={submitting}>
          {submitting ? "Preparing..." : "Continue"}
          <ArrowRight size={18} />
        </button>
      </div>
    </main>
  );
}

export default Contribute;