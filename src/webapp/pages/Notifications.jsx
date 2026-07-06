import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BellRing,
  CheckCircle2,
  Clock,
  CreditCard,
  Filter,
  RefreshCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
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

// Backend/realtime logic stays active for this page.
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const filters = ["All", "Payments", "Reminders", "Withdrawals", "Reports", "AI"];

function normalizeType(type = "") {
  return String(type || "").toLowerCase();
}

function getIcon(type) {
  const t = normalizeType(type);

  if (t.includes("payment") || t.includes("contribution")) return CreditCard;
  if (t.includes("withdraw")) return WalletCards;
  if (t.includes("reminder")) return Send;
  if (t.includes("ai") || t.includes("insight")) return Sparkles;
  if (t.includes("report")) return BellRing;
  if (t.includes("fail") || t.includes("error")) return AlertCircle;

  return Bell;
}

function getTypeLabel(type) {
  const t = normalizeType(type);

  if (t.includes("payment") || t.includes("contribution")) return "Contribution";
  if (t.includes("withdraw")) return "Wallet";
  if (t.includes("reminder")) return "Reminder";
  if (t.includes("ai") || t.includes("insight")) return "AI Insight";
  if (t.includes("report")) return "Report";
  if (t.includes("fail") || t.includes("error")) return "Action";

  return type || "Notification";
}

function getTypeClass(type) {
  const t = normalizeType(type);

  if (t.includes("payment") || t.includes("contribution")) return "payment";
  if (t.includes("withdraw")) return "wallet";
  if (t.includes("reminder")) return "reminder";
  if (t.includes("ai") || t.includes("insight")) return "ai";
  if (t.includes("report")) return "report";
  if (t.includes("fail") || t.includes("error")) return "action";

  return "default";
}

function getStatus(notification) {
  if (notification?.is_read) return "Read";

  const t = normalizeType(notification?.type);

  if (t.includes("fail") || t.includes("error") || t.includes("pending")) return "Action";
  if (t.includes("payment") || t.includes("contribution")) return "Success";
  if (t.includes("withdraw")) return "Wallet";
  if (t.includes("reminder")) return "Reminder";
  if (t.includes("ai") || t.includes("insight")) return "AI";
  if (t.includes("report")) return "Report";

  return "New";
}

