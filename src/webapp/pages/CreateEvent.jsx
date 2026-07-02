import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  Church,
  Gift,
  Globe2,
  GraduationCap,
  HeartHandshake,
  ImagePlus,
  LockKeyhole,
  MapPin,
  PartyPopper,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";

import {
  createEvent,
  getEvent,
  updateEvent,
  uploadEventPhoto,
} from "../api/api";

import mtnLogo from "../../assets/mtn.png";
import airtelLogo from "../../assets/airtel.jpg";
import logoIcon from "../../assets/logo-icon.png";

import "./CreateEvent.css";

const eventTypes = [
  { id: "wedding", label: "Wedding", Icon: HeartHandshake },
  { id: "birthday", label: "Birthday", Icon: Gift },
  { id: "graduation", label: "Graduation", Icon: GraduationCap },
  { id: "church", label: "Church", Icon: Church },
  { id: "celebration", label: "Celebration", Icon: PartyPopper },
  { id: "other", label: "Other", Icon: Sparkles },
];

const paymentMethods = [
  { id: "mtn", label: "MTN MoMo", logo: mtnLogo },
  { id: "airtel", label: "Airtel Money", logo: airtelLogo },
];

const suggestions = {
  wedding:
    "We are getting married and would love you to be part of our special day. Thank you for supporting us with love.",
  graduation:
    "I am celebrating this graduation milestone and I would be grateful for your support as I start this new journey.",
  birthday:
    "I am celebrating my birthday and would love friends and family to be part of this special moment.",
  church:
    "We are raising support for our church event and every contribution helps us make this gathering possible.",
  celebration:
    "We are organizing a special celebration and your contribution will help make it memorable.",
  other:
    "Thank you for supporting this event. Your contribution means a lot and helps us reach our goal.",
};

function formatPhone(value) {
  const clean = String(value || "").replace(/[^\d]/g, "");

  if (clean.startsWith("250")) return clean;
  if (clean.startsWith("0")) return `25${clean}`;
  if (clean.length === 9) return `250${clean}`;

  return clean;
}

function normalizeEventType(value) {
  const clean = String(value || "").toLowerCase();

  const found = eventTypes.find(
    (item) => item.id === clean || item.label.toLowerCase() === clean
  );

  return found?.id || "other";
}

function isExistingUrl(value) {
  return typeof value === "string" && value.startsWith("http");
}

async function uploadPhotoIfNeeded(photo, file) {
  if (isExistingUrl(photo) && !file) {
    return photo;
  }

  if (!file) {
    return null;
  }

  const result = await uploadEventPhoto(file);

  if (!result.success) {
    throw new Error(result.message || "Could not upload event photo.");
  }

  return result.photo_url || result.url || null;
}

