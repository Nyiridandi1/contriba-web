import {
  AlertCircle,
  ArrowRight,
  Bell,
  BellRing,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileText,
  Filter,
  MessageCircle,
  RefreshCcw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound,
  WalletCards,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import "./Notifications.css";

const notificationStats = [
  {
    title: "Unread Alerts",
    value: "18",
    note: "Needs review",
    icon: BellRing,
  },
  {
    title: "Today",
    value: "42",
    note: "New activities",
    icon: Clock,
  },
  {
    title: "Payments",
    value: "23",
    note: "Received today",
    icon: CreditCard,
  },
  {
    title: "AI Alerts",
    value: "6",
    note: "Smart recommendations",
    icon: Sparkles,
  },
];

const notifications = [
  {
    type: "Payment",
    title: "New contribution received",
    description: "Olivier Ishimwe contributed RWF 500,000 through MTN MoMo.",
    time: "2 mins ago",
    status: "Success",
    icon: CreditCard,
  },
  {
    type: "Reminder",
    title: "Reminder campaign sent",
    description: "A reminder was sent to 42 people who viewed but did not pay.",
    time: "12 mins ago",
    status: "Sent",
    icon: Send,
  },
  {
    type: "AI Insight",
    title: "Best sharing window detected",
    description:
      "Your audience is most active between 6PM and 9PM. Sharing now may increase contributions.",
    time: "28 mins ago",
    status: "Insight",
    icon: Sparkles,
  },
  {
    type: "Withdrawal",
    title: "Withdrawal completed",
    description: "RWF 500,000 was sent to MTN MoMo • 0788 123 456.",
    time: "Today, 10:42 AM",
    status: "Completed",
    icon: WalletCards,
  },
  {
    type: "Payment Failed",
    title: "Payment could not be completed",
    description:
      "Jean Claude attempted to contribute RWF 50,000 but payment failed before confirmation.",
    time: "Yesterday, 6:12 PM",
    status: "Failed",
    icon: AlertCircle,
  },
  {
    type: "Report",
    title: "Financial report generated",
    description:
      "Jean & Alice Wedding Full Report was generated successfully as PDF.",
    time: "Yesterday, 11:24 AM",
    status: "Ready",
    icon: FileText,
  },
];

const filters = ["All", "Payments", "Reminders", "Withdrawals", "AI", "Reports"];

function Notifications() {
  return (
    <main className="notifications-page">
      <AppSidebar active="notifications" />

      <section className="notifications-main">
        <header className="notifications-topbar">
          <div>
            <span>Notifications Center</span>
            <h1>Financial activity feed</h1>
            <p>
              Stay updated on every payment, reminder, withdrawal, report and AI
              insight across your event fundraising flow.
            </p>
          </div>

          <div className="notifications-top-actions">
            <button>
              <RefreshCcw size={18} />
              Refresh
            </button>

            <button className="red">
              <CheckCircle2 size={18} />
              Mark All Read
            </button>
          </div>
        </header>

        <section className="notifications-hero">
          <div className="notifications-hero-left">
            <span className="notifications-badge">
              <BellRing size={16} />
              Live Event Activity
            </span>

            <h2>Never miss a payment, reminder or AI insight.</h2>

            <p>
              Contriba watches your event activity in real time so organizers
              know what happened, what needs attention, and what action should
              happen next.
            </p>

            <div className="notifications-hero-actions">
              <button className="light">
                <Send size={18} />
                Send Reminder
              </button>

              <button className="glass">
                <Download size={18} />
                Export Alerts
              </button>
            </div>
          </div>

          <div className="notifications-hero-card">
            <Sparkles size={28} />
            <span>AI Notification Insight</span>
            <strong>Activity is 34% higher than yesterday.</strong>
            <p>
              Best next action: send another reminder around 7:15 PM while your
              audience is active.
            </p>
          </div>
        </section>

        <section className="notifications-stats-grid">
          {notificationStats.map((item) => {
            const Icon = item.icon;

            return (
              <div className="notifications-stat-card" key={item.title}>
                <div className="notifications-stat-icon">
                  <Icon size={20} />
                </div>

                <span>{item.title}</span>
                <strong>{item.value}</strong>
                <p>{item.note}</p>
              </div>
            );
          })}
        </section>

        <section className="notifications-content-grid">
          <div className="notifications-panel large">
            <div className="notifications-toolbar">
              <div className="notifications-search">
                <Search size={18} />
                <input placeholder="Search payments, names, reports, alerts..." />
              </div>

              <button>
                <Filter size={18} />
                Filter
              </button>
            </div>

            <div className="notification-filter-row">
              {filters.map((filter, index) => (
                <button className={index === 0 ? "active" : ""} key={filter}>
                  {filter}
                </button>
              ))}
            </div>

            <div className="notifications-panel-heading">
              <div>
                <span>Notification Timeline</span>
                <h3>Happening now</h3>
              </div>
              <Bell size={22} />
            </div>

            <div className="notifications-timeline">
              {notifications.map((item) => {
                const Icon = item.icon;

                return (
                  <div className="notification-item" key={item.title}>
                    <div className="notification-icon">
                      <Icon size={20} />
                    </div>

                    <div className="notification-content">
                      <div className="notification-title-row">
                        <div>
                          <span>{item.type}</span>
                          <h4>{item.title}</h4>
                        </div>

                        <small
                          className={
                            item.status === "Success" ||
                            item.status === "Completed" ||
                            item.status === "Ready" ||
                            item.status === "Sent"
                              ? "success"
                              : item.status === "Failed"
                              ? "failed"
                              : "insight"
                          }
                        >
                          {item.status}
                        </small>
                      </div>

                      <p>{item.description}</p>

                      <div className="notification-footer">
                        <time>{item.time}</time>

                        <button>
                          View Details
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="notifications-side">
            <div className="notifications-panel ai-alert-panel">
              <span className="notifications-badge dark">
                <Sparkles size={16} />
                AI Alert
              </span>

              <h3>Send a reminder before 9PM.</h3>

              <p>
                47 people viewed your event but have not contributed yet. Based
                on current patterns, this reminder could generate up to RWF
                420,000 tonight.
              </p>

              <button>
                Send Smart Reminder
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="notifications-panel">
              <div className="notifications-panel-heading">
                <div>
                  <span>Quick Actions</span>
                  <h3>Manage alerts</h3>
                </div>
                <Settings size={22} />
              </div>

              <div className="notification-actions-grid">
                <button>
                  <CheckCircle2 size={18} />
                  Mark All Read
                </button>

                <button>
                  <Send size={18} />
                  Send Reminder
                </button>

                <button>
                  <FileText size={18} />
                  Download Report
                </button>

                <button>
                  <Settings size={18} />
                  Settings
                </button>
              </div>
            </div>

            <div className="notifications-panel">
              <div className="notifications-panel-heading">
                <div>
                  <span>Alert Health</span>
                  <h3>System status</h3>
                </div>
                <ShieldCheck size={22} />
              </div>

              <div className="alert-health-list">
                <p>
                  <CheckCircle2 size={16} />
                  Payment alerts active
                </p>

                <p>
                  <CheckCircle2 size={16} />
                  Reminder tracking active
                </p>

                <p>
                  <CheckCircle2 size={16} />
                  AI insights enabled
                </p>
              </div>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

export default Notifications;