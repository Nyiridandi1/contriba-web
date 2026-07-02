import {
  BarChart3,
  Bell,
  CalendarDays,
  FileText,
  Plus,
  Settings,
  Share2,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";

import logoIcon from "../../assets/logo-icon.png";
import "./AppSidebar.css";

function AppSidebar({ active = "dashboard" }) {
  return (
    <aside className="app-sidebar">
      <Link to="/" className="app-sidebar-brand">
        <img src={logoIcon} alt="Contriba" />
        <span>Contriba</span>
      </Link>

      <nav className="app-sidebar-nav">
        <Link
          to="/dashboard"
          className={active === "dashboard" ? "active" : ""}
        >
          <BarChart3 size={18} />
          Dashboard
        </Link>

        <Link
          to="/dashboard/events"
          className={active === "events" ? "active" : ""}
        >
          <CalendarDays size={18} />
          Events
        </Link>

        <Link to="/wallet" className={active === "wallet" ? "active" : ""}>
          <WalletCards size={18} />
          Wallet
        </Link>

        <Link
          to="/contributors"
          className={active === "contributors" ? "active" : ""}
        >
          <UsersRound size={18} />
          Contributors
        </Link>

        <Link to="/reports" className={active === "reports" ? "active" : ""}>
          <FileText size={18} />
          Reports
        </Link>

        <Link
          to="/notifications"
          className={active === "notifications" ? "active" : ""}
        >
          <Bell size={18} />
          Notifications
        </Link>

        <Link to="/share" className={active === "share" ? "active" : ""}>
          <Share2 size={18} />
          Share Center
        </Link>

        <Link to="/profile" className={active === "profile" ? "active" : ""}>
          <UserRound size={18} />
          Profile
        </Link>

        <Link
          to="/settings"
          className={active === "settings" ? "active" : ""}
        >
          <Settings size={18} />
          Settings
        </Link>
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
  );
}

export default AppSidebar;