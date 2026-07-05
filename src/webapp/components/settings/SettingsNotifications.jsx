import { Bell, Mail, Wallet } from "lucide-react";

const notifications = [
  {
    title: "Contribution Alerts",
    description: "Notify whenever someone contributes.",
    icon: Wallet,
    enabled: true,
  },
  {
    title: "Email Notifications",
    description: "Receive receipts and event summaries by email.",
    icon: Mail,
    enabled: true,
  },
  {
    title: "Push Notifications",
    description: "Receive important alerts on your device.",
    icon: Bell,
    enabled: true,
  },
];

function SettingsNotifications() {
  return (
    <section className="settings-panel">
      <div className="settings-panel-heading">
        <div>
          <h3>Alert preferences</h3>
        </div>
        <Bell size={22} />
      </div>

      <div className="settings-toggle-list">
        {notifications.map((item) => {
          const Icon = item.icon;

          return (
            <div className="settings-toggle-card" key={item.title}>
              <div className="settings-toggle-left">
                <div className="settings-option-icon">
                  <Icon size={18} />
                </div>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              </div>

              <button
                type="button"
                className={`settings-switch ${item.enabled ? "active" : ""}`}
                aria-label={`${item.title} toggle`}
              >
                <span />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SettingsNotifications;
