import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import "./ShareCardPage.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=90";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://contriba-backend-production.up.railway.app";

function number(value) {
  const parsed =
    Number(value || 0);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function formatMoney(value) {
  return `RWF ${Math.round(
    number(value)
  ).toLocaleString("en-US")}`;
}

function formatDaysLeft(value) {
  if (!value) {
    return "Open";
  }

  const eventDate =
    new Date(value);

  if (
    Number.isNaN(
      eventDate.getTime()
    )
  ) {
    return "Open";
  }

  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  eventDate.setHours(
    0,
    0,
    0,
    0
  );

  const difference =
    eventDate.getTime() -
    today.getTime();

  const days =
    Math.ceil(
      difference /
        (
          1000 *
          60 *
          60 *
          24
        )
    );

  if (days < 0) {
    return "Ended";
  }

  if (days === 0) {
    return "Today";
  }

  if (days === 1) {
    return "1 day left";
  }

  return `${days} days left`;
}

function normalizeEvent(event) {
  const raised =
    number(
      event.total_raised ||
        event.raised ||
        event.amount_raised
    );

  const target =
    number(
      event.goal_amount ||
        event.goal ||
        event.target
    );

  const progress =
    target > 0
      ? Math.min(
          (
            raised /
            target
          ) *
            100,
          100
        )
      : 0;

  return {
    id:
      event.id,

    title:
      event.title ||
      "Untitled Event",

    category:
      event.type ||
      event.category ||
      "Event",

    location:
      event.location ||
      "Rwanda",

    raised,

    target,

    progress,

    contributors:
      number(
        event.total_contributors ||
          event.contributors ||
          event.contributors_count
      ),

    daysLeft:
      formatDaysLeft(
        event.date ||
          event.event_date ||
          event.start_date
      ),

    image:
      event.cover_image ||
      event.photo_url ||
      event.image_url ||
      FALLBACK_IMAGE,
  };
}

function markReady() {
  document.documentElement.setAttribute(
    "data-share-card-ready",
    "true"
  );

  document.body.setAttribute(
    "data-share-card-ready",
    "true"
  );

  window.__CONTRIBA_SHARE_CARD_READY__ =
    true;
}

function markFailed() {
  document.documentElement.setAttribute(
    "data-share-card-error",
    "true"
  );

  document.body.setAttribute(
    "data-share-card-error",
    "true"
  );

  window.__CONTRIBA_SHARE_CARD_ERROR__ =
    true;
}

function waitForImage(imageUrl) {
  return new Promise(
    (resolve) => {
      const image =
        new Image();

      image.onload =
        resolve;

      image.onerror =
        resolve;

      image.src =
        imageUrl;

      if (image.complete) {
        resolve();
      }
    }
  );
}

function SharePreview({
  event,
}) {
  return (
    <article className="social-preview">
      <div className="social-preview-photo">
        <img
          src={event.image}
          alt=""
        />

        <div className="social-preview-photo-shade" />

        <div className="social-preview-brand">
          <span className="social-preview-logo">
            ∞
          </span>

          <span>
            Contriba
          </span>
        </div>

        <div className="social-preview-category">
          {event.category}
        </div>

        <div className="social-preview-photo-title">
          <h1>
            {event.title}
          </h1>

          <p>
            Support this event securely
            with Contriba.
          </p>
        </div>
      </div>

      <div className="social-preview-panel">
        <div className="social-preview-panel-top">
          <span className="social-preview-eyebrow">
            PUBLIC EVENT
          </span>

          <h2>
            {event.title}
          </h2>

          <div className="social-preview-meta">
            <span>
              📍 {event.location}
            </span>

            <span>
              👥 {event.contributors} Contributors
            </span>

            <span>
              ⏱ {event.daysLeft}
            </span>
          </div>
        </div>

        <div className="social-preview-funding">
          <div className="social-preview-funding-row">
            <div>
              <small>
                RAISED
              </small>

              <strong>
                {formatMoney(
                  event.raised
                )}
              </strong>
            </div>

            <div className="social-preview-progress-value">
              {event.progress.toFixed(
                1
              )}
              %
            </div>
          </div>

          <div className="social-preview-progress">
            <div
              className="social-preview-progress-fill"
              style={{
                width: `${Math.max(
                  event.progress,
                  event.progress > 0
                    ? 1.5
                    : 0
                )}%`,
              }}
            />
          </div>

          <div className="social-preview-goal">
            Goal:{" "}
            {formatMoney(
              event.target
            )}
          </div>
        </div>

        <div className="social-preview-button">
          Contribute Now
          <span>
            →
          </span>
        </div>

        <div className="social-preview-footer">
          <span>
            contriba.online
          </span>

          <span>
            Secure contributions
          </span>
        </div>
      </div>
    </article>
  );
}

function ShareCardPage() {
  const {
    eventId,
  } = useParams();

  const [
    event,
    setEvent,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    let cancelled =
      false;

    async function loadEvent() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/api/events/${encodeURIComponent(
              eventId
            )}`,
            {
              headers: {
                Accept:
                  "application/json",
              },
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result?.success ||
          !result?.event
        ) {
          throw new Error(
            result?.message ||
              "Event not found"
          );
        }

        const normalized =
          normalizeEvent(
            result.event
          );

        await waitForImage(
          normalized.image
        );

        if (cancelled) {
          return;
        }

        setEvent(
          normalized
        );

        setLoading(false);

        requestAnimationFrame(
          () => {
            requestAnimationFrame(
              markReady
            );
          }
        );
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        console.error(
          "Share preview load failed:",
          loadError
        );

        setError(
          loadError.message ||
            "Unable to load event"
        );

        setLoading(false);

        markFailed();
      }
    }

    if (!eventId) {
      setLoading(false);
      setError(
        "Event ID is missing"
      );
      markFailed();

      return undefined;
    }

    loadEvent();

    return () => {
      cancelled =
        true;
    };
  }, [eventId]);

  const content =
    useMemo(() => {
      if (loading) {
        return (
          <div className="social-preview-state">
            Loading event preview…
          </div>
        );
      }

      if (
        error ||
        !event
      ) {
        return (
          <div className="social-preview-state">
            {error ||
              "Event unavailable"}
          </div>
        );
      }

      return (
        <SharePreview
          event={event}
        />
      );
    }, [
      loading,
      error,
      event,
    ]);

  return (
    <main className="share-card-page">
      <section
        id="contriba-share-card"
        className="share-card-capture"
      >
        {content}
      </section>
    </main>
  );
}

export default ShareCardPage;