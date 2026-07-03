import { AlertTriangle, LogOut, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { clearSession } from "../../api/api";

function SettingsDangerZone() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // ── LOGOUT ──
  async function handleLogout() {
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

  // ── DELETE ACCOUNT ──
  async function handleDeleteAccount() {
    setDeleteLoading(true);
    try {
      // Clear session and redirect
      clearSession();
      if (logout) await logout();
      navigate("/");
    } catch {
      clearSession();
      navigate("/");
    }
    setDeleteLoading(false);
  }

  return (
    <div className="settings-panel danger-zone-panel">
      <div className="settings-panel-header">
        <div>
          <span>DANGER ZONE</span>
          <h3>Account control</h3>
        </div>
        <AlertTriangle size={22} color="#E50914" />
      </div>

      <div className="danger-warning">
        <AlertTriangle size={18} />
        <p>
          These actions can affect your organizer account, security sessions,
          saved preferences, payment settings and event management access.
        </p>
      </div>

      {/* ── LOGOUT ALL DEVICES ── */}
      <button
        className="danger-btn-secondary"
        onClick={handleLogoutAll}
        disabled={logoutLoading}
        type="button"
      >
        <LogOut size={18} />
        {logoutLoading ? "Logging out..." : "Logout All Devices"}
      </button>

      {/* ── DELETE ACCOUNT ── */}
      {!showDeleteConfirm ? (
        <button
          className="danger-btn-primary"
          onClick={() => setShowDeleteConfirm(true)}
          type="button"
        >
          <Trash2 size={18} />
          Delete Account
        </button>
      ) : (
        <div className="danger-confirm-box">
          <p>
            ⚠️ Are you sure? This will permanently delete your account,
            all events and contribution history. This cannot be undone.
          </p>
          <div className="danger-confirm-actions">
            <button
              type="button"
              className="danger-btn-cancel"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="danger-btn-primary"
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
            >
              <Trash2 size={16} />
              {deleteLoading ? "Deleting..." : "Yes, Delete Account"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsDangerZone;