import { useEffect, useRef, useState } from "react";
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
  RefreshCcw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  getUser,
} from "../api/api";

import AppSidebar from "../components/AppSidebar";
import "./Notifications.css";

// ── Supabase client for realtime ──
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const filters = ["All", "Payments", "Reminders", "Withdrawals", "AI", "Reports"];

function getIcon(type) {
  if (!type) return Bell;
  const t = type.toLowerCase();
  if (t.includes("payment") || t.includes("contribution")) return CreditCard;
  if (t.includes("withdraw")) return WalletCards;
  if (t.includes("report")) return FileText;
  if (t.includes("reminder")) return Send;
  if (t.includes("ai") || t.includes("insight")) return Sparkles;
  if (t.includes("fail") || t.includes("error")) return AlertCircle;
  return Bell;
}

function getStatus(notification) {
  if (!notification.type) return "Info";
  const t = notification.type.toLowerCase();
  if (t.includes("fail") || t.includes("error")) return "Failed";
  if (t.includes("success") || t.includes("payment") || t.includes("contribution")) return "Success";
  if (t.includes("withdraw")) return "Completed";
  if (t.includes("reminder")) return "Sent";
  if (t.includes("ai") || t.includes("insight")) return "Insight";
  if (t.includes("report")) return "Ready";
  return "Info";
}

