import {
  BarChart3,
  Bell,
  CalendarDays,
  FileText,
  Home,
  Menu,
  Plus,
  Settings,
  Share2,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { getUser } from "../api/api";
import logoIcon from "../../assets/logo-icon.png";
import "./AppSidebar.css";

const navItems = [
  { label: "Dashboard", icon: BarChart3, path: "/dashboard", key: "dashboard" },
  { label: "Events", icon: CalendarDays, path: "/dashboard/events", key: "events" },
  { label: "Wallet", icon: WalletCards, path: "/wallet", key: "wallet" },
  { label: "Contributors", icon: UsersRound, path: "/contributors", key: "contributors" },
  { label: "Reports", icon: FileText, path: "/reports", key: "reports" },
  { label: "Notifications", icon: Bell, path: "/notifications", key: "notifications" },
  { label: "Share Center", icon: Share2, path: "/share", key: "share" },
  { label: "Profile", icon: UserRound, path: "/profile", key: "profile" },
  { label: "Settings", icon: Settings, path: "/settings", key: "settings" },
];

const bottomNavItems = [
  { label: "Home", icon: Home, path: "/home", key: "home" },
  { label: "Dashboard", icon: BarChart3, path: "/dashboard", key: "dashboard" },
  { label: "Wallet", icon: WalletCards, path: "/wallet", key: "wallet" },
  { label: "Notifs", icon: Bell, path: "/notifications", key: "notifications" },
  { label: "Profile", icon: UserRound, path: "/profile", key: "profile" },
];

function getUserInitials(user) {
  const name = user?.name || "U";
  const parts = String(name).trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function AppSidebar({ active = "dashboard" }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const currentUser = getUser();
  const initials = getUserInitials(currentUser);

  return (
    <>
      {/* ══════════════════════════════
          DESKTOP SIDEBAR
      ══════════════════════════════ */}
      <aside className="app-sidebar">
        <Link to="/" className="app-sidebar-brand">
          <img src={logoIcon} alt="Contriba" />
          <span>Contriba</span>
        </Link>

        <nav className="app-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                to={item.path}
                className={active === item.key ? "active" : ""}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link to="/create-event" className="app-sidebar-create">
          <Plus size={18} />
          Create Event
        </Link>

        <div className="app-sidebar-card">
          <span>Contriba OS</span>
          <h3>Financial Operating System</h3>
          <p>
            Manage events, contributors, payments, reports, reminders and
            withdrawals from one premium command center.
          </p>
        </div>
      </aside>

      {/* ══════════════════════════════
          MOBILE TOP BAR
      ══════════════════════════════ */}
      <div className="mobile-topbar">
        <Link to="/" className="mobile-topbar-brand">
          <img src={logoIcon} alt="Contriba" />
          <span>Contriba</span>
        </Link>

        <div className="mobile-topbar-actions">
          {/* Bell icon */}
          <Link
            to="/notifications"
            className="mobile-topbar-btn"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </Link>

          {/* Avatar */}
          {currentUser ? (
            <Link to="/profile" className="mobile-topbar-avatar">
              {currentUser.avatar_url ? (
                <img src={currentUser.avatar_url} alt="Profile" />
              ) : (
                <span>{initials}</span>
              )}
            </Link>
          ) : null}

          {/* Create Event */}
          <Link to="/create-event" className="mobile-topbar-create">
            <Plus size={15} />
            New
          </Link>

          {/* Hamburger */}
          <button
            className="mobile-topbar-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════
          MOBILE DRAWER OVERLAY
      ══════════════════════════════ */}
      <div
        className={`mobile-menu-overlay ${drawerOpen ? "open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ══════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════ */}
      <div className={`mobile-menu-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <Link
            to="/"
            className="mobile-drawer-brand"
            onClick={() => setDrawerOpen(false)}
          >
            <img src={logoIcon} alt="Contriba" />
            <span>Contriba</span>
          </Link>
          <button
            className="mobile-drawer-close"
            onClick={() => setDrawerOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* User info in drawer */}
        {currentUser && (
          <div className="mobile-drawer-user">
            <div className="mobile-drawer-user-avatar">
              {currentUser.avatar_url ? (
                <img src={currentUser.avatar_url} alt="Profile" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div>
              <strong>{currentUser.name || "Organizer"}</strong>
              <small>{currentUser.phone || ""}</small>
            </div>
          </div>
        )}

        <nav className="mobile-drawer-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                to={item.path}
                className={active === item.key ? "active" : ""}
                onClick={() => setDrawerOpen(false)}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/create-event"
          className="mobile-drawer-create"
          onClick={() => setDrawerOpen(false)}
        >
          <Plus size={18} />
          Create Event
        </Link>
      </div>

      {/* ══════════════════════════════
          MOBILE BOTTOM NAVIGATION
      ══════════════════════════════ */}
      <nav className="mobile-bottom-nav">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              to={item.path}
              className={active === item.key ? "active" : ""}
            >
              <Icon size={22} />
              {item.label}
            </Link>
          );
        })}

        <Link to="/create-event" className="mobile-bottom-create">
          <Plus size={22} />
        </Link>
      </nav>
    </>
  );
}

export default AppSidebar;