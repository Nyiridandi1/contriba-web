import { ChevronRight, FileText, HelpCircle, Scale } from "lucide-react";

const legalItems = [
  {
    title: "Privacy Policy",
    description: "How Contriba stores and protects organizer data.",
    icon: FileText,
  },
  {
    title: "Terms & Conditions",
    description: "Platform rules and organizer agreement.",
    icon: Scale,
  },
  {
    title: "Help Center",
    description: "Support for account, payments and event questions.",
    icon: HelpCircle,
  },
];

function SettingsLegal() {
  return (
    <section className="settings-panel settings-support-panel">
      <div className="settings-panel-heading">
        <div>
          <span>Support</span>
          <h3>Help and policies</h3>
        </div>
        <Scale size={22} />
      </div>

      <div className="settings-list">
        {legalItems.map((item) => {
          const Icon = item.icon;

          return (
            <button key={item.title} className="settings-list-item" type="button">
              <div className="settings-option-icon">
                <Icon size={18} />
              </div>
              <span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </span>
              <ChevronRight size={18} />
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default SettingsLegal;
