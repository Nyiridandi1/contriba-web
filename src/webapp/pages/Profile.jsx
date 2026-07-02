import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Edit3,
  Eye,
  Globe,
  KeyRound,
  Languages,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  TrendingUp,
  UserRound,
  WalletCards,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import "./Profile.css";

const profileStats = [
  {
    title: "Total Events",
    value: "12",
    note: "8 completed",
    icon: CalendarDays,
  },
  {
    title: "Total Collected",
    value: "RWF 18.4M",
    note: "Across all events",
    icon: TrendingUp,
  },
  {
    title: "Contributors",
    value: "1,420",
    note: "Trusted supporters",
    icon: UserRound,
  },
  {
    title: "Success Rate",
    value: "94%",
    note: "Strong organizer profile",
    icon: ShieldCheck,
  },
];

const personalInfo = [
  {
    label: "Full Name",
    value: "ISHIMWE Olivier",
    icon: UserRound,
  },
  {
    label: "Email",
    value: "olivier@contriba.rw",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "+250 788 123 456",
    icon: Phone,
  },
  {
    label: "Location",
    value: "Kigali, Rwanda",
    icon: MapPin,
  },
  {
    label: "Country",
    value: "Rwanda",
    icon: Globe,
  },
  {
    label: "Language",
    value: "English / Kinyarwanda",
    icon: Languages,
  },
];

const verificationItems = [
  {
    title: "Phone Verified",
    description: "Your primary phone number is verified.",
    status: "Verified",
    icon: Phone,
  },
  {
    title: "Email Verified",
    description: "Your email can receive reports and receipts.",
    status: "Verified",
    icon: Mail,
  },
  {
    title: "Identity Verification",
    description: "Your organizer identity is under review.",
    status: "Review",
    icon: BadgeCheck,
  },
  {
    title: "Bank Verification",
    description: "Bank account verification improves withdrawal trust.",
    status: "Pending",
    icon: Building2,
  },
];

const paymentAccounts = [
  {
    title: "MTN MoMo",
    detail: "+250 788 123 456",
    status: "Primary",
    icon: Smartphone,
  },
  {
    title: "Airtel Money",
    detail: "+250 732 444 220",
    status: "Connected",
    icon: Smartphone,
  },
  {
    title: "Bank Account",
    detail: "Bank of Kigali • **** 4821",
    status: "Pending",
    icon: CreditCard,
  },
];

const recentActivity = [
  "Created Jean & Alice Wedding event",
  "Generated financial report",
  "Added MTN MoMo withdrawal account",
  "Updated profile information",
  "Enabled AI recommendations",
];

