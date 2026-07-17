import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  Copy,
  Download,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  QrCode,
  Reply,
  Share2,
  ShieldCheck,
  Star,
  UserRound,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { createClient } from "@supabase/supabase-js";

import {
  addEventComment,
  getEvent,
  getEventComments,
  getEventContributions,
  getEventLikes,
  likeEvent,
  unlikeEvent,
} from "../api/api";

import { useAuth } from "../context/AuthContext";
import EventProgress from "../components/events/EventProgress";
import "./EventDetails.css";

// ── Supabase client for realtime ──
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const fallbackImage =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

function formatMoney(value) {
  return Number(value || 0).toLocaleString();
}

function formatDate(value) {
  if (!value) return "Date not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDaysLeft(value) {
  if (!value) return "Open";
  const eventDate = new Date(value);
  const today = new Date();
  if (Number.isNaN(eventDate.getTime())) return "Open";
  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Ended";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day left";
  return `${diffDays} days left`;
}

function formatTimeAgo(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function buildImages(event) {
  const images = [
    event?.cover_image,
    event?.photo2_url,
    event?.photo3_url,
    event?.photo4_url,
  ].filter(Boolean);
  return images.length > 0 ? images : [fallbackImage];
}

function normalizeEvent(event) {
  return {
    id: event.id,
    title: event.title || "Untitled Event",
    category: event.type || event.category || "Event",
    location: event.location || "Rwanda",
    date: formatDate(event.date),
    rawDate: event.date,
    raised: Number(event.total_raised || 0),
    target: Number(event.goal_amount || 0),
    contributors: Number(event.total_contributors || 0),
    daysLeft: formatDaysLeft(event.date),
    organizer: event.creator?.name || "Organizer",
    organizerPhone: event.creator?.phone || event.owner_phone || "Phone hidden",
    description:
      event.description ||
      "This event is collecting contributions through Contriba.",
    images: buildImages(event),
  };
}

function EventDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [comments, setComments] = useState([]);
  const [liveFeed, setLiveFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // ── SHARE STATE ──
  const [copied, setCopied] = useState(false);

  // ── QR STATE ──
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef(null);

  // ── LIKE STATE ──
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  // ── REALTIME REF ──
  const channelRef = useRef(null);

  const normalizedEvent = useMemo(() => {
    if (!event) return null;
    return normalizeEvent(event);
  }, [event]);

  function buildFreshShareUrl() {
  const baseUrl =
    import.meta.env.VITE_SHARE_BASE_URL ||
    "https://contriba-backend-production.up.railway.app";

  const rawVersion =
    event?.updated_at ||
    event?.created_at ||
    event?.date ||
    Date.now();

  const parsedVersion = new Date(rawVersion).getTime();

  const version = Number.isNaN(parsedVersion)
    ? Date.now()
    : parsedVersion;

  return `${baseUrl.replace(
    /\/+$/,
    ""
  )}/share/events/${encodeURIComponent(id)}?v=${version}`;
}
const shareUrl = buildFreshShareUrl();

  useEffect(() => {
    async function loadEventDetails() {
      setLoading(true);
      setMessage("");
      setSelectedImageIndex(0);

      const eventResult = await getEvent(id);

      if (!eventResult.success) {
        setMessage(eventResult.message || "Failed to load event.");
        setLoading(false);
        return;
      }

      setEvent(eventResult.event);
      setLiveFeed(eventResult.public_feed || []);

      const contributionsResult = await getEventContributions(id);
      if (contributionsResult.success) {
        setContributors(contributionsResult.contributions || []);
      }

      const commentsResult = await getEventComments(id);
      if (commentsResult.success) {
        setComments(commentsResult.comments || []);
      }

      const likesResult = await getEventLikes(id);
      if (likesResult.success) {
        setLikesCount(likesResult.likes || 0);
        setLiked(likesResult.liked || false);
      }

      setLoading(false);
    }

    loadEventDetails();
  }, [id]);

  // ── SUPABASE REALTIME FOR COMMENTS ──
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`comments-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `event_id=eq.${id}`,
        },
        (payload) => {
          // New comment arrives instantly
          setComments((prev) => {
            // Avoid duplicates
            const exists = prev.find((c) => c.id === payload.new.id);
            if (exists) return prev;
            return [payload.new, ...prev];
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [id]);

  async function handlePostComment() {
    if (!commentText.trim()) return;
    setCommentLoading(true);

    const result = await addEventComment(id, {
      name: commentName.trim() || "Guest",
      message: commentText.trim(),
      is_anonymous: !commentName.trim(),
    });

    if (result.success && result.comment) {
      // Optimistically add — realtime will also fire but we deduplicate
      setComments((current) => {
        const exists = current.find((c) => c.id === result.comment.id);
        if (exists) return current;
        return [result.comment, ...current];
      });
      setCommentName("");
      setCommentText("");
    }

    setCommentLoading(false);
  }

  // ── LIKE HANDLER ──
  async function handleLike() {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);

    if (liked) {
      const result = await unlikeEvent(id);
      if (result.success) {
        setLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      }
    } else {
      const result = await likeEvent(id);
      if (result.success) {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    }

    setLikeLoading(false);
  }

  // ── SHARE HANDLER ──
  async function handleShare() {
    const shareUrl = buildFreshShareUrl();
    const shareTitle = normalizedEvent?.title || "Check out this event";
    const shareText = `Support "${shareTitle}" on Contriba 🙌`;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
      } catch {
        // User cancelled
      }
      return;
    }

    handleCopyLink();
  }

  // ── COPY LINK HANDLER ──
  async function handleCopyLink() {
  const shareUrl = buildFreshShareUrl();

  try {
    await navigator.clipboard.writeText(shareUrl);
  } catch {
    const el = document.createElement("textarea");
    el.value = shareUrl;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }

  setCopied(true);
  setTimeout(() => setCopied(false), 2500);
}

  // ── QR DOWNLOAD HANDLER ──
  function handleDownloadQR() {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `contriba-${normalizedEvent?.title || "event"}-qr.png`;
    link.click();
  }

  if (loading) {
    return (
      <main className="event-details-page">
        <section className="event-details-hero event-details-skeleton-hero">
          <Link to="/events" className="event-details-back">
            <ArrowLeft size={18} />
            Back to Events
          </Link>

          <div className="event-details-gallery event-details-skeleton-gallery" aria-hidden="true">
            <div className="event-details-main-image skeleton-block skeleton-main-photo"></div>

            <div className="event-details-thumbs">
              <div className="event-thumb skeleton-block"></div>
              <div className="event-thumb skeleton-block"></div>
              <div className="event-thumb skeleton-block"></div>
            </div>
          </div>
        </section>

        <section className="event-details-content event-details-skeleton-content" aria-hidden="true">
          <div className="event-details-main">
            <div className="event-details-skeleton-title">
              <span className="skeleton-line skeleton-label-line"></span>
              <span className="skeleton-line skeleton-title-line"></span>
              <span className="skeleton-line skeleton-title-line short"></span>
            </div>

            <div className="event-details-meta skeleton-meta-row">
              <span className="skeleton-pill"></span>
              <span className="skeleton-pill"></span>
              <span className="skeleton-pill"></span>
            </div>

            <div className="event-details-card skeleton-card-preview">
              <span className="skeleton-line skeleton-card-title"></span>
              <span className="skeleton-line"></span>
              <span className="skeleton-line"></span>
              <span className="skeleton-line medium"></span>
            </div>

            <div className="event-details-card skeleton-card-preview">
              <span className="skeleton-line skeleton-card-title"></span>
              <div className="skeleton-list-preview">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <aside className="event-details-sidebar">
            <div className="event-sticky-card skeleton-sticky-preview">
              <span className="skeleton-line skeleton-card-title"></span>
              <span className="skeleton-line skeleton-money-line"></span>
              <div className="skeleton-progress"></div>
              <div className="skeleton-stats-grid">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="skeleton-button-line"></span>
            </div>
          </aside>
        </section>
      </main>
    );
  }

  if (!normalizedEvent) {
    return (
      <main className="event-details-page">
        <section className="event-details-hero">
          <Link to="/events" className="event-details-back">
            <ArrowLeft size={18} />
            Back to Events
          </Link>
          <div className="event-details-card">
            <h2>Event not found</h2>
            <p>{message || "This event could not be loaded."}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="event-details-page">

      {/* ── QR CODE MODAL ── */}
      {showQR && (
        <div className="qr-modal-overlay" onClick={() => setShowQR(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <div>
                <h3>Event QR Code</h3>
                <p>Scan to open and contribute to this event</p>
              </div>
              <button type="button" className="qr-modal-close" onClick={() => setShowQR(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="qr-code-wrapper" ref={qrRef}>
              <QRCodeCanvas
                value={shareUrl}
                size={220}
                bgColor="#ffffff"
                fgColor="#0a0a0a"
                level="H"
                includeMargin={true}
              />
            </div>

            <p className="qr-event-title">{normalizedEvent.title}</p>

            <div className="qr-url-box">
              <span>{shareUrl}</span>
            </div>

            <div className="qr-modal-actions">
              <button type="button" className="qr-btn-download" onClick={handleDownloadQR}>
                <Download size={17} />
                Download QR
              </button>
              <button type="button" className="qr-btn-copy" onClick={handleCopyLink}>
                {copied ? <Check size={17} /> : <Copy size={17} />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>

            <p className="qr-modal-note">
              Print this QR code and place it at your event for easy contributions.
            </p>
          </div>
        </div>
      )}

      <section className="event-details-hero">
        <Link to="/events" className="event-details-back">
          <ArrowLeft size={18} />
          Back to Events
        </Link>

        <div className="event-details-gallery">
          <button className="gallery-action gallery-left" type="button">
            <Eye size={17} />
            View all photos
          </button>

          <div className="event-details-main-image">
            <img src={normalizedEvent.images[selectedImageIndex]} alt={normalizedEvent.title} />
            <span>{normalizedEvent.category}</span>
            <div className="gallery-counter">
              {selectedImageIndex + 1} / {normalizedEvent.images.length}
            </div>
          </div>

          <div className="event-details-thumbs">
            {normalizedEvent.images
              .map((image, index) => ({ image, index }))
              .filter((item) => item.index !== selectedImageIndex)
              .slice(0, 3)
              .map(({ image, index }) => (
                <button
                  key={index}
                  type="button"
                  className="event-thumb"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={image} alt={`${normalizedEvent.title} ${index + 1}`} />
                </button>
              ))}
          </div>
        </div>
      </section>

      <section className="event-details-content">
        <div className="event-details-main">
          <div className="event-details-title-row">
            <div>
              <span className="event-details-label">Public Event</span>
              <h1>{normalizedEvent.title}</h1>
            </div>

            <div className="event-share-actions">
              <button
                type="button"
                onClick={handleLike}
                disabled={likeLoading}
                style={{
                  color: liked ? "#E50914" : undefined,
                  borderColor: liked ? "#E50914" : undefined,
                }}
              >
                <Heart
                  size={17}
                  fill={liked ? "#E50914" : "none"}
                  color={liked ? "#E50914" : "currentColor"}
                />
                {likesCount > 0 ? likesCount : "Save"}
              </button>

              <button type="button" onClick={handleShare}>
                <Share2 size={17} />
                Share
              </button>

              <button type="button" onClick={handleCopyLink}>
                {copied ? <Check size={17} /> : <Copy size={17} />}
                {copied ? "Copied!" : "Copy Link"}
              </button>

              <button type="button" onClick={() => setShowQR(true)}>
                <QrCode size={17} />
                QR Code
              </button>
            </div>
          </div>

          <div className="event-details-meta">
            <span><CalendarDays size={17} />{normalizedEvent.date}</span>
            <span><MapPin size={17} />{normalizedEvent.location}</span>
            <span><Clock size={17} />{normalizedEvent.daysLeft}</span>
          </div>

          <div className="event-live-card">
            <div className="event-live-heading">
              <div>
                <span className="live-dot"></span>
                <strong>Live Contribution Feed</strong>
              </div>
              <Zap size={18} />
            </div>
            <div className="live-feed-list">
              {liveFeed.length === 0 && (
                <div className="live-feed-item">
                  <span>No contribution yet</span>
                  <strong>RWF 0</strong>
                  <small>Be first</small>
                </div>
              )}
              {liveFeed.slice(0, 5).map((item) => (
                <div className="live-feed-item" key={item.id}>
                  <span>{item.name || "Guest"}</span>
                  <strong>{item.amount ? `RWF ${formatMoney(item.amount)}` : "Hidden"}</strong>
                  <small>{formatTimeAgo(item.created_at)}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="event-details-card">
            <h2>Event Story</h2>
            <p>{normalizedEvent.description}</p>
          </div>

          <div className="event-details-card">
            <div className="card-title-row">
              <h2>Recent Contributors</h2>
              <Link to={`/events/${id}/contributors`}>View all</Link>
            </div>
            <div className="contributors-list">
              {contributors.length === 0 && (
                <div className="contributor-item">
                  <div className="contributor-avatar"><UserRound size={18} /></div>
                  <div>
                    <strong>No contributors yet</strong>
                    <span>Be the first supporter</span>
                    <p>Your contribution can help this event move forward.</p>
                  </div>
                  <strong className="contributor-amount">RWF 0</strong>
                </div>
              )}
              {contributors.slice(0, 6).map((person) => (
                <div className="contributor-item" key={person.id}>
                  <div className="contributor-avatar"><UserRound size={18} /></div>
                  <div>
                    <strong>
                      {person.is_anonymous ? "Anonymous" : person.contributor_name || "Guest"}
                    </strong>
                    <span>{formatTimeAgo(person.created_at)}</span>
                    <p>{person.message || "Supported this event."}</p>
                  </div>
                  <strong className="contributor-amount">RWF {formatMoney(person.amount)}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* ── REALTIME COMMENTS ── */}
          <div className="event-details-card">
            <div className="card-title-row">
              <h2>
                Comments
                {comments.length > 0 && (
                  <span style={{
                    marginLeft: "8px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "rgba(0,0,0,0.4)"
                  }}>
                    ({comments.length})
                  </span>
                )}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="live-dot" style={{ width: "7px", height: "7px" }}></span>
                <span style={{ fontSize: "12px", color: "#E50914", fontWeight: 600 }}>Live</span>
              </div>
            </div>

            <div className="comment-form">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
              />
              <textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                type="button"
                onClick={handlePostComment}
                disabled={commentLoading || !commentText.trim()}
              >
                {commentLoading ? "Posting..." : "Post Comment"}
              </button>
            </div>

            <div className="comments-list">
              {comments.length === 0 && (
                <div className="comment-item">
                  <div className="comment-icon"><MessageCircle size={17} /></div>
                  <div>
                    <div className="comment-top">
                      <strong>No comments yet</strong>
                      <span>Be first</span>
                    </div>
                    <p>Leave a kind message for the organizer.</p>
                  </div>
                </div>
              )}
              {comments.map((comment) => (
                <div className="comment-item" key={comment.id}>
                  <div className="comment-icon"><MessageCircle size={17} /></div>
                  <div>
                    <div className="comment-top">
                      <strong>{comment.name || comment.is_anonymous ? "Anonymous" : "Guest"}</strong>
                      <span>{formatTimeAgo(comment.created_at)}</span>
                    </div>
                    <p>{comment.message}</p>
                    <div className="comment-actions">
                      <button type="button"><Heart size={14} />0</button>
                      <button type="button"><Reply size={14} />Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="event-details-sidebar">
          <div className="event-sticky-card">
            <div className="event-raised-box">
              <span>Raised so far</span>
              <strong>RWF {formatMoney(normalizedEvent.raised)}</strong>
              <p>of RWF {formatMoney(normalizedEvent.target)} goal</p>
            </div>

            <EventProgress raised={normalizedEvent.raised} target={normalizedEvent.target} />

            <div className="event-stats-grid">
              <div>
                <UsersRound size={18} />
                <strong>{normalizedEvent.contributors}</strong>
                <span>Contributors</span>
              </div>
              <div>
                <Clock size={18} />
                <strong>{normalizedEvent.daysLeft}</strong>
                <span>Status</span>
              </div>
            </div>

            <Link to={`/events/${id}/contribute`} className="event-contribute-btn">
              <Heart size={18} />
              Contribute Now
            </Link>

            <div className="event-secure-note">
              <ShieldCheck size={16} />
              Secure contribution through Contriba
            </div>
          </div>

          <div className="organizer-card">
            <span>Organizer</span>
            <div className="organizer-profile">
              <div className="organizer-avatar"><UserRound size={22} /></div>
              <div>
                <strong>{normalizedEvent.organizer}</strong>
                <p>{normalizedEvent.organizerPhone}</p>
              </div>
            </div>
            <div className="verified-line">
              <ShieldCheck size={15} />
              Verified Organizer
            </div>
            <div className="organizer-stats">
              <div>
                <Star size={16} />
                <strong>Live</strong>
                <span>Event status</span>
              </div>
              <div>
                <UsersRound size={16} />
                <strong>{normalizedEvent.contributors}</strong>
                <span>Supporters</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <div className="event-bottom-bar">
        <Link to={`/events/${id}/contribute`}>
          <Heart size={18} />
          Contribute
        </Link>
        <button type="button" onClick={handleLike} disabled={likeLoading}>
          <Heart
            size={18}
            fill={liked ? "#E50914" : "none"}
            color={liked ? "#E50914" : "currentColor"}
          />
          {liked ? `Liked ${likesCount}` : "Like"}
        </button>
        <button type="button" onClick={handleShare}>
          <Share2 size={18} />
          Share
        </button>
        <button type="button" onClick={() => setShowQR(true)}>
          <QrCode size={18} />
          QR Code
        </button>
      </div>
    </main>
  );
}

export default EventDetails;