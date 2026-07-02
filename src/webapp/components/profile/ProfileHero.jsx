import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Camera,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Upload,
} from "lucide-react";

import { getToken, getUser, uploadAvatar } from "../../api/api";

function getInitials(user) {
  const name = user?.name || user?.full_name || "Contriba User";
  const parts = String(name).trim().split(" ").filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatPhone(phone) {
  if (!phone) return "Phone not available";

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

    if (token) {
      localStorage.setItem("contriba_token", token);
    }

    localStorage.setItem("contriba_user", JSON.stringify(updatedUser));

    setCurrentUser(updatedUser);
    setProfilePhoto(updatedUser.avatar_url || result.avatar_url || "");
    setPhotoMessage("Profile photo updated.");
  }

  const initials = getInitials(currentUser);
  const displayName = currentUser?.name || "Contriba Organizer";
  const displayEmail = currentUser?.email || "Email not added";
  const displayPhone = formatPhone(currentUser?.phone);

  return (
    <section className="profile-hero">
      <div className="profile-hero-left">
        <div className="profile-profile-header">
          <div className="profile-photo-wrapper">
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
              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: "12px",
                  fontWeight: 800,
                  color: photoMessage.includes("updated") ? "#16a34a" : "#E50914",
                  textAlign: "center",
                }}
              >
                {photoMessage}
              </p>
            )}
          </div>

          <div className="profile-header-info">
            <div className="profile-badge">
              <BadgeCheck size={16} />
              Verified Organizer
            </div>

            <h2>{displayName}</h2>

            <span className="profile-role">Founder • Contriba Organizer</span>

            <p>
              Premium organizer managing fundraising, contributions, financial
              reports and event analytics through Contriba.
            </p>

            <div className="profile-meta-grid">
              <div>
                <Mail size={16} />
                {displayEmail}
              </div>

              <div>
                <Phone size={16} />
                {displayPhone}
              </div>

              <div>
                <MapPin size={16} />
                Kigali, Rwanda
              </div>

              <div>
                <CalendarDays size={16} />
                Member Since 2026
              </div>
            </div>
          </div>
        </div>

        <div className="profile-completion-card">
          <div className="completion-header">
            <div>
              <small>Profile Completion</small>
              <strong>{profilePhoto ? "95%" : "80%"}</strong>
            </div>

            <Sparkles size={24} />
          </div>

          <div className="completion-bar">
            <div className="completion-fill" />
          </div>

          <div className="completion-list">
            <div>
              <CheckCircle2 size={16} />
              Phone Verified
            </div>

            <div>
              <CheckCircle2 size={16} />
              Organizer Profile Active
            </div>

            <div>
              <CheckCircle2 size={16} />
              Contributions Ready
            </div>

            <div className={profilePhoto ? "" : "pending-item"}>
              <BadgeCheck size={16} />
              {profilePhoto ? "Profile Photo Added" : "Profile Photo Pending"}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-hero-card">
        <div className="profile-ai-header">
          <Sparkles size={26} />
          <span>AI Profile Coach</span>
        </div>

        <strong>Your organizer profile is performing well.</strong>

        <p>
          Verified organizers receive more trust from contributors. Completing
          your profile could increase contribution confidence and improve
          conversion.
        </p>

        <div className="profile-ai-score">
          <div>
            <small>Trust Score</small>
            <h3>{profilePhoto ? "98%" : "88%"}</h3>
          </div>

          <div>
            <small>Profile Rank</small>
            <h3>{profilePhoto ? "Excellent" : "Good"}</h3>
          </div>
        </div>

        <button
          className="profile-smart-btn"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {profilePhoto ? "Update Profile Photo" : "Complete Profile"}
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

export default ProfileHero;