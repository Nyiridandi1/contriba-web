import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  Filter,
  HeartHandshake,
  MapPin,
  MoreHorizontal,
  Plus,
  QrCode,
  Search,
  Share2,
  Sparkles,
  Trash2,
  TrendingUp,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { deleteEvent, getEvents, getMyEvents } from "../api/api";

import AppSidebar from "../components/AppSidebar";
import "./DashboardEvents.css";

function formatMoney(value) {
  return `RWF ${Number(value || 0).toLocaleString()}`;
}

function formatDaysLeft(value) {
  if (!value) return "Open";

  const eventDate = new Date(value);
  const today = new Date();

  if (Number.isNaN(eventDate.getTime())) return "Open";

  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Ended";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day left";

  return `${diffDays} days left`;
}

function normalizeEvent(event) {
  const raised = Number(event.total_raised || event.raised || 0);
  const goal = Number(event.goal_amount || event.goal || 0);
  const progressNumber =
    goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

  return {
    id: event.id,
    title: event.title || "Untitled Event",
    type: event.type || event.category || "Event",
    location: event.location || "Rwanda",
    collected: formatMoney(raised),
    goal: formatMoney(goal),
    progress: `${progressNumber}%`,
    progressNumber,
    contributors: Number(event.total_contributors || event.contributors || 0),
    status: event.status || "active",
    endDate: formatDaysLeft(event.date),
    isPrivate: Boolean(event.is_private),
  };
}

