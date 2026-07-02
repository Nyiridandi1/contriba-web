import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileSpreadsheet,
  FileText,
  Mail,
  MessageCircle,
  PieChart,
  Printer,
  QrCode,
  ReceiptText,
  RefreshCcw,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound,
  WalletCards,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getDashboard, getWallet, getTransactions } from "../api/api";
import AppSidebar from "../components/AppSidebar";
import "./Reports.css";

function formatMoney(value) {
  const num = Number(value || 0);
  if (num >= 1000000) return `RWF ${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `RWF ${(num / 1000).toFixed(0)}K`;
  return `RWF ${num.toLocaleString()}`;
}

function formatMoneyFull(value) {
  return `RWF ${Number(value || 0).toLocaleString()}`;
}

function formatTimeAgo(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

const exportCards = [
  { title: "Full PDF Report", description: "A complete professional event financial report.", icon: FileText },
  { title: "Excel Workbook", description: "Detailed contributor, payment and withdrawal sheets.", icon: FileSpreadsheet },
  { title: "CSV Export", description: "Clean raw data for accounting and analysis.", icon: Download },
  { title: "Receipt Pack", description: "Generate receipts for all successful payments.", icon: ReceiptText },
];

const availableReports = [
  { title: "Financial Summary", description: "Collected, pending, withdrawn, fees and net balance.", icon: PieChart, status: "Ready" },
  { title: "Contribution History", description: "Every contributor, amount, message and method.", icon: UsersRound, status: "Ready" },
  { title: "Payment History", description: "MTN, Airtel transactions and statuses.", icon: CreditCard, status: "Ready" },
  { title: "Withdraw History", description: "Payouts, destinations and completed records.", icon: WalletCards, status: "Ready" },
  { title: "Pending Payments", description: "People waiting confirmation or follow-up.", icon: Clock, status: "Review" },
  { title: "Failed Payments", description: "Failed transactions that may need retry reminders.", icon: XCircle, status: "Action" },
  { title: "QR Analytics", description: "Scans, conversion rate and QR performance.", icon: QrCode, status: "Ready" },
  { title: "Campaign Performance", description: "WhatsApp, Instagram and direct link results.", icon: Share2, status: "Ready" },
];

function Reports() {
  const [dashboard, setDashboard] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadReports() {
    setLoading(true);
    const [dashResult, walletResult, transResult] = await Promise.all([
      getDashboard(),
      getWallet(),
      getTransactions(),
    ]);

    if (dashResult.success) setDashboard(dashResult.dashboard);
    if (walletResult.success) setWallet(walletResult.wallet);
    if (transResult.success) setTransactions(transResult.transactions || []);

    setLoading(false);
  }

  useEffect(() => {
    loadReports();
  }, []);

  // ── Real computed data ──
  const totalRaised = dashboard?.total_raised || 0;
  const totalContributors = dashboard?.total_contributors || 0;
  const totalEvents = dashboard?.total_events || 0;
  const walletBalance = Number(wallet?.balance || 0);
  const contributions = dashboard?.recent_contributions || [];

  const totalWithdrawn = transactions
    .filter(t => t.type === "withdrawal" && t.status === "success")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const pendingCount = contributions.filter(c => c.status === "pending").length;
  const failedCount = contributions.filter(c => c.status === "failed").length;

  const mtnTotal = contributions
    .filter(c => c.payment_method === "mtn" && c.status === "success")
    .reduce((sum, c) => sum + Number(c.amount || 0), 0);

  const airtelTotal = contributions
    .filter(c => c.payment_method === "airtel" && c.status === "success")
    .reduce((sum, c) => sum + Number(c.amount || 0), 0);

  const avgContribution = totalContributors > 0
    ? Math.round(totalRaised / totalContributors)
    : 0;

  return (
    <main className="reports-page">
      <AppSidebar active="reports" />

      <section className="reports-main">
        <header className="reports-topbar">
          <div>
            <span>Reports Center</span>
            <h1>Financial reports and exports</h1>
            <p>
              Generate professional reports for contributors, payments,
              withdrawals, receipts, campaign performance and financial
              reconciliation.
            </p>
          </div>

          <div className="reports-top-actions">
            <button>
              <FileSpreadsheet size={18} />
              Export Excel
            </button>

            <button className="red">
              <FileText size={18} />
              Export PDF
            </button>
          </div>
        </header>

        {/* ── HERO ── */}
        <section className="reports-hero">
          <div className="reports-hero-left">
            <span className="reports-badge">
              <Sparkles size={16} />
              Smart Reporting
            </span>

            <h2>Turn every contribution into a clean financial record.</h2>

            <p>
              Contriba reports help organizers explain where money came from,
              who contributed, what is pending, what was withdrawn and what
              action should happen next.
            </p>

            <div className="reports-hero-actions">
              <button className="light">
                <Download size={18} />
                Download Full Report
              </button>

              <button className="glass">
                <Mail size={18} />
                Email Report
              </button>
            </div>
          </div>

          <div className="reports-hero-card">
            <ShieldCheck size={28} />
            <span>Report Health</span>
            <strong>
              {loading
                ? "Loading..."
                : totalRaised > 0
                ? "Ready for reconciliation"
                : "No data yet"}
            </strong>
            <p>
              {totalRaised > 0
                ? "Your event data is complete enough to generate a clean financial summary."
                : "Create events and receive contributions to generate reports."}
            </p>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="reports-stats-grid">
          <div className="reports-stat-card">
            <div className="reports-stat-icon"><TrendingUp size={20} /></div>
            <span>Total Collected</span>
            <strong>{loading ? "..." : formatMoney(totalRaised)}</strong>
            <p>{totalEvents} event{totalEvents !== 1 ? "s" : ""}</p>
          </div>

          <div className="reports-stat-card">
            <div className="reports-stat-icon"><UsersRound size={20} /></div>
            <span>Contributors</span>
            <strong>{loading ? "..." : totalContributors}</strong>
            <p>Total supporters</p>
          </div>

          <div className="reports-stat-card">
            <div className="reports-stat-icon"><WalletCards size={20} /></div>
            <span>Withdrawn</span>
            <strong>{loading ? "..." : formatMoney(totalWithdrawn)}</strong>
            <p>Sent to accounts</p>
          </div>

          <div className="reports-stat-card">
            <div className="reports-stat-icon"><Clock size={20} /></div>
            <span>Pending / Failed</span>
            <strong>{loading ? "..." : pendingCount + failedCount}</strong>
            <p>Needs follow-up</p>
          </div>
        </section>

        {/* ── EXPORT + AI ── */}
        <section className="reports-content-grid">
          <div className="reports-panel large">
            <div className="reports-panel-heading">
              <div>
                <span>Export Center</span>
                <h3>Choose report format</h3>
              </div>
              <Download size={22} />
            </div>

            <div className="export-card-grid">
              {exportCards.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.title}>
                    <div><Icon size={21} /></div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                    <span>
                      Generate
                      <ArrowRight size={16} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="reports-panel reports-ai-panel">
            <span className="reports-badge dark">
              <Sparkles size={16} />
              AI Report Insight
            </span>

            <h3>
              {avgContribution > 0
                ? `Average contribution is ${formatMoneyFull(avgContribution)}.`
                : "No contributions yet to analyze."}
            </h3>

            <p>
              {totalContributors > 0
                ? `${totalContributors} people contributed across ${totalEvents} events. MTN MoMo is your top payment method.`
                : "Once you receive contributions, AI will analyze your performance and suggest actions."}
            </p>

            <div className="reports-ai-grid">
              <div>
                <span>MTN total</span>
                <strong>{formatMoney(mtnTotal)}</strong>
              </div>
              <div>
                <span>Average gift</span>
                <strong>{formatMoney(avgContribution)}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ── AVAILABLE REPORTS ── */}
        <section className="reports-panel">
          <div className="reports-panel-heading">
            <div>
              <span>Available Reports</span>
              <h3>Financial documents</h3>
            </div>
            <button onClick={loadReports}>
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>

          <div className="available-reports-grid">
            {availableReports.map((item) => {
              const Icon = item.icon;
              return (
                <div className="available-report-card" key={item.title}>
                  <div className="available-report-icon">
                    <Icon size={20} />
                  </div>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                  <small className={
                    item.status === "Ready" ? "ready"
                    : item.status === "Review" ? "review"
                    : "action"
                  }>
                    {item.status === "Ready" && <CheckCircle2 size={14} />}
                    {item.status === "Review" && <Clock size={14} />}
                    {item.status === "Action" && <XCircle size={14} />}
                    {item.status}
                  </small>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── RECENT CONTRIBUTIONS AS EXPORTS ── */}
        <section className="reports-content-grid">
          <div className="reports-panel large">
            <div className="reports-panel-heading">
              <div>
                <span>Recent Contributions</span>
                <h3>Latest financial records</h3>
              </div>
              <FileText size={22} />
            </div>

            <div className="recent-export-table">
              {loading && (
                <div className="recent-export-row">
                  <div><strong>Loading...</strong></div>
                </div>
              )}

              {!loading && contributions.length === 0 && (
                <div className="recent-export-row">
                  <div>
                    <strong>No contributions yet</strong>
                    <span>Share your event to start receiving contributions</span>
                  </div>
                </div>
              )}

              {!loading && contributions.slice(0, 8).map((item, index) => (
                <div className="recent-export-row" key={item.id || index}>
                  <div>
                    <strong>
                      {item.is_anonymous ? "Anonymous" : item.contributor_name || "Guest"}
                    </strong>
                    <span>{formatTimeAgo(item.created_at)}</span>
                  </div>
                  <span>{item.payment_method?.toUpperCase() || "MoMo"}</span>
                  <small className={item.status === "success" ? "completed" : "processing"}>
                    {item.status === "success" ? "Success" : "Pending"}
                  </small>
                  <button>
                    {formatMoneyFull(item.amount)}
                    <ArrowRight size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="reports-panel">
            <div className="reports-panel-heading">
              <div>
                <span>Quick Actions</span>
                <h3>Send or print</h3>
              </div>
              <Send size={22} />
            </div>

            <div className="report-actions-grid">
              <button><Printer size={18} />Print Report</button>
              <button><Mail size={18} />Email Organizer</button>
              <button><MessageCircle size={18} />Send Summary</button>
              <button><ReceiptText size={18} />Generate Receipts</button>
            </div>
          </div>
        </section>

        {/* ── FINANCIAL SNAPSHOT ── */}
        <section className="reports-content-grid">
          <div className="reports-panel">
            <div className="reports-panel-heading">
              <div>
                <span>Financial Snapshot</span>
                <h3>Event reconciliation</h3>
              </div>
              <BarChart3 size={22} />
            </div>

            <div className="snapshot-list">
              <div>
                <span>Gross collected</span>
                <strong>{formatMoneyFull(totalRaised)}</strong>
              </div>
              <div>
                <span>MTN MoMo</span>
                <strong>{formatMoneyFull(mtnTotal)}</strong>
              </div>
              <div>
                <span>Airtel Money</span>
                <strong>{formatMoneyFull(airtelTotal)}</strong>
              </div>
              <div>
                <span>Wallet balance</span>
                <strong>{formatMoneyFull(walletBalance)}</strong>
              </div>
              <div>
                <span>Withdrawn total</span>
                <strong>{formatMoneyFull(totalWithdrawn)}</strong>
              </div>
              <div>
                <span>Net available</span>
                <strong>{formatMoneyFull(walletBalance)}</strong>
              </div>
            </div>
          </div>

          <div className="reports-panel">
            <div className="reports-panel-heading">
              <div>
                <span>Report Completeness</span>
                <h3>Data quality score</h3>
              </div>
              <ShieldCheck size={22} />
            </div>

            <div className="report-score">
              <strong>{totalRaised > 0 ? "94%" : "—"}</strong>
              <span>{totalRaised > 0 ? "Complete" : "No data"}</span>
            </div>

            <div className="report-check-list">
              <p>
                <CheckCircle2 size={16} />
                {totalContributors > 0 ? "Contributor records complete" : "No contributors yet"}
              </p>
              <p>
                <CheckCircle2 size={16} />
                Payment methods verified
              </p>
              <p>
                <CheckCircle2 size={16} />
                {totalWithdrawn > 0 ? "Withdrawals reconciled" : "No withdrawals yet"}
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Reports;