function getStatusClass(status) {
  if (["Success", "Completed", "Ready", "Sent"].includes(status)) return "success";
  if (status === "Failed") return "failed";
  return "insight";
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

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [markingRead, setMarkingRead] = useState(false);
  const channelRef = useRef(null);

  const currentUser = getUser();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filteredNotifications = notifications.filter((n) => {
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Payments" && n.type?.toLowerCase().includes("payment")) ||
      (activeFilter === "Reminders" && n.type?.toLowerCase().includes("reminder")) ||
      (activeFilter === "Withdrawals" && n.type?.toLowerCase().includes("withdraw")) ||
      (activeFilter === "AI" && n.type?.toLowerCase().includes("ai")) ||
      (activeFilter === "Reports" && n.type?.toLowerCase().includes("report"));

    const matchesSearch =
      !search ||
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.message?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  async function loadNotifications() {
    setLoading(true);
    const result = await getNotifications();
    if (result.success) {
      setNotifications(result.notifications || []);
    }
    setLoading(false);
  }

  // ── SUPABASE REALTIME ──
  useEffect(() => {
    loadNotifications();

    if (!currentUser?.id) return;

    // Subscribe to new notifications for this user
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload) => {
          // New notification arrives — add to top instantly
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload) => {
          // Update existing notification (e.g. marked as read)
          setNotifications((prev) =>
            prev.map((n) => (n.id === payload.new.id ? payload.new : n))
          );
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [currentUser?.id]);

  async function handleMarkAllRead() {
    if (markingRead) return;
    setMarkingRead(true);
    const result = await markAllNotificationsRead();
    if (result.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
    setMarkingRead(false);
  }

  async function handleMarkRead(id) {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  }

  return (
    <main className="notifications-page">
      <AppSidebar active="notifications" />

      <section className="notifications-main">
        <header className="notifications-topbar">
          <div>
            <span>Notifications Center</span>
            <h1>
              Financial activity feed
              {unreadCount > 0 && (
                <span className="notifications-unread-badge">{unreadCount}</span>
              )}
            </h1>
            <p>
              Stay updated on every payment, reminder, withdrawal, report and AI
              insight across your event fundraising flow.
            </p>
          </div>

          <div className="notifications-top-actions">
            <button onClick={loadNotifications}>
              <RefreshCcw size={18} />
              Refresh
            </button>

            <button
              className="red"
              onClick={handleMarkAllRead}
              disabled={markingRead || unreadCount === 0}
            >
              <CheckCircle2 size={18} />
              {markingRead ? "Marking..." : "Mark All Read"}
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
            <span>Live Notification Feed</span>
            <strong>
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up!"}
            </strong>
            <p>
              {unreadCount > 0
                ? "Review your latest activity below."
                : "No new notifications at the moment."}
            </p>
          </div>
        </section>

        <section className="notifications-stats-grid">
          <div className="notifications-stat-card">
            <div className="notifications-stat-icon"><BellRing size={20} /></div>
            <span>Unread Alerts</span>
            <strong>{unreadCount}</strong>
            <p>Needs review</p>
          </div>
          <div className="notifications-stat-card">
            <div className="notifications-stat-icon"><Clock size={20} /></div>
            <span>Total</span>
            <strong>{notifications.length}</strong>
            <p>All notifications</p>
          </div>
          <div className="notifications-stat-card">
            <div className="notifications-stat-icon"><CreditCard size={20} /></div>
            <span>Payments</span>
            <strong>
              {notifications.filter((n) =>
                n.type?.toLowerCase().includes("payment") ||
                n.type?.toLowerCase().includes("contribution")
              ).length}
            </strong>
            <p>Payment alerts</p>
          </div>
          <div className="notifications-stat-card">
            <div className="notifications-stat-icon"><Sparkles size={20} /></div>
            <span>AI Alerts</span>
            <strong>
              {notifications.filter((n) =>
                n.type?.toLowerCase().includes("ai")
              ).length}
            </strong>
            <p>Smart recommendations</p>
          </div>
        </section>

        <section className="notifications-content-grid">
          <div className="notifications-panel large">
            <div className="notifications-toolbar">
              <div className="notifications-search">
                <Search size={18} />
                <input
                  placeholder="Search payments, names, reports, alerts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button>
                <Filter size={18} />
                Filter
              </button>
            </div>

            <div className="notification-filter-row">
              {filters.map((filter) => (
                <button
                  className={activeFilter === filter ? "active" : ""}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="notifications-panel-heading">
              <div>
                <span>Notification Timeline</span>
                <h3>
                  {loading
                    ? "Loading..."
                    : `${filteredNotifications.length} notification${filteredNotifications.length !== 1 ? "s" : ""}`}
                </h3>
              </div>
              <Bell size={22} />
            </div>

            <div className="notifications-timeline">
              {loading && (
                <div className="notification-item">
                  <div className="notification-content">
                    <p>Loading notifications...</p>
                  </div>
                </div>
              )}

              {!loading && filteredNotifications.length === 0 && (
                <div className="notification-item">
                  <div className="notification-icon">
                    <Bell size={20} />
                  </div>
                  <div className="notification-content">
                    <div className="notification-title-row">
                      <div>
                        <span>System</span>
                        <h4>No notifications yet</h4>
                      </div>
                    </div>
                    <p>When someone contributes to your event, you'll see it here instantly.</p>
                  </div>
                </div>
              )}

              {!loading &&
                filteredNotifications.map((item) => {
                  const Icon = getIcon(item.type);
                  const status = getStatus(item);

                  return (
                    <div
                      className={`notification-item ${!item.is_read ? "unread" : ""}`}
                      key={item.id}
                      onClick={() => !item.is_read && handleMarkRead(item.id)}
                      style={{ cursor: !item.is_read ? "pointer" : "default" }}
                    >
                      <div className="notification-icon">
                        <Icon size={20} />
                      </div>

                      <div className="notification-content">
                        <div className="notification-title-row">
                          <div>
                            <span>{item.type || "Notification"}</span>
                            <h4>{item.title}</h4>
                          </div>

                          <small className={getStatusClass(status)}>
                            {status}
                          </small>
                        </div>

                        <p>{item.message}</p>

                        <div className="notification-footer">
                          <time>{formatTimeAgo(item.created_at)}</time>

                          {!item.is_read && (
                            <button onClick={(e) => {
                              e.stopPropagation();
                              handleMarkRead(item.id);
                            }}>
                              Mark Read
                              <ArrowRight size={15} />
                            </button>
                          )}
                        </div>
                      </div>

                      {!item.is_read && (
                        <div className="notification-unread-dot" />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          <aside className="notifications-side">
            <div className="notifications-panel ai-alert-panel">
              <span className="notifications-badge dark">
                <Sparkles size={16} />
                Live Status
              </span>

              <h3>
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
                  : "You're all caught up!"}
              </h3>

              <p>
                {unreadCount > 0
                  ? "Review your notifications and take action on pending payments or reminders."
                  : "New notifications will appear here instantly when someone contributes to your event."}
              </p>

              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} disabled={markingRead}>
                  {markingRead ? "Marking..." : "Mark All Read"}
                  <ArrowRight size={17} />
                </button>
              )}
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
                <button onClick={handleMarkAllRead} disabled={markingRead}>
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
                  Realtime notifications active
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