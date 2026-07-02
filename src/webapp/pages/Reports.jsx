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

import AppSidebar from "../components/AppSidebar";
import "./Reports.css";

const reportStats = [
  {
    title: "Total Collected",
    value: "RWF 3.85M",
    note: "+18% today",
    icon: TrendingUp,
  },
  {
    title: "Contributors",
    value: "287",
    note: "23 joined today",
    icon: UsersRound,
  },
  {
    title: "Withdrawn",
    value: "RWF 1.24M",
    note: "3 payouts completed",
    icon: WalletCards,
  },
  {
    title: "Pending / Failed",
    value: "14",
    note: "Needs follow-up",
    icon: Clock,
  },
];

const exportCards = [
  {
    title: "Full PDF Report",
    description: "A complete professional event financial report.",
    icon: FileText,
  },
  {
    title: "Excel Workbook",
    description: "Detailed contributor, payment and withdrawal sheets.",
    icon: FileSpreadsheet,
  },
  {
    title: "CSV Export",
    description: "Clean raw data for accounting and analysis.",
    icon: Download,
  },
  {
    title: "Receipt Pack",
    description: "Generate receipts for all successful payments.",
    icon: ReceiptText,
  },
];

const availableReports = [
  {
    title: "Financial Summary",
    description: "Collected, pending, withdrawn, fees and net balance.",
    icon: PieChart,
    status: "Ready",
  },
  {
    title: "Contribution History",
    description: "Every contributor, amount, message and method.",
    icon: UsersRound,
    status: "Ready",
  },
  {
    title: "Payment History",
    description: "MTN, Airtel, Visa/Card transactions and statuses.",
    icon: CreditCard,
    status: "Ready",
  },
  {
    title: "Withdraw History",
    description: "Payouts, destinations, processing and completed records.",
    icon: WalletCards,
    status: "Ready",
  },
  {
    title: "Pending Payments",
    description: "People waiting confirmation or follow-up.",
    icon: Clock,
    status: "Review",
  },
  {
    title: "Failed Payments",
    description: "Failed transactions that may need retry reminders.",
    icon: XCircle,
    status: "Action",
  },
  {
    title: "QR Analytics",
    description: "Scans, conversion rate and QR performance.",
    icon: QrCode,
    status: "Ready",
  },
  {
    title: "Campaign Performance",
    description: "WhatsApp, Instagram, Facebook and direct link results.",
    icon: Share2,
    status: "Ready",
  },
];

const recentExports = [
  {
    name: "Jean & Alice Wedding Full Report",
    type: "PDF",
    date: "Today, 11:24 AM",
    status: "Completed",
  },
  {
    name: "Contributors List",
    type: "Excel",
    date: "Yesterday, 7:12 PM",
    status: "Completed",
  },
  {
    name: "Payment Transactions",
    type: "CSV",
    date: "24 June, 3:45 PM",
    status: "Completed",
  },
];

function Reports() {
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
            <strong>Ready for reconciliation</strong>
            <p>
              Your event data is complete enough to generate a clean financial
              summary for organizers and stakeholders.
            </p>
          </div>
        </section>

        <section className="reports-stats-grid">
          {reportStats.map((item) => {
            const Icon = item.icon;

            return (
              <div className="reports-stat-card" key={item.title}>
                <div className="reports-stat-icon">
                  <Icon size={20} />
                </div>

                <span>{item.title}</span>
                <strong>{item.value}</strong>
                <p>{item.note}</p>
              </div>
            );
          })}
        </section>

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
                    <div>
                      <Icon size={21} />
                    </div>

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

            <h3>Your event collected 32% more than similar weddings.</h3>

            <p>
              WhatsApp generated most contributions, Saturday had the strongest
              collection activity, and average contribution size is currently
              around RWF 13,400.
            </p>

            <div className="reports-ai-grid">
              <div>
                <span>Best source</span>
                <strong>WhatsApp</strong>
              </div>

              <div>
                <span>Average gift</span>
                <strong>RWF 13.4K</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="reports-panel">
          <div className="reports-panel-heading">
            <div>
              <span>Available Reports</span>
              <h3>Financial documents</h3>
            </div>

            <button>
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

                  <small
                    className={
                      item.status === "Ready"
                        ? "ready"
                        : item.status === "Review"
                        ? "review"
                        : "action"
                    }
                  >
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

        <section className="reports-content-grid">
          <div className="reports-panel large">
            <div className="reports-panel-heading">
              <div>
                <span>Recent Exports</span>
                <h3>Generated files</h3>
              </div>
              <FileText size={22} />
            </div>

            <div className="recent-export-table">
              {recentExports.map((item) => (
                <div className="recent-export-row" key={item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.date}</span>
                  </div>

                  <span>{item.type}</span>

                  <small>{item.status}</small>

                  <button>
                    Download
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
              <button>
                <Printer size={18} />
                Print Report
              </button>

              <button>
                <Mail size={18} />
                Email Organizer
              </button>

              <button>
                <MessageCircle size={18} />
                Send Summary
              </button>

              <button>
                <ReceiptText size={18} />
                Generate Receipts
              </button>
            </div>
          </div>
        </section>

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
                <strong>RWF 3,850,000</strong>
              </div>

              <div>
                <span>Pending confirmation</span>
                <strong>RWF 140,000</strong>
              </div>

              <div>
                <span>Platform fees</span>
                <strong>RWF 38,500</strong>
              </div>

              <div>
                <span>Net available</span>
                <strong>RWF 3,810,000</strong>
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
              <strong>94%</strong>
              <span>Complete</span>
            </div>

            <div className="report-check-list">
              <p>
                <CheckCircle2 size={16} />
                Contributor records complete
              </p>

              <p>
                <CheckCircle2 size={16} />
                Payment methods verified
              </p>

              <p>
                <CheckCircle2 size={16} />
                Withdrawals reconciled
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Reports;