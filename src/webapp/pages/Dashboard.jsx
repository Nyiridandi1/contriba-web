import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  Clock,
  FileText,
  Heart,
  LineChart,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

function getFirstName(user) {
  return user?.name?.split(" ")[0] || "there";
}

function generateDashboardInsight({
  heroEvent,
  heroGoal,
  heroRaised,
  heroProgress,
  totalRaised,
  totalContributors,
  totalEvents,
  walletBalance,
}) {
  if (!heroEvent) {
    return {
      title: "Create your first event",
      message:
        "Start by creating a public contribution page. Once people begin contributing, your dashboard will show live financial performance here.",
      action: "Create Event",
      link: "/create-event",
      tone: "neutral",
    };
  }

  if (heroGoal > 0 && heroProgress >= 100) {
    return {
      title: "Goal reached",
      message: `${heroEvent.title} has reached its target. Review the wallet balance and prepare your withdrawal or final report.`,
      action: "Open Wallet",
      link: "/wallet",
      tone: "success",
    };
  }

  if (heroGoal > 0 && heroProgress >= 70) {
    return {
      title: "Close to the goal",
      message: `${heroEvent.title} is at ${heroProgress}% of its goal. A focused reminder can help close the remaining gap.`,
      action: "Send Reminder",
      link: "/notifications",
      tone: "success",
    };
  }

  if (totalContributors === 0) {
    return {
      title: "Start with close contacts",
      message:
        "Your event has no contributors yet. Share directly with close family and friends first before posting in large groups.",
      action: "Go to Share Center",
      link: "/share",
      tone: "warning",
    };
  }

  if (walletBalance > 0) {
    return {
      title: "Funds are available",
      message: `You currently have ${formatMoneyFull(walletBalance)} available in your wallet. Review withdrawals when ready.`,
      action: "Open Wallet",
      link: "/wallet",
      tone: "success",
    };
  }

  if (totalEvents > 1) {
    return {
      title: "Focus on your strongest event",
      message:
        "You are managing multiple events. Prioritize the event closest to deadline or closest to goal for better results.",
      action: "View Events",
      link: "/dashboard/events",
      tone: "info",
    };
  }

  return {
    title: "Keep the momentum",
    message:
      totalRaised > 0
        ? "Your event is receiving support. Keep contributors engaged with short reminders and appreciation messages."
        : "Your dashboard is ready. Create and share an event to start tracking contributions.",
    action: totalRaised > 0 ? "View Contributors" : "Create Event",
    link: totalRaised > 0 ? "/contributors" : "/create-event",
    tone: "info",
  };
}