function getStatusClass(status) {
  if (["Success", "Wallet", "Read", "Report"].includes(status)) return "success";
  if (status === "Action") return "failed";
  if (status === "Reminder") return "reminder";
  if (status === "AI") return "insight";

  return "new";
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
  const [deleting, setDeleting] = useState(false);
  const channelRef = useRef(null);

  const currentUser = getUser();

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const totalCount = notifications.length;

  const paymentCount = notifications.filter((n) => {
    const type = normalizeType(n.type);
    return type.includes("payment") || type.includes("contribution");
  }).length;

  const actionCount = notifications.filter((n) => {
    const type = normalizeType(n.type);
    return !n.is_read && (type.includes("fail") || type.includes("pending") || type.includes("reminder"));
  }).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const type = normalizeType(n.type);

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Payments" && (type.includes("payment") || type.includes("contribution"))) ||
        (activeFilter === "Reminders" && type.includes("reminder")) ||
        (activeFilter === "Withdrawals" && type.includes("withdraw")) ||
        (activeFilter === "Reports" && type.includes("report")) ||
        (activeFilter === "AI" && (type.includes("ai") || type.includes("insight")));

      const keyword = search.trim().toLowerCase();
      const matchesSearch =
        !keyword ||
        n.title?.toLowerCase().includes(keyword) ||
        n.message?.toLowerCase().includes(keyword) ||
        n.type?.toLowerCase().includes(keyword);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, notifications, search]);

  async function loadNotifications() {
    setLoading(true);

    const result = await getNotifications();
    if (result.success) {
      setNotifications(result.notifications || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadNotifications();

    if (!currentUser?.id) return undefined;

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
    if (markingRead || unreadCount === 0) return;

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

  function handleDeleteNotification(id) {
    const confirmed = window.confirm("Delete this notification from your feed?");
    if (!confirmed) return;

    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function handleDeleteAllNotifications() {
    if (notifications.length === 0 || deleting) return;

    const confirmed = window.confirm("Delete all notifications from this feed?");
    if (!confirmed) return;

    setDeleting(true);
    setNotifications([]);
    setDeleting(false);
  }

  return (
    <main className="notifications-page">
      <AppSidebar active="notifications" />

      <section className="notifications-main">
        <header className="notifications-topbar">
          <div>
            <span>Notifications Center</span>
            <div className="notifications-title-row-main">
              <h1>Financial activity feed</h1>
              <span className="notifications-live-pill">
                <i /> Live
              </span>
            </div>
            <p>
              Review contributions, reminders, withdrawals and system updates from one clean activity center.
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

            <button
              className="danger"
              onClick={handleDeleteAllNotifications}
              disabled={deleting || notifications.length === 0}
            >
              <Trash2 size={18} />
              {deleting ? "Deleting..." : "Delete All"}
            </button>
          </div>
        </header>

        <section className="notifications-hero">
          <div className="notifications-hero-left">
            <span className="notifications-badge">
              <BellRing size={16} />
              Live Activity
            </span>

            <h2>
              {unreadCount > 0
                ? `${unreadCount} update${unreadCount > 1 ? "s" : ""} need your attention.`
                : "You're all caught up."}
            </h2>

            <p>
              {unreadCount > 0
                ? "Take quick action on payments, reminders and important event updates without leaving your organizer workspace."
                : "Great job. Everything is up to date. We'll notify you instantly when someone contributes, withdraws money or needs your attention."}
            </p>

            <div className="notifications-hero-actions">
              <button className="light" onClick={handleMarkAllRead} disabled={markingRead || unreadCount === 0}>
                <CheckCircle2 size={18} />
                Clear Unread
              </button>

              <button className="glass" onClick={loadNotifications}>
                <RefreshCcw size={18} />
                Refresh Feed
              </button>
            </div>
          </div>

          <div className="notifications-hero-card">
            <Sparkles size={28} />
            <span>Realtime Status</span>
            <strong>
              {totalCount > 0
                ? `${totalCount} total notification${totalCount > 1 ? "s" : ""}`
                : "Feed ready"}
            </strong>
            <p>
              {paymentCount > 0
                ? `${paymentCount} payment update${paymentCount > 1 ? "s" : ""} recorded.`
                : "Payment alerts will appear after your next contribution."}
            </p>
          </div>
        </section>

        <section className="notifications-stats-grid">
          {loading ? (
            [1, 2, 3, 4].map((item) => (
              <div className="notifications-stat-card notifications-skeleton-card" key={item}>
                <div className="notifications-skeleton-icon shimmer" />
                <span className="notifications-skeleton-line notifications-skeleton-line-sm shimmer" />
                <strong className="notifications-skeleton-line notifications-skeleton-line-md shimmer" />
                <p className="notifications-skeleton-line notifications-skeleton-line-xs shimmer" />
              </div>
            ))
          ) : (
            <>
              <div className="notifications-stat-card">
                <div className="notifications-stat-icon">
                  <BellRing size={20} />
                </div>
                <span>Unread</span>
                <strong>{unreadCount}</strong>
                <p>{unreadCount > 0 ? "Needs review" : "All clear"}</p>
              </div>

              <div className="notifications-stat-card">
                <div className="notifications-stat-icon">
                  <Clock size={20} />
                </div>
                <span>Total</span>
                <strong>{totalCount}</strong>
                <p>All activity</p>
              </div>

              <div className="notifications-stat-card">
                <div className="notifications-stat-icon">
                  <CreditCard size={20} />
                </div>
                <span>Payments</span>
                <strong>{paymentCount}</strong>
                <p>Contribution alerts</p>
              </div>

              <div className="notifications-stat-card">
                <div className="notifications-stat-icon">
                  <AlertCircle size={20} />
                </div>
                <span>Actions</span>
                <strong>{actionCount}</strong>
                <p>{actionCount > 0 ? "Follow-up needed" : "No urgent action"}</p>
              </div>
            </>
          )}
        </section>

        <section className="notifications-dashboard-grid">
          <div className="notifications-panel notifications-feed-panel">
            <div className="notifications-toolbar">
              <div className="notifications-search">
                <Search size={18} />
                <input
                  placeholder="Search payments, names, reminders..."
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
                <span>Activity Timeline</span>
                <h3>
                  {loading
                    ? "Loading..."
                    : `${filteredNotifications.length} notification${filteredNotifications.length !== 1 ? "s" : ""}`}
                </h3>
              </div>
              <Bell size={22} />
            </div>

            <div className="notifications-timeline">
              {loading &&
                [1, 2, 3, 4, 5, 6].map((item) => (
                  <article className="notification-item notification-skeleton-item" key={item}>
                    <div className="notifications-skeleton-icon notification-skeleton-icon shimmer" />

                    <div className="notification-content">
                      <div className="notification-title-row">
                        <div>
                          <span className="notifications-skeleton-line notifications-skeleton-line-xs shimmer" />
                          <h4 className="notifications-skeleton-line notifications-skeleton-line-md shimmer" />
                        </div>

                        <small className="notifications-skeleton-pill shimmer" />
                      </div>

                      <p className="notifications-skeleton-line notifications-skeleton-line-full shimmer" />

                      <div className="notification-footer">
                        <time className="notifications-skeleton-line notifications-skeleton-line-xs shimmer" />
                        <span className="notifications-skeleton-pill shimmer" />
                      </div>
                    </div>
                  </article>
                ))}

              {!loading && filteredNotifications.length === 0 && (
                <div className="notifications-empty-state">
                  <Bell size={30} />
                  <h4>No notifications yet</h4>
                  <p>
                    When someone contributes, receives a reminder or triggers a wallet update,
                    it will appear here automatically.
                  </p>
                </div>
              )}

              {!loading &&
                filteredNotifications.map((item) => {
                  const Icon = getIcon(item.type);
                  const status = getStatus(item);
                  const typeClass = getTypeClass(item.type);

                  return (
                    <article
                      className={`notification-item ${!item.is_read ? "unread" : ""} type-${typeClass}`}
                      key={item.id}
                      onClick={() => !item.is_read && handleMarkRead(item.id)}
                    >
                      {!item.is_read && <span className="notification-unread-line" />}

                      <div className="notification-icon">
                        <Icon size={20} />
                      </div>

                      <div className="notification-content">
                        <div className="notification-title-row">
                          <div>
                            <span>{getTypeLabel(item.type)}</span>
                            <h4>{item.title || "New notification"}</h4>
                          </div>

                          <small className={getStatusClass(status)}>
                            <i /> {status}
                          </small>
                        </div>

                        <p>{item.message || "No message provided."}</p>

                        <div className="notification-footer">
                          <time>{formatTimeAgo(item.created_at)}</time>

                          <div className="notification-footer-actions">
                            {!item.is_read ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkRead(item.id);
                                }}
                              >
                                Mark Read
                                <ArrowRight size={15} />
                              </button>
                            ) : (
                              <span className="notification-read-label">Reviewed</span>
                            )}

                            <button
                              className="notification-delete-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNotification(item.id);
                              }}
                              title="Delete notification"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          </div>

          <aside className="notifications-panel notifications-summary-panel">
            <span className="notifications-badge dark">
              <Sparkles size={16} />
              Smart Summary
            </span>

            <h3>
              {unreadCount > 0
                ? "Focus on unread alerts first."
                : "Your feed is healthy."}
            </h3>

            <p>
              {unreadCount > 0
                ? "Clear unread updates, then follow up on contributors who still need attention."
                : "Realtime notifications are connected and ready for new event activity."}
            </p>

            <div className="notifications-check-list">
              <p>
                <CheckCircle2 size={16} />
                Payment alerts connected
              </p>
              <p>
                <CheckCircle2 size={16} />
                Realtime updates enabled
              </p>
              <p>
                <CheckCircle2 size={16} />
                Organizer actions ready
              </p>
              <p>
                <ShieldCheck size={16} />
                Server connection healthy
              </p>
            </div>

            <button onClick={handleMarkAllRead} disabled={markingRead || unreadCount === 0}>
              {markingRead ? "Marking..." : "Clear unread alerts"}
              <ArrowRight size={17} />
            </button>
          </aside>
        </section>
      </section>
    </main>
  );
}

export default Notifications;
