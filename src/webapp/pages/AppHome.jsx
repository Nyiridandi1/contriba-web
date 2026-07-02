import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CakeSlice,
  Church,
  Filter,
  GraduationCap,
  HandCoins,
  HeartHandshake,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getEvents } from "../api/api";
import { useAuth } from "../context/AuthContext";

import logoIcon from "../../assets/logo-icon.png";
import EventCard from "../components/events/EventCard";
import EventCategoryPill from "../components/events/EventCategoryPill";
import AppSidebar from "../components/AppSidebar";

import "./AppHome.css";

const categories = [
  { Icon: Sparkles, label: "All", active: true },
  { Icon: HeartHandshake, label: "Wedding" },
  { Icon: GraduationCap, label: "Graduation" },
  { Icon: CakeSlice, label: "Birthday" },
  { Icon: Church, label: "Church" },
  { Icon: HandCoins, label: "Fundraiser" },
];

const fallbackImage =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

function getStoredUser() {
  try {
    const savedUser = localStorage.getItem("contriba_user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

function getUserInitials(user) {
  const name = user?.name || user?.full_name || "Contriba User";
  const parts = String(name).trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatDaysLeft(date) {
  if (!date) return "Open";
  const eventDate = new Date(date);
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
  return {
    id: event.id,
    title: event.title || "Untitled Event",
    category: event.type || event.category || "Event",
    location: event.location || "Rwanda",
    raised: Number(event.total_raised || 0),
    target: Number(event.goal_amount || 0),
    contributors: Number(event.total_contributors || 0),
    daysLeft: formatDaysLeft(event.date),
    image: event.cover_image || event.photo_url || fallbackImage,
  };
}

function AppHome() {
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated;
  const authUser = auth?.user;
  const storedUser = getStoredUser();
  const currentUser = authUser || storedUser;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const normalizedEvents = useMemo(
    () => events.map((event) => normalizeEvent(event)),
    [events]
  );

  const userInitials = getUserInitials(currentUser);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      setMessage("");
      const result = await getEvents();
      if (!result.success) {
        setMessage(result.message || "Failed to load events.");
        setEvents([]);
        setLoading(false);
        return;
      }
      setEvents(result.events || []);
      setLoading(false);
    }
    loadEvents();
  }, []);

  return (
    <main className="app-home-page">

      {/* ── Desktop sidebar ── */}
      <aside className="app-home-sidebar">
        <div>
          <Link to="/" className="app-home-brand">
            <img src={logoIcon} alt="Contriba" />
            <div>
              <strong>Contriba</strong>
              <span>Contribute easily</span>
            </div>
          </Link>

          <nav className="app-home-nav">
            <Link to="/home" className="active">
              <Sparkles size={18} />
              <span>Home</span>
            </Link>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <ShieldCheck size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to={isAuthenticated ? "/wallet" : "/register"}>
              <HeartHandshake size={18} />
              <span>Wallet</span>
            </Link>
            <Link to={isAuthenticated ? "/notifications" : "/register"}>
              <Bell size={18} />
              <span>Notifications</span>
            </Link>
            <Link to={isAuthenticated ? "/profile" : "/register"}>
              <UserRound size={18} />
              <span>Profile</span>
            </Link>
          </nav>

          <Link
            to={isAuthenticated ? "/create-event" : "/register"}
            className="app-home-create"
          >
            + Create Event
          </Link>
        </div>

        <div className="app-home-sidebar-bottom">
          <div className="app-home-sidebar-card">
            <div className="app-home-sidebar-card-icon">
              <Sparkles size={20} />
            </div>
            <h4>{isAuthenticated ? "Organizer Mode" : "Guest Mode"}</h4>
            <p>
              {isAuthenticated
                ? "Create events, track contributions and manage your organizer tools."
                : "Browse public events freely. Create an account to unlock your organizer dashboard, wallet and reports."}
            </p>
            <Link to={isAuthenticated ? "/create-event" : "/register"}>
              {isAuthenticated ? "Create Event" : "Create Free Account"}
            </Link>
          </div>

          <div className="app-home-sidebar-footer">
            <span>Contriba Web V2</span>
            <div>
              <Link to="/privacy">Privacy</Link>
              <Link to="/contact">Support</Link>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile top bar + bottom nav via AppSidebar ── */}
      <AppSidebar active="home" />

      <section className="app-home-main">
        <header className="app-home-topbar">
          <div>
            <span>Public events</span>
            <h1>Discover events</h1>
            <p>
              Browse real weddings, graduations, birthdays, church events and
              fundraisers people are supporting right now.
            </p>
          </div>

          <div className="app-home-top-actions">
            <div className="app-home-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search events, people or locations..."
              />
            </div>

            <button type="button">
              <Filter size={18} />
              Filters
            </button>

            <Link
              to={isAuthenticated ? "/notifications" : "/login"}
              className="app-home-icon-action"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </Link>

            {isAuthenticated && (
              <Link to="/profile" className="app-home-user-avatar">
                <span className="app-home-user-online"></span>
                {currentUser?.avatar_url ? (
                  <img src={currentUser.avatar_url} alt="Profile" />
                ) : (
                  <strong>{userInitials}</strong>
                )}
              </Link>
            )}
          </div>
        </header>

        {!isAuthenticated && (
          <section className="app-home-lock-banner">
            <div className="app-home-lock-badge">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3>Organizer tools unlock after account creation</h3>
              <p>
                Browse and contribute now. Create an account to manage events,
                wallet, reports, notifications and settings.
              </p>
            </div>
            <div className="app-home-lock-actions">
              <Link to="/login">Login</Link>
              <Link to="/register">Create Account</Link>
            </div>
          </section>
        )}

        <section className="app-home-categories">
          {categories.map((category) => (
            <EventCategoryPill
              key={category.label}
              Icon={category.Icon}
              label={category.label}
              active={category.active}
            />
          ))}
        </section>

        <section className="app-home-section-header">
          <div>
            <span>Live events</span>
            <h2>Popular Events</h2>
          </div>
          <p></p>
        </section>

        {loading && (
          <section className="app-home-empty-state">
            <h3>Loading events...</h3>
            <p>Preparing public events for you...</p>
          </section>
        )}

        {!loading && message && (
          <section className="app-home-empty-state">
            <h3>Could not load events</h3>
            <p>{message}</p>
          </section>
        )}

        {!loading && !message && normalizedEvents.length === 0 && (
          <section className="app-home-empty-state">
            <h3>No public events yet</h3>
            <p>Create the first event and it will appear here.</p>
            <Link to={isAuthenticated ? "/create-event" : "/register"}>
              Create Event
            </Link>
          </section>
        )}

        {!loading && !message && normalizedEvents.length > 0 && (
          <section className="app-home-events-grid">
            {normalizedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

export default AppHome;