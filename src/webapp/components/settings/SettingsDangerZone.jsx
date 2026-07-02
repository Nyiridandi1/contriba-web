import { AlertTriangle, LogOut, ShieldAlert, Trash2 } from "lucide-react";

function SettingsDangerZone() {
  return (
    <section className="settings-panel settings-danger-panel">
      <div className="settings-panel-heading">
        <div>
          <span>Danger Zone</span>
          <h3>Account control</h3>
        </div>

        <ShieldAlert size={22} />
      </div>

      <div className="settings-danger-warning">
        <AlertTriangle size={20} />
        <p>
          These actions can affect your organizer account, security sessions,
          saved preferences, payment settings and event management access.
        </p>
      </div>

      <div className="settings-danger-actions">
        <button type="button">
          <LogOut size={18} />
          Logout All Devices
        </button>

        <button className="danger" type="button">
          <Trash2 size={18} />
          Delete Account
        </button>
      </div>
    </section>
  );
}

export default SettingsDangerZone;