import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Copy,
  Heart,
  Home,
  ReceiptText,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import mtnLogo from "../../assets/mtn.png";
import airtelLogo from "../../assets/airtel.jpg";
import visaLogo from "../../assets/Visa.png";

import "./PaymentSuccess.css";

function formatMoney(value) {
  return `RWF ${Number(value || 0).toLocaleString()}`;
}

function readSuccessData() {
  const raw =
    sessionStorage.getItem("contriba_payment_success") ||
    sessionStorage.getItem("contriba_checkout");

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getMethodLogo(method) {
  if (method === "airtel") return airtelLogo;
  if (method === "card") return visaLogo;
  return mtnLogo;
}

function getMethodLabel(method) {
  if (method === "airtel") return "Airtel Money";
  if (method === "card") return "Visa / Card";
  return "MTN Mobile Money";
}

function PaymentSuccess() {
  const { id } = useParams();

  const payment = readSuccessData();

  const amount = Number(payment?.amount || 0);
  const fee = Number(payment?.fee || Math.round(amount * 0.01));
  const ownerReceives = Number(payment?.ownerReceives || amount - fee);

  const eventTitle = payment?.event?.title || "Selected Event";
  const method = payment?.selectedMethod || payment?.paymentMethod || "mtn";
  const methodLabel = payment?.selectedMethodLabel || getMethodLabel(method);
  const methodLogo = getMethodLogo(method);
  const phone = payment?.phone || "Phone not available";
  const transactionRef =
    payment?.transaction_ref ||
    payment?.reference ||
    payment?.contribution?.transaction_id ||
    "Payment reference pending";

  return (
    <main className="payment-success-page">
      <div className="success-glow one"></div>
      <div className="success-glow two"></div>

      <section className="payment-success-shell">
        <div className="success-card-main">
          <div className="confetti-layer">
            <span className="confetti c1"></span>
            <span className="confetti c2"></span>
            <span className="confetti c3"></span>
            <span className="confetti c4"></span>
            <span className="confetti c5"></span>
            <span className="confetti c6"></span>
            <span className="confetti c7"></span>
            <span className="confetti c8"></span>
          </div>

          <div className="success-icon">
            <Check size={54} />
          </div>

          <span className="success-badge">
            <Sparkles size={16} />
            Payment Successful
          </span>

          <h1>Thank you for your contribution.</h1>

          <p>
            Your payment has been received successfully. The event owner will be
            notified and your contribution is now part of the event support.
          </p>

          <div className="success-amount-box">
            <span>You contributed</span>
            <strong>{formatMoney(amount)}</strong>
            <small>to {eventTitle}</small>
          </div>

          <div className="success-actions">
            <Link to={`/events/${id}`} className="success-primary">
              <CalendarDays size={18} />
              Back to Event
            </Link>

            <Link to="/events" className="success-secondary">
              <Home size={18} />
              Go Events
            </Link>

            <button className="success-secondary" type="button">
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>

        <aside className="success-receipt-card">
          <div className="receipt-heading">
            <div>
              <ReceiptText size={22} />
            </div>

            <span>Contribution Receipt</span>
          </div>

          <div className="receipt-method">
            <div className="receipt-method-logo">
              <img src={methodLogo} alt={methodLabel} />
            </div>

            <div>
              <strong>{methodLabel}</strong>
              <span>{phone}</span>
            </div>
          </div>

          <div className="receipt-list">
            <div>
              <span>Amount</span>
              <strong>{formatMoney(amount)}</strong>
            </div>

            <div>
              <span>Platform Fee (1%)</span>
              <strong className="red">- {formatMoney(fee)}</strong>
            </div>

            <div>
              <span>Total Paid</span>
              <strong>{formatMoney(amount)}</strong>
            </div>

            <div>
              <span>Owner Receives</span>
              <strong className="green">{formatMoney(ownerReceives)}</strong>
            </div>
          </div>

          <div className="receipt-ref">
            <span>Transaction Reference</span>

            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(transactionRef)}
            >
              {transactionRef}
              <Copy size={15} />
            </button>
          </div>

          <div className="receipt-trust">
            <span>
              <ShieldCheck size={15} />
              Verified payment
            </span>

            <span>
              <Heart size={15} />
              Contribution recorded
            </span>
          </div>

          <Link to={`/events/${id}/contribute`} className="receipt-link">
            Make another contribution
            <ArrowRight size={18} />
          </Link>
        </aside>
      </section>
    </main>
  );
}

export default PaymentSuccess;