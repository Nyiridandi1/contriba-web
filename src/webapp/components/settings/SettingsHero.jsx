import { Bell, Settings, ShieldCheck, SlidersHorizontal } from "lucide-react";

function SettingsHero() {
  return (
    <section className="settings-hero settings-hero-clean">
      <div className="settings-hero-left">
        <span className="settings-badge">
          <Settings size={16} />
          Settings Center
        </span>

        <h2>
          Manage your
          <br />
          organizer settings.
        </h2>

        <p>
          Manage your account preferences, security, notifications and regional
          settings from one place.
        </p>

        <div className="settings-tags">
          <div>
            <ShieldCheck size={16} />
            Account secure
          </div>
          <div>
            <Bell size={16} />
            Alerts ready
          </div>
          <div>
            <SlidersHorizontal size={16} />
            Preferences set
          </div>
        </div>
      </div>

      <div className="settings-hero-summary">
        <span>Account Status</span>
        <h3>Ready to manage events.</h3>
        <p>
          Your basic profile, security and notification settings are ready for
          daily organizer work.
        </p>

        <div className="settings-summary-list">
          <div>
            <strong>Security</strong>
            <small>PIN protected</small>
          </div>
          <div>
            <strong>Notifications</strong>
            <small>Payment alerts on</small>
          </div>
          <div>
            <strong>Region</strong>
            <small>Rwanda · RWF</small>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SettingsHero;
