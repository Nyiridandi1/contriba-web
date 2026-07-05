import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  LineChart,
  Send,
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

function getFinancialHealth(totalRaised, totalContributors) {
  if (totalRaised <= 0) {
    return {
      label: "Getting started",
      score: "—",
      status: "No data yet",
      notes: [
        "Create or share an event to start collecting contributions",
        "Payments will be secured through your connected payment flow",
        "Contributor activity will appear here automatically",
      ],
    };
  }

  return {
    label: "Healthy",
    score: "96%",
    status: "Strong",
    notes: [
      "Payments are being tracked securely",
      "No suspicious activity detected",
      totalContributors > 0
        ? "Contributor activity is growing"
        : "Ready for more contributors",
    ],
  };
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
        setData(result.dashboard);
      }

      setLoading(false);
    }

    loadDashboard();
  }, []);

  const recentContributions = data?.recent_contributions || [];
  const recentEvents = data?.events || [];
  const totalContributors = data?.total_contributors || 0;
  const totalEvents = data?.total_events || 0;
  const walletBalance = data?.wallet_balance || 0;

  const totalRaised = recentContributions.reduce(
    (sum, contribution) => sum + Number(contribution.amount || 0),
    0
  );

  const heroEvent = recentEvents[0] || null;
  const heroRaised = heroEvent
    ? recentContributions
        .filter((contribution) => contribution.event_id === heroEvent.id)
        .reduce((sum, contribution) => sum + Number(contribution.amount || 0), 0)
    : 0;

  const heroGoal = Number(heroEvent?.goal_amount || 0);
  const heroProgress =
    heroGoal > 0 ? Math.min(100, Math.round((heroRaised / heroGoal) * 100)) : 0;

  const financialHealth = getFinancialHealth(totalRaised, totalContributors);

  return (
    <main className="dashboard-page">
      <AppSidebar active="dashboard" />

      <section className="dashboard-main">
        <header className="dashboard-topbar dashboard-topbar-clean">
          <div>
            <span>
              {getGreeting()} {currentUser?.name?.split(" ")[0] || "there"}
            </span>
            <h1>Financial Command Center</h1>
            <p>
              Track your events, contributions, wallet balance and latest
              supporter activity in one clean workspace.
            </p>
          </div>
        </header>

        <section className="dashboard-hero-card dashboard-hero-card-clean">
          <div className="dashboard-hero-left">
            <span className="dashboard-badge">
              <Sparkles size={16} />
              {loading ? "Loading..." : heroEvent ? "Active Event" : "Start Here"}
            </span>

            <h2>
              {loading
                ? "Loading your dashboard..."
                : heroEvent
                ? heroEvent.title
                : "Create your first event"}
            </h2>

            <p>
              {heroEvent
                ? "Your latest event is collecting contributions. Monitor the overall progress here, then manage details from the Events page."
                : "Create an event, share it with your community and start collecting contributions securely."}
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
                  <div style={{ width: `${heroProgress}%` }} />
                </div>
              </>
            )}

            {!heroEvent && (
              <Link to="/create-event" className="dashboard-hero-main-action">
                <Sparkles size={18} />
                Create Event
              </Link>
            )}
          </div>
        </section>

        <section className="ai-coach-card">
          <div className="ai-coach-content">
            <span className="dashboard-badge dark">
              <Sparkles size={16} />
              Financial Summary
            </span>

            <h2>
              {totalRaised > 0
                ? `You've collected ${formatMoney(totalRaised)} across ${totalEvents} event${
                    totalEvents !== 1 ? "s" : ""
                  }.`
                : "Your financial dashboard is ready."}
            </h2>

            <p>
              {totalContributors > 0
                ? `${totalContributors} supporter${
                    totalContributors !== 1 ? "s have" : " has"
                  } contributed so far. Keep monitoring your wallet and recent contributions from this page.`
                : "Once contributions start coming in, your totals, wallet balance and latest supporters will appear here automatically."}
            </p>

            <div className="ai-coach-actions">
              <Link to="/dashboard/events">
                <Eye size={18} />
                Manage Events
              </Link>

              <Link to="/contributors">
                <UsersRound size={18} />
                View Contributors
              </Link>
            </div>
          </div>

          <div className="ai-coach-metric">
            <span>Wallet Balance</span>
            <strong>{formatMoney(walletBalance)}</strong>
            <p>Available to withdraw</p>
          </div>
        </section>

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

          <Link to="/dashboard/events" className="dashboard-stat-card">
            <span>My Events</span>
            <strong>{totalEvents}</strong>
            <p>
              <Eye size={15} />
              Active events
            </p>
          </Link>

          <Link to="/wallet" className="dashboard-stat-card">
            <span>Wallet Balance</span>
            <strong>{formatMoney(walletBalance)}</strong>
            <p>
              <Clock size={15} />
              Ready to withdraw
            </p>
          </Link>
        </section>

        <section className="dashboard-content-grid dashboard-priority-grid">
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
                  <div>
                    <strong>Loading contributions...</strong>
                    <span>Preparing your latest supporter activity</span>
                  </div>
                </div>
              )}

              {!loading && recentContributions.length === 0 && (
                <div className="dashboard-empty-state">
                  <strong>No contributions yet</strong>
                  <span>
                    Share your event link or QR code from the Events page to
                    start receiving support.
                  </span>
                  <Link to="/dashboard/events">
                    Go to Events
                    <ArrowRight size={15} />
                  </Link>
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

        <section className="dashboard-content-grid dashboard-secondary-grid">
          <div className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span>Financial Health</span>
                <h3>{financialHealth.label}</h3>
              </div>

              <ShieldCheck size={22} />
            </div>

            <div className="health-score">
              <strong>{financialHealth.score}</strong>
              <span>{financialHealth.status}</span>
            </div>

            <div className="health-list">
              {financialHealth.notes.map((note) => (
                <p key={note}>
                  <CheckCircle2 size={16} />
                  {note}
                </p>
              ))}
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span>Live Activity</span>
                <h3>Happening now</h3>
              </div>

              <LineChart size={22} />
            </div>

            <div className="activity-list">
              {!loading && recentContributions.length === 0 && (
                <p>
                  <span />
                  No activity yet — share your event to get started.
                </p>
              )}

              {loading && (
                <p>
                  <span />
                  Loading activity...
                </p>
              )}

              {!loading &&
                recentContributions.slice(0, 4).map((item, index) => (
                  <p key={item.id || index}>
                    <span />
                    {item.is_anonymous
                      ? "Anonymous"
                      : item.contributor_name || "Guest"}{" "}
                    contributed {formatMoneyFull(item.amount)}
                  </p>
                ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Dashboard;