function CreateEvent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [eventType, setEventType] = useState("wedding");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [message, setMessage] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mtn");

  const [photos, setPhotos] = useState([null, null, null, null]);
  const [photoFiles, setPhotoFiles] = useState([null, null, null, null]);

  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const selectedType = eventTypes.find((item) => item.id === eventType);
  const selectedPayment = paymentMethods.find(
    (item) => item.id === paymentMethod
  );

  const previewTitle = title || "Jean & Alice Wedding";
  const previewDate = date || "Choose event date";
  const previewLocation = location || "Kigali, Rwanda";
  const previewGoal = goalAmount || "5000000";

  useEffect(() => {
    async function loadEventForEdit() {
      if (!isEditMode) return;

      setLoadingEvent(true);
      setFormMessage("");

      const result = await getEvent(id);

      setLoadingEvent(false);

      if (!result.success) {
        setFormMessage(result.message || "Failed to load event for editing.");
        return;
      }

      const eventData = result.event || result.data || result;

      setEventType(normalizeEventType(eventData.type));
      setTitle(eventData.title || "");
      setDate(eventData.date ? String(eventData.date).slice(0, 10) : "");
      setLocation(eventData.location || "");
      setGoalAmount(
        eventData.goal_amount || eventData.goalAmount
          ? String(eventData.goal_amount || eventData.goalAmount)
          : ""
      );
      setMessage(eventData.description || "");
      setPrivacy(eventData.is_private ? "private" : "public");
      setPhone(eventData.owner_phone || "");
      setPaymentMethod(eventData.owner_payment_method || "mtn");

      setPhotos([
        eventData.cover_image || null,
        eventData.photo2_url || null,
        eventData.photo3_url || null,
        eventData.photo4_url || null,
      ]);

      setPhotoFiles([null, null, null, null]);
    }

    loadEventForEdit();
  }, [id, isEditMode]);

  const readiness = useMemo(() => {
    let score = 0;
    if (title) score += 25;
    if (date) score += 20;
    if (goalAmount) score += 20;
    if (phone) score += 20;
    if (photos.some(Boolean)) score += 15;
    return score;
  }, [title, date, goalAmount, phone, photos]);

  const canSubmit =
    title.trim().length >= 3 &&
    date &&
    location.trim().length >= 2 &&
    Number(goalAmount) > 0 &&
    formatPhone(phone).length >= 9 &&
    !loading &&
    !loadingEvent;

  function handlePhotoChange(index, file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormMessage("Please choose a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormMessage("Please choose an image smaller than 5MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    const nextPhotos = [...photos];
    const nextPhotoFiles = [...photoFiles];

    nextPhotos[index] = previewUrl;
    nextPhotoFiles[index] = file;

    setPhotos(nextPhotos);
    setPhotoFiles(nextPhotoFiles);
    setFormMessage("");
  }

  function removePhoto(index) {
    const nextPhotos = [...photos];
    const nextPhotoFiles = [...photoFiles];

    nextPhotos[index] = null;
    nextPhotoFiles[index] = null;

    setPhotos(nextPhotos);
    setPhotoFiles(nextPhotoFiles);
  }

  function useSuggestedMessage() {
    setMessage(suggestions[eventType]);
  }

  async function handleSubmitEvent() {
    setFormMessage("");

    if (!canSubmit) {
      setFormMessage(
        "Please complete title, date, location, goal amount and receiver phone."
      );
      return;
    }

    setLoading(true);

    try {
      const uploadedPhotoUrls = await Promise.all([
        uploadPhotoIfNeeded(photos[0], photoFiles[0]),
        uploadPhotoIfNeeded(photos[1], photoFiles[1]),
        uploadPhotoIfNeeded(photos[2], photoFiles[2]),
        uploadPhotoIfNeeded(photos[3], photoFiles[3]),
      ]);

      const payload = {
        title: title.trim(),
        type: selectedType?.label || eventType,
        date,
        location: location.trim(),
        description: message.trim() || suggestions[eventType],
        goal_amount: Number(goalAmount),
        owner_phone: formatPhone(phone),
        owner_payment_method: paymentMethod,
        cover_image: uploadedPhotoUrls[0],
        photo2_url: uploadedPhotoUrls[1],
        photo3_url: uploadedPhotoUrls[2],
        photo4_url: uploadedPhotoUrls[3],
        is_private: privacy === "private",
      };

      const result = isEditMode
        ? await updateEvent(id, payload)
        : await createEvent(payload);

      setLoading(false);

      if (!result.success) {
        setFormMessage(
          result.message ||
            (isEditMode ? "Failed to update event." : "Failed to create event.")
        );
        return;
      }

      navigate("/dashboard/events");
    } catch (error) {
      setLoading(false);
      setFormMessage(error.message || "Could not upload event photos.");
    }
  }  return (
    <main className="create-event-page">
      <div className="create-event-shell">
        <Link to="/dashboard/events" className="create-back">
          <ArrowLeft size={18} />
          Back to events
        </Link>

        <section className="create-hero">
          <div>
            <span className="create-badge">
              <Sparkles size={16} />
              {isEditMode ? "Edit contribution page" : "Create contribution page"}
            </span>

            <h1>
              {isEditMode ? "Update your event." : "Create your event in minutes."}
            </h1>

            <p>
              {isEditMode
                ? "Edit your contribution page details, update finance setup and keep your event information accurate."
                : "Build a beautiful contribution page, collect money securely and track every contribution from one financial dashboard."}
            </p>
          </div>

          <div className="create-hero-card">
            <img src={logoIcon} alt="Contriba" />
            <strong>Smart event finance</strong>
            <span>Collect • Track • Report</span>
          </div>
        </section>

        <div className="create-steps">
          <span className="active">01 Details</span>
          <span>02 Finance</span>
          <span>03 Photos</span>
          <span>04 Publish</span>
        </div>

        <section className="create-layout">
          <div className="create-main">
            <div className="create-card">
              <div className="create-card-heading">
                <span>01</span>
                <div>
                  <h2>Event details</h2>
                  <p>Start with the basic information guests will see.</p>
                </div>
              </div>

              <label>Event Type</label>

              <div className="event-type-grid">
                {eventTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={eventType === type.id ? "active" : ""}
                    onClick={() => setEventType(type.id)}
                  >
                    <type.Icon size={20} />
                    <span>{type.label}</span>
                    {eventType === type.id && <Check size={16} />}
                  </button>
                ))}
              </div>

              <label>Event Title</label>
              <input
                className="create-input"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Jean & Alice Wedding"
              />

              <div className="create-two-grid">
                <div>
                  <label>Event Date</label>
                  <div className="create-input-icon">
                    <CalendarDays size={18} />
                    <input
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label>Location</label>
                  <div className="create-input-icon">
                    <MapPin size={18} />
                    <input
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="Kigali, Rwanda"
                    />
                  </div>
                </div>
              </div>

              <label>Short Message</label>
              <textarea
                className="create-textarea"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tell contributors why this event matters..."
              />

              <button
                className="suggestion-button"
                type="button"
                onClick={useSuggestedMessage}
              >
                <Sparkles size={17} />
                Use smart message suggestion
              </button>
            </div>

            <div className="create-card">
              <div className="create-card-heading">
                <span>02</span>
                <div>
                  <h2>Finance setup</h2>
                  <p>Choose your goal and where contributions should go.</p>
                </div>
              </div>

              <label>Goal Amount</label>
              <div className="amount-box">
                <span>RWF</span>
                <input
                  value={goalAmount}
                  onChange={(event) =>
                    setGoalAmount(event.target.value.replace(/[^\d]/g, ""))
                  }
                  placeholder="5,000,000"
                />
              </div>

              <label>Your Phone Number</label>
              <div className="create-input-icon">
                <Phone size={18} />
                <span>+250</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="781 234 567"
                />
              </div>

              <label>Payment Method</label>
              <div className="create-payment-grid">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    className={paymentMethod === method.id ? "active" : ""}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <img src={method.logo} alt={method.label} />
                    <span>{method.label}</span>
                    {paymentMethod === method.id && <Check size={17} />}
                  </button>
                ))}
              </div>

              <label>Event Privacy</label>
              <div className="privacy-grid">
                <button
                  type="button"
                  className={privacy === "public" ? "active green" : ""}
                  onClick={() => setPrivacy("public")}
                >
                  <Globe2 size={20} />
                  <span>
                    <strong>Public</strong>
                    Visible to everyone on Contriba.
                  </span>
                  {privacy === "public" && <Check size={17} />}
                </button>

                <button
                  type="button"
                  className={privacy === "private" ? "active red" : ""}
                  onClick={() => setPrivacy("private")}
                >
                  <LockKeyhole size={20} />
                  <span>
                    <strong>Private</strong>
                    Only people with the link can view.
                  </span>
                  {privacy === "private" && <Check size={17} />}
                </button>
              </div>
            </div>

            <div className="create-card">
              <div className="create-card-heading">
                <span>03</span>
                <div>
                  <h2>Event photos</h2>
                  <p>
                    Upload a cover photo and up to three extra photos for your
                    event gallery.
                  </p>
                </div>
              </div>

              <div className="photo-upload-grid">
                {photos.map((photo, index) => (
                  <label
                    key={index}
                    className={`photo-upload ${index === 0 ? "large" : ""}`}
                  >
                    {photo ? (
                      <>
                        <img src={photo} alt={`Event ${index + 1}`} />
                        <button type="button" onClick={() => removePhoto(index)}>
                          Remove
                        </button>
                      </>
                    ) : (
                      <div>
                        {index === 0 ? (
                          <Camera size={28} />
                        ) : (
                          <ImagePlus size={24} />
                        )}
                        <strong>
                          {index === 0 ? "Cover Photo" : `Photo ${index + 1}`}
                        </strong>
                        <span>Upload image</span>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        handlePhotoChange(index, event.target.files[0])
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <aside className="create-sidebar">
            <div className="event-preview-card">
              <div className="preview-cover">
                {photos[0] ? (
                  <img src={photos[0]} alt="Preview" />
                ) : (
                  <div>
                    <Upload size={26} />
                    Cover preview
                  </div>
                )}

                <span>{selectedType?.label}</span>
              </div>

              <div className="preview-body">
                <h3>{previewTitle}</h3>

                <p>
                  <CalendarDays size={15} />
                  {previewDate}
                </p>

                <p>
                  <MapPin size={15} />
                  {previewLocation}
                </p>

                <div className="preview-goal">
                  <span>Goal</span>
                  <strong>RWF {Number(previewGoal).toLocaleString()}</strong>
                </div>

                <div className="preview-tags">
                  <span className={privacy === "public" ? "green" : "red"}>
                    {privacy === "public" ? "Public Event" : "Private Event"}
                  </span>

                  <span>{selectedPayment?.label}</span>
                </div>
              </div>
            </div>

            <div className="publish-card">
              <span>
                {isEditMode ? "Ready to update" : "Ready to publish"}
              </span>

              <div
                className="readiness-circle"
                style={{ "--progress": `${readiness}%` }}
              >
                <strong>{readiness}%</strong>
                <small>Complete</small>
              </div>

              <div className="publish-checklist">
                <p className={title ? "done" : ""}>
                  <Check size={15} />
                  Event title
                </p>

                <p className={date ? "done" : ""}>
                  <Check size={15} />
                  Event date
                </p>

                <p className={goalAmount ? "done" : ""}>
                  <Check size={15} />
                  Goal amount
                </p>

                <p className={phone ? "done" : ""}>
                  <Check size={15} />
                  Receiver phone
                </p>

                <p className={photos.some(Boolean) ? "done" : ""}>
                  <Check size={15} />
                  Event photos
                </p>
              </div>

              {formMessage && (
                <p
                  style={{
                    margin: "0 0 12px",
                    color: "#E50914",
                    fontSize: "13px",
                    fontWeight: 900,
                    lineHeight: 1.5,
                  }}
                >
                  {formMessage}
                </p>
              )}

              <button
                type="button"
                className="publish-button"
                onClick={handleSubmitEvent}
                disabled={loading || loadingEvent}
              >
                <Plus size={18} />
                {loadingEvent
                  ? "Loading Event..."
                  : loading
                  ? isEditMode
                    ? "Uploading & Updating..."
                    : "Uploading & Creating..."
                  : isEditMode
                  ? "Update Event"
                  : "Create Event"}
              </button>

              <button className="draft-button" type="button">
                Save Draft
                <ArrowRight size={17} />
              </button>

              <div className="secure-create-note">
                <ShieldCheck size={15} />
                Your event is protected by Contriba.
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default CreateEvent;