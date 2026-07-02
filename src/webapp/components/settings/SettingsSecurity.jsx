import {
  Activity,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const securityItems = [
  {
    title: "Change PIN",
    description: "Update your Contriba account PIN.",
    status: "Recommended",
    icon: KeyRound,
  },
  {
    title: "Two-Factor Authentication",
    description: "Add extra protection for withdrawals and login.",
    status: "Enabled",
    icon: ShieldCheck,
  },
  {
    title: "Biometric Login",
    description: "Use device biometrics on supported devices.",
    status: "Future",
    icon: Fingerprint,
  },
  {
    title: "Trusted Devices",
    description: "Manage devices connected to your account.",
    status: "2 devices",
    icon: Smartphone,
  },
  {
    title: "Login History",
    description: "Review recent login activity and locations.",
    status: "View",
    icon: Activity,
  },
];

function SettingsSecurity() {
  return (
    <section className="settings-panel">
      <div className="settings-panel-heading">
        <div>
          <span>Security</span>
          <h3>Protect your organizer account</h3>
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