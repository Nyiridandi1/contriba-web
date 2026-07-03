import { AlertTriangle, LogOut, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { clearSession } from "../../api/api";

function ProfileDangerZone() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  // ── LOGOUT ALL DEVICES ──
  async function handleLogoutAll() {
    setLogoutLoading(true);
    try {
      clearSession();
      if (logout) await logout();
      navigate("/login");
    } catch {
      clearSession();
      navigate("/login");
    }
    setLogoutLoading(false);
  }

  // ── DEACTIVATE PROFILE ──
  async function handleDeactivate() {
    setDeactivateLoading(true);
    try {
      clearSession();
      if (logout) await logout();
      navigate("/");
    } catch {
      clearSession();
      navigate("/");
    }
    setDeactivateLoading(false);
  }

  return (
    <div className="profile-danger-zone">
      <div className="profile-danger-header">
        <div>
          <span>DANGER ZONE</span>
          <h3>Account control</h3>
        </div>
        <AlertTriangle size={22} color="#E50914" />
      </div>

      <div className="profile-danger-warning">
        <AlertTriangle size={16} />
        <p>
          These actions affect your account access, organizer profile and
          saved data. Use them carefully.
        </p>
      </div>

      {/* ── LOGOUT ALL DEVICES ── */}
      <button
        className="profile-danger-btn-secondary"
        onClick={handleLogoutAll}
        disabled={logoutLoading}
        type="button"
      >
        <LogOut size={18} />
        {logoutLoading ? "Logging out..." : "Logout All Devices"}
      </button>

      {/* ── DEACTIVATE PROFILE ── */}
      {!showDeactivateConfirm ? (
        <button
          className="profile-danger-btn-primary"
          onClick={() => setShowDeactivateConfirm(true)}
          type="button"
        >
          <Trash2 size={18} />
          Deactivate Profile
        </button>
      ) : (
        <div className="profile-danger-confirm">
          <p>
            ⚠️ Are you sure? This will deactivate your organizer profile
            and remove access to your events and wallet.
          </p>
          <div className="profile-danger-confirm-actions">
            <button
              type="button"
              className="profile-danger-btn-cancel"
              onClick={() => setShowDeactivateConfirm(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="profile-danger-btn-primary"
              onClick={handleDeactivate}
              disabled={deactivateLoading}
            >
              <Trash2 size={16} />
              {deactivateLoading ? "Deactivating..." : "Yes, Deactivate"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDangerZone;