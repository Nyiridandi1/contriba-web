import {
  LayoutDashboard,
  Monitor,
  Moon,
  Palette,
  Sparkles,
  Sun,
} from "lucide-react";

const appearanceSettings = [
  {
    title: "Theme",
    value: "Light Mode",
    description: "Premium fintech light interface.",
    icon: Sun,
  },
  {
    title: "Dark Mode",
    value: "Coming Soon",
    description: "Future dark experience.",
    icon: Moon,
  },
  {
    title: "Accent Color",
    value: "Contriba Red",
    description: "Primary dashboard color.",
    icon: Palette,
  },
  {
    title: "Dashboard Layout",
    value: "Comfortable",
    description: "Balanced spacing and cards.",
    icon: LayoutDashboard,
  },
  {
    title: "Animations",
    value: "Enabled",
    description: "Smooth transitions throughout the app.",
    icon: Sparkles,
  },
  {
    title: "System Preference",
    value: "Follow Device",
    description: "Automatically match your device theme.",
    icon: Monitor,
  },
];

function SettingsAppearance() {
  return (
    <section className="settings-panel">
      <div className="settings-panel-heading">
        <div>
          <span>Appearance</span>
          <h3>Personalize your dashboard</h3>
        </div>

        <Palette size={22} />
      </div>

      <div className="settings-options-grid">
        {appearanceSettings.map((item) => {
          const Icon = item.icon;

          return (
            <div className="settings-option-card" key={item.title}>
              <div className="settings-option-icon">
                <Icon size={18} />
              </div>

              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>

              <button type="button">
                {item.value}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SettingsAppearance;