function DashboardEvents() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("my");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [myEvents, setMyEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [pageMessage, setPageMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const isMyEvents = activeTab === "my";

  useEffect(() => {
    async function loadDashboardEvents() {
      setLoading(true);
      setPageMessage("");

      const [myResult, allResult] = await Promise.all([
        getMyEvents(),
        getEvents(),
      ]);

      if (myResult.success) {
        setMyEvents(myResult.events || []);
      } else {
        setPageMessage(myResult.message || "Failed to load your events.");
      }

      if (allResult.success) {
        setAllEvents(allResult.events || []);
      }

      setLoading(false);
    }

    loadDashboardEvents();
  }, []);

  const normalizedMyEvents = useMemo(
    () => myEvents.map((event) => normalizeEvent(event)),
    [myEvents]
  );

  const normalizedAllEvents = useMemo(
    () => allEvents.map((event) => normalizeEvent(event)),
    [allEvents]
  );

  const baseEvents = isMyEvents ? normalizedMyEvents : normalizedAllEvents;

  const displayedEvents = useMemo(() => {
    return baseEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === "All" ||
        event.type.toLowerCase() === activeFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [baseEvents, searchTerm, activeFilter]);

  const totalCollected = normalizedMyEvents.reduce((sum, event) => {
    const clean = event.collected.replace(/[^\d]/g, "");
    return sum + Number(clean || 0);
  }, 0);

  const totalContributors = normalizedMyEvents.reduce(
    (sum, event) => sum + Number(event.contributors || 0),
    0
  );

  const activeEventsCount = normalizedMyEvents.filter(
    (event) => event.status === "active"
  ).length;

  const eventStats = [
    {
      title: "My Active Events",
      value: String(activeEventsCount),
      note: `${normalizedMyEvents.length} total events`,
      icon: CalendarDays,
    },
    {
      title: "Collected",
      value: formatMoney(totalCollected),
      note: "From your events",
      icon: WalletCards,
    },
    {
      title: "Contributors",
      value: String(totalContributors),
      note: "Across my events",
      icon: UsersRound,
    },
    {
      title: "Success Rate",
      value: "--",
      note: "Analytics coming soon",
      icon: TrendingUp,
    },
  ];

  async function handleCopyLink(eventId) {
    const link = `${window.location.origin}/events/${eventId}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopyMessage("Event link copied.");
    } catch (error) {
      setCopyMessage(link);
    }

    setTimeout(() => {
      setCopyMessage("");
    }, 2500);
  }

  async function handleDeleteEvent(eventId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeletingId(eventId);
    setPageMessage("");

    const result = await deleteEvent(eventId);

    setDeletingId(null);

    if (!result.success) {
      setPageMessage(result.message || "Failed to delete event.");
      return;
    }

    setMyEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== eventId)
    );

    setAllEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== eventId)
    );

    setPageMessage("Event deleted successfully.");
  }

  return (
    <main className="dashboard-events-page">
      <AppSidebar active="events" />

      <section className="dashboard-events-main">
        <header className="dashboard-events-topbar">
          <div>
            <span>Events Center</span>
            <h1>{isMyEvents ? "Manage your events" : "Browse all events"}</h1>
            <p>
              {isMyEvents
                ? "Manage events you created, track contributors, share links, view QR codes and monitor performance."
                : "Browse public events people are supporting across Contriba and contribute securely."}
            </p>
          </div>

          <div className="dashboard-events-actions">
            <button type="button">
              <Search size={18} />
              Search
            </button>

            <button type="button">
              <Filter size={18} />
              Filter
            </button>

            <button
              className="red"
              type="button"
              onClick={() => navigate("/create-event")}
            >
              <Plus size={18} />
              Create Event
            </button>
          </div>
        </header>

        <section className="dashboard-events-tabs">
          <button
            type="button"
            className={isMyEvents ? "active" : ""}
            onClick={() => setActiveTab("my")}
          >
            <CalendarDays size={18} />
            My Events
          </button>

          <button
            type="button"
            className={!isMyEvents ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            <HeartHandshake size={18} />
            All Events
          </button>
        </section>

        <section className="dashboard-events-hero">
          <div className="dashboard-events-hero-left">
            <span className="dashboard-events-badge">
              <Sparkles size={16} />
              {isMyEvents ? "Organizer Events" : "Public Events"}
            </span>

            <h2>
              {isMyEvents
                ? "Your event command center."
                : "Find an event to support."}
            </h2>

            <p>
              {isMyEvents
                ? "Keep your organizer tools separate from public browsing. Manage progress, contributors, reports and sharing from one place."
                : "Discover weddings, graduations, birthdays, church events and fundraisers. Support people securely in just a few clicks."}
            </p>

            <div className="dashboard-events-hero-buttons">
              <button
                className="primary"
                type="button"
                onClick={() => navigate("/create-event")}
              >
                <Plus size={18} />
                Create Event
              </button>

              <button className="glass" type="button">
                <BarChart3 size={18} />
                View Analytics
              </button>
            </div>
          </div>

          <div className="dashboard-events-ai-card">
            <Sparkles size={26} />
            <span>{isMyEvents ? "AI Event Insight" : "Featured Event"}</span>
            <strong>
              {isMyEvents
                ? "Analytics coming soon."
                : "Public event discovery is live."}
            </strong>
            <p>
              {isMyEvents
                ? "Visitor insights, smart reminders and recommendations are coming soon."
                : "Events shown here are live on Contriba."}
            </p>
          </div>
        </section>

        {isMyEvents && (
          <section className="dashboard-events-stats-grid">
            {eventStats.map((item) => {
              const Icon = item.icon;

              return (
                <div className="dashboard-events-stat-card" key={item.title}>
                  <div>
                    <Icon size={20} />
                  </div>

                  <span>{item.title}</span>
                  <strong>{item.value}</strong>
                  <p>{item.note}</p>
                </div>
              );
            })}
          </section>
        )}

        <section className="dashboard-events-toolbar">
          <div className="dashboard-events-search">
            <Search size={19} />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={
                isMyEvents
                  ? "Search your events..."
                  : "Search all public events..."
              }
            />
          </div>

          <div className="dashboard-events-filters">
            {["All", "Wedding", "Graduation", "Birthday"].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={activeFilter === filter ? "active" : ""}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {copyMessage && (
          <section className="dashboard-events-panel">
            <h3>Share link</h3>
            <p>{copyMessage}</p>
          </section>
        )}

        {loading && (
          <section className="dashboard-events-panel">
            <h3>Loading events...</h3>
            <p>Preparing your events...</p>
          </section>
        )}

        {!loading && pageMessage && isMyEvents && (
          <section className="dashboard-events-panel">
            <h3>Event update</h3>
            <p>{pageMessage}</p>
          </section>
        )}

        {!loading && displayedEvents.length === 0 && (
          <section className="dashboard-events-panel">
            <h3>No events found</h3>
            <p>
              {isMyEvents
                ? "Create your first event and it will appear here."
                : "No public events match this search yet."}
            </p>
          </section>
        )}

        {!loading && displayedEvents.length > 0 && (
          <section className="dashboard-events-grid">
            {displayedEvents.map((event) => (
              <article className="dashboard-event-card" key={event.id}>
                <div className="dashboard-event-card-top">
                  <span>{event.type}</span>

                  <button type="button">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <h3>{event.title}</h3>

                <div className="dashboard-event-location">
                  <MapPin size={16} />
                  {event.location}
                </div>

                <div className="dashboard-event-metrics">
                  <div>
                    <small>{isMyEvents ? "Collected" : "Raised"}</small>
                    <strong>{event.collected}</strong>
                  </div>

                  <div>
                    <small>Goal</small>
                    <strong>{event.goal}</strong>
                  </div>
                </div>

                <div className="dashboard-event-progress-row">
                  <span>{event.progress} raised</span>
                  <small>{event.endDate}</small>
                </div>

                <div className="dashboard-event-progress">
                  <div style={{ width: event.progress }} />
                </div>

                <div className="dashboard-event-meta">
                  <div>
                    <UsersRound size={16} />
                    {event.contributors} contributors
                  </div>

                  <div className="event-status active">
                    <CheckCircle2 size={15} />
                    Active
                  </div>
                </div>

                <div className="dashboard-event-actions">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        isMyEvents
                          ? `/dashboard/events/${event.id}/edit`
                          : `/events/${event.id}`
                      )
                    }
                  >
                    <Eye size={17} />
                    {isMyEvents ? "Edit" : "View"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyLink(event.id)}
                  >
                    <Share2 size={17} />
                    Share
                  </button>

                  {isMyEvents && (
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={deletingId === event.id}
                      style={{
                        color: "#E50914",
                      }}
                    >
                      <Trash2 size={17} />
                      {deletingId === event.id ? "Deleting..." : "Delete"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        isMyEvents
                          ? `/events/${event.id}`
                          : `/events/${event.id}/contribute`
                      )
                    }
                  >
                    {isMyEvents ? (
                      <QrCode size={17} />
                    ) : (
                      <ArrowRight size={17} />
                    )}

                    {isMyEvents ? "QR" : "Contribute"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

        {isMyEvents && (
          <section className="dashboard-events-content-grid">
            <div className="dashboard-events-panel large">
              <div className="dashboard-events-panel-heading">
                <div>
                  <span>Recent Event Activity</span>
                  <h3>Event system ready</h3>
                </div>

                <Clock size={22} />
              </div>

              <div className="dashboard-events-activity-list">
                <p>
                  <CheckCircle2 size={16} />
                  Events shown above are now live on Contriba.
                </p>

                <p>
                  <Eye size={16} />
                  Every event you create will automatically appear here.
                </p>

                <p>
                  <Share2 size={16} />
                  Share, Edit and Delete are connected. QR generation is coming soon.
                </p>

                <p>
                  <Copy size={16} />
                  Fake dashboard data has been removed.
                </p>
              </div>
            </div>

            <div className="dashboard-events-panel">
              <div className="dashboard-events-panel-heading">
                <div>
                  <span>Next Best Action</span>
                  <h3>QR Generator Coming Soon</h3>
                </div>

                <Sparkles size={22} />
              </div>

              <div className="dashboard-events-recommendation">
                <strong>Edit and Delete Event are now connected.</strong>

                <p>
                  Your dashboard can now open events for editing, delete events
                  from your event center and copy public event links. QR generation is
                  still coming soon.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/create-event")}
                >
                  Create Another Event
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default DashboardEvents;