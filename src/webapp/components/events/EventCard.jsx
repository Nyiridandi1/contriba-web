import {
  ArrowRight,
  Clock3,
  MapPin,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import EventProgress from "./EventProgress";
import "./EventCard.css";

function EventCard({ event }) {
  return (
    <article className="event-card">
      <Link to={`/events/${event.id}`} className="event-card-image-link">
        <div className="event-card-media">
          <img src={event.image} alt={event.title} />

          <div className="event-card-overlay"></div>

          <span className="event-card-category">
            {event.category}
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
            {event.contributors} contributors
          </span>

          <span>
            <Clock3 size={13} />
            {event.daysLeft}
          </span>
        </div>

        <EventProgress raised={event.raised} target={event.target} />

        <Link to={`/events/${event.id}`} className="event-card-button">
          View Details
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

export default EventCard;