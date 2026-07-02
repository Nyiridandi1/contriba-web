import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Wallet,
  CalendarClock,
} from "lucide-react";

const notifications = [
  {
    title: "Push Notifications",
    description: "Receive instant alerts on your device.",
    icon: Bell,
    enabled: true,
  },
  {
    title: "Email Notifications",
    description: "Receive event summaries by email.",
    icon: Mail,
    enabled: true,
  },
  {
    title: "SMS Notifications",
    description: "Important payment confirmations.",
    icon: Smartphone,
    enabled: false,
  },
  {
    title: "Contribution Alerts",
    description: "Notify whenever someone contributes.",
    icon: Wallet,
    enabled: true,
  },
  {
    title: "Reminder Notifications",
    description: "Notify before reminder campaigns.",
    icon: CalendarClock,
    enabled: true,
  },
  {
    title: "Marketing Updates",
    description: "Receive product news and updates.",
    icon: MessageSquare,
    enabled: false,
  },
];

function SettingsNotifications() {
  return (
    <section className="settings-panel">
      <div className="settings-panel-heading">
        <div>
          <span>Notifications</span>
          <h3>Control every alert</h3>
        </div>

        <Bell size={22} />
      </div>

      <div className="settings-toggle-list">
        {notifications.map((item) => {
          const Icon = item.icon;

          return (
            <div
              className="settings-toggle-card"
              key={item.title}
            >
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
                className={`settings-switch ${
                  item.enabled ? "active" : ""
                }`}
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