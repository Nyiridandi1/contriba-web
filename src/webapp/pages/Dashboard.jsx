import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Eye,
  FileText,
  Heart,
  LineChart,
  MessageCircle,
  QrCode,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound,
  WalletCards,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import AppSidebar from "../components/AppSidebar";
import "./Dashboard.css";

const contributors = [
  {
    name: "Olivier Ishimwe",
    amount: "RWF 500,000",
    method: "MTN",
    time: "2 mins ago",
    status: "Success",
    message: "Congratulations!",
  },
  {
    name: "Grace N.",
    amount: "RWF 250,000",
    method: "Airtel",
    time: "18 mins ago",
    status: "Success",
    message: "So happy for you.",
  },
  {
    name: "Patrick K.",
    amount: "RWF 150,000",
    method: "Visa",
    time: "1 hour ago",
    status: "Success",
    message: "God bless your union.",
  },
  {
    name: "Anonymous",
    amount: "RWF 100,000",
    method: "MTN",
    time: "3 hours ago",
    status: "Pending",
    message: "Wishing you the best.",
  },
];

const activity = [
  "Olivier contributed RWF 500,000",
  "Jean & Alice Wedding reached 77%",
  "Grace shared your event link",
  "18 visitors viewed but did not contribute",
];

const sources = [
  { name: "WhatsApp", value: "61%", width: "61%" },
  { name: "Instagram", value: "16%", width: "16%" },
  { name: "Facebook", value: "11%", width: "11%" },
  { name: "QR Code", value: "7%", width: "7%" },
  { name: "Direct Link", value: "5%", width: "5%" },
];

const paymentBreakdown = [
  { name: "MTN MoMo", value: "71%", width: "71%" },
  { name: "Airtel Money", value: "18%", width: "18%" },
  { name: "Visa / Card", value: "11%", width: "11%" },
];

