import {
  BarChart3,
  Bell,
  CalendarDays,
  FileText,
  Home,
  Lock,
  Menu,
  Plus,
  Settings,
  Share2,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getUser } from "../api/api";
import "./AppSidebar.css";

const publicNavItems = [
  { label: "Home", icon: Home, path: "/home", key: "home" },
];

const organizerNavItems = [
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

const guestNavItems = [
  { label: "Dashboard", icon: Lock, path: "/login", key: "dashboard" },
  { label: "Events", icon: Lock, path: "/login", key: "events" },
  { label: "Wallet", icon: Lock, path: "/login", key: "wallet" },
  { label: "Contributors", icon: Lock, path: "/login", key: "contributors" },
  { label: "Reports", icon: Lock, path: "/login", key: "reports" },
  { label: "Notifications", icon: Lock, path: "/login", key: "notifications" },
  { label: "Share Center", icon: Lock, path: "/login", key: "share" },
  { label: "Profile", icon: Lock, path: "/login", key: "profile" },
  { label: "Settings", icon: Lock, path: "/login", key: "settings" },
];

function getUserInitials(user) {
  const name = user?.name || "U";
  const parts = String(name).trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function AppSidebar({ active = "home" }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("contriba-sidebar-collapsed") === "true";
  });

  const currentUser = getUser();
  const isOrganizer = Boolean(currentUser);
  const initials = getUserInitials(currentUser);
  const navItems = [...publicNavItems, ...(isOrganizer ? organizerNavItems : guestNavItems)];

  useEffect(() => {
    document.body.classList.toggle("contriba-sidebar-collapsed", collapsed);
    window.localStorage.setItem("contriba-sidebar-collapsed", String(collapsed));

    return () => {
      document.body.classList.remove("contriba-sidebar-collapsed");
    };
  }, [collapsed]);

  const bottomNavItems = isOrganizer
    ? [
        { label: "Home", icon: Home, path: "/home", key: "home" },
        { label: "Dashboard", icon: BarChart3, path: "/dashboard", key: "dashboard" },
        { label: "Wallet", icon: WalletCards, path: "/wallet", key: "wallet" },
        { label: "Notifs", icon: Bell, path: "/notifications", key: "notifications" },
        { label: "Profile", icon: UserRound, path: "/profile", key: "profile" },
      ]
    : [
        { label: "Home", icon: Home, path: "/home", key: "home" },
        { label: "Login", icon: UserRound, path: "/login", key: "login" },
      ];

  const renderNav = (items, onClick) =>
    items.map((item) => {
      const Icon = item.icon;
      return (
        <Link
          key={`${item.key}-${item.label}`}
          to={item.path}
          className={active === item.key ? "active" : ""}
          onClick={onClick}
          title={collapsed ? item.label : undefined}
        >
          <Icon size={22} />
          <span className="app-sidebar-label">{item.label}</span>
        </Link>
      );
    });

  return (
    <>
      <aside className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="app-sidebar-top">
          <button
            type="button"
            className="app-sidebar-toggle"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu size={21} />
          </button>

          <Link to="/home" className="app-sidebar-brand" aria-label="Contriba home">
            <span className="app-sidebar-brand-full">Contriba</span>
            <span className="app-sidebar-brand-subtitle">Contribute easily</span>
            <span className="app-sidebar-brand-mini">CO</span>
          </Link>
        </div>

        {!isOrganizer && (
          <div className="app-sidebar-lock-card">
            <Lock size={17} />
            <div>
              <strong>Organizer tools locked</strong>
              <small>Create an account to manage events, wallet and reports.</small>
            </div>
          </div>
        )}

        <nav className="app-sidebar-nav">{renderNav(navItems)}</nav>

        <Link
          to={isOrganizer ? "/create-event" : "/register"}
          className="app-sidebar-create"
          title={collapsed ? (isOrganizer ? "Create Event" : "Create Account") : undefined}
        >
          <Plus size={22} />
          <span className="app-sidebar-label">{isOrganizer ? "Create Event" : "Create Account"}</span>
        </Link>

        <div className="app-sidebar-footer">
          <p>© 2026 Contriba</p>
          <div className="app-sidebar-footer-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Support</Link>
          </div>
        </div>
      </aside>

      <div className="mobile-topbar">
        <Link to="/home" className="mobile-topbar-brand">
          <span>Contriba</span>
        </Link>

        <div className="mobile-topbar-actions">
          {isOrganizer && (
            <Link to="/notifications" className="mobile-topbar-btn" aria-label="Notifications">
              <Bell size={20} />
            </Link>
          )}

          {isOrganizer ? (
            <Link to="/profile" className="mobile-topbar-avatar">
              {currentUser.avatar_url ? <img src={currentUser.avatar_url} alt="Profile" /> : <span>{initials}</span>}
            </Link>
          ) : (
            <Link to="/login" className="mobile-topbar-login">Login</Link>
          )}

          <Link to={isOrganizer ? "/create-event" : "/register"} className="mobile-topbar-create">
            <Plus size={15} />
            {isOrganizer ? "New" : "Join"}
          </Link>

          <button className="mobile-topbar-btn" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
        </div>
      </div>

      <div className={`mobile-menu-overlay ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} />

      <div className={`mobile-menu-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <Link to="/home" className="mobile-drawer-brand" onClick={() => setDrawerOpen(false)}>
            <span>Contriba</span>
          </Link>
          <button className="mobile-drawer-close" onClick={() => setDrawerOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {isOrganizer ? (
          <div className="mobile-drawer-user">
            <div className="mobile-drawer-user-avatar">
              {currentUser.avatar_url ? <img src={currentUser.avatar_url} alt="Profile" /> : <span>{initials}</span>}
            </div>
            <div>
              <strong>{currentUser.name || "Organizer"}</strong>
              <small>{currentUser.phone || "Organizer workspace"}</small>
            </div>
          </div>
        ) : (
          <div className="mobile-drawer-user locked">
            <div className="mobile-drawer-user-avatar"><Lock size={18} /></div>
            <div>
              <strong>Guest mode</strong>
              <small>Sign up to unlock organizer tools.</small>
            </div>
          </div>
        )}

        <nav className="mobile-drawer-nav">{renderNav(navItems, () => setDrawerOpen(false))}</nav>

        <Link to={isOrganizer ? "/create-event" : "/register"} className="mobile-drawer-create" onClick={() => setDrawerOpen(false)}>
          <Plus size={18} />
          {isOrganizer ? "Create Event" : "Create Account"}
        </Link>
      </div>

      <nav className="mobile-bottom-nav">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.key} to={item.path} className={active === item.key ? "active" : ""}>
              <Icon size={22} />
              {item.label}
            </Link>
          );
        })}

        <Link to={isOrganizer ? "/create-event" : "/register"} className="mobile-bottom-create">
          <Plus size={22} />
        </Link>
      </nav>
    </>
  );
}

export default AppSidebar;
