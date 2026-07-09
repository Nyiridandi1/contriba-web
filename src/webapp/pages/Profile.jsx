import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  CalendarDays,
  Camera,
  CheckCircle2,
  Globe,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Upload,
  UserRound,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import { clearSession, getToken, getUser, uploadAvatar } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

function getInitials(user) {
  const name = user?.name || user?.full_name || "Contriba User";
  const parts = String(name).trim().split(" ").filter(Boolean);

  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatPhone(phone) {
  if (!phone) return "Phone not added";

  const clean = String(phone).replace(/[^\d]/g, "");
  if (clean.startsWith("250")) return `+${clean}`;
  if (clean.startsWith("0")) return `+250 ${clean.slice(1)}`;

  return phone;
}

function ProfileHero() {
  const fileInputRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(() => getUser());
  const [profilePhoto, setProfilePhoto] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");

  useEffect(() => {
    const user = getUser();
    setCurrentUser(user);
    setProfilePhoto(user?.avatar_url || user?.profile_photo || user?.photo_url || "");
  }, []);

  async function handlePhotoSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoMessage("");

    if (!file.type.startsWith("image/")) {
      setPhotoMessage("Please choose a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoMessage("Please choose an image smaller than 5MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setProfilePhoto(previewUrl);
    setUploading(true);

    const result = await uploadAvatar(file);
    setUploading(false);

    if (!result.success) {
      setPhotoMessage(result.message || "Could not upload photo. Please try again.");
      setProfilePhoto(currentUser?.avatar_url || "");
      return;
    }

    const updatedUser = result.user || {
      ...currentUser,
      avatar_url: result.avatar_url,
    };

    const token = getToken();
    if (token) localStorage.setItem("contriba_token", token);

    localStorage.setItem("contriba_user", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setProfilePhoto(updatedUser.avatar_url || result.avatar_url || "");
    setPhotoMessage("Profile photo updated.");
  }

  const initials = getInitials(currentUser);
  const displayName = currentUser?.name || currentUser?.full_name || "Contriba Organizer";
  const displayEmail = currentUser?.email || "Email not added";
  const displayPhone = formatPhone(currentUser?.phone);
  const completion = profilePhoto ? 95 : 80;

  return (
    <section className="profile-hero-clean">
      <div className="profile-photo-area">
        <div className="profile-photo-card">
          <div className="profile-photo">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" />
            ) : (
              <div className="profile-photo-placeholder">{initials}</div>
            )}

            <button
              className="photo-edit-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label="Change profile photo"
            >
              <Camera size={16} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              hidden
            />
          </div>

          <button
            className="change-photo-btn"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload size={16} />
            {uploading ? "Uploading..." : "Change Photo"}
          </button>

          {photoMessage && (
            <p className={photoMessage.includes("updated") ? "photo-message success" : "photo-message error"}>
              {photoMessage}
            </p>
          )}
        </div>
      </div>

      <div className="profile-hero-info">
        <div className="profile-badge">
          <BadgeCheck size={16} />
          Verified Organizer
        </div>

        <h2>{displayName}</h2>

        <p>
          Manage your Contriba organizer identity, profile photo and trust details from one clean profile center.
        </p>

        <div className="profile-meta-grid">
          <div><Mail size={16} />{displayEmail}</div>
          <div><Phone size={16} />{displayPhone}</div>
          <div><MapPin size={16} />Kigali, Rwanda</div>
          <div><CalendarDays size={16} />Member since 2026</div>
        </div>

        <div className="profile-completion-card compact">
          <div className="completion-header">
            <div>
              <small>Profile Completion</small>
              <strong>{completion}%</strong>
            </div>
            <Sparkles size={22} />
          </div>

          <div className="completion-bar">
            <div className="completion-fill" style={{ width: `${completion}%` }} />
          </div>

          <div className="completion-list">
            <div><CheckCircle2 size={16} />Phone verified</div>
            <div><CheckCircle2 size={16} />Organizer active</div>
            <div><CheckCircle2 size={16} />Contributions ready</div>
            <div className={profilePhoto ? "" : "pending-item"}>
              <BadgeCheck size={16} />{profilePhoto ? "Photo added" : "Photo pending"}
            </div>
          </div>
        </div>
      </div>

      <aside className="profile-trust-card">
        <div className="profile-ai-header">
          <Sparkles size={24} />
          <span>Trust Profile</span>
        </div>

        <strong>Your organizer profile is ready.</strong>

        <p>
          Verified account details help contributors trust your events and complete payments with confidence.
        </p>

        <div className="trust-mini-grid">
          <div>
            <small>Trust Score</small>
            <h3>{profilePhoto ? "98%" : "88%"}</h3>
          </div>

          <div>
            <small>Status</small>
            <h3>Excellent</h3>
          </div>
        </div>
      </aside>
    </section>
  );
}

function ProfileInfo() {
  const user = getUser();

  const items = [
    { label: "Full Name", value: user?.name || user?.full_name || "Contriba Organizer", icon: UserRound },
    { label: "Email Address", value: user?.email || "Email not added", icon: Mail },
    { label: "Phone Number", value: formatPhone(user?.phone), icon: Phone },
    { label: "Country", value: "Rwanda", icon: Globe },
  ];

  return (
    <section className="profile-panel profile-info-panel">
      <div className="profile-panel-heading">
        <div>
          <span>Personal Information</span>
          <h3>Account details</h3>
        </div>
        <UserRound size={22} />
      </div>

      <div className="personal-info-grid clean-info-grid">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div className="personal-info-item" key={item.label}>
              <div><Icon size={18} /></div>

              <span>
                <small>{item.label}</small>
                <strong>{item.value}</strong>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProfileVerification() {
  const verifications = [
    { icon: Mail, title: "Email Address", value: "Verified", description: "Your email address has been confirmed." },
    { icon: Phone, title: "Phone Number", value: "Verified", description: "Your phone number has been confirmed." },
    { icon: UserRound, title: "National Identity", value: "Verified", description: "Your national identity has been confirmed." },
  ];

  return (
    <section className="profile-panel">
      <div className="profile-panel-heading">
        <div>
          <span>Verification</span>
          <h3>Identity status</h3>
        </div>
        <ShieldCheck size={22} />
      </div>

      <div className="verification-list-clean">
        {verifications.map((item) => {
          const Icon = item.icon;

          return (
            <div className="verification-row" key={item.title}>
              <div className="verification-icon"><Icon size={18} /></div>

              <span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>

              <em><CheckCircle2 size={14} />{item.value}</em>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProfileLogout() {
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
    }

    setLogoutLoading(false);
  }

  return (
    <section className="profile-panel profile-logout-panel-clean">
      <div className="profile-panel-heading">
        <div>
          <span>Session</span>
          <h3>Account access</h3>
        </div>
        <LogOut size={22} />
      </div>

      <p className="profile-logout-copy">
        Logout from this device when you finish using Contriba on a shared computer.
      </p>

      <button
        className="profile-logout-btn"
        type="button"
        onClick={handleLogout}
        disabled={logoutLoading}
      >
        <LogOut size={18} />
        {logoutLoading ? "Logging out..." : "Logout"}
      </button>
    </section>
  );
}

function ProfileSkeleton() {
  return (
    <>
      <section className="profile-hero-clean profile-skeleton-hero">
        <div className="profile-photo-area">
          <div className="profile-skeleton-photo shimmer" />
          <div className="profile-skeleton-line profile-skeleton-line-sm shimmer" />
        </div>

        <div className="profile-hero-info">
          <div className="profile-skeleton-pill shimmer" />
          <div className="profile-skeleton-line profile-skeleton-title shimmer" />
          <div className="profile-skeleton-line profile-skeleton-line-full shimmer" />
          <div className="profile-skeleton-line profile-skeleton-line-md shimmer" />

          <div className="profile-meta-grid profile-skeleton-meta">
            <div className="profile-skeleton-line profile-skeleton-line-sm shimmer" />
            <div className="profile-skeleton-line profile-skeleton-line-sm shimmer" />
            <div className="profile-skeleton-line profile-skeleton-line-sm shimmer" />
            <div className="profile-skeleton-line profile-skeleton-line-sm shimmer" />
          </div>

          <div className="profile-completion-card compact">
            <div className="profile-skeleton-line profile-skeleton-line-md shimmer" />
            <div className="profile-skeleton-progress shimmer" />

            <div className="completion-list">
              <div className="profile-skeleton-chip shimmer" />
              <div className="profile-skeleton-chip shimmer" />
              <div className="profile-skeleton-chip shimmer" />
              <div className="profile-skeleton-chip shimmer" />
            </div>
          </div>
        </div>

        <aside className="profile-trust-card">
          <div className="profile-skeleton-icon shimmer" />
          <div className="profile-skeleton-line profile-skeleton-line-sm shimmer" />
          <div className="profile-skeleton-line profile-skeleton-line-md shimmer" />
          <div className="profile-skeleton-line profile-skeleton-line-full shimmer" />
        </aside>
      </section>

      <section className="profile-panel profile-info-panel">
        <div className="profile-panel-heading">
          <div>
            <span className="profile-skeleton-line profile-skeleton-line-sm shimmer" />
            <h3 className="profile-skeleton-line profile-skeleton-line-md shimmer" />
          </div>
        </div>
      </section>
    </>
  );
}

function Profile() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="profile-page">
      <AppSidebar active="profile" />

      <section className="profile-main">
        <header className="profile-topbar">
          <div>
            <span>Profile Center</span>
            <h1>Organizer account and trust profile</h1>

            <p>
              Manage your personal details, identity status and trust profile from one clean profile center.
            </p>
          </div>
        </header>

        {loading ? (
          <ProfileSkeleton />
        ) : (
          <>
            <ProfileHero />
            <ProfileInfo />

            <section className="profile-content-grid clean-profile-grid">
              <ProfileVerification />
              <ProfileLogout />
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default Profile;
