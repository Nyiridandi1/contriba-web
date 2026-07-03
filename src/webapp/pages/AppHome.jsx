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
  X,
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
  { Icon: Sparkles, label: "All" },
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

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filterFunded, setFilterFunded] = useState("all");

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

  const normalizedEvents = useMemo(
    () => events.map((event) => normalizeEvent(event)),
    [events]
  );

  const filteredEvents = useMemo(() => {
    let result = [...normalizedEvents];

    if (activeCategory !== "All") {
      result = result.filter(
        (event) =>
          event.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (event) =>
          event.title?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query) ||
          event.category?.toLowerCase().includes(query)
      );
    }

    if (filterFunded === "active") {
      result = result.filter((event) => event.daysLeft !== "Ended");
    } else if (filterFunded === "ended") {
      result = result.filter((event) => event.daysLeft === "Ended");
    } else if (filterFunded === "funded") {
      result = result.filter(
        (event) => event.target > 0 && event.raised >= event.target
      );
    }

    if (sortBy === "most_raised") {
      result.sort((a, b) => b.raised - a.raised);
    } else if (sortBy === "most_contributors") {
      result.sort((a, b) => b.contributors - a.contributors);
    } else if (sortBy === "ending_soon") {
      result.sort((a, b) => {
        if (a.daysLeft === "Ended") return 1;
        if (b.daysLeft === "Ended") return -1;
        return 0;
      });
    }

    return result;
  }, [normalizedEvents, searchQuery, activeCategory, sortBy, filterFunded]);

  function clearSearch() {
    setSearchQuery("");
    setActiveCategory("All");
    setFilterFunded("all");
    setSortBy("newest");
  }

  const hasActiveFilters =
    searchQuery ||
    activeCategory !== "All" ||
    filterFunded !== "all" ||
    sortBy !== "newest";

  return (
    <main className="app-home-page">
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
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />

              {searchQuery && (
                <button
                  className="app-home-search-clear"
                  onClick={() => setSearchQuery("")}
                  type="button"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              type="button"
              className={showFilters ? "active" : ""}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filters
              {hasActiveFilters && <span className="filter-dot" />}
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

        {showFilters && (
          <div className="app-home-filter-panel">
            <div className="filter-panel-inner">
              <div className="filter-group">
                <label>Sort by</label>

                <div className="filter-chips">
                  {[
                    { value: "newest", label: "Newest" },
                    { value: "most_raised", label: "Most Raised" },
                    { value: "most_contributors", label: "Most Contributors" },
                    { value: "ending_soon", label: "Ending Soon" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={sortBy === option.value ? "active" : ""}
                      onClick={() => setSortBy(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label>Status</label>

                <div className="filter-chips">
                  {[
                    { value: "all", label: "All Events" },
                    { value: "active", label: "Active" },
                    { value: "ended", label: "Ended" },
                    { value: "funded", label: "Fully Funded" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={filterFunded === option.value ? "active" : ""}
                      onClick={() => setFilterFunded(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="filter-clear-btn"
                  onClick={clearSearch}
                >
                  <X size={14} />
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}

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
              active={activeCategory === category.label}
              onClick={() => setActiveCategory(category.label)}
            />
          ))}
        </section>

        <section className="app-home-section-header">
          <div>
            <span>{hasActiveFilters ? "Search results" : "Live events"}</span>
            <h2>
              {hasActiveFilters
                ? `${filteredEvents.length} event${
                    filteredEvents.length !== 1 ? "s" : ""
                  } found`
                : "Popular Events"}
            </h2>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="app-home-clear-btn"
              onClick={clearSearch}
            >
              <X size={14} />
              Clear
            </button>
          )}
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

        {!loading && !message && filteredEvents.length === 0 && (
          <section className="app-home-empty-state contriba-empty-state">
            <div className="contriba-empty-icon">
              <Sparkles size={30} />
            </div>

            <span className="contriba-empty-label">
              {hasActiveFilters
                ? "No results found"
                : "Start the first contribution story"}
            </span>

            <h3>
              {hasActiveFilters
                ? "No events match your search"
                : "No public events yet"}
            </h3>

            <p>
              {hasActiveFilters
                ? "Try another keyword, category or clear your filters to explore more events."
                : "Be the first organizer to create a beautiful contribution page for a wedding, graduation, birthday, church event or fundraiser."}
            </p>

            <div className="contriba-empty-actions">
              {hasActiveFilters ? (
                <button type="button" onClick={clearSearch}>
                  Clear filters
                </button>
              ) : (
                <Link to={isAuthenticated ? "/create-event" : "/register"}>
                  Create First Event
                </Link>
              )}
            </div>

            {!hasActiveFilters && (
              <div className="contriba-empty-trust">
                <span>Secure contributions</span>
                <span>Mobile money ready</span>
                <span>Shareable event link</span>
              </div>
            )}
          </section>
        )}

        {!loading && !message && filteredEvents.length > 0 && (
          <section className="app-home-events-grid">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

export default AppHome;