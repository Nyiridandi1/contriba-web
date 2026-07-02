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
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDashboard, getUser } from "../api/api";
import AppSidebar from "../components/AppSidebar";
import "./Dashboard.css";

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
  if (Number.isNaN(date.getTime())) return "Recently";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = getUser();

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      const result = await getDashboard();
      if (result.success) {
        setData(result.dashboard); // ✅ read .dashboard not root
      }
      setLoading(false);
    }
    loadDashboard();
  }, []);

  // ── Pull real data ──
  const recentContributions = data?.recent_contributions || [];
  const recentEvents = data?.events || [];
  const totalContributors = data?.total_contributors || 0;
  const totalEvents = data?.total_events || 0;
  const walletBalance = data?.wallet_balance || 0;

  // ✅ Calculate total raised from real contributions
  const totalRaised = recentContributions.reduce(
    (sum, c) => sum + Number(c.amount || 0), 0
  );

  // Use first active event for hero
  const heroEvent = recentEvents[0] || null;
  const heroRaised = heroEvent
    ? recentContributions
        .filter((c) => c.event_id === heroEvent.id)
        .reduce((sum, c) => sum + Number(c.amount || 0), 0)
    : 0;
  const heroGoal = Number(heroEvent?.goal_amount || 0);
  const heroProgress =
    heroGoal > 0 ? Math.min(100, Math.round((heroRaised / heroGoal) * 100)) : 0;

  return (
    <main className="dashboard-page">
      <AppSidebar active="dashboard" />

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <span>
              {getGreeting()} {currentUser?.name?.split(" ")[0] || "there"}
            </span>
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

        {/* ── HERO CARD ── */}
        <section className="dashboard-hero-card">
          <div className="dashboard-hero-left">
            <span className="dashboard-badge">
              <Sparkles size={16} />
              {loading ? "Loading..." : heroEvent ? "Active Event" : "No Active Event"}
            </span>

            <h2>
              {loading
                ? "Loading your events..."
                : heroEvent
                ? heroEvent.title
                : "Create your first event"}
            </h2>

            <p>
              Track every contribution, contributor, payment method, message,
              visitor and financial movement in one trusted dashboard.
            </p>

            {heroEvent && (
              <>
                <div className="dashboard-progress-row">
                  <div>
                    <span>Raised</span>
                    <strong>{formatMoneyFull(heroRaised)}</strong>
                  </div>
                  <div>
                    <span>Goal</span>
                    <strong>{formatMoneyFull(heroGoal)}</strong>
                  </div>
                  <div>
                    <span>Progress</span>
                    <strong>{heroProgress}%</strong>
                  </div>
                </div>

                <div className="dashboard-progress-track">
                  <div style={{ width: `${heroProgress}%` }}></div>
                </div>
              </>
            )}
          </div>

          <div className="dashboard-hero-actions">
            {heroEvent ? (
              <>
                <Link to={`/events/${heroEvent.id}`}>
                  <Eye size={18} />
                  View Public Page
                </Link>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}/events/${heroEvent.id}`
                    )
                  }
                >
                  <Copy size={18} />
                  Copy Link
                </button>
              </>
            ) : (
              <Link to="/create-event">
                <Sparkles size={18} />
                Create Event
              </Link>
            )}
            <button>
              <QrCode size={18} />
              QR Code
            </button>
          </div>
        </section>

        {/* ── AI COACH ── */}
        <section className="ai-coach-card">
          <div className="ai-coach-content">
            <span className="dashboard-badge dark">
              <Sparkles size={16} />
              AI Financial Coach
            </span>

            <h2>
              {totalRaised > 0
                ? `You've collected ${formatMoney(totalRaised)} across ${totalEvents} event${totalEvents !== 1 ? "s" : ""}.`
                : "Create your first event to start collecting contributions."}
            </h2>

            <p>
              {totalContributors > 0
                ? `${totalContributors} people have contributed to your events. Share your event link between 6PM and 9PM to increase activity.`
                : "Once you create an event and share it, your contributors will appear here with real-time updates."}
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
            <span>Wallet Balance</span>
            <strong>{formatMoney(walletBalance)}</strong>
            <p>Available to withdraw</p>
          </div>
        </section>

        {/* ── STATS GRID ── */}
        <section className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <span>Total Collected</span>
            <strong>{formatMoney(totalRaised)}</strong>
            <p>
              <TrendingUp size={15} />
              {totalEvents} event{totalEvents !== 1 ? "s" : ""}
            </p>
          </div>

          <Link to="/contributors" className="dashboard-stat-card">
            <span>Contributors</span>
            <strong>{totalContributors}</strong>
            <p>
              <UsersRound size={15} />
              Total supporters
            </p>
          </Link>

          <div className="dashboard-stat-card">
            <span>My Events</span>
            <strong>{totalEvents}</strong>
            <p>
              <Eye size={15} />
              Active events
            </p>
          </div>

          <div className="dashboard-stat-card">
            <span>Wallet Balance</span>
            <strong>{formatMoney(walletBalance)}</strong>
            <p>
              <Clock size={15} />
              Ready to withdraw
            </p>
          </div>
        </section>

        {/* ── SMART INSIGHTS ── */}
        <section className="smart-insights-grid">
          <div className="smart-card forecast-card">
            <div className="panel-heading">
              <div>
                <span>Goal Prediction</span>
                <h3>
                  {heroProgress >= 100
                    ? "Goal reached! 🎉"
                    : heroProgress > 50
                    ? "On track!"
                    : "Keep going!"}
                </h3>
              </div>
              <TrendingUp size={22} />
            </div>

            <div className="forecast-amount">
              <span>Total raised</span>
              <strong>{formatMoneyFull(heroRaised)}</strong>
              <p>{heroGoal > 0 ? `Goal: ${formatMoneyFull(heroGoal)}` : "No goal set"}</p>
            </div>

            <div className="forecast-track">
              <div style={{ width: `${heroProgress}%` }}></div>
            </div>
          </div>

          <div className="smart-card reminder-card">
            <div className="panel-heading">
              <div>
                <span>Reminder Center</span>
                <h3>Contributors</h3>
              </div>
              <Bell size={22} />
            </div>

            <div className="waiting-stats">
              <div>
                <strong>{totalContributors}</strong>
                <span>Total</span>
              </div>
              <div>
                <strong>{totalEvents}</strong>
                <span>Events</span>
              </div>
              <div>
                <strong>{formatMoney(walletBalance)}</strong>
                <span>Balance</span>
              </div>
            </div>

            <button className="smart-red-button">
              Send Reminder
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="dashboard-panel chart-panel">
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
              <div style={{ height: "38%" }}><span>Mon</span></div>
              <div style={{ height: "62%" }}><span>Tue</span></div>
              <div style={{ height: "45%" }}><span>Wed</span></div>
              <div style={{ height: "82%" }}><span>Thu</span></div>
              <div style={{ height: "70%" }}><span>Fri</span></div>
              <div style={{ height: "92%" }}><span>Sat</span></div>
              <div style={{ height: "56%" }}><span>Sun</span></div>
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span>Financial Health</span>
                <h3>{totalRaised > 0 ? "Excellent" : "Getting started"}</h3>
              </div>
              <ShieldCheck size={22} />
            </div>

            <div className="health-score">
              <strong>{totalRaised > 0 ? "96%" : "—"}</strong>
              <span>{totalRaised > 0 ? "Healthy" : "No data yet"}</span>
            </div>

            <div className="health-list">
              <p><CheckCircle2 size={16} />Payments secured by Paypack</p>
              <p><CheckCircle2 size={16} />No suspicious activity</p>
              <p>
                <CheckCircle2 size={16} />
                {totalContributors > 0
                  ? "Strong contributor activity"
                  : "Ready for contributions"}
              </p>
            </div>
          </div>
        </section>

        {/* ── RECENT CONTRIBUTIONS ── */}
        <section className="dashboard-content-grid">
          <div className="dashboard-panel large">
            <div className="panel-heading">
              <div>
                <span>Recent Contributions</span>
                <h3>Latest supporters</h3>
              </div>
              <Link to="/contributors">
                View all
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="contributors-table">
              {loading && (
                <div className="contributor-row">
                  <div><strong>Loading...</strong></div>
                </div>
              )}

              {!loading && recentContributions.length === 0 && (
                <div className="contributor-row">
                  <div>
                    <strong>No contributions yet</strong>
                    <span>Share your event to start receiving contributions</span>
                  </div>
                </div>
              )}

              {!loading &&
                recentContributions.slice(0, 5).map((person, index) => (
                  <div className="contributor-row" key={person.id || index}>
                    <div>
                      <strong>
                        {index === 0 && "🥇 "}
                        {index === 1 && "🥈 "}
                        {index === 2 && "🥉 "}
                        {person.is_anonymous
                          ? "Anonymous"
                          : person.contributor_name || "Guest"}
                      </strong>
                      <span>{person.message || "Supported this event."}</span>
                    </div>
                    <strong>{formatMoneyFull(person.amount)}</strong>
                    <span>{person.payment_method?.toUpperCase() || "MoMo"}</span>
                    <span>{formatTimeAgo(person.created_at)}</span>
                    <small
                      className={
                        person.status === "success" ? "success" : "pending"
                      }
                    >
                      {person.status === "success" ? "Success" : "Pending"}
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
              <strong>{formatMoneyFull(walletBalance)}</strong>
              <p>Estimated arrival: 2 minutes</p>
            </div>

            <Link to="/wallet" className="smart-red-button">
              Withdraw Funds
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* ── QUICK ACTIONS ── */}
        <section className="dashboard-content-grid">
          <div className="dashboard-panel ai-panel">
            <span className="dashboard-badge dark">
              <Sparkles size={16} />
              AI Recommendation
            </span>

            <h3>What you should do next</h3>

            <p>
              {totalContributors > 0
                ? `You have ${totalContributors} supporters. Send a friendly reminder and include the public link to increase contributions.`
                : "Create your first event and share it with friends and family to start collecting contributions."}
            </p>

            <button>
              {totalContributors > 0 ? "Send smart reminder" : "Create Event"}
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

        {/* ── LIVE ACTIVITY ── */}
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
              {recentContributions.length === 0 && (
                <p>
                  <span></span>
                  No activity yet — share your event to get started!
                </p>
              )}
              {recentContributions.slice(0, 4).map((item, index) => (
                <p key={index}>
                  <span></span>
                  {item.is_anonymous
                    ? "Anonymous"
                    : item.contributor_name || "Guest"}{" "}
                  contributed {formatMoneyFull(item.amount)}
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
              <strong>{totalContributors} contributors</strong>
              <span>{heroProgress}% of goal reached</span>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Dashboard;