import { Clock, Coins, Languages, MapPin, SlidersHorizontal } from "lucide-react";

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
];

function SettingsGeneral() {
  return (
    <section className="settings-panel">
      <div className="settings-panel-heading">
        <div>
          <h3>Account defaults</h3>
        </div>
        <SlidersHorizontal size={22} />
      </div>

      <div className="settings-options-grid compact">
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
