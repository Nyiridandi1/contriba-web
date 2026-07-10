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
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getUser } from "../api/api";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { translations } from "../../i18n/translations.js";
import "./AppSidebar.css";

function getText(language, key, fallback) {
  return translations?.[language]?.[key] || translations?.English?.[key] || fallback;
}

function getUserInitials(user) {
  const name = user?.name || "U";
  const parts = String(name).trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function AppSidebar({ active = "home" }) {
  const { language } = useLanguage();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("contriba-sidebar-collapsed") === "true";
  });

  const t = (key, fallback) => getText(language, key, fallback);

  const currentUser = getUser();
  const isOrganizer = Boolean(currentUser);
  const initials = getUserInitials(currentUser);

  const publicNavItems = useMemo(
    () => [{ label: t("home", "Home"), icon: Home, path: "/home", key: "home" }],
    [language]
  );

  const organizerNavItems = useMemo(
    () => [
      { label: t("dashboard", "Dashboard"), icon: BarChart3, path: "/dashboard", key: "dashboard" },
      { label: t("events", "Events"), icon: CalendarDays, path: "/dashboard/events", key: "events" },
      { label: t("wallet", "Wallet"), icon: WalletCards, path: "/wallet", key: "wallet" },
      { label: t("contributors", "Contributors"), icon: UsersRound, path: "/contributors", key: "contributors" },
      { label: t("reports", "Reports"), icon: FileText, path: "/reports", key: "reports" },
      { label: t("notifications", "Notifications"), icon: Bell, path: "/notifications", key: "notifications" },
      { label: t("share_center", "Share Center"), icon: Share2, path: "/share", key: "share" },
      { label: t("profile", "Profile"), icon: UserRound, path: "/profile", key: "profile" },
      { label: t("settings", "Settings"), icon: Settings, path: "/settings", key: "settings" },
    ],
    [language]
  );

  const guestNavItems = useMemo(
    () => [
      { label: t("dashboard", "Dashboard"), icon: Lock, path: "/login", key: "dashboard" },
      { label: t("events", "Events"), icon: Lock, path: "/login", key: "events" },
      { label: t("wallet", "Wallet"), icon: Lock, path: "/login", key: "wallet" },
      { label: t("contributors", "Contributors"), icon: Lock, path: "/login", key: "contributors" },
      { label: t("reports", "Reports"), icon: Lock, path: "/login", key: "reports" },
      { label: t("notifications", "Notifications"), icon: Lock, path: "/login", key: "notifications" },
      { label: t("share_center", "Share Center"), icon: Lock, path: "/login", key: "share" },
      { label: t("profile", "Profile"), icon: Lock, path: "/login", key: "profile" },
      { label: t("settings", "Settings"), icon: Lock, path: "/login", key: "settings" },
    ],
    [language]
  );

  const navItems = useMemo(
    () => [...publicNavItems, ...(isOrganizer ? organizerNavItems : guestNavItems)],
    [publicNavItems, organizerNavItems, guestNavItems, isOrganizer]
  );

  const bottomNavItems = useMemo(
    () =>
      isOrganizer
        ? [
            { label: t("home", "Home"), icon: Home, path: "/home", key: "home" },
            { label: t("dashboard", "Dashboard"), icon: BarChart3, path: "/dashboard", key: "dashboard" },
            { label: t("notifications_short", "Notifs"), icon: Bell, path: "/notifications", key: "notifications" },
            { label: t("profile", "Profile"), icon: UserRound, path: "/profile", key: "profile" },
          ]
        : [
            { label: t("home", "Home"), icon: Home, path: "/home", key: "home" },
            { label: t("login", "Login"), icon: UserRound, path: "/login", key: "login" },
          ],
    [isOrganizer, language]
  );

  useEffect(() => {
    document.body.classList.toggle("contriba-sidebar-collapsed", collapsed);
    window.localStorage.setItem("contriba-sidebar-collapsed", String(collapsed));

    return () => {
      document.body.classList.remove("contriba-sidebar-collapsed");
    };
  }, [collapsed]);

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
            aria-label={
              collapsed
                ? t("expand_sidebar", "Expand sidebar")
                : t("collapse_sidebar", "Collapse sidebar")
            }
            title={
              collapsed
                ? t("expand_sidebar", "Expand sidebar")
                : t("collapse_sidebar", "Collapse sidebar")
            }
          >
            <Menu size={21} />
          </button>

          <Link to="/home" className="app-sidebar-brand" aria-label="Contriba home">
            <span className="app-sidebar-brand-full">Contriba</span>
            <span className="app-sidebar-brand-subtitle">{t("contribute_easily", "Contribute easily")}</span>
            <span className="app-sidebar-brand-mini">CO</span>
          </Link>
        </div>

        {!isOrganizer && (
          <div className="app-sidebar-lock-card">
            <Lock size={17} />
            <div>
              <strong>{t("organizer_tools_locked", "Organizer tools locked")}</strong>
              <small>{t("organizer_tools_locked_desc", "Create an account to manage events, wallet and reports.")}</small>
            </div>
          </div>
        )}

        <nav className="app-sidebar-nav">{renderNav(navItems)}</nav>

        <Link
          to={isOrganizer ? "/create-event" : "/register"}
          className="app-sidebar-create"
          title={collapsed ? (isOrganizer ? t("create_event", "Create Event") : t("create_account", "Create Account")) : undefined}
        >
          <Plus size={22} />
          <span className="app-sidebar-label">
            {isOrganizer ? t("create_event", "Create Event") : t("create_account", "Create Account")}
          </span>
        </Link>

        <div className="app-sidebar-footer">
          <p>© 2026 Contriba</p>
          <div className="app-sidebar-footer-links">
            <Link to="/privacy">{t("privacy", "Privacy")}</Link>
            <Link to="/terms">{t("terms", "Terms")}</Link>
            <Link to="/contact">{t("support", "Support")}</Link>
          </div>
        </div>
      </aside>

      <div className="mobile-topbar">
        <Link to="/home" className="mobile-topbar-brand">
          <span>Contriba</span>
        </Link>

        <div className="mobile-topbar-actions">
          {isOrganizer && (
            <Link to="/notifications" className="mobile-topbar-btn" aria-label={t("notifications", "Notifications")}>
              <Bell size={20} />
            </Link>
          )}

          {isOrganizer ? (
            <Link to="/profile" className="mobile-topbar-avatar">
              {currentUser.avatar_url ? <img src={currentUser.avatar_url} alt={t("profile", "Profile")} /> : <span>{initials}</span>}
            </Link>
          ) : (
            <Link to="/login" className="mobile-topbar-login">{t("login", "Login")}</Link>
          )}

          <Link to={isOrganizer ? "/create-event" : "/register"} className="mobile-topbar-create">
            <Plus size={15} />
            {isOrganizer ? t("new", "New") : t("join", "Join")}
          </Link>

          <button className="mobile-topbar-btn" onClick={() => setDrawerOpen(true)} aria-label={t("open_menu", "Open menu")}>
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
              {currentUser.avatar_url ? <img src={currentUser.avatar_url} alt={t("profile", "Profile")} /> : <span>{initials}</span>}
            </div>
            <div>
              <strong>{currentUser.name || t("organizer", "Organizer")}</strong>
              <small>{currentUser.phone || t("organizer_workspace", "Organizer workspace")}</small>
            </div>
          </div>
        ) : (
          <div className="mobile-drawer-user locked">
            <div className="mobile-drawer-user-avatar"><Lock size={18} /></div>
            <div>
              <strong>{t("guest_mode", "Guest mode")}</strong>
              <small>{t("guest_mode_desc", "Sign up to unlock organizer tools.")}</small>
            </div>
          </div>
        )}

        <nav className="mobile-drawer-nav">{renderNav(navItems, () => setDrawerOpen(false))}</nav>

        <Link to={isOrganizer ? "/create-event" : "/register"} className="mobile-drawer-create" onClick={() => setDrawerOpen(false)}>
          <Plus size={18} />
          {isOrganizer ? t("create_event", "Create Event") : t("create_account", "Create Account")}
        </Link>
      </div>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {bottomNavItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.key} to={item.path} className={active === item.key ? "active" : ""}>
              <Icon size={21} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <Link
          to={isOrganizer ? "/create-event" : "/register"}
          className="mobile-bottom-create"
          aria-label={isOrganizer ? t("create_event", "Create Event") : t("create_account", "Create Account")}
        >
          <Plus size={24} />
        </Link>

        {bottomNavItems.slice(2).map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.key} to={item.path} className={active === item.key ? "active" : ""}>
              <Icon size={21} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default AppSidebar;
