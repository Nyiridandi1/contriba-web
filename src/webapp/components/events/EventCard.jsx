import {
  ArrowRight,
  Clock3,
  MapPin,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useLanguage } from "../../../context/LanguageContext.jsx";
import { translations } from "../../../i18n/translations.js";
import EventProgress from "./EventProgress";
import "./EventCard.css";

function pickText(language, key, fallback) {
  return translations?.[language]?.[key] || translations?.English?.[key] || fallback;
}

function translateCategory(category, language) {
  const raw = String(category || "").trim();
  const key = raw.toLowerCase();

  const categoryMap = {
    all: "all",
    wedding: "wedding",
    graduation: "graduation",
    birthday: "birthday",
    church: "church",
    fundraiser: "fundraiser",
    event: "event",
  };

  return pickText(language, categoryMap[key] || key, raw || pickText(language, "event", "Event"));
}

function EventCard({ event }) {
  const { language } = useLanguage();

  const contributorsLabel =
    Number(event.contributors || 0) === 1
      ? pickText(language, "contributor", "contributor")
      : pickText(language, "contributors", "contributors");

  return (
    <article className="event-card">
      <Link to={`/events/${event.id}`} className="event-card-image-link">
        <div className="event-card-media">
          <img src={event.image} alt={event.title} />

          <div className="event-card-overlay"></div>

          <span className="event-card-category">
            {translateCategory(event.category, language)}
          </span>
        </div>
      </Link>

      <div className="event-card-body">
        <Link to={`/events/${event.id}`} className="event-card-title">
          {event.title}
        </Link>

        <p className="event-card-location">
          <MapPin size={13} />
          {event.location}
        </p>

        <div className="event-card-meta">
          <span>
            <UsersRound size={13} />
            {event.contributors} {contributorsLabel}
          </span>

          <span>
            <Clock3 size={13} />
            {event.daysLeft}
          </span>
        </div>

        <EventProgress raised={event.raised} target={event.target} />

        <Link to={`/events/${event.id}`} className="event-card-button">
          {pickText(language, "view_details", "View Details")}
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

export default EventCard;
