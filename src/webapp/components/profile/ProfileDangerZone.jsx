import { AlertTriangle, LogOut, ShieldAlert, Trash2 } from "lucide-react";

function ProfileDangerZone() {
  return (
    <section className="profile-panel danger-panel">
      <div className="profile-panel-heading">
        <div>
          <span>Danger Zone</span>
          <h3>Account control</h3>
        </div>

        <ShieldAlert size={22} />
      </div>

      <div className="danger-warning">
        <AlertTriangle size={20} />
        <p>
          These actions affect your account access, organizer profile and saved
          data. Use them carefully.
        </p>
      </div>

      <div className="danger-actions">
        <button type="button">
          <LogOut size={18} />
          Logout All Devices
        </button>

        <button className="danger" type="button">
          <Trash2 size={18} />
          Deactivate Profile
        </button>
      </div>
    </section>
  );
}

export default ProfileDangerZone;