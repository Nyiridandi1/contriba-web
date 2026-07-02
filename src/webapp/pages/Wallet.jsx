import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileText,
  Landmark,
  LockKeyhole,
  Phone,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getWallet, getTransactions, withdrawFunds, getUser } from "../api/api";
import AppSidebar from "../components/AppSidebar";
import "./Wallet.css";

function formatMoney(value) {
  return `RWF ${Number(value || 0).toLocaleString()}`;
}

function formatTimeAgo(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawPhone, setWithdrawPhone] = useState("");
  const [withdrawMessage, setWithdrawMessage] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("mtn");

  const currentUser = getUser();

  const balance = Number(wallet?.balance || 0);
  const totalWithdrawn = transactions
    .filter(t => t.type === "withdrawal" && t.status === "success")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const pendingBalance = transactions
    .filter(t => t.status === "pending")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  async function loadWallet() {
    setLoading(true);
    const [walletResult, transactionsResult] = await Promise.all([
      getWallet(),
      getTransactions(),
    ]);

    if (walletResult.success) {
      setWallet(walletResult.wallet);
    }

    if (transactionsResult.success) {
      setTransactions(transactionsResult.transactions || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadWallet();
  }, []);

  async function handleWithdraw() {
    if (!withdrawAmount || Number(withdrawAmount) < 500) {
      setWithdrawMessage("Minimum withdrawal is RWF 500.");
      return;
    }
    if (!withdrawPhone) {
      setWithdrawMessage("Please enter your phone number.");
      return;
    }
    if (Number(withdrawAmount) > balance) {
      setWithdrawMessage("Amount exceeds available balance.");
      return;
    }

    setWithdrawLoading(true);
    setWithdrawMessage("");

    const result = await withdrawFunds({
      amount: Number(withdrawAmount),
      phone: withdrawPhone,
      method: selectedMethod,
    });

    if (result.success) {
      setWithdrawMessage("✅ Withdrawal initiated! Check your mobile money.");
      setWithdrawAmount("");
      await loadWallet();
    } else {
      setWithdrawMessage(result.message || "Withdrawal failed. Try again.");
    }

    setWithdrawLoading(false);
  }

  return (
    <main className="wallet-page">
      <AppSidebar active="wallet" />

      <section className="wallet-main">
        <header className="wallet-topbar">
          <div>
            <span>Wallet Center</span>
            <h1>Money, payouts and withdrawals</h1>
            <p>
              Manage available balance, pending payments, withdrawal
              destinations, platform fees and financial statements.
            </p>
          </div>

          <div className="wallet-top-actions">
            <button>
              <Download size={18} />
              Statement
            </button>

            <button className="red" onClick={handleWithdraw} disabled={withdrawLoading}>
              <ArrowDownRight size={18} />
              {withdrawLoading ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </header>

        {/* ── HERO ── */}
        <section className="wallet-hero">
          <div className="wallet-hero-left">
            <span className="wallet-badge">
              <Sparkles size={16} />
              Available to withdraw
            </span>

            <h2>{loading ? "Loading..." : formatMoney(balance)}</h2>

            <p>
              This balance is cleared, verified and ready to move to MTN MoMo
              or Airtel Money.
            </p>

            <div className="wallet-hero-actions">
              <button className="light">
                <ArrowDownRight size={18} />
                Withdraw Funds
              </button>

              <button className="glass">
                <FileText size={18} />
                Download Report
              </button>
            </div>
          </div>

          <div className="wallet-security-card">
            <ShieldCheck size={28} />
            <span>Protected Balance</span>
            <strong>{balance > 0 ? "Active wallet" : "No balance yet"}</strong>
            <p>
              {balance > 0
                ? "Your recent payments are verified and payout-ready."
                : "Contribute to events to see your wallet grow."}
            </p>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="wallet-stats-grid">
          <div className="wallet-stat-card">
            <div className="wallet-stat-icon"><WalletCards size={20} /></div>
            <span>Available Balance</span>
            <strong>{formatMoney(balance)}</strong>
            <p>Ready to withdraw now</p>
          </div>

          <div className="wallet-stat-card">
            <div className="wallet-stat-icon"><Clock size={20} /></div>
            <span>Pending Balance</span>
            <strong>{formatMoney(pendingBalance)}</strong>
            <p>Waiting confirmation</p>
          </div>

          <div className="wallet-stat-card">
            <div className="wallet-stat-icon"><ArrowUpRight size={20} /></div>
            <span>Withdrawn Total</span>
            <strong>{formatMoney(totalWithdrawn)}</strong>
            <p>Sent to your accounts</p>
          </div>

          <div className="wallet-stat-card">
            <div className="wallet-stat-icon"><ShieldCheck size={20} /></div>
            <span>Transactions</span>
            <strong>{transactions.length}</strong>
            <p>Total transactions</p>
          </div>
        </section>

        {/* ── WITHDRAW + AI ── */}
        <section className="wallet-content-grid">
          <div className="wallet-panel wallet-withdraw-panel">
            <div className="wallet-panel-heading">
              <div>
                <span>Withdraw Center</span>
                <h3>Choose destination</h3>
              </div>
              <LockKeyhole size={22} />
            </div>

            <div className="withdraw-amount-card">
              <span>Available balance</span>
              <strong>{formatMoney(balance)}</strong>
              <p>Estimated arrival: 2 minutes for mobile money.</p>
            </div>

            {/* Amount input */}
            <div style={{ marginBottom: "12px" }}>
              <input
                type="number"
                placeholder="Enter amount (RWF)"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  fontSize: "15px",
                  fontFamily: "inherit",
                  marginBottom: "10px",
                  outline: "none",
                }}
              />
              <input
                type="tel"
                placeholder="Phone number (e.g. 0788123456)"
                value={withdrawPhone}
                onChange={(e) => setWithdrawPhone(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  fontSize: "15px",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
            </div>

            {/* Method selection */}
            <div className="destination-list">
              <button
                className={selectedMethod === "mtn" ? "active" : ""}
                onClick={() => setSelectedMethod("mtn")}
              >
                <div><Phone size={18} /></div>
                <span>
                  <strong>MTN MoMo</strong>
                  <small>Mobile Money</small>
                </span>
                {selectedMethod === "mtn" && <CheckCircle2 size={18} />}
              </button>

              <button
                className={selectedMethod === "airtel" ? "active" : ""}
                onClick={() => setSelectedMethod("airtel")}
              >
                <div><Phone size={18} /></div>
                <span>
                  <strong>Airtel Money</strong>
                  <small>Mobile Money</small>
                </span>
                {selectedMethod === "airtel" && <CheckCircle2 size={18} />}
              </button>

              <button
                className={selectedMethod === "bank" ? "active" : ""}
                onClick={() => setSelectedMethod("bank")}
              >
                <div><Landmark size={18} /></div>
                <span>
                  <strong>Bank Account</strong>
                  <small>Coming soon</small>
                </span>
                {selectedMethod === "bank" && <CheckCircle2 size={18} />}
              </button>
            </div>

            {withdrawMessage && (
              <p style={{
                fontSize: "13px",
                color: withdrawMessage.includes("✅") ? "#16a34a" : "#E50914",
                margin: "8px 0",
                fontWeight: 600,
              }}>
                {withdrawMessage}
              </p>
            )}

            <button
              className="wallet-red-button"
              onClick={handleWithdraw}
              disabled={withdrawLoading || !withdrawAmount || !withdrawPhone}
            >
              {withdrawLoading ? "Processing..." : "Confirm Withdrawal"}
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="wallet-panel wallet-ai-panel">
            <span className="wallet-badge dark">
              <Sparkles size={16} />
              AI Wallet Insight
            </span>

            <h3>
              {balance > 0
                ? "Your balance is ready to withdraw."
                : "No balance available yet."}
            </h3>

            <p>
              {balance > 0
                ? `You have ${formatMoney(balance)} available. Withdraw to MTN MoMo or Airtel Money in under 2 minutes.`
                : "Once contributors send money to your events, your wallet balance will appear here ready to withdraw."}
            </p>

            <div className="ai-wallet-grid">
              <div>
                <span>Available</span>
                <strong>{formatMoney(balance)}</strong>
              </div>
              <div>
                <span>Withdrawn</span>
                <strong>{formatMoney(totalWithdrawn)}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRANSACTION HISTORY ── */}
        <section className="wallet-content-grid">
          <div className="wallet-panel large">
            <div className="wallet-panel-heading">
              <div>
                <span>Transaction History</span>
                <h3>Recent payouts & deposits</h3>
              </div>
              <button onClick={loadWallet}>
                <RefreshCcw size={16} />
                Refresh
              </button>
            </div>

            <div className="withdraw-table">
              {loading && (
                <div className="withdraw-row">
                  <div><strong>Loading transactions...</strong></div>
                </div>
              )}

              {!loading && transactions.length === 0 && (
                <div className="withdraw-row">
                  <div>
                    <strong>No transactions yet</strong>
                    <span>Your transaction history will appear here</span>
                  </div>
                </div>
              )}

              {!loading && transactions.slice(0, 10).map((item, index) => (
                <div className="withdraw-row" key={item.id || index}>
                  <div>
                    <strong>{item.type === "withdrawal" ? "Withdrawal" : "Deposit"}</strong>
                    <span>{item.phone || item.destination || "Mobile Money"}</span>
                  </div>
                  <strong>{formatMoney(item.amount)}</strong>
                  <span>{formatTimeAgo(item.created_at)}</span>
                  <small className={item.status === "success" || item.status === "completed" ? "completed" : "processing"}>
                    {item.status === "success" ? "Completed" : item.status === "pending" ? "Processing" : item.status}
                  </small>
                </div>
              ))}
            </div>
          </div>

          <div className="wallet-panel">
            <div className="wallet-panel-heading">
              <div>
                <span>Cash Flow</span>
                <h3>This week</h3>
              </div>
              <TrendingUp size={22} />
            </div>

            <div className="cashflow-chart">
              <div style={{ height: "40%" }}><span>Mon</span></div>
              <div style={{ height: "58%" }}><span>Tue</span></div>
              <div style={{ height: "45%" }}><span>Wed</span></div>
              <div style={{ height: "80%" }}><span>Thu</span></div>
              <div style={{ height: "64%" }}><span>Fri</span></div>
              <div style={{ height: "92%" }}><span>Sat</span></div>
              <div style={{ height: "54%" }}><span>Sun</span></div>
            </div>
          </div>
        </section>

        {/* ── ACCOUNT SETUP ── */}
        <section className="wallet-content-grid">
          <div className="wallet-panel">
            <div className="wallet-panel-heading">
              <div>
                <span>Payment Sources</span>
                <h3>Money received by method</h3>
              </div>
              <CreditCard size={22} />
            </div>

            <div className="wallet-source-list">
              <div>
                <span>MTN MoMo</span>
                <strong>
                  {formatMoney(
                    transactions
                      .filter(t => t.method === "mtn" && t.status === "success")
                      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
                  )}
                </strong>
                <div><i style={{ width: "71%" }}></i></div>
              </div>
              <div>
                <span>Airtel Money</span>
                <strong>
                  {formatMoney(
                    transactions
                      .filter(t => t.method === "airtel" && t.status === "success")
                      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
                  )}
                </strong>
                <div><i style={{ width: "18%" }}></i></div>
              </div>
            </div>
          </div>

          <div className="wallet-panel">
            <div className="wallet-panel-heading">
              <div>
                <span>Account Setup</span>
                <h3>Withdrawal accounts</h3>
              </div>
              <Banknote size={22} />
            </div>

            <div className="account-setup-list">
              <button onClick={() => setSelectedMethod("mtn")}>
                <Plus size={18} />
                Add MTN MoMo Account
              </button>

              <button onClick={() => setSelectedMethod("airtel")}>
                <Plus size={18} />
                Add Airtel Money Account
              </button>

              <button>
                <Plus size={18} />
                Add Bank Account
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Wallet;