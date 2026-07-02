import { Bell, Brain, Globe, Mail, MessageCircle, Moon, Smartphone } from "lucide-react";

const preferences = [
  {
    title: "Email Notifications",
    value: "Enabled",
    description: "Receive reports, receipts and account updates.",
    icon: Mail,
  },
  {
    title: "SMS Alerts",
    value: "Enabled",
    description: "Get important payment and security alerts.",
    icon: Smartphone,
  },
  {
    title: "WhatsApp Reminders",
    value: "Enabled",
    description: "Send and receive contributor reminders.",
    icon: MessageCircle,
  },
  {
    title: "AI Suggestions",
    value: "Enabled",
    description: "Smart recommendations for fundraising growth.",
    icon: Brain,
  },
  {
    title: "Language",
    value: "English",
    description: "Preferred dashboard language.",
    icon: Globe,
  },
  {
    title: "Theme",
    value: "Light",
    description: "Premium light fintech interface.",
    icon: Moon,
  },
];

function ProfilePreferences() {
  return (
    <section className="profile-panel">
      <div className="profile-panel-heading">
        <div>
          <span>Preferences</span>
          <h3>Experience settings</h3>
        </div>

        <Bell size={22} />
      </div>

      <div className="preference-list premium-preference-list">
        {preferences.map((item) => {
          const Icon = item.icon;

          return (
            <div className="premium-preference-item" key={item.title}>
              <div className="preference-icon">
                <Icon size={18} />
              </div>

              <span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>

              <em>{item.value}</em>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ProfilePreferences;