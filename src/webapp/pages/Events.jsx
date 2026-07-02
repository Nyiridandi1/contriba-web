import {
  ArrowRight,
  CakeSlice,
  Church,
  GraduationCap,
  HandCoins,
  HeartHandshake,
  Plus,
  PlusCircle,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

import logoIcon from "../../assets/logo-icon.png";
import EventCard from "../components/events/EventCard";
import EventCategoryPill from "../components/events/EventCategoryPill";

import "./Events.css";

const categories = [
  { Icon: Sparkles, label: "All", active: true },
  { Icon: HeartHandshake, label: "Wedding" },
  { Icon: GraduationCap, label: "Graduation" },
  { Icon: CakeSlice, label: "Birthday" },
  { Icon: Church, label: "Church" },
  { Icon: HandCoins, label: "Fundraiser" },
];

const events = [
  {
    id: "jean-alice-wedding",
    title: "Jean & Alice Wedding",
    category: "Wedding",
    location: "Kigali Convention Centre",
    raised: 3850000,
    target: 5000000,
    contributors: 287,
    daysLeft: "5 days left",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "olivier-graduation",
    title: "Olivier Graduation Celebration",
    category: "Graduation",
    location: "Kigali, Rwanda",
    raised: 1329000,
    target: 3000000,
    contributors: 119,
    daysLeft: "12 days left",
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "aime-birthday",
    title: "Aime Birthday Surprise",
    category: "Birthday",
    location: "Nyarutarama",
    raised: 920000,
    target: 1200000,
    contributors: 76,
    daysLeft: "2 days left",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "church-thanksgiving",
    title: "Church Thanksgiving Event",
    category: "Church",
    location: "Remera Worship Centre",
    raised: 2450000,
    target: 4000000,
    contributors: 203,
    daysLeft: "18 days left",
    image:
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "help-kevin-surgery",
    title: "Help Kevin's Surgery",
    category: "Fundraiser",
    location: "Kacyiru",
    raised: 1885000,
    target: 3000000,
    contributors: 154,
    daysLeft: "9 days left",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "baby-shower-diane",
    title: "Diane Baby Shower",
    category: "Baby Shower",
    location: "Kibagabaga",
    raised: 640000,
    target: 1000000,
    contributors: 58,
    daysLeft: "7 days left",
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80",
  },
];

function Events() {
  return (
    <main className="events-page">
      <section className="events-hero">
        <div className="events-hero-content">
          <img src={logoIcon} alt="Contriba" className="events-hero-logo" />

          <div className="events-hero-symbol">co</div>
          <div className="events-hero-circle one"></div>
          <div className="events-hero-circle two"></div>

          <div className="events-hero-grid">
            <div className="events-hero-main">
              <span className="events-badge">
                <Sparkles size={16} />
                Public Events
              </span>

              <h1>Find an event to support.</h1>

              <p>
                Browse weddings, graduations, birthdays, church events and
                fundraisers. Contribute securely in just a few clicks.
              </p>

              <div className="events-hero-actions">
                <Link to="/create-event" className="events-hero-primary">
                  <PlusCircle size={18} />
                  Create Event
                </Link>

                <a href="#featured-events" className="events-hero-secondary">
                  Browse Events
                  <ArrowRight size={18} />
                </a>
              </div>

              <div className="events-search">
                <Search size={21} />
                <input
                  type="text"
                  placeholder="Search by event name, owner or location..."
                />
                <button>Search</button>
              </div>

              <div className="events-categories">
                {categories.map((category) => (
                  <EventCategoryPill
                    key={category.label}
                    Icon={category.Icon}
                    label={category.label}
                    active={category.active}
                  />
                ))}
              </div>
            </div>

            <div className="events-feature-card">
              <div className="events-feature-top">
                <span>Featured</span>
                <TrendingUp size={18} />
              </div>

              <h3>Jean & Alice Wedding</h3>
              <p>287 people already contributed this week.</p>

              <div className="events-feature-amount">
                <strong>RWF 3.85M</strong>
                <span>of RWF 5M</span>
              </div>

              <div className="events-feature-track">
                <div></div>
              </div>

              <Link
                to="/events/jean-alice-wedding"
                className="events-feature-link"
              >
                View featured event
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="events-create-cta">
        <div className="events-create-card">
          <div>
            <span>
              <PlusCircle size={16} />
              Create your own event
            </span>

            <h2>Planning a wedding, graduation or celebration?</h2>

            <p>
              Create a beautiful contribution page and let friends, family and
              community support your moment securely.
            </p>
          </div>

          <Link to="/create-event" className="events-create-button">
            Create Event
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="events-section" id="featured-events">
        <div className="events-section-header">
          <div>
            <span>Featured Events</span>
            <h2>Events people are supporting</h2>
          </div>

          <p>Premium public contribution pages for real life moments.</p>
        </div>

        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <Link to="/create-event" className="events-floating-create">
        <Plus size={20} />
        <span>Create Event</span>
      </Link>
    </main>
  );
}

export default Events;