function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton-grid">
      <div className="dashboard-skeleton-card shimmer" />
      <div className="dashboard-skeleton-card shimmer" />
      <div className="dashboard-skeleton-card shimmer" />
      <div className="dashboard-skeleton-card shimmer" />
    </div>
  );
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

  const latestContribution = recentContributions[0] || null;

  const averageContribution =
    totalContributors > 0 ? Math.round(totalRaised / totalContributors) : 0;

  const dashboardInsight = useMemo(
    () =>
      generateDashboardInsight({
        heroEvent,
        heroGoal,
        heroRaised,
        heroProgress,
        totalRaised,
        totalContributors,
        totalEvents,
        walletBalance,
      }),
    [
      heroEvent,
      heroGoal,
      heroRaised,
      heroProgress,
      totalRaised,
      totalContributors,
      totalEvents,
      walletBalance,
    ]
  );

  const activityItems = recentContributions.slice(0, 4);

  return (
    <main className="dashboard-page">
      <AppSidebar active="dashboard" />

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <span>{getGreeting()} {getFirstName(currentUser)}</span>
            <h1>Financial Command Center</h1>
            <p>
              A clean overview of your events, contributors, wallet balance and
              contribution movement.
            </p>
          </div>
        </header>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <section className="dashboard-overview">
              <div className="dashboard-command-card">
                <span className="dashboard-badge">
                  <Sparkles size={16} />
                  Organizer Overview
                </span>

                <h2>
                  {heroEvent
                    ? heroEvent.title
                    : "Your contribution workspace is ready."}
                </h2>

                <p>
                  {heroEvent
                    ? "Track the strongest event in your workspace and monitor the most important financial signals."
                    : "Create an event to begin collecting contributions and monitoring your progress in real time."}
                </p>

                <div className="dashboard-command-progress">
                  <div>
                    <span>Current event raised</span>
                    <strong>{formatMoneyFull(heroRaised)}</strong>
                  </div>

                  <div>
                    <span>Goal</span>
                    <strong>{heroGoal > 0 ? formatMoneyFull(heroGoal) : "Not set"}</strong>
                  </div>

                  <div>
                    <span>Progress</span>
                    <strong>{heroGoal > 0 ? `${heroProgress}%` : "—"}</strong>
                  </div>
                </div>

                {heroGoal > 0 && (
                  <div className="dashboard-progress-track">
                    <div style={{ width: `${heroProgress}%` }} />
                  </div>
                )}
              </div>

              <div className={`dashboard-insight-card ${dashboardInsight.tone}`}>
                <div className="dashboard-insight-icon">
                  <Sparkles size={22} />
                </div>

                <span>Today&apos;s Recommendation</span>
                <h3>{dashboardInsight.title}</h3>
                <p>{dashboardInsight.message}</p>

                <Link to={dashboardInsight.link}>
                  {dashboardInsight.action}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>

            <section className="dashboard-stats-grid">
              <div className="dashboard-stat-card">
                <span>Total Collected</span>
                <strong>{formatMoney(totalRaised)}</strong>
                <p>
                  <TrendingUp size={15} />
                  Across all events
                </p>
              </div>

              <div className="dashboard-stat-card">
                <span>Wallet Balance</span>
                <strong>{formatMoney(walletBalance)}</strong>
                <p>
                  <WalletCards size={15} />
                  Ready to review
                </p>
              </div>

              <Link to="/dashboard/events" className="dashboard-stat-card">
                <span>Events</span>
                <strong>{totalEvents}</strong>
                <p>
                  <BarChart3 size={15} />
                  Organizer events
                </p>
              </Link>

              <Link to="/contributors" className="dashboard-stat-card">
                <span>Contributors</span>
                <strong>{totalContributors}</strong>
                <p>
                  <UsersRound size={15} />
                  Total supporters
                </p>
              </Link>
            </section>

            <section className="dashboard-analytics-grid">
              <div className="dashboard-panel dashboard-trend-panel">
                <div className="panel-heading">
                  <div>
                    <span>Goal Progress</span>
                    <h3>{heroProgress >= 100 ? "Goal reached" : "Current event"}</h3>
                  </div>

                  <LineChart size={22} />
                </div>

                <div className="dashboard-goal-ring">
                  <strong>{heroGoal > 0 ? `${heroProgress}%` : "—"}</strong>
                  <span>{heroGoal > 0 ? "Completed" : "No goal yet"}</span>
                </div>

                <div className="dashboard-goal-summary">
                  <div>
                    <span>Raised</span>
                    <strong>{formatMoneyFull(heroRaised)}</strong>
                  </div>

                  <div>
                    <span>Remaining</span>
                    <strong>
                      {heroGoal > 0
                        ? formatMoneyFull(Math.max(heroGoal - heroRaised, 0))
                        : "—"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="dashboard-panel dashboard-mini-panel">
                <div className="panel-heading">
                  <div>
                    <span>Average Support</span>
                    <h3>{formatMoneyFull(averageContribution)}</h3>
                  </div>

                  <Heart size={22} />
                </div>

                <p>
                  Average amount contributed per supporter based on your current
                  dashboard data.
                </p>

                <div className="dashboard-mini-line">
                  <span>Supporters</span>
                  <strong>{totalContributors}</strong>
                </div>
              </div>

              <div className="dashboard-panel dashboard-mini-panel">
                <div className="panel-heading">
                  <div>
                    <span>Latest Movement</span>
                    <h3>
                      {latestContribution
                        ? formatMoneyFull(latestContribution.amount)
                        : "No activity yet"}
                    </h3>
                  </div>

                  <Clock size={22} />
                </div>

                <p>
                  {latestContribution
                    ? `${
                        latestContribution.is_anonymous
                          ? "Anonymous"
                          : latestContribution.contributor_name || "Guest"
                      } contributed ${formatTimeAgo(latestContribution.created_at)}.`
                    : "Share your event to start seeing live contribution movement."}
                </p>

                <div className="dashboard-mini-line">
                  <span>Status</span>
                  <strong>{latestContribution?.status || "Waiting"}</strong>
                </div>
              </div>
            </section>

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
                  {recentContributions.length === 0 && (
                    <div className="dashboard-empty-row">
                      <strong>No contributions yet</strong>
                      <span>
                        When people contribute, the latest supporters will appear
                        here.
                      </span>
                    </div>
                  )}

                  {recentContributions.slice(0, 5).map((person, index) => (
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
                        className={person.status === "success" ? "success" : "pending"}
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
                    <span>Wallet</span>
                    <h3>Available balance</h3>
                  </div>

                  <WalletCards size={22} />
                </div>

                <div className="wallet-balance">
                  <span>Ready to review</span>
                  <strong>{formatMoneyFull(walletBalance)}</strong>
                  <p>Withdrawals are managed from your wallet page.</p>
                </div>

                <Link to="/wallet" className="smart-red-button">
                  Open Wallet
                  <ArrowRight size={17} />
                </Link>
              </div>
            </section>

            <section className="dashboard-bottom-grid">
              <div className="dashboard-panel">
                <div className="panel-heading">
                  <div>
                    <span>Financial Health</span>
                    <h3>{totalRaised > 0 ? "Healthy" : "Getting started"}</h3>
                  </div>

                  <ShieldCheck size={22} />
                </div>

                <div className="health-list">
                  <p>
                    <CheckCircle2 size={16} />
                    Payments are organized through secure contribution records.
                  </p>

                  <p>
                    <CheckCircle2 size={16} />
                    Wallet balance is separated from event contribution totals.
                  </p>

                  <p>
                    <CheckCircle2 size={16} />
                    Contributor activity is ready for reporting.
                  </p>
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="panel-heading">
                  <div>
                    <span>Live Activity</span>
                    <h3>Happening now</h3>
                  </div>

                  <Bell size={22} />
                </div>

                <div className="activity-list">
                  {activityItems.length === 0 && (
                    <p>
                      <span />
                      No activity yet — share your event to get started.
                    </p>
                  )}

                  {activityItems.map((item, index) => (
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

              <div className="dashboard-panel quick-panel">
                <div className="panel-heading">
                  <div>
                    <span>Quick Actions</span>
                    <h3>Next steps</h3>
                  </div>
                </div>

                <div className="quick-actions-grid">
                  <Link to="/create-event">
                    <Plus size={18} />
                    Create Event
                  </Link>

                  <Link to="/notifications">
                    <Send size={18} />
                    Send Reminder
                  </Link>

                  <Link to="/wallet">
                    <WalletCards size={18} />
                    Open Wallet
                  </Link>

                  <Link to="/reports">
                    <FileText size={18} />
                    View Reports
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
