import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Landmark,
  LockKeyhole,
  Phone,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getWallet, getTransactions, withdrawFunds } from "../api/api";
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

  const balance = Number(wallet?.balance || 0);
  const totalWithdrawn = transactions
    .filter((t) => t.type === "withdrawal" && t.status === "success")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const pendingBalance = transactions
    .filter((t) => t.status === "pending")
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

  function scrollToWithdraw() {
    document.getElementById("wallet-withdraw-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

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
    if (selectedMethod === "bank") {
      setWithdrawMessage("Bank withdrawals are coming soon. Please use MTN MoMo or Airtel Money.");
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
      setWithdrawMessage("✅ Withdrawal initiated. Check your mobile money account.");
      setWithdrawAmount("");
      setWithdrawPhone("");
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
              Manage available balance, request withdrawals and track payout
              history from one clean wallet center.
            </p>
          </div>

          <div className="wallet-top-actions">
            <button type="button">
              <Download size={18} />
              Statement
            </button>

            <button type="button" className="red" onClick={scrollToWithdraw}>
              <ArrowDownRight size={18} />
              Withdraw
            </button>
          </div>
        </header>

        <section className="wallet-hero">
          <div className="wallet-hero-left">
            <span className="wallet-badge">
              <Sparkles size={16} />
              {balance > 0 ? "Available to withdraw" : "Wallet ready"}
            </span>

            <h2>{loading ? <span className="wallet-hero-balance-skeleton shimmer" /> : formatMoney(balance)}</h2>

            <p>
              {balance > 0
                ? "This balance is cleared, verified and ready to move to MTN MoMo or Airtel Money."
                : "Your wallet is ready. Contributions will appear here after successful payments."}
            </p>

            <div className="wallet-hero-actions">
              <button type="button" className="light" onClick={scrollToWithdraw}>
                <ArrowDownRight size={18} />
                Withdraw Funds
              </button>

              <button type="button" className="glass">
                <FileText size={18} />
                Statement
              </button>
            </div>
          </div>

        </section>

        <section className="wallet-stats-grid">
          {loading ? (
            [1, 2, 3, 4].map((item) => (
              <div className="wallet-stat-card wallet-skeleton-card" key={item}>
                <div className="wallet-skeleton-icon shimmer" />
                <span className="wallet-skeleton-line wallet-skeleton-line-sm shimmer" />
                <strong className="wallet-skeleton-line wallet-skeleton-line-md shimmer" />
                <p className="wallet-skeleton-line wallet-skeleton-line-xs shimmer" />
              </div>
            ))
          ) : (
            <>
              <div className="wallet-stat-card">
                <div className="wallet-stat-icon"><WalletCards size={20} /></div>
                <span>Available Balance</span>
                <strong>{formatMoney(balance)}</strong>
                <p>Ready to withdraw</p>
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
                <p>Wallet records</p>
              </div>
            </>
          )}
        </section>

        <section className="wallet-content-grid wallet-primary-grid">
          <div id="wallet-withdraw-form" className="wallet-panel wallet-withdraw-panel">
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

            <div className="wallet-form-fields">
              <input
                type="number"
                placeholder="Enter amount (RWF)"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Phone number (e.g. 0788123456)"
                value={withdrawPhone}
                onChange={(e) => setWithdrawPhone(e.target.value)}
              />
            </div>

            <div className="destination-list">
              <button
                type="button"
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
                type="button"
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
                type="button"
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
              <p className={withdrawMessage.includes("✅") ? "wallet-message success" : "wallet-message error"}>
                {withdrawMessage}
              </p>
            )}

            <button
              type="button"
              className="wallet-red-button"
              onClick={handleWithdraw}
              disabled={withdrawLoading || !withdrawAmount || !withdrawPhone}
            >
              {withdrawLoading ? "Processing..." : "Confirm Withdrawal"}
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="wallet-panel wallet-status-panel">
            <span className="wallet-badge dark">
              <ShieldCheck size={16} />
              Wallet Status
            </span>

            <h3>Ready for secure payouts</h3>
            <p>
              Your wallet is prepared for live mobile money withdrawals. New
              contributions, payout requests and transaction records will appear
              here automatically.
            </p>

            <div className="wallet-status-list">
              <p><CheckCircle2 size={16} />Balance tracking is active</p>
              <p><CheckCircle2 size={16} />MTN MoMo and Airtel Money withdrawals are prepared</p>
              <p><CheckCircle2 size={16} />Payout history will update after each transaction</p>
            </div>
          </div>
        </section>

        <section className="wallet-panel wallet-transactions-panel">
          <div className="wallet-panel-heading">
            <div>
              <span>Transaction History</span>
              <h3>Recent payouts & deposits</h3>
            </div>
            <button type="button" onClick={loadWallet}>
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>

          <div className="withdraw-table">
            {loading && (
              <div className="wallet-transactions-skeleton">
                {[1, 2, 3].map((item) => (
                  <div className="withdraw-row wallet-withdraw-skeleton-row" key={item}>
                    <div>
                      <strong className="wallet-skeleton-line wallet-skeleton-line-md shimmer" />
                      <span className="wallet-skeleton-line wallet-skeleton-line-sm shimmer" />
                    </div>
                    <strong className="wallet-skeleton-line wallet-skeleton-line-sm shimmer" />
                    <span className="wallet-skeleton-line wallet-skeleton-line-xs shimmer" />
                    <small className="wallet-skeleton-pill shimmer" />
                  </div>
                ))}
              </div>
            )}

            {!loading && transactions.length === 0 && (
              <div className="wallet-empty-state">
                <WalletCards size={32} />
                <strong>No transactions yet</strong>
                <span>
                  Your payouts and deposits will appear here after the wallet
                  backend records your first transaction.
                </span>
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
        </section>
      </section>
    </main>
  );
}

export default Wallet;
