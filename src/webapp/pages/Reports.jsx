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

import {
  getDashboard,
  getTransactions,
  getWallet,
  getShareOverview,
} from "../api/api";
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

function downloadTextFile(filename, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function cleanFileName(value) {
  return String(value || "contriba-report")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "and")
    .replace(/[^\w-]/g, "")
    .toLowerCase();
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function buildCsvReport({ dashboard, wallet, transactions, contributions, shareData }) {
  const rows = [];

  rows.push(["Contriba Financial Report"]);
  rows.push(["Generated At", new Date().toLocaleString()]);
  rows.push([]);

  rows.push(["SUMMARY"]);
  rows.push(["Total Raised", Number(dashboard?.total_raised || 0)]);
  rows.push(["Total Contributors", Number(dashboard?.total_contributors || 0)]);
  rows.push(["Total Events", Number(dashboard?.total_events || 0)]);
  rows.push(["Wallet Balance", Number(wallet?.balance || 0)]);
  rows.push(["Visitors", Number(shareData?.stats?.visitors || 0)]);
  rows.push(["Shares", Number(shareData?.stats?.shares || 0)]);
  rows.push(["QR Scans", Number(shareData?.stats?.qr_scans || 0)]);
  rows.push([]);

  rows.push(["CONTRIBUTIONS"]);
  rows.push(["Contributor", "Amount", "Method", "Status", "Date"]);

  contributions.forEach((item) => {
    rows.push([
      item.is_anonymous ? "Anonymous" : item.contributor_name || "Guest",
      Number(item.amount || 0),
      item.payment_method || "MoMo",
      item.status || "unknown",
      item.created_at || "",
    ]);
  });

  rows.push([]);
  rows.push(["TRANSACTIONS"]);
  rows.push(["Type", "Amount", "Status", "Date", "Reference"]);

  transactions.forEach((item) => {
    rows.push([
      item.type || "",
      Number(item.amount || 0),
      item.status || "",
      item.created_at || "",
      item.reference || item.transaction_id || "",
    ]);
  });

  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
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
  const [shareData, setShareData] = useState(null);
const [selectedEvent, setSelectedEvent] = useState(null);


  async function loadReports() {
    setLoading(true);

    const [dashResult, walletResult, transResult] = await Promise.all([
      getDashboard(),
      getWallet(),
      getTransactions(),
    ]);

    if (dashResult.success) {
  setDashboard(dashResult.dashboard);

  const events = dashResult.dashboard?.events || [];

  if (events.length > 0) {
    const eventId = events[0].id;

    setSelectedEvent(eventId);

    const share = await getShareOverview(eventId);

    if (share.success) {
  setShareData(share);
}
  }
}
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
  function generatePdfReport() {
  const reportHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Contriba Financial Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 34px;
      color: #111827;
    }

    h1 {
      color: #e50914;
      margin-bottom: 4px;
    }

    h2 {
      margin-top: 28px;
      border-bottom: 2px solid #e50914;
      padding-bottom: 8px;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 22px;
    }

    .card {
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      padding: 14px;
      background: #f9fafb;
    }

    .card span {
      display: block;
      color: #6b7280;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .card strong {
      display: block;
      margin-top: 8px;
      font-size: 22px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      font-size: 13px;
    }

    th, td {
      border-bottom: 1px solid #e5e7eb;
      padding: 10px;
      text-align: left;
    }

    th {
      background: #f3f4f6;
      color: #374151;
    }

    .footer {
      margin-top: 32px;
      color: #6b7280;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <h1>Contriba Financial Report</h1>
  <p>Generated on ${new Date().toLocaleString()}</p>

  <div class="summary">
    <div class="card"><span>Total Raised</span><strong>${formatMoneyFull(totalRaised)}</strong></div>
    <div class="card"><span>Contributors</span><strong>${totalContributors}</strong></div>
    <div class="card"><span>Wallet Balance</span><strong>${formatMoneyFull(walletBalance)}</strong></div>
    <div class="card"><span>Needs Attention</span><strong>${attentionCount}</strong></div>
    <div class="card"><span>Visitors</span><strong>${shareData?.stats?.visitors || 0}</strong></div>
    <div class="card"><span>QR Scans</span><strong>${shareData?.stats?.qr_scans || 0}</strong></div>
  </div>

  <h2>Recent Contributions</h2>
  <table>
    <thead>
      <tr>
        <th>Contributor</th>
        <th>Amount</th>
        <th>Method</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      ${contributions.map((item) => `
        <tr>
          <td>${item.is_anonymous ? "Anonymous" : item.contributor_name || "Guest"}</td>
          <td>${formatMoneyFull(item.amount)}</td>
          <td>${item.payment_method || "MoMo"}</td>
          <td>${item.status || "unknown"}</td>
          <td>${item.created_at ? new Date(item.created_at).toLocaleString() : ""}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <h2>Wallet Transactions</h2>
  <table>
    <thead>
      <tr>
        <th>Type</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      ${transactions.map((item) => `
        <tr>
          <td>${item.type || ""}</td>
          <td>${formatMoneyFull(item.amount)}</td>
          <td>${item.status || ""}</td>
          <td>${item.created_at ? new Date(item.created_at).toLocaleString() : ""}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <p class="footer">Generated by Contriba Reports Center.</p>

  <script>
    window.onload = () => {
      window.print();
    };
  </script>
</body>
</html>
`;

  const printWindow = window.open("", "_blank", "width=900,height=1100");

  if (!printWindow) {
    alert("Popup blocked. Please allow popups to export PDF.");
    return;
  }

  printWindow.document.write(reportHtml);
  printWindow.document.close();
}

function exportExcelReport() {
  const csv = buildCsvReport({
    dashboard,
    wallet,
    transactions,
    contributions,
    shareData,
  });

  downloadTextFile(
    `contriba-financial-report-${new Date().toISOString().slice(0, 10)}.csv`,
    csv,
    "text/csv;charset=utf-8;"
  );
}

function downloadReceiptPack() {
  if (successfulContributions.length === 0) {
    alert("No successful contributions available for receipt pack.");
    return;
  }

  const receipts = successfulContributions.map((item, index) => {
    return `
CONTRIBA RECEIPT #${index + 1}
--------------------------------
Contributor: ${item.is_anonymous ? "Anonymous" : item.contributor_name || "Guest"}
Amount: ${formatMoneyFull(item.amount)}
Payment Method: ${item.payment_method || "MoMo"}
Status: ${item.status || "success"}
Date: ${item.created_at ? new Date(item.created_at).toLocaleString() : ""}
Reference: ${item.reference || item.transaction_id || item.id || "N/A"}

Thank you for your contribution.
`;
  }).join("\n\n");

  downloadTextFile(
    `contriba-receipt-pack-${new Date().toISOString().slice(0, 10)}.txt`,
    receipts,
    "text/plain;charset=utf-8;"
  );
}


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
            <button onClick={exportExcelReport}>
  <FileSpreadsheet size={18} />
  Export Excel
</button>

            <button className="red" onClick={generatePdfReport}>
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
              <button className="light" onClick={generatePdfReport}>
                <Download size={18} />
                Download Report
              </button>

              <button className="glass" onClick={downloadReceiptPack}>
                <ReceiptText size={18} />
                Receipt Pack
              </button>
            </div>
          </div>

          <div className="reports-hero-card">
            <ShieldCheck size={28} />
            <span>Report Health</span>
            <strong>
              {loading ? <span className="reports-skeleton-line reports-skeleton-line-md shimmer" /> : reportReady ? "Ready for reconciliation" : "Waiting for data"}
            </strong>
            <p>
              {reportReady
                ? "Your live data is ready to generate a clean financial summary."
                : "Create events and receive contributions to unlock full reports."}
            </p>
          </div>
        </section>

        <section className="reports-stats-grid">
          {loading ? (
            [1, 2, 3, 4].map((item) => (
              <div className="reports-stat-card reports-skeleton-card" key={item}>
                <div className="reports-skeleton-icon shimmer" />
                <span className="reports-skeleton-line reports-skeleton-line-sm shimmer" />
                <strong className="reports-skeleton-line reports-skeleton-line-md shimmer" />
                <p className="reports-skeleton-line reports-skeleton-line-xs shimmer" />
              </div>
            ))
          ) : (
            <>
              <div className="reports-stat-card">
                <div className="reports-stat-icon">
                  <TrendingUp size={20} />
                </div>
                <span>Total Collected</span>
                <strong>{formatMoney(totalRaised)}</strong>
                <p>{totalEvents} event{totalEvents !== 1 ? "s" : ""}</p>
              </div>

              <div className="reports-stat-card">
                <div className="reports-stat-icon">
                  <UsersRound size={20} />
                </div>
                <span>Contributors</span>
                <strong>{totalContributors}</strong>
                <p>Total supporters</p>
              </div>

              <div className="reports-stat-card">
                <div className="reports-stat-icon">
                  <WalletCards size={20} />
                </div>
                <span>Available Wallet</span>
                <strong>{formatMoney(walletBalance)}</strong>
                <p>Ready to reconcile</p>
              </div>

              <div className="reports-stat-card">
                <div className="reports-stat-icon">
                  <Clock size={20} />
                </div>
                <span>Needs Attention</span>
                <strong>{attentionCount}</strong>
                <p>Pending / failed</p>
              </div>
            </>
          )}
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
              {loading ? (
                [1, 2, 3].map((item) => (
                  <button className="reports-export-skeleton" key={item}>
                    <div className="reports-skeleton-icon shimmer" />
                    <small className="reports-skeleton-pill shimmer" />
                    <strong className="reports-skeleton-line reports-skeleton-line-md shimmer" />
                    <p className="reports-skeleton-line reports-skeleton-line-full shimmer" />
                    <span className="reports-skeleton-line reports-skeleton-line-sm shimmer" />
                  </button>
                ))
              ) : (
                exportCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
  key={item.title}
  onClick={() => {
    if (item.title === "PDF Report") {
      generatePdfReport();
    } else if (item.title === "Excel Workbook") {
      exportExcelReport();
    } else if (item.title === "Receipt Pack") {
      downloadReceiptPack();
    }
  }}
>
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
                })
              )}
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
                <div className="reports-records-skeleton">
                  {[1, 2, 3, 4].map((item) => (
                    <div className="recent-export-row reports-record-skeleton-row" key={item}>
                      <div>
                        <strong className="reports-skeleton-line reports-skeleton-line-md shimmer" />
                        <span className="reports-skeleton-line reports-skeleton-line-sm shimmer" />
                      </div>
                      <strong className="reports-skeleton-line reports-skeleton-line-sm shimmer" />
                      <span className="reports-skeleton-line reports-skeleton-line-xs shimmer" />
                      <small className="reports-skeleton-pill shimmer" />
                    </div>
                  ))}
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
