import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import EventCard from "../webapp/components/events/EventCard";

import "./ShareCardPage.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://contriba-backend-production.up.railway.app";

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
  return {
    id: event.id,

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

    raised: Number(
      event.total_raised ||
        event.raised ||
        event.amount_raised ||
        0
    ),

    target: Number(
      event.goal_amount ||
        event.goal ||
        event.target ||
        0
    ),

    contributors: Number(
      event.total_contributors ||
        event.contributors ||
        event.contributors_count ||
        0
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

function markShareCardReady() {
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

function markShareCardFailed() {
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
  return new Promise((resolve) => {
    if (!imageUrl) {
      resolve();
      return;
    }

    const image =
      new Image();

    image.onload = () => {
      resolve();
    };

    image.onerror = () => {
      resolve();
    };

    image.src =
      imageUrl;

    if (image.complete) {
      resolve();
    }
  });
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
              method: "GET",

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
              () => {
                markShareCardReady();
              }
            );
          }
        );
      } catch (loadError) {
        console.error(
          "Share card event load failed:",
          loadError
        );

        if (cancelled) {
          return;
        }

        setError(
          loadError.message ||
            "Unable to load event"
        );

        setLoading(false);

        markShareCardFailed();
      }
    }

    if (!eventId) {
      setError(
        "Event ID is missing"
      );

      setLoading(false);

      markShareCardFailed();

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
          <div className="share-card-loading">
            <div className="share-card-loading-image" />

            <div className="share-card-loading-body">
              <div className="share-card-loading-title" />
              <div className="share-card-loading-line" />
              <div className="share-card-loading-line short" />
              <div className="share-card-loading-progress" />
              <div className="share-card-loading-button" />
            </div>
          </div>
        );
      }

      if (
        error ||
        !event
      ) {
        return (
          <div className="share-card-error">
            <strong>
              Event unavailable
            </strong>

            <span>
              {error ||
                "This event could not be loaded."}
            </span>
          </div>
        );
      }

      return (
        <EventCard
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