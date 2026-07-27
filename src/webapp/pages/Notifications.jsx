import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Bell,
  BellRing,
  Check,
  CheckCircle2,
  CreditCard,
  RefreshCcw,
  Search,
  Send,
  Sparkles,
  Trash2,
  WalletCards,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

import {
  deleteAllNotifications,
  deleteNotification,
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

const filters = [
  "All",
  "Unread",
  "Payments",
  "Reminders",
  "Withdrawals",
  "Reports",
  "AI",
];

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
  if (t.includes("withdraw")) return "Withdrawal";
  if (t.includes("reminder")) return "Reminder";
  if (t.includes("ai") || t.includes("insight")) return "AI Insight";
  if (t.includes("report")) return "Report";
  if (t.includes("fail") || t.includes("error")) return "Action needed";

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
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDateGroup(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Earlier";

  const today = startOfDay(new Date());
  const notificationDay = startOfDay(date);
  const dayDifference = Math.floor((today - notificationDay) / 86400000);

  if (dayDifference <= 0) return "Today";
  if (dayDifference === 1) return "Yesterday";
  if (dayDifference <= 7) return "Earlier this week";
  if (dayDifference <= 14) return "Last week";
  return "Earlier";
}

const groupOrder = ["Today", "Yesterday", "Earlier this week", "Last week", "Earlier"];

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

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const type = normalizeType(n.type);

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Unread" && !n.is_read) ||
        (activeFilter === "Payments" &&
          (type.includes("payment") || type.includes("contribution"))) ||
        (activeFilter === "Reminders" && type.includes("reminder")) ||
        (activeFilter === "Withdrawals" && type.includes("withdraw")) ||
        (activeFilter === "Reports" && type.includes("report")) ||
        (activeFilter === "AI" &&
          (type.includes("ai") || type.includes("insight")));

      const keyword = search.trim().toLowerCase();
      const matchesSearch =
        !keyword ||
        n.title?.toLowerCase().includes(keyword) ||
        n.message?.toLowerCase().includes(keyword) ||
        n.type?.toLowerCase().includes(keyword);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, notifications, search]);

  const groupedNotifications = useMemo(() => {
    const groups = filteredNotifications.reduce((acc, notification) => {
      const group = getDateGroup(notification.created_at);
      if (!acc[group]) acc[group] = [];
      acc[group].push(notification);
      return acc;
    }, {});

    return groupOrder
      .filter((group) => groups[group]?.length)
      .map((group) => ({ label: group, items: groups[group] }));
  }, [filteredNotifications]);

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

  async function handleDeleteNotification(id) {
    const confirmed = window.confirm("Delete this notification from your feed?");
    if (!confirmed) return;

    const result = await deleteNotification(id);

    if (result.success) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      return;
    }

    window.alert(result.message || "Failed to delete notification. Please try again.");
  }

  async function handleDeleteAllNotifications() {
    if (notifications.length === 0 || deleting) return;

    const confirmed = window.confirm("Delete all notifications from this feed?");
    if (!confirmed) return;

    setDeleting(true);

    const result = await deleteAllNotifications();

    if (result.success) {
      setNotifications([]);
    } else {
      window.alert(result.message || "Failed to delete notifications. Please try again.");
    }

    setDeleting(false);
  }

  return (
    <main className="notifications-page">
      <AppSidebar active="notifications" />

      <section className="notifications-main">
        <header className="notifications-header">
          <div className="notifications-heading-copy">
            <div className="notifications-eyebrow">
              <span className="notifications-live-dot" />
              Live notification center
            </div>

            <div className="notifications-heading-row">
              <div>
                <h1>Notifications</h1>
                <p>Everything important from your events, payments, and wallet—organized in one place.</p>
              </div>

              {unreadCount > 0 && (
                <span className="notifications-unread-badge">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>

          <div className="notifications-header-actions">
            <button className="notifications-icon-action" onClick={loadNotifications} title="Refresh notifications">
              <RefreshCcw size={18} />
              <span>Refresh</span>
            </button>

            <button
              className="notifications-primary-action"
              onClick={handleMarkAllRead}
              disabled={markingRead || unreadCount === 0}
            >
              <CheckCircle2 size={18} />
              <span>{markingRead ? "Marking..." : "Mark all as read"}</span>
            </button>

            <button
              className="notifications-delete-all"
              onClick={handleDeleteAllNotifications}
              disabled={deleting || notifications.length === 0}
              title="Delete all notifications"
            >
              <Trash2 size={18} />
              <span>{deleting ? "Deleting..." : "Delete all"}</span>
            </button>
          </div>
        </header>

        <section className="notifications-inbox">
          <div className="notifications-controls">
            <label className="notifications-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search notifications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <div className="notification-filter-row" aria-label="Notification filters">
              {filters.map((filter) => (
                <button
                  className={activeFilter === filter ? "active" : ""}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                  {filter === "Unread" && unreadCount > 0 && <span>{unreadCount}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="notifications-list-header">
            <div>
              <strong>{activeFilter === "All" ? "All activity" : activeFilter}</strong>
              <span>
                {loading
                  ? "Loading your feed..."
                  : `${filteredNotifications.length} notification${filteredNotifications.length === 1 ? "" : "s"}`}
              </span>
            </div>

            {!loading && unreadCount === 0 && notifications.length > 0 && (
              <span className="notifications-caught-up">
                <Check size={15} /> All caught up
              </span>
            )}
          </div>

          <div className="notifications-feed">
            {loading && (
              <div className="notifications-skeleton-stack" aria-label="Loading notifications">
                {[1, 2, 3, 4, 5].map((item) => (
                  <article className="notification-row notification-skeleton-row" key={item}>
                    <div className="notification-skeleton-icon shimmer" />
                    <div className="notification-skeleton-content">
                      <span className="notification-skeleton-line short shimmer" />
                      <span className="notification-skeleton-line title shimmer" />
                      <span className="notification-skeleton-line full shimmer" />
                      <span className="notification-skeleton-line time shimmer" />
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!loading && filteredNotifications.length === 0 && (
              <div className="notifications-empty-state">
                <div className="notifications-empty-icon">
                  <Bell size={30} />
                </div>
                <h2>{search || activeFilter !== "All" ? "No matching notifications" : "You're all caught up"}</h2>
                <p>
                  {search || activeFilter !== "All"
                    ? "Try another search term or choose a different notification filter."
                    : "New contributions, reminders, withdrawals, and system updates will appear here automatically."}
                </p>
                {(search || activeFilter !== "All") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setActiveFilter("All");
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {!loading &&
              groupedNotifications.map((group) => (
                <section className="notification-group" key={group.label}>
                  <div className="notification-group-heading">
                    <h2>{group.label}</h2>
                    <span>{group.items.length}</span>
                  </div>

                  <div className="notification-group-list">
                    {group.items.map((item) => {
                      const Icon = getIcon(item.type);
                      const typeClass = getTypeClass(item.type);

                      return (
                        <article
                          className={`notification-row type-${typeClass} ${!item.is_read ? "unread" : "read"}`}
                          key={item.id}
                          onClick={() => !item.is_read && handleMarkRead(item.id)}
                        >
                          <span className="notification-unread-indicator" aria-hidden="true" />

                          <div className="notification-icon">
                            <Icon size={20} />
                          </div>

                          <div className="notification-body">
                            <div className="notification-meta-row">
                              <span className="notification-type-label">{getTypeLabel(item.type)}</span>
                              <time>{formatTimeAgo(item.created_at)}</time>
                            </div>

                            <h3>{item.title || "New notification"}</h3>
                            <p>{item.message || "No message provided."}</p>

                            <div className="notification-actions">
                              {!item.is_read ? (
                                <button
                                  className="notification-mark-read"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkRead(item.id);
                                  }}
                                >
                                  <Check size={15} />
                                  Mark as read
                                </button>
                              ) : (
                                <span className="notification-reviewed">
                                  <Check size={14} /> Reviewed
                                </span>
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
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Notifications;