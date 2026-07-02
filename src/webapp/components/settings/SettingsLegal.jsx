import {
  ChevronRight,
  FileText,
  Gavel,
  HelpCircle,
  Info,
  Scale,
} from "lucide-react";

const legalItems = [
  {
    title: "Privacy Policy",
    description: "Learn how Contriba stores and protects your data.",
    icon: FileText,
  },
  {
    title: "Terms & Conditions",
    description: "Read the platform rules and user agreement.",
    icon: Gavel,
  },
  {
    title: "Licenses",
    description: "Third-party software and open-source licenses.",
    icon: Scale,
  },
  {
    title: "About Contriba",
    description: "Platform version, company information and credits.",
    icon: Info,
  },
  {
    title: "Help Center",
    description: "FAQs, documentation and customer support.",
    icon: HelpCircle,
  },
];

function SettingsLegal() {
  return (
    <section className="settings-panel">
      <div className="settings-panel-heading">
        <div>
          <span>Legal & Support</span>
          <h3>Policies and documentation</h3>
        </div>

        <Scale size={22} />
      </div>

      <div className="settings-list">
        {legalItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className="settings-list-item"
              type="button"
            >
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

      <div className="settings-version-card">
        <small>Current Version</small>

        <strong>Contriba Web v2.0.0</strong>

        <p>
          Your application is running the latest available version with all
          premium organizer dashboard features enabled.
        </p>
      </div>
    </section>
  );
}

export default SettingsLegal;