function Dashboard() {
  return (
    <main className="dashboard-page">
      <AppSidebar active="dashboard" />

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <span>Good evening Olivier</span>
            <h1>Financial Command Center</h1>
          </div>

          <div className="dashboard-top-actions">
            <button>
              <Search size={18} />
              Search
            </button>

            <Link to="/reports">
              <Download size={18} />
              Export
            </Link>

            <Link to="/share" className="red">
              <Share2 size={18} />
              Share Event
            </Link>
          </div>
        </header>

        <section className="dashboard-hero-card">
          <div className="dashboard-hero-left">
            <span className="dashboard-badge">
              <Sparkles size={16} />
              Active Event
            </span>

            <h2>Jean & Alice Wedding</h2>

            <p>
              Track every contribution, contributor, payment method, message,
              visitor and financial movement in one trusted dashboard.
            </p>

            <div className="dashboard-progress-row">
              <div>
                <span>Raised</span>
                <strong>RWF 3,850,000</strong>
              </div>

              <div>
                <span>Goal</span>
                <strong>RWF 5,000,000</strong>
              </div>

              <div>
                <span>Progress</span>
                <strong>77%</strong>
              </div>
            </div>

            <div className="dashboard-progress-track">
              <div></div>
            </div>
          </div>

          <div className="dashboard-hero-actions">
            <Link to="/events/jean-alice-wedding">
              <Eye size={18} />
              View Public Page
            </Link>

            <button>
              <Copy size={18} />
              Copy Link
            </button>

            <button>
              <QrCode size={18} />
              QR Code
            </button>
          </div>
        </section>

        <section className="ai-coach-card">
          <div className="ai-coach-content">
            <span className="dashboard-badge dark">
              <Sparkles size={16} />
              AI Financial Coach
            </span>

            <h2>Your event is performing better than 81% of weddings.</h2>

            <p>
              At the current pace, you are likely to reach your goal{" "}
              <strong>3 days early</strong>. Most contributors are coming from{" "}
              <strong>WhatsApp</strong>. Share your event again between{" "}
              <strong>6PM and 9PM</strong> to increase activity.
            </p>

            <div className="ai-coach-actions">
              <button>
                <Send size={18} />
                Send Reminder
              </button>

              <Link to="/reports">
                <FileText size={18} />
                Generate Report
              </Link>
            </div>
          </div>

          <div className="ai-coach-metric">
            <span>Expected Final</span>
            <strong>RWF 5.42M</strong>
            <p>+RWF 420K if shared tonight</p>
          </div>
        </section>

        <section className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <span>Total Collected</span>
            <strong>RWF 3.85M</strong>
            <p>
              <TrendingUp size={15} />
              +18% today
            </p>
          </div>

          <Link to="/contributors" className="dashboard-stat-card">
            <span>Contributors</span>
            <strong>287</strong>
            <p>
              <UsersRound size={15} />
              23 today
            </p>
          </Link>

          <div className="dashboard-stat-card">
            <span>Visitors</span>
            <strong>1,240</strong>
            <p>
              <Eye size={15} />
              29% conversion
            </p>
          </div>

          <div className="dashboard-stat-card">
            <span>Pending Payments</span>
            <strong>14</strong>
            <p>
              <Clock size={15} />
              Waiting confirmation
            </p>
          </div>
        </section>

        <section className="smart-insights-grid">
          <div className="smart-card forecast-card">
            <div className="panel-heading">
              <div>
                <span>Goal Prediction</span>
                <h3>Likely to reach goal</h3>
              </div>
              <TrendingUp size={22} />
            </div>

            <div className="forecast-amount">
              <span>Projected collection</span>
              <strong>RWF 5,420,000</strong>
              <p>Estimated finish: 12 July</p>
            </div>

            <div className="forecast-track">
              <div></div>
            </div>
          </div>

          <div className="smart-card reminder-card">
            <div className="panel-heading">
              <div>
                <span>Reminder Center</span>
                <h3>People waiting</h3>
              </div>
              <Bell size={22} />
            </div>

            <div className="waiting-stats">
              <div>
                <strong>189</strong>
                <span>Viewed</span>
              </div>

              <div>
                <strong>142</strong>
                <span>Paid</span>
              </div>

              <div>
                <strong>47</strong>
                <span>Waiting</span>
              </div>
            </div>

            <button className="smart-red-button">
              Send Reminder
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="smart-card share-time-card">
            <div className="panel-heading">
              <div>
                <span>Best Time To Share</span>
                <h3>Today 6PM – 9PM</h3>
              </div>
              <Zap size={22} />
            </div>

            <p>
              Your audience responds best in the evening. Sharing now could
              increase contributions by <strong>34%</strong>.
            </p>
          </div>
        </section>

        <section className="dashboard-content-grid">
          <div className="dashboard-panel large">
            <div className="panel-heading">
              <div>
                <span>Contribution Analytics</span>
                <h3>Daily money movement</h3>
              </div>

              <button>
                This week
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="chart-bars">
              <div style={{ height: "38%" }}>
                <span>Mon</span>
              </div>

              <div style={{ height: "62%" }}>
                <span>Tue</span>
              </div>

              <div style={{ height: "45%" }}>
                <span>Wed</span>
              </div>

              <div style={{ height: "82%" }}>
                <span>Thu</span>
              </div>

              <div style={{ height: "70%" }}>
                <span>Fri</span>
              </div>

              <div style={{ height: "92%" }}>
                <span>Sat</span>
              </div>

              <div style={{ height: "56%" }}>
                <span>Sun</span>
              </div>
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span>Financial Health</span>
                <h3>Excellent</h3>
              </div>
              <ShieldCheck size={22} />
            </div>

            <div className="health-score">
              <strong>96%</strong>
              <span>Healthy</span>
            </div>

            <div className="health-list">
              <p>
                <CheckCircle2 size={16} />
                Goal progressing well
              </p>

              <p>
                <CheckCircle2 size={16} />
                No suspicious activity
              </p>

              <p>
                <CheckCircle2 size={16} />
                Strong contributor activity
              </p>
            </div>
          </div>
        </section>

        <section className="dashboard-content-grid">
          <div className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span>Contribution Sources</span>
                <h3>Where money comes from</h3>
              </div>
              <Share2 size={22} />
            </div>

            <div className="source-list">
              {sources.map((source) => (
                <div className="source-item" key={source.name}>
                  <div>
                    <span>{source.name}</span>
                    <strong>{source.value}</strong>
                  </div>

                  <div className="source-track">
                    <span style={{ width: source.width }}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span>Payment Breakdown</span>
                <h3>Preferred methods</h3>
              </div>
              <WalletCards size={22} />
            </div>

            <div className="source-list">
              {paymentBreakdown.map((source) => (
                <div className="source-item" key={source.name}>
                  <div>
                    <span>{source.name}</span>
                    <strong>{source.value}</strong>
                  </div>

                  <div className="source-track red">
                    <span style={{ width: source.width }}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="dashboard-content-grid">
          <div className="dashboard-panel large">
            <div className="panel-heading">
              <div>
                <span>Top Contributors</span>
                <h3>Biggest supporters</h3>
              </div>

              <Link to="/contributors">
                View all
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="contributors-table">
              {contributors.map((person, index) => (
                <div className="contributor-row" key={person.name}>
                  <div>
                    <strong>
                      {index === 0 && "🥇 "}
                      {index === 1 && "🥈 "}
                      {index === 2 && "🥉 "}
                      {person.name}
                    </strong>
                    <span>{person.message}</span>
                  </div>

                  <strong>{person.amount}</strong>

                  <span>{person.method}</span>

                  <span>{person.time}</span>

                  <small
                    className={
                      person.status === "Success" ? "success" : "pending"
                    }
                  >
                    {person.status}
                  </small>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-panel wallet-panel">
            <div className="panel-heading">
              <div>
                <span>Withdraw Center</span>
                <h3>Available balance</h3>
              </div>
              <WalletCards size={22} />
            </div>

            <div className="wallet-balance">
              <span>Ready to withdraw</span>
              <strong>RWF 3,810,000</strong>
              <p>Estimated arrival: 2 minutes</p>
            </div>

            <Link to="/wallet" className="smart-red-button">
              Withdraw Funds
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <section className="dashboard-content-grid">
          <div className="dashboard-panel ai-panel">
            <span className="dashboard-badge dark">
              <Sparkles size={16} />
              AI Recommendation
            </span>

            <h3>What you should do next</h3>

            <p>
              47 people viewed your event but have not contributed yet. Send a
              friendly reminder now and include the public link. Based on
              current patterns, this could generate an additional{" "}
              <strong>RWF 420,000</strong> tonight.
            </p>

            <button>
              Send smart reminder
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="dashboard-panel quick-panel">
            <div className="panel-heading">
              <div>
                <span>Quick Actions</span>
                <h3>Manage event</h3>
              </div>
            </div>

            <div className="quick-actions-grid">
              <button>
                <Send size={18} />
                Send Thank You
              </button>

              <Link to="/reports">
                <FileText size={18} />
                Download Report
              </Link>

              <button>
                <MessageCircle size={18} />
                Read Messages
              </button>

              <Link to="/contributors">
                <Heart size={18} />
                Top Contributors
              </Link>
            </div>
          </div>
        </section>

        <section className="dashboard-content-grid">
          <div className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span>Live Activity</span>
                <h3>Happening now</h3>
              </div>
              <LineChart size={22} />
            </div>

            <div className="activity-list">
              {activity.map((item) => (
                <p key={item}>
                  <span></span>
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="dashboard-panel qr-panel">
            <div className="panel-heading">
              <div>
                <span>QR Analytics</span>
                <h3>Scan performance</h3>
              </div>
              <QrCode size={22} />
            </div>

            <div className="qr-box">
              <QrCode size={64} />
              <strong>125 scans</strong>
              <span>64% conversion rate</span>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Dashboard;