function Profile() {
  return (
    <main className="profile-page">
      <AppSidebar active="profile" />

      <section className="profile-main">
        <header className="profile-topbar">
          <div>
            <span>Profile Center</span>
            <h1>Organizer account and trust profile</h1>
            <p>
              Manage your personal information, verification status, payment
              accounts, security settings and organizer reputation.
            </p>
          </div>

          <div className="profile-top-actions">
            <button>
              <Eye size={18} />
              View Public
            </button>

            <button className="red">
              <Edit3 size={18} />
              Edit Profile
            </button>
          </div>
        </header>

        <section className="profile-hero">
          <div className="profile-hero-left">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">OI</div>

              <span>
                <BadgeCheck size={15} />
                Verified Organizer
              </span>
            </div>

            <h2>ISHIMWE Olivier</h2>

            <p>
              Premium Contriba organizer managing event contributions,
              contributor relationships, reports, wallet withdrawals and
              campaign growth from one trusted profile.
            </p>

            <div className="profile-hero-meta">
              <div>
                <Mail size={16} />
                olivier@contriba.rw
              </div>

              <div>
                <Phone size={16} />
                +250 788 123 456
              </div>

              <div>
                <MapPin size={16} />
                Kigali, Rwanda
              </div>
            </div>
          </div>

          <div className="profile-hero-card">
            <Sparkles size={28} />
            <span>AI Profile Insight</span>
            <strong>Your profile is 95% complete.</strong>
            <p>
              Verify your bank account and add organization details to increase
              contributor trust.
            </p>
          </div>
        </section>

        <section className="profile-stats-grid">
          {profileStats.map((item) => {
            const Icon = item.icon;

            return (
              <div className="profile-stat-card" key={item.title}>
                <div className="profile-stat-icon">
                  <Icon size={20} />
                </div>

                <span>{item.title}</span>
                <strong>{item.value}</strong>
                <p>{item.note}</p>
              </div>
            );
          })}
        </section>

        <section className="profile-content-grid">
          <div className="profile-panel large">
            <div className="profile-panel-heading">
              <div>
                <span>Personal Information</span>
                <h3>Account details</h3>
              </div>
              <UserRound size={22} />
            </div>

            <div className="personal-info-grid">
              {personalInfo.map((item) => {
                const Icon = item.icon;

                return (
                  <div className="personal-info-item" key={item.label}>
                    <div>
                      <Icon size={18} />
                    </div>

                    <span>
                      <small>{item.label}</small>
                      <strong>{item.value}</strong>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="profile-panel ai-profile-panel">
            <span className="profile-badge dark">
              <Sparkles size={16} />
              AI Trust Coach
            </span>

            <h3>Complete verification to improve trust.</h3>

            <p>
              Contributors are more likely to contribute when organizer profiles
              show verified phone, email, identity and withdrawal accounts.
            </p>

            <button>
              Complete Verification
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        <section className="profile-content-grid">
          <div className="profile-panel large">
            <div className="profile-panel-heading">
              <div>
                <span>Verification</span>
                <h3>Trust and compliance</h3>
              </div>
              <ShieldCheck size={22} />
            </div>

            <div className="verification-grid">
              {verificationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div className="verification-card" key={item.title}>
                    <div className="verification-icon">
                      <Icon size={20} />
                    </div>

                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>

                    <small
                      className={
                        item.status === "Verified"
                          ? "verified"
                          : item.status === "Review"
                          ? "review"
                          : "pending"
                      }
                    >
                      {item.status === "Verified" && <CheckCircle2 size={14} />}
                      {item.status}
                    </small>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="profile-panel">
            <div className="profile-panel-heading">
              <div>
                <span>Profile Score</span>
                <h3>Trust rating</h3>
              </div>
              <BadgeCheck size={22} />
            </div>

            <div className="profile-score">
              <strong>95%</strong>
              <span>Trusted</span>
            </div>

            <div className="profile-check-list">
              <p>
                <CheckCircle2 size={16} />
                Phone verified
              </p>

              <p>
                <CheckCircle2 size={16} />
                Email verified
              </p>

              <p>
                <CheckCircle2 size={16} />
                Payment account connected
              </p>
            </div>
          </div>
        </section>

        <section className="profile-content-grid">
          <div className="profile-panel">
            <div className="profile-panel-heading">
              <div>
                <span>Payment Accounts</span>
                <h3>Withdrawal destinations</h3>
              </div>
              <WalletCards size={22} />
            </div>

            <div className="payment-account-list">
              {paymentAccounts.map((account) => {
                const Icon = account.icon;

                return (
                  <div className="payment-account-item" key={account.title}>
                    <div>
                      <Icon size={18} />
                    </div>

                    <span>
                      <strong>{account.title}</strong>
                      <small>{account.detail}</small>
                    </span>

                    <small
                      className={
                        account.status === "Primary"
                          ? "primary"
                          : account.status === "Connected"
                          ? "connected"
                          : "pending"
                      }
                    >
                      {account.status}
                    </small>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="profile-panel">
            <div className="profile-panel-heading">
              <div>
                <span>Security</span>
                <h3>Protect account</h3>
              </div>
              <LockKeyhole size={22} />
            </div>

            <div className="security-actions-grid">
              <button>
                <KeyRound size={18} />
                Change PIN
              </button>

              <button>
                <ShieldCheck size={18} />
                Two-Factor Auth
              </button>

              <button>
                <Smartphone size={18} />
                Login Devices
              </button>

              <button>
                <Activity size={18} />
                Active Sessions
              </button>
            </div>
          </div>
        </section>

        <section className="profile-content-grid">
          <div className="profile-panel large">
            <div className="profile-panel-heading">
              <div>
                <span>Organizer Performance</span>
                <h3>Account analytics</h3>
              </div>
              <TrendingUp size={22} />
            </div>

            <div className="profile-performance-bars">
              <div style={{ height: "74%" }}>
                <span>Events</span>
              </div>

              <div style={{ height: "92%" }}>
                <span>Collected</span>
              </div>

              <div style={{ height: "64%" }}>
                <span>Reports</span>
              </div>

              <div style={{ height: "86%" }}>
                <span>Trust</span>
              </div>

              <div style={{ height: "58%" }}>
                <span>Response</span>
              </div>
            </div>
          </div>

          <div className="profile-panel">
            <div className="profile-panel-heading">
              <div>
                <span>Preferences</span>
                <h3>Experience settings</h3>
              </div>
              <Bell size={22} />
            </div>

            <div className="preference-list">
              <div>
                <span>Email Notifications</span>
                <strong>Enabled</strong>
              </div>

              <div>
                <span>SMS Alerts</span>
                <strong>Enabled</strong>
              </div>

              <div>
                <span>AI Suggestions</span>
                <strong>Enabled</strong>
              </div>

              <div>
                <span>Language</span>
                <strong>English</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-content-grid">
          <div className="profile-panel">
            <div className="profile-panel-heading">
              <div>
                <span>Recent Activity</span>
                <h3>Profile timeline</h3>
              </div>
              <Activity size={22} />
            </div>

            <div className="profile-activity-list">
              {recentActivity.map((item) => (
                <p key={item}>
                  <CheckCircle2 size={16} />
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="profile-panel danger-panel">
            <div className="profile-panel-heading">
              <div>
                <span>Danger Zone</span>
                <h3>Account control</h3>
              </div>
              <Trash2 size={22} />
            </div>

            <p>
              These actions affect your account access and should be used
              carefully.
            </p>

            <div className="danger-actions">
              <button>
                <LogOut size={18} />
                Logout All Devices
              </button>

              <button className="danger">
                <Trash2 size={18} />
                Deactivate Profile
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Profile;