import {
  CalendarDays,
  Clock,
  Coins,
  Globe,
  Languages,
  MapPin,
  SlidersHorizontal,
} from "lucide-react";

const generalSettings = [
  {
    title: "Language",
    value: "English",
    description: "Dashboard language",
    icon: Languages,
  },
  {
    title: "Country",
    value: "Rwanda",
    description: "Organizer region",
    icon: MapPin,
  },
  {
    title: "Currency",
    value: "RWF",
    description: "Default event currency",
    icon: Coins,
  },
  {
    title: "Time Zone",
    value: "Africa/Kigali",
    description: "Used for reminders and reports",
    icon: Clock,
  },
  {
    title: "Date Format",
    value: "DD/MM/YYYY",
    description: "Used across reports",
    icon: CalendarDays,
  },
  {
    title: "Public Region",
    value: "Africa",
    description: "Recommended visibility",
    icon: Globe,
  },
];

function SettingsGeneral() {
  return (
    <section className="settings-panel">
      <div className="settings-panel-heading">
        <div>
          <span>General Settings</span>
          <h3>Regional and account defaults</h3>
        </div>

        <SlidersHorizontal size={22} />
      </div>

      <div className="settings-options-grid">
        {generalSettings.map((item) => {
          const Icon = item.icon;

          return (
            <div className="settings-option-card" key={item.title}>
              <div className="settings-option-icon">
                <Icon size={19} />
              </div>

              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>

              <button type="button">{item.value}</button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SettingsGeneral;