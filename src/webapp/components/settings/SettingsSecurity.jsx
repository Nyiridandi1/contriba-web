import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";

const securityItems = [
  {
    title: "Change PIN",
    description: "Update the PIN used to access your organizer account.",
    status: "Recommended",
    icon: KeyRound,
  },
  {
    title: "Two-Factor Authentication",
    description: "Add extra protection for login and withdrawals.",
    status: "Enabled",
    icon: ShieldCheck,
  },
];

function SettingsSecurity() {
  return (
    <section className="settings-panel">
      <div className="settings-panel-heading">
        <div>
          <span>Security</span>
          <h3>Protect account</h3>
        </div>
        <LockKeyhole size={22} />
      </div>

      <div className="settings-list">
        {securityItems.map((item) => {
          const Icon = item.icon;

          return (
            <button className="settings-list-item" type="button" key={item.title}>
              <div className="settings-option-icon">
                <Icon size={18} />
              </div>
              <span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </span>
              <small>{item.status}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default SettingsSecurity;
