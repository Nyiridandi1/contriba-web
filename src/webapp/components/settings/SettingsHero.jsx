import {
  Settings,
  Brain,
  ShieldCheck,
  Bell,
  ArrowRight,
  Sparkles,
} from "lucide-react";

function SettingsHero() {
  return (
    <section className="settings-hero">

      <div className="settings-hero-left">

        <span className="settings-badge">
          <Settings size={16} />
          Settings Center
        </span>

        <h2>
          Configure your
          <br />
          organizer experience.
        </h2>

        <p>
          Manage security, notifications, payments, AI preferences,
          appearance and account settings from one secure dashboard.
        </p>

        <div className="settings-tags">

          <div>
            <ShieldCheck size={16} />
            Secure
          </div>

          <div>
            <Bell size={16} />
            Notifications
          </div>

          <div>
            <Brain size={16} />
            AI Ready
          </div>

        </div>

        <div className="settings-hero-buttons">

          <button className="primary-btn">
            Save Changes
            <ArrowRight size={18} />
          </button>

          <button className="secondary-btn">
            Restore Defaults
          </button>

        </div>

      </div>

      <div className="settings-ai-card">

        <div className="settings-ai-header">

          <Sparkles size={22} />

          <span>AI SETTINGS INSIGHT</span>

        </div>

        <h3>92% Optimized</h3>

        <p>
          Your organizer account follows recommended security,
          payment and notification settings. Only a few
          improvements remain.
        </p>

        <div className="settings-ai-stats">

          <div>

            <small>Security</small>

            <strong>98%</strong>

          </div>

          <div>

            <small>Privacy</small>

            <strong>95%</strong>

          </div>

          <div>

            <small>Performance</small>

            <strong>91%</strong>

          </div>

          <div>

            <small>AI Score</small>

            <strong>96%</strong>

          </div>

        </div>

      </div>

    </section>
  );
}

export default SettingsHero;