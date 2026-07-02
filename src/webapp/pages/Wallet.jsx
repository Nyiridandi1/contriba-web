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

import AppSidebar from "../components/AppSidebar";
import "./Wallet.css";

const walletStats = [
  {
    title: "Available Balance",
    value: "RWF 3,810,000",
    note: "Ready to withdraw now",
    icon: WalletCards,
  },
  {
    title: "Pending Balance",
    value: "RWF 140,000",
    note: "Waiting payment confirmation",
    icon: Clock,
  },
  {
    title: "Withdrawn Total",
    value: "RWF 1,240,000",
    note: "Sent to your accounts",
    icon: ArrowUpRight,
  },
  {
    title: "Platform Fees",
    value: "RWF 38,500",
    note: "Transparent fee history",
    icon: ShieldCheck,
  },
];

const withdrawalHistory = [
  {
    id: "WD-2049",
    destination: "MTN MoMo • 0788 123 456",
    amount: "RWF 500,000",
    date: "Today, 10:42 AM",
    status: "Completed",
  },
  {
    id: "WD-2048",
    destination: "Airtel Money • 0732 444 220",
    amount: "RWF 350,000",
    date: "Yesterday, 6:18 PM",
    status: "Completed",
  },
  {
    id: "WD-2047",
    destination: "Bank of Kigali • **** 4821",
    amount: "RWF 390,000",
    date: "24 June, 2:03 PM",
    status: "Processing",
  },
];

const destinations = [
  {
    title: "MTN MoMo",
    detail: "+250 788 123 456",
    icon: Phone,
    active: true,
  },
  {
    title: "Airtel Money",
    detail: "+250 732 444 220",
    icon: Phone,
    active: false,
  },
  {
    title: "Bank Account",
    detail: "Bank of Kigali • **** 4821",
    icon: Landmark,
    active: false,
  },
];

function Wallet() {
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

            <button className="red">
              <ArrowDownRight size={18} />
              Withdraw
            </button>
          </div>
        </header>

        <section className="wallet-hero">
          <div className="wallet-hero-left">
            <span className="wallet-badge">
              <Sparkles size={16} />
              Available to withdraw
            </span>

            <h2>RWF 3,810,000</h2>

            <p>
              This balance is cleared, verified and ready to move to MTN MoMo,
              Airtel Money or your bank account.
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
            <strong>96% financial health</strong>
            <p>
              No suspicious activity detected. Your recent payments are
              verified and payout-ready.
            </p>
          </div>
        </section>

        <section className="wallet-stats-grid">
          {walletStats.map((item) => {
            const Icon = item.icon;

            return (
              <div className="wallet-stat-card" key={item.title}>
                <div className="wallet-stat-icon">
                  <Icon size={20} />
                </div>

                <span>{item.title}</span>
                <strong>{item.value}</strong>
                <p>{item.note}</p>
              </div>
            );
          })}
        </section>

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
              <span>Amount to withdraw</span>
              <strong>RWF 3,810,000</strong>
              <p>Estimated arrival: 2 minutes for mobile money.</p>
            </div>

            <div className="destination-list">
              {destinations.map((destination) => {
                const Icon = destination.icon;

                return (
                  <button
                    className={destination.active ? "active" : ""}
                    key={destination.title}
                  >
                    <div>
                      <Icon size={18} />
                    </div>

                    <span>
                      <strong>{destination.title}</strong>
                      <small>{destination.detail}</small>
                    </span>

                    {destination.active && <CheckCircle2 size={18} />}
                  </button>
                );
              })}
            </div>

            <button className="wallet-red-button">
              Confirm Withdrawal
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="wallet-panel wallet-ai-panel">
            <span className="wallet-badge dark">
              <Sparkles size={16} />
              AI Wallet Insight
            </span>

            <h3>Withdraw 70%, keep 30% pending until the event closes.</h3>

            <p>
              Your event is still receiving active contributions. Withdrawing
              part of your available balance now keeps cash flow flexible while
              protecting your final reconciliation.
            </p>

            <div className="ai-wallet-grid">
              <div>
                <span>Suggested now</span>
                <strong>RWF 2.6M</strong>
              </div>

              <div>
                <span>Keep reserved</span>
                <strong>RWF 1.2M</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="wallet-content-grid">
          <div className="wallet-panel large">
            <div className="wallet-panel-heading">
              <div>
                <span>Withdrawal History</span>
                <h3>Recent payouts</h3>
              </div>

              <button>
                <RefreshCcw size={16} />
                Refresh
              </button>
            </div>

            <div className="withdraw-table">
              {withdrawalHistory.map((item) => (
                <div className="withdraw-row" key={item.id}>
                  <div>
                    <strong>{item.id}</strong>
                    <span>{item.destination}</span>
                  </div>

                  <strong>{item.amount}</strong>

                  <span>{item.date}</span>

                  <small
                    className={
                      item.status === "Completed" ? "completed" : "processing"
                    }
                  >
                    {item.status}
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
              <div style={{ height: "40%" }}>
                <span>Mon</span>
              </div>
              <div style={{ height: "58%" }}>
                <span>Tue</span>
              </div>
              <div style={{ height: "45%" }}>
                <span>Wed</span>
              </div>
              <div style={{ height: "80%" }}>
                <span>Thu</span>
              </div>
              <div style={{ height: "64%" }}>
                <span>Fri</span>
              </div>
              <div style={{ height: "92%" }}>
                <span>Sat</span>
              </div>
              <div style={{ height: "54%" }}>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </section>

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
                <strong>RWF 2.73M</strong>
                <div>
                  <i style={{ width: "71%" }}></i>
                </div>
              </div>

              <div>
                <span>Airtel Money</span>
                <strong>RWF 693K</strong>
                <div>
                  <i style={{ width: "18%" }}></i>
                </div>
              </div>

              <div>
                <span>Visa / Card</span>
                <strong>RWF 423K</strong>
                <div>
                  <i style={{ width: "11%" }}></i>
                </div>
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
              <button>
                <Plus size={18} />
                Add MTN MoMo Account
              </button>

              <button>
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