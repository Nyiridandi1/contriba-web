import {
  Activity,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const securityActions = [
  {
    title: "Change PIN",
    description: "Update your account security PIN.",
    icon: KeyRound,
  },
  {
    title: "Two-Factor Auth",
    description: "Add an extra protection layer.",
    icon: ShieldCheck,
  },
  {
    title: "Login Devices",
    description: "Review trusted devices.",
    icon: Smartphone,
  },
  {
    title: "Active Sessions",
    description: "Control signed-in sessions.",
    icon: Activity,
  },
];

function ProfileSecurity() {
  return (
    <section className="profile-panel">
      <div className="profile-panel-heading">
        <div>
          <span>Security</span>
          <h3>Protect account</h3>
        </div>

        <LockKeyhole size={22} />
      </div>

      <div className="security-actions-grid">
        {securityActions.map((item) => {
          const Icon = item.icon;

          return (
            <button type="button" key={item.title}>
              <Icon size={18} />
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ProfileSecurity;