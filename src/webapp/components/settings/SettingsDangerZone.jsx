import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

function SettingsDangerZone() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);

  async function handleLogout() {
    setLogoutLoading(true);

    try {
      clearSession();
      if (logout) await logout();
      navigate("/login");
    } catch {
      clearSession();
      navigate("/login");
    } finally {
      setLogoutLoading(false);
    }
  }

  return (
    <section className="settings-panel settings-logout-panel">
      <div className="settings-panel-heading">
        <div>
          <span>Account</span>
          <h3>Sign out</h3>
        </div>
        <LogOut size={22} />
      </div>

      <p className="settings-logout-copy">
        Sign out of this device when you finish managing your events.
      </p>

      <button
        className="settings-logout-button"
        onClick={handleLogout}
        disabled={logoutLoading}
        type="button"
      >
        <LogOut size={18} />
        {logoutLoading ? "Signing out..." : "Sign Out"}
      </button>
    </section>
  );
}

export default SettingsDangerZone;
