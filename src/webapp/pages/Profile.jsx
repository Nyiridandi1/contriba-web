import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  BadgeCheck,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  FileImage,
  Globe,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Upload,
  UserRound,
  XCircle,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import { clearSession, getToken, getUser, uploadAvatar } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

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

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-RW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

async function fetchKycStatus() {
  const token = getToken();

  if (!token) {
    return {
      success: false,
      message: "Please log in again.",
    };
  }

  const response = await fetch(`${API_BASE_URL}/api/kyc/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json().catch(() => ({}));

  return {
    ...result,
    httpStatus: response.status,
  };
}

async function submitKyc(formData) {
  const token = getToken();

  if (!token) {
    return {
      success: false,
      message: "Please log in again.",
    };
  }

  const response = await fetch(`${API_BASE_URL}/api/kyc/submit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json().catch(() => ({}));

  return {
    ...result,
    httpStatus: response.status,
  };
}

function ProfileHero({ kycStatus }) {
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
  const isVerified = kycStatus === "verified";
  const completion = profilePhoto ? (isVerified ? 100 : 95) : isVerified ? 90 : 80;

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
        {isVerified && (
          <div className="profile-badge">
            <BadgeCheck size={16} />
            Verified Organizer
          </div>
        )}

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
            {isVerified && (
              <div><ShieldCheck size={16} />Identity verified</div>
            )}
          </div>
        </div>
      </div>

      <aside className="profile-trust-card">
        <div className="profile-ai-header">
          <Sparkles size={24} />
          <span>Trust Profile</span>
        </div>

        <strong>
          {isVerified
            ? "Your organizer identity is verified."
            : "Build more trust with identity verification."}
        </strong>

        <p>
          {isVerified
            ? "Contriba has reviewed your identity details. Contributors can now see your Verified Organizer badge."
            : "Submit your National ID to become eligible for the Verified Organizer badge and stronger contributor trust."}
        </p>

        <div className="trust-mini-grid">
          <div>
            <small>Identity</small>
            <h3>{isVerified ? "Verified" : "Optional"}</h3>
          </div>

          <div>
            <small>Status</small>
            <h3>{isVerified ? "Trusted" : "Active"}</h3>
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

function KycUploadBox({ label, description, file, preview, inputRef, onChange }) {
  return (
    <div className="kyc-upload-box">
      <div className="kyc-upload-copy">
        <div className="kyc-upload-icon">
          <FileImage size={20} />
        </div>

        <div>
          <strong>{label}</strong>
          <small>{description}</small>
        </div>
      </div>

      {preview ? (
        <div className="kyc-preview">
          <img src={preview} alt={`${label} preview`} />
          <span>{file?.name}</span>
        </div>
      ) : (
        <div className="kyc-empty-preview">
          <Upload size={22} />
          <span>No image selected</span>
        </div>
      )}

      <button
        type="button"
        className="kyc-select-btn"
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={16} />
        {file ? "Change image" : "Choose image"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onChange}
        hidden
      />
    </div>
  );
}

function ProfileVerification({ kycData, loading, error, onRefresh }) {
  const user = getUser();
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const [nationalIdNumber, setNationalIdNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("Rwanda");
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [frontPreview, setFrontPreview] = useState("");
  const [backPreview, setBackPreview] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const status = kycData?.status || "not_submitted";
  const canSubmit = status === "not_submitted" || status === "rejected";

  useEffect(() => {
    return () => {
      if (frontPreview) URL.revokeObjectURL(frontPreview);
      if (backPreview) URL.revokeObjectURL(backPreview);
    };
  }, [frontPreview, backPreview]);

  const statusMeta = useMemo(() => {
    if (status === "verified") {
      return {
        title: "Identity verified",
        description: "Your National ID has been reviewed and approved by Contriba.",
        badge: "Verified",
        className: "verified",
        icon: CheckCircle2,
      };
    }

    if (status === "pending") {
      return {
        title: "Verification pending",
        description: "Your documents are under review. You can continue using Contriba normally.",
        badge: "Under review",
        className: "pending",
        icon: Clock3,
      };
    }

    if (status === "rejected") {
      return {
        title: "Verification needs attention",
        description:
          kycData?.rejection_reason ||
          "Your previous submission could not be approved. Please review your details and submit clearer documents.",
        badge: "Resubmit",
        className: "rejected",
        icon: XCircle,
      };
    }

    return {
      title: "National Identity",
      description: "Submit your ID to become eligible for the Verified Organizer badge.",
      badge: "Not submitted",
      className: "not-submitted",
      icon: UserRound,
    };
  }, [status, kycData]);

  function handleImageSelection(event, side) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFormMessage("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFormMessage("Please choose a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormMessage("Each ID image must be 5MB or smaller.");
      return;
    }

    const preview = URL.createObjectURL(file);

    if (side === "front") {
      if (frontPreview) URL.revokeObjectURL(frontPreview);
      setFrontFile(file);
      setFrontPreview(preview);
    } else {
      if (backPreview) URL.revokeObjectURL(backPreview);
      setBackFile(file);
      setBackPreview(preview);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormMessage("");

    if (!nationalIdNumber.trim()) {
      setFormMessage("Enter your National ID number.");
      return;
    }

    if (!dateOfBirth) {
      setFormMessage("Select your date of birth.");
      return;
    }

    if (!frontFile || !backFile) {
      setFormMessage("Upload both the front and back of your National ID.");
      return;
    }

    const formData = new FormData();
    formData.append("national_id_number", nationalIdNumber.trim());
    formData.append("date_of_birth", dateOfBirth);
    formData.append("nationality", nationality.trim() || "Rwanda");
    formData.append("id_front", frontFile);
    formData.append("id_back", backFile);

    setSubmitting(true);
    const result = await submitKyc(formData);
    setSubmitting(false);

    if (!result.success) {
      setFormMessage(result.message || "Could not submit your identity verification.");
      return;
    }

    setFormMessage("Identity verification submitted successfully.");
    setNationalIdNumber("");
    setDateOfBirth("");
    setNationality("Rwanda");
    setFrontFile(null);
    setBackFile(null);
    if (frontPreview) URL.revokeObjectURL(frontPreview);
    if (backPreview) URL.revokeObjectURL(backPreview);
    setFrontPreview("");
    setBackPreview("");
    await onRefresh();
  }

  if (loading) {
    return (
      <section className="profile-panel">
        <div className="profile-panel-heading">
          <div>
            <span>Verification</span>
            <h3>Identity status</h3>
          </div>
          <ShieldCheck size={22} />
        </div>

        <div className="kyc-status-loading">
          <Loader2 className="spin" size={22} />
          Loading verification status...
        </div>
      </section>
    );
  }

  return (
    <section className="profile-panel profile-kyc-panel">
      <div className="profile-panel-heading">
        <div>
          <span>Verification</span>
          <h3>Identity status</h3>
        </div>
        <ShieldCheck size={22} />
      </div>

      <div className="verification-list-clean">
        <div className="verification-row">
          <div className="verification-icon"><Mail size={18} /></div>

          <span>
            <strong>Email Address</strong>
            <small>Your email address has been confirmed.</small>
          </span>

          <em><CheckCircle2 size={14} />Verified</em>
        </div>

        <div className="verification-row">
          <div className="verification-icon"><Phone size={18} /></div>

          <span>
            <strong>Phone Number</strong>
            <small>Your phone number has been confirmed.</small>
          </span>

          <em><CheckCircle2 size={14} />Verified</em>
        </div>
      </div>

      {error && (
        <div className="kyc-alert error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button type="button" onClick={onRefresh}>
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      )}

      <div className={`kyc-status-card ${statusMeta.className}`}>
        <div className="kyc-status-icon">
          <statusMeta.icon size={24} />
        </div>

        <div className="kyc-status-copy">
          <strong>{statusMeta.title}</strong>
          <small>{statusMeta.description}</small>

          {(status === "pending" || status === "verified") && (
            <div className="kyc-status-meta">
              {kycData?.national_id_number_masked && (
                <span>ID: {kycData.national_id_number_masked}</span>
              )}
              {kycData?.submitted_at && (
                <span>Submitted: {formatDate(kycData.submitted_at)}</span>
              )}
              {status === "verified" && kycData?.verified_at && (
                <span>Verified: {formatDate(kycData.verified_at)}</span>
              )}
            </div>
          )}
        </div>

        <div className={`kyc-status-badge ${statusMeta.className}`}>
          {statusMeta.badge}
        </div>
      </div>

      {canSubmit && (
        <form className="kyc-form" onSubmit={handleSubmit}>
          <div className="kyc-form-heading">
            <div>
              <span>{status === "rejected" ? "Resubmit verification" : "Verify your identity"}</span>
              <h4>Government ID submission</h4>
            </div>

            <ShieldCheck size={22} />
          </div>

          <p className="kyc-form-intro">
            Your account information is filled automatically. Contriba admins will compare the name on your ID with your account name before approval.
          </p>

          <div className="kyc-readonly-grid">
            <div>
              <small>Full Name</small>
              <strong>{user?.name || user?.full_name || "Not available"}</strong>
            </div>

            <div>
              <small>Email Address</small>
              <strong>{user?.email || "Not available"}</strong>
            </div>

            <div>
              <small>Phone Number</small>
              <strong>{formatPhone(user?.phone)}</strong>
            </div>
          </div>

          <div className="kyc-fields-grid">
            <label>
              <span>National ID Number</span>
              <input
                type="text"
                value={nationalIdNumber}
                onChange={(event) => setNationalIdNumber(event.target.value)}
                placeholder="Enter your National ID number"
                autoComplete="off"
                maxLength={30}
              />
            </label>

            <label>
              <span>Date of Birth</span>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(event) => setDateOfBirth(event.target.value)}
              />
            </label>

            <label>
              <span>Nationality</span>
              <input
                type="text"
                value={nationality}
                onChange={(event) => setNationality(event.target.value)}
                placeholder="Rwanda"
                maxLength={80}
              />
            </label>
          </div>

          <div className="kyc-upload-grid">
            <KycUploadBox
              label="Front of National ID"
              description="Upload a clear photo showing the complete front side."
              file={frontFile}
              preview={frontPreview}
              inputRef={frontInputRef}
              onChange={(event) => handleImageSelection(event, "front")}
            />

            <KycUploadBox
              label="Back of National ID"
              description="Upload a clear photo showing the complete back side."
              file={backFile}
              preview={backPreview}
              inputRef={backInputRef}
              onChange={(event) => handleImageSelection(event, "back")}
            />
          </div>

          {formMessage && (
            <div className={`kyc-form-message ${formMessage.includes("successfully") ? "success" : "error"}`}>
              {formMessage.includes("successfully") ? (
                <CheckCircle2 size={17} />
              ) : (
                <AlertCircle size={17} />
              )}
              <span>{formMessage}</span>
            </div>
          )}

          <div className="kyc-privacy-note">
            <ShieldCheck size={18} />
            <span>
              Your ID images are stored privately and are only available to authorized Contriba reviewers.
            </span>
          </div>

          <button
            className="kyc-submit-btn"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="spin" size={18} />
                Submitting verification...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Submit Verification
              </>
            )}
          </button>
        </form>
      )}
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
  const [kycLoading, setKycLoading] = useState(true);
  const [kycData, setKycData] = useState({
    status: "not_submitted",
  });
  const [kycError, setKycError] = useState("");

  async function loadKycStatus() {
    setKycLoading(true);
    setKycError("");

    const result = await fetchKycStatus();

    if (!result.success) {
      setKycError(result.message || "Could not load identity verification status.");
      setKycLoading(false);
      return;
    }

    setKycData(result.kyc || { status: "not_submitted" });
    setKycLoading(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 650);
    loadKycStatus();

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
            <ProfileHero kycStatus={kycData?.status} />
            <ProfileInfo />

            <section className="profile-content-grid clean-profile-grid profile-content-grid-kyc">
              <ProfileVerification
                kycData={kycData}
                loading={kycLoading}
                error={kycError}
                onRefresh={loadKycStatus}
              />
              <ProfileLogout />
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default Profile;