import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  UserCircle2,
} from "lucide-react";

import { cashIn, checkPaymentStatus } from "../api/api";

import mtnLogo from "../../assets/mtn.png";
import airtelLogo from "../../assets/airtel.jpg";
import visaLogo from "../../assets/Visa.png";

import "./PaymentConfirm.css";

const paymentMethods = [
  { id: "mtn", label: "MTN Mobile Money", logo: mtnLogo },
  { id: "airtel", label: "Airtel Money", logo: airtelLogo },
  { id: "card", label: "Visa / Card", logo: visaLogo },
];

function formatMoney(value) {
  return `RWF ${Number(value || 0).toLocaleString()}`;
}

function readCheckoutData() {
  const raw = sessionStorage.getItem("contriba_checkout");

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalizePhone(phone) {
  const digits = String(phone || "").replace(/[^\d]/g, "");

  if (digits.startsWith("250")) return digits;
  if (digits.startsWith("0")) return `25${digits}`;
  if (digits.length === 9) return `250${digits}`;

  return digits;
}

function PaymentConfirm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [checkout, setCheckout] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("mtn");
  const [isLoading, setIsLoading] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    const savedCheckout = readCheckoutData();

    if (!savedCheckout) {
      navigate(`/events/${id}/contribute`);
      return;
    }

    setCheckout(savedCheckout);
    setSelectedMethod(savedCheckout.paymentMethod || "mtn");
  }, [id, navigate]);

  const amount = Number(checkout?.amount || 0);
  const fee = Number(checkout?.fee || Math.round(amount * 0.01));
  const ownerReceives = Number(checkout?.ownerReceives || amount - fee);

  const selectedMethodLabel =
    paymentMethods.find((method) => method.id === selectedMethod)?.label ||
    "MTN Mobile Money";

  const payerName = checkout?.name || "Guest";
  const payerPhone = normalizePhone(checkout?.phone);
  const eventTitle = checkout?.event?.title || "Selected Event";

  const canPay = useMemo(() => {
    return Boolean(checkout?.contribution?.id && amount > 0 && payerPhone);
  }, [checkout, amount, payerPhone]);

  async function pollStatus(reference) {
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts += 1;
      setPollCount(attempts);

      const result = await checkPaymentStatus(reference);

      if (!result.success) {
        setStatusMessage(result.message || "Checking payment status...");
      }

      if (result.success && result.status === "successful") {
        clearInterval(interval);

        const successData = {
          ...checkout,
          transaction_ref: reference,
          payment_status: "successful",
          selectedMethod,
          selectedMethodLabel,
          paid_at: new Date().toISOString(),
        };

        sessionStorage.setItem(
          "contriba_payment_success",
          JSON.stringify(successData)
        );

        setStatusMessage("Payment confirmed successfully.");
        setIsLoading(false);

        navigate(`/events/${id}/payment-success`);
      }

      if (
        result.success &&
        ["failed", "cancelled", "canceled"].includes(result.status)
      ) {
        clearInterval(interval);
        setIsLoading(false);
        setTimedOut(true);
        setStatusMessage("Payment was not completed. Please try again.");
      }

      if (attempts >= 30) {
        clearInterval(interval);
        setIsLoading(false);
        setTimedOut(true);
        setStatusMessage(
          "Payment is still pending. If you confirmed on your phone, try checking again."
        );
      }
    }, 2000);
  }

  async function handlePayNow() {
    if (!checkout) {
      navigate(`/events/${id}/contribute`);
      return;
    }

    if (selectedMethod === "card") {
      setTimedOut(true);
      setStatusMessage(
        "Card payment is coming soon."
      );
      return;
    }

    if (!canPay) {
      setTimedOut(true);
      setStatusMessage("Missing payment information. Please go back and try again.");
      return;
    }

    const provider = selectedMethod === "airtel" ? "airtel" : "mtn";

    setIsLoading(true);
    setTimedOut(false);
    setStatusMessage("Sending payment request to your phone...");
    setTransactionRef("");

    const result = await cashIn({
      amount,
      phone: payerPhone,
      provider,
      payment_method: provider,
      contribution_id: checkout.contribution.id,
      event_id: id,
    });

    if (!result.success) {
      setIsLoading(false);
      setTimedOut(true);
      setStatusMessage(result.message || "Payment request failed.");
      return;
    }

    const reference =
      result.transaction_ref ||
      result.ref ||
      result.reference ||
      result.data?.ref ||
      result.data?.transaction_ref;

    if (!reference) {
      setIsLoading(false);
      setTimedOut(true);
      setStatusMessage("Payment started, but we could not confirm the reference. Please try again.");
      return;
    }

    setTransactionRef(reference);
    setStatusMessage("Check your phone and confirm the mobile money payment.");

    pollStatus(reference);
  }

  function handleRetry() {
    setTimedOut(false);

    if (transactionRef) {
      setIsLoading(true);
      setStatusMessage("Checking payment status again...");
      pollStatus(transactionRef);
      return;
    }

    handlePayNow();
  }

  if (!checkout) {
    return (
      <main className="payment-confirm-page">
        <div className="payment-confirm-shell">
          <div className="payment-confirm-top">
            <Link to={`/events/${id}/contribute`} className="payment-back">
              <ArrowLeft size={19} />
            </Link>

            <div>
              <span>Secure checkout</span>
              <h1>Loading Payment</h1>
            </div>

            <div className="payment-top-spacer"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="payment-confirm-page">
      <div className="payment-confirm-shell">
        <div className="payment-confirm-top">
          <Link to={`/events/${id}/contribute`} className="payment-back">
            <ArrowLeft size={19} />
          </Link>

          <div>
            <span>Secure checkout</span>
            <h1>Confirm Payment</h1>
          </div>

          <div className="payment-top-spacer"></div>
        </div>

        <section className="payment-confirm-layout">
          <div className="payment-confirm-main">
            <div className="payer-card">
              <UserCircle2 size={24} />
              <strong>{payerName}</strong>
              <span>•</span>
              <strong>{payerPhone}</strong>
            </div>

            <div className="sending-card">
              <span>You are sending</span>
              <strong>{formatMoney(amount)}</strong>
              <p>to {eventTitle}</p>
            </div>

            <div className="confirm-card">
              <h2>Choose Payment Method</h2>

              <div className="confirm-methods">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    className={selectedMethod === method.id ? "active" : ""}
                    onClick={() => setSelectedMethod(method.id)}
                    disabled={isLoading}
                  >
                    <div className="confirm-method-logo">
                      <img src={method.logo} alt={method.label} />
                    </div>

                    <span>{method.label}</span>

                    <div className="confirm-radio">
                      {selectedMethod === method.id && <div></div>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="breakdown-card">
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

            {timedOut && (
              <div className="timeout-box">
                <Clock size={22} />
                <div>
                  <strong>Payment needs your attention</strong>
                  <p>{statusMessage}</p>
                </div>
              </div>
            )}

            <div className="security-note">
              <div>
                <Smartphone size={22} />
              </div>

              <p>
                You will receive a mobile money prompt on your phone to confirm
                this payment. Keep this page open while Contriba checks the
                transaction status.
              </p>
            </div>
          </div>

          <aside className="payment-confirm-sidebar">
            <div className="payment-summary-card">
              <span>Final Review</span>

              <h3>{formatMoney(amount)}</h3>
              <p>Confirm your payment details before continuing.</p>

              <div className="summary-mini-list">
                <div>
                  <span>Method</span>
                  <strong>{selectedMethodLabel}</strong>
                </div>

                <div>
                  <span>Recipient</span>
                  <strong>{eventTitle}</strong>
                </div>

                <div>
                  <span>Owner receives</span>
                  <strong className="green">{formatMoney(ownerReceives)}</strong>
                </div>

                {transactionRef && (
                  <div>
                    <span>Transaction Ref</span>
                    <strong>{transactionRef}</strong>
                  </div>
                )}

                {isLoading && (
                  <div>
                    <span>Status Check</span>
                    <strong>{pollCount} checks</strong>
                  </div>
                )}
              </div>

              {isLoading && statusMessage && (
                <div className="payment-status">
                  <Loader2 size={18} className="spin" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {timedOut && !isLoading && (
                <button className="retry-button" onClick={handleRetry}>
                  <RefreshCcw size={18} />
                  Check Status / Try Again
                </button>
              )}

              <button
                className="pay-now-button"
                onClick={handlePayNow}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={19} className="spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay Now {formatMoney(amount)}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <div className="payment-trust">
                <span>
                  <CheckCircle2 size={15} />
                  Secure checkout
                </span>

                <span>
                  <CreditCard size={15} />
                  Mobile money ready
                </span>

                <span>
                  <ShieldCheck size={15} />
                  Confirming payment status
                </span>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <div className="payment-bottom-bar">
        <button onClick={handlePayNow} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 size={19} className="spin" />
              Processing...
            </>
          ) : (
            <>
              Pay Now {formatMoney(amount)}
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </main>
  );
}

export default PaymentConfirm;