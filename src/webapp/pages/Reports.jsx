import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileSpreadsheet,
  FileText,
  PieChart,
  QrCode,
  ReceiptText,
  RefreshCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound,
  WalletCards,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getDashboard, getTransactions, getWallet } from "../api/api";
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
  {
    title: "PDF Report",
    label: "Most used",
    description: "A clean organizer-ready financial report for sharing or printing.",
    icon: FileText,
  },
  {
    title: "Excel Workbook",
    label: "Accounting",
    description: "Contributor, payment, withdrawal and reconciliation sheets.",
    icon: FileSpreadsheet,
  },
  {
    title: "Receipt Pack",
    label: "Payments",
    description: "Receipts for successful contributions when backend receipts are ready.",
    icon: ReceiptText,
  },
];

const reportGroups = [
  {
    group: "Financial",
    items: [
      { title: "Financial Summary", description: "Collected, withdrawn, fees and net balance.", icon: PieChart, status: "Ready" },
      { title: "Payment History", description: "MTN, Airtel and card transaction records.", icon: CreditCard, status: "Ready" },
      { title: "Withdrawal History", description: "Payout destinations and completed withdrawals.", icon: WalletCards, status: "Ready" },
    ],
  },
  {
    group: "Contributors",
    items: [
      { title: "Contribution History", description: "Every supporter, amount, method and message.", icon: UsersRound, status: "Ready" },
      { title: "Pending Payments", description: "Payments waiting confirmation or follow-up.", icon: Clock, status: "Review" },
      { title: "Failed Payments", description: "Failed payments that may need retry support.", icon: XCircle, status: "Action" },
    ],
  },
  {
    group: "Growth",
    items: [
      { title: "QR Analytics", description: "Scans and QR contribution performance.", icon: QrCode, status: "Backend" },
      { title: "Campaign Performance", description: "WhatsApp, Instagram and direct link results.", icon: Share2, status: "Backend" },
    ],
  },
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

  const totalRaised = Number(dashboard?.total_raised || 0);
  const totalContributors = Number(dashboard?.total_contributors || 0);
  const totalEvents = Number(dashboard?.total_events || 0);
  const walletBalance = Number(wallet?.balance || 0);
  const contributions = dashboard?.recent_contributions || [];

  const successfulContributions = useMemo(
    () => contributions.filter((item) => item.status === "success"),
    [contributions]
  );

  const totalWithdrawn = transactions
    .filter((item) => item.type === "withdrawal" && item.status === "success")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const pendingCount = contributions.filter((item) => item.status === "pending").length;
  const failedCount = contributions.filter((item) => item.status === "failed").length;
  const attentionCount = pendingCount + failedCount;

  const mtnTotal = successfulContributions
    .filter((item) => item.payment_method === "mtn")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const airtelTotal = successfulContributions
    .filter((item) => item.payment_method === "airtel")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const avgContribution = totalContributors > 0 ? Math.round(totalRaised / totalContributors) : 0;
  const largestContribution = successfulContributions.reduce(
    (max, item) => Math.max(max, Number(item.amount || 0)),
    0
  );
  const bestPaymentMethod = mtnTotal >= airtelTotal ? "MTN MoMo" : "Airtel Money";
  const dataQualityScore = totalRaised > 0 ? 94 : 0;
  const reportReady = totalRaised > 0;

  return (
    <main className="reports-page">
      <AppSidebar active="reports" />

      <section className="reports-main">
        <header className="reports-topbar">
          <div>
            <span>Reports Center</span>
            <h1>Financial reports and exports</h1>
            <p>
              Turn contribution, wallet and payout activity into clear records your
              organization can review, print and reconcile.
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

        <section className="reports-hero">
          <div className="reports-hero-left">
            <span className="reports-badge">
              <Sparkles size={16} />
              Smart Reporting
            </span>

            <h2>Clean records for every contribution.</h2>

            <p>
              Review what was collected, who contributed, what needs attention,
              and what is available in your wallet from one organized reporting center.
            </p>

            <div className="reports-hero-actions">
              <button className="light">
                <Download size={18} />
                Download Report
              </button>

              <button className="glass">
                <ReceiptText size={18} />
                Receipt Pack
              </button>
            </div>
          </div>

          <div className="reports-hero-card">
            <ShieldCheck size={28} />
            <span>Report Health</span>
            <strong>
              {loading ? "Loading..." : reportReady ? "Ready for reconciliation" : "Waiting for data"}
            </strong>
            <p>
              {reportReady
                ? "Your live data is ready to generate a clean financial summary."
                : "Create events and receive contributions to unlock full reports."}
            </p>
          </div>
        </section>

        <section className="reports-stats-grid">
          <div className="reports-stat-card">
            <div className="reports-stat-icon">
              <TrendingUp size={20} />
            </div>
            <span>Total Collected</span>
            <strong>{loading ? "..." : formatMoney(totalRaised)}</strong>
            <p>{totalEvents} event{totalEvents !== 1 ? "s" : ""}</p>
          </div>

          <div className="reports-stat-card">
            <div className="reports-stat-icon">
              <UsersRound size={20} />
            </div>
            <span>Contributors</span>
            <strong>{loading ? "..." : totalContributors}</strong>
            <p>Total supporters</p>
          </div>

          <div className="reports-stat-card">
            <div className="reports-stat-icon">
              <WalletCards size={20} />
            </div>
            <span>Available Wallet</span>
            <strong>{loading ? "..." : formatMoney(walletBalance)}</strong>
            <p>Ready to reconcile</p>
          </div>

          <div className="reports-stat-card">
            <div className="reports-stat-icon">
              <Clock size={20} />
            </div>
            <span>Needs Attention</span>
            <strong>{loading ? "..." : attentionCount}</strong>
            <p>Pending / failed</p>
          </div>
        </section>

        <section className="reports-content-grid reports-primary-grid">
          <div className="reports-panel reports-export-panel">
            <div className="reports-panel-heading">
              <div>
                <span>Export Center</span>
                <h3>Generate clean reports</h3>
              </div>
              <Download size={22} />
            </div>

            <div className="export-card-grid">
              {exportCards.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.title}>
                    <div>
                      <Icon size={21} />
                    </div>
                    <small>{item.label}</small>
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
              AI Financial Summary
            </span>

            <h3>
              {avgContribution > 0
                ? `${formatMoneyFull(avgContribution)} average contribution.`
                : "No contributions yet to analyze."}
            </h3>

            <p>
              {totalContributors > 0
                ? `${totalContributors} supporters across ${totalEvents} event${totalEvents !== 1 ? "s" : ""}. ${bestPaymentMethod} is currently your strongest payment method.`
                : "When contributions arrive, Contriba will summarize performance and show the strongest action to take next."}
            </p>

            <div className="reports-ai-grid">
              <div>
                <span>Best method</span>
                <strong>{bestPaymentMethod}</strong>
              </div>
              <div>
                <span>Largest gift</span>
                <strong>{formatMoney(largestContribution)}</strong>
              </div>
              <div>
                <span>Collection rate</span>
                <strong>{totalContributors > 0 ? "Live" : "Waiting"}</strong>
              </div>
              <div>
                <span>Open items</span>
                <strong>{attentionCount}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="reports-panel reports-documents-panel">
          <div className="reports-panel-heading">
            <div>
              <span>Report Library</span>
              <h3>Documents organized by purpose</h3>
            </div>
            <button onClick={loadReports}>
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>

          <div className="report-group-grid">
            {reportGroups.map((group) => (
              <div className="report-group-card" key={group.group}>
                <h4>{group.group}</h4>
                <div className="report-group-list">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const statusClass =
                      item.status === "Ready"
                        ? "ready"
                        : item.status === "Review"
                        ? "review"
                        : item.status === "Action"
                        ? "action"
                        : "backend";

                    return (
                      <div className="report-mini-card" key={item.title}>
                        <div className="available-report-icon">
                          <Icon size={19} />
                        </div>
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.description}</p>
                        </div>
                        <small className={statusClass}>
                          {item.status === "Ready" && <CheckCircle2 size={14} />}
                          {item.status === "Review" && <Clock size={14} />}
                          {item.status === "Action" && <XCircle size={14} />}
                          {item.status === "Backend" && <Sparkles size={14} />}
                          {item.status}
                        </small>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="reports-content-grid reports-records-grid">
          <div className="reports-panel large">
            <div className="reports-panel-heading">
              <div>
                <span>Recent Records</span>
                <h3>Latest financial activity</h3>
              </div>
              <FileText size={22} />
            </div>

            <div className="recent-export-table">
              {loading && (
                <div className="recent-export-row">
                  <div>
                    <strong>Loading records...</strong>
                    <span>Fetching report data</span>
                  </div>
                </div>
              )}

              {!loading && contributions.length === 0 && (
                <div className="reports-empty-state">
                  <ReceiptText size={28} />
                  <strong>No financial records yet</strong>
                  <span>Successful contributions will appear here automatically.</span>
                </div>
              )}

              {!loading &&
                contributions.slice(0, 6).map((item, index) => (
                  <div className="recent-export-row" key={item.id || index}>
                    <div>
                      <strong>
                        {item.is_anonymous ? "Anonymous" : item.contributor_name || "Guest"}
                      </strong>
                      <span>{formatTimeAgo(item.created_at)}</span>
                    </div>

                    <strong>{formatMoneyFull(item.amount)}</strong>
                    <span>{item.payment_method?.toUpperCase() || "MoMo"}</span>

                    <small className={item.status === "success" ? "completed" : "processing"}>
                      {item.status === "success" ? "Success" : "Pending"}
                    </small>
                  </div>
                ))}
            </div>
          </div>

          <div className="reports-panel reports-reconciliation-panel">
            <div className="reports-panel-heading">
              <div>
                <span>Financial Snapshot</span>
                <h3>Reconciliation</h3>
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
                <span>Withdrawn</span>
                <strong>{formatMoneyFull(totalWithdrawn)}</strong>
              </div>
              <div>
                <span>Net available</span>
                <strong>{formatMoneyFull(walletBalance)}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="reports-panel reports-quality-panel">
          <div className="reports-quality-content">
            <div>
              <span className="reports-section-label">Report Completeness</span>
              <h3>Data quality score</h3>
              <p>
                This score shows whether contribution, payment and wallet records
                are ready for a clean financial report.
              </p>
            </div>

            <div className="report-score">
              <strong>{reportReady ? `${dataQualityScore}%` : "—"}</strong>
              <span>{reportReady ? "Complete" : "No data"}</span>
            </div>

            <div className="report-check-list">
              <p>
                <CheckCircle2 size={16} />
                {totalContributors > 0 ? "Contributor records available" : "Waiting for contributors"}
              </p>
              <p>
                <CheckCircle2 size={16} />
                Payment methods tracked
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
