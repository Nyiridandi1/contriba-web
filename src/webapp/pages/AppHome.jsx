import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CakeSlice,
  Church,
  Filter,
  GraduationCap,
  HandCoins,
  HeartHandshake,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getEvents } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { translations } from "../../i18n/translations.js";

import EventCard from "../components/events/EventCard";
import EventCategoryPill from "../components/events/EventCategoryPill";
import AppSidebar from "../components/AppSidebar";

import "./AppHome.css";

const CATEGORY_KEYS = [
  { Icon: Sparkles, key: "all", fallback: "All" },
  { Icon: HeartHandshake, key: "wedding", fallback: "Wedding" },
  { Icon: GraduationCap, key: "graduation", fallback: "Graduation" },
  { Icon: CakeSlice, key: "birthday", fallback: "Birthday" },
  { Icon: Church, key: "church", fallback: "Church" },
  { Icon: HandCoins, key: "fundraiser", fallback: "Fundraiser" },
];

const fallbackImage =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

const HOME_TEXT = {
  English: {
    public_events: "Public events",
    discover_events: "Discover events",
    browse_events:
      "Browse real weddings, graduations, birthdays, church events and fundraisers people are supporting right now.",
    search_placeholder: "Search events, people or locations...",
    clear_search: "Clear search",
    filters: "Filters",
    sort_by: "Sort by",
    newest: "Newest",
    most_raised: "Most Raised",
    most_contributors: "Most Contributors",
    ending_soon: "Ending Soon",
    status: "Status",
    all_events: "All Events",
    active: "Active",
    ended: "Ended",
    fully_funded: "Fully Funded",
    clear_all_filters: "Clear all filters",
    organizer_locked_title: "Organizer tools unlock after account creation",
    organizer_locked_desc:
      "Browse and contribute now. Create an account to manage events, wallet, reports, notifications and settings.",
    login: "Login",
    create_account: "Create Account",
    search_results: "Search results",
    live_events: "Live events",
    event_found: "event found",
    events_found: "events found",
    popular_events: "Popular Events",
    could_not_load_events: "Could not load events",
    no_results_found: "No results found",
    start_first_story: "Start the first contribution story",
    no_events_match: "No events match your search",
    no_public_events: "No public events yet",
    try_another_search:
      "Try another keyword, category or clear your filters to explore more events.",
    be_first_organizer:
      "Be the first organizer to create a beautiful contribution page for a wedding, graduation, birthday, church event or fundraiser.",
    clear_filters: "Clear filters",
    create_first_event: "Create First Event",
    secure_contributions: "Secure contributions",
    mobile_money_ready: "Mobile money ready",
    shareable_event_link: "Shareable event link",
    open: "Open",
    today: "Today",
    ended_day: "Ended",
    one_day_left: "1 day left",
    days_left: "days left",
    untitled_event: "Untitled Event",
    event: "Event",
    rwanda: "Rwanda",
  },

  Kinyarwanda: {
    public_events: "Ibirori rusange",
    discover_events: "Shakisha ibirori",
    browse_events:
      "Reba ubukwe, impamyabumenyi, isabukuru, ibikorwa by'itorero n'ibikorwa byo gukusanya inkunga abantu bari gushyigikira.",
    search_placeholder: "Shakisha ibirori, abantu cyangwa ahantu...",
    clear_search: "Siba ibyo washakishije",
    filters: "Muyunguruzi",
    sort_by: "Tondeka",
    newest: "Ibishya",
    most_raised: "Byakusanyije menshi",
    most_contributors: "Abaterankunga benshi",
    ending_soon: "Bigiye kurangira",
    status: "Imimerere",
    all_events: "Ibirori byose",
    active: "Bikora",
    ended: "Byarangiye",
    fully_funded: "Byuzuye inkunga",
    clear_all_filters: "Siba muyunguruzi zose",
    organizer_locked_title: "Ibikoresho by'umuyobozi bifunguka umaze gukora konti",
    organizer_locked_desc:
      "Reba kandi utange umusanzu nonaha. Kora konti kugira ngo ucunge ibirori, igikapo, raporo, imenyesha n'igenamiterere.",
    login: "Injira",
    create_account: "Kora konti",
    search_results: "Ibyabonetse",
    live_events: "Ibirori biri gukora",
    event_found: "ibirori byabonetse",
    events_found: "ibirori byabonetse",
    popular_events: "Ibirori bikunzwe",
    could_not_load_events: "Ntibyabashije kuzana ibirori",
    no_results_found: "Nta byabonetse",
    start_first_story: "Tangira inkuru ya mbere y'inkunga",
    no_events_match: "Nta birori bihuye n'ibyo ushaka",
    no_public_events: "Nta birori rusange birahari",
    try_another_search:
      "Gerageza irindi jambo, icyiciro cyangwa usibe muyunguruzi urebe ibindi birori.",
    be_first_organizer:
      "Ba umuyobozi wa mbere ukora paji nziza yo gukusanya inkunga ku bukwe, impamyabumenyi, isabukuru, igikorwa cy'itorero cyangwa fundraiser.",
    clear_filters: "Siba muyunguruzi",
    create_first_event: "Tegura ibirori bya mbere",
    secure_contributions: "Inkunga zizewe",
    mobile_money_ready: "Mobile money iriteguye",
    shareable_event_link: "Link y'ibirori isangizwa",
    open: "Birafunguye",
    today: "Uyu munsi",
    ended_day: "Byarangiye",
    one_day_left: "Hasigaye umunsi 1",
    days_left: "iminsi isigaye",
    untitled_event: "Ibirori bitiswe izina",
    event: "Ibirori",
    rwanda: "Rwanda",
  },

  Français: {
    public_events: "Événements publics",
    discover_events: "Découvrir les événements",
    browse_events:
      "Parcourez les mariages, remises de diplômes, anniversaires, événements religieux et collectes de fonds que les gens soutiennent maintenant.",
    search_placeholder: "Rechercher des événements, des personnes ou des lieux...",
    clear_search: "Effacer la recherche",
    filters: "Filtres",
    sort_by: "Trier par",
    newest: "Plus récents",
    most_raised: "Plus collectés",
    most_contributors: "Plus de contributeurs",
    ending_soon: "Bientôt terminé",
    status: "Statut",
    all_events: "Tous les événements",
    active: "Actifs",
    ended: "Terminés",
    fully_funded: "Entièrement financés",
    clear_all_filters: "Effacer tous les filtres",
    organizer_locked_title: "Les outils organisateur se débloquent après la création du compte",
    organizer_locked_desc:
      "Parcourez et contribuez maintenant. Créez un compte pour gérer les événements, le portefeuille, les rapports, les notifications et les paramètres.",
    login: "Connexion",
    create_account: "Créer un compte",
    search_results: "Résultats de recherche",
    live_events: "Événements actifs",
    event_found: "événement trouvé",
    events_found: "événements trouvés",
    popular_events: "Événements populaires",
    could_not_load_events: "Impossible de charger les événements",
    no_results_found: "Aucun résultat trouvé",
    start_first_story: "Commencer la première histoire de contribution",
    no_events_match: "Aucun événement ne correspond à votre recherche",
    no_public_events: "Aucun événement public pour le moment",
    try_another_search:
      "Essayez un autre mot-clé, une catégorie ou effacez vos filtres pour explorer plus d'événements.",
    be_first_organizer:
      "Soyez le premier organisateur à créer une belle page de contribution pour un mariage, une remise de diplôme, un anniversaire, une église ou une collecte.",
    clear_filters: "Effacer les filtres",
    create_first_event: "Créer le premier événement",
    secure_contributions: "Contributions sécurisées",
    mobile_money_ready: "Mobile money prêt",
    shareable_event_link: "Lien d'événement partageable",
    open: "Ouvert",
    today: "Aujourd'hui",
    ended_day: "Terminé",
    one_day_left: "1 jour restant",
    days_left: "jours restants",
    untitled_event: "Événement sans titre",
    event: "Événement",
    rwanda: "Rwanda",
  },
};

function getHomeText(language, key, fallback) {
  return (
    HOME_TEXT?.[language]?.[key] ||
    translations?.[language]?.[key] ||
    HOME_TEXT?.English?.[key] ||
    translations?.English?.[key] ||
    fallback
  );
}

function getStoredUser() {
  try {
    const savedUser = localStorage.getItem("contriba_user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

function getUserInitials(user) {
  const name = user?.name || user?.full_name || "Contriba User";
  const parts = String(name).trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatDaysLeft(date, t) {
  if (!date) return t("open", "Open");

  const eventDate = new Date(date);
  const today = new Date();

  if (Number.isNaN(eventDate.getTime())) return t("open", "Open");

  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return t("ended_day", "Ended");
  if (diffDays === 0) return t("today", "Today");
  if (diffDays === 1) return t("one_day_left", "1 day left");

  return `${diffDays} ${t("days_left", "days left")}`;
}

function normalizeEvent(event, t) {
  return {
    id: event.id,
    title: event.title || t("untitled_event", "Untitled Event"),
    category: event.type || event.category || t("event", "Event"),
    location: event.location || t("rwanda", "Rwanda"),
    raised: Number(event.total_raised || 0),
    target: Number(event.goal_amount || 0),
    contributors: Number(event.total_contributors || 0),
    daysLeft: formatDaysLeft(event.date, t),
    rawDateStatus: formatDaysLeft(event.date, getHomeText.bind(null, "English")),
    image: event.cover_image || event.photo_url || fallbackImage,
  };
}

function AppHome() {
  const { language } = useLanguage();
  const t = (key, fallback) => getHomeText(language, key, fallback);

  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated;
  const authUser = auth?.user;
  const storedUser = getStoredUser();
  const currentUser = authUser || storedUser;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filterFunded, setFilterFunded] = useState("all");

  const userInitials = getUserInitials(currentUser);

  const categories = useMemo(
    () =>
      CATEGORY_KEYS.map((category) => ({
        ...category,
        label: t(category.key, category.fallback),
      })),
    [language]
  );

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      setMessage("");

      const result = await getEvents();

      if (!result.success) {
        setMessage(result.message || t("could_not_load_events", "Failed to load events."));
        setEvents([]);
        setLoading(false);
        return;
      }

      setEvents(result.events || []);
      setLoading(false);
    }

    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizedEvents = useMemo(
    () => events.map((event) => normalizeEvent(event, t)),
    [events, language]
  );

  const filteredEvents = useMemo(() => {
    let result = [...normalizedEvents];

    if (activeCategory !== "all") {
      result = result.filter(
        (event) => event.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (event) =>
          event.title?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query) ||
          event.category?.toLowerCase().includes(query)
      );
    }

    if (filterFunded === "active") {
      result = result.filter((event) => event.rawDateStatus !== "Ended");
    } else if (filterFunded === "ended") {
      result = result.filter((event) => event.rawDateStatus === "Ended");
    } else if (filterFunded === "funded") {
      result = result.filter((event) => event.target > 0 && event.raised >= event.target);
    }

    if (sortBy === "most_raised") {
      result.sort((a, b) => b.raised - a.raised);
    } else if (sortBy === "most_contributors") {
      result.sort((a, b) => b.contributors - a.contributors);
    } else if (sortBy === "ending_soon") {
      result.sort((a, b) => {
        if (a.rawDateStatus === "Ended") return 1;
        if (b.rawDateStatus === "Ended") return -1;
        return 0;
      });
    }

    return result;
  }, [normalizedEvents, searchQuery, activeCategory, sortBy, filterFunded]);

  function clearSearch() {
    setSearchQuery("");
    setActiveCategory("all");
    setFilterFunded("all");
    setSortBy("newest");
  }

  const hasActiveFilters =
    searchQuery ||
    activeCategory !== "all" ||
    filterFunded !== "all" ||
    sortBy !== "newest";

  return (
    <main className="app-home-page">
      <AppSidebar active="home" />

      <section className="app-home-main">
        <header className="app-home-topbar">
          <div>
            <span>{t("public_events", "Public events")}</span>
            <h1>{t("discover_events", "Discover events")}</h1>
            <p>{t("browse_events", "Browse real weddings, graduations, birthdays, church events and fundraisers people are supporting right now.")}</p>
          </div>

          <div className="app-home-top-actions">
            <div className="app-home-search">
              <Search size={18} />

              <input
                type="text"
                placeholder={t("search_placeholder", "Search events, people or locations...")}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />

              {searchQuery && (
                <button
                  className="app-home-search-clear"
                  onClick={clearSearch}
                  type="button"
                  aria-label={t("clear_search", "Clear search")}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              type="button"
              className={showFilters ? "active" : ""}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              {t("filters", "Filters")}
              {hasActiveFilters && <span className="filter-dot" />}
            </button>

            <Link
              to={isAuthenticated ? "/notifications" : "/login"}
              className="app-home-icon-action"
              aria-label={t("notifications", "Notifications")}
            >
              <Bell size={18} />
            </Link>

            {isAuthenticated && (
              <Link to="/profile" className="app-home-user-avatar">
                <span className="app-home-user-online"></span>

                {currentUser?.avatar_url ? (
                  <img src={currentUser.avatar_url} alt={t("profile", "Profile")} />
                ) : (
                  <strong>{userInitials}</strong>
                )}
              </Link>
            )}
          </div>
        </header>

        {showFilters && (
          <div className="app-home-filter-panel">
            <div className="filter-panel-inner">
              <div className="filter-group">
                <label>{t("sort_by", "Sort by")}</label>

                <div className="filter-chips">
                  {[
                    { value: "newest", label: t("newest", "Newest") },
                    { value: "most_raised", label: t("most_raised", "Most Raised") },
                    { value: "most_contributors", label: t("most_contributors", "Most Contributors") },
                    { value: "ending_soon", label: t("ending_soon", "Ending Soon") },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={sortBy === option.value ? "active" : ""}
                      onClick={() => setSortBy(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label>{t("status", "Status")}</label>

                <div className="filter-chips">
                  {[
                    { value: "all", label: t("all_events", "All Events") },
                    { value: "active", label: t("active", "Active") },
                    { value: "ended", label: t("ended", "Ended") },
                    { value: "funded", label: t("fully_funded", "Fully Funded") },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={filterFunded === option.value ? "active" : ""}
                      onClick={() => setFilterFunded(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button type="button" className="filter-clear-btn" onClick={clearSearch}>
                  <X size={14} />
                  {t("clear_all_filters", "Clear all filters")}
                </button>
              )}
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <section className="app-home-lock-banner">
            <div className="app-home-lock-badge">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h3>{t("organizer_locked_title", "Organizer tools unlock after account creation")}</h3>
              <p>{t("organizer_locked_desc", "Browse and contribute now. Create an account to manage events, wallet, reports, notifications and settings.")}</p>
            </div>

            <div className="app-home-lock-actions">
              <Link to="/login">{t("login", "Login")}</Link>
              <Link to="/register">{t("create_account", "Create Account")}</Link>
            </div>
          </section>
        )}

        <section className="app-home-categories">
          {categories.map((category) => (
            <EventCategoryPill
              key={category.key}
              Icon={category.Icon}
              label={category.label}
              active={activeCategory === category.key}
              onClick={() => setActiveCategory(category.key)}
            />
          ))}
        </section>

        <section className="app-home-section-header">
          <div>
            <span>{hasActiveFilters ? t("search_results", "Search results") : t("live_events", "Live events")}</span>

            <h2>
              {hasActiveFilters
                ? `${filteredEvents.length} ${
                    filteredEvents.length === 1
                      ? t("event_found", "event found")
                      : t("events_found", "events found")
                  }`
                : t("popular_events", "Popular Events")}
            </h2>
          </div>
        </section>

        {loading && (
          <section className="app-home-events-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="app-home-skeleton-card">
                <div className="app-home-skeleton-image shimmer"></div>

                <div className="app-home-skeleton-body">
                  <div className="app-home-skeleton-pill shimmer"></div>
                  <div className="app-home-skeleton-title shimmer"></div>
                  <div className="app-home-skeleton-line shimmer"></div>
                  <div className="app-home-skeleton-line short shimmer"></div>
                  <div className="app-home-skeleton-progress shimmer"></div>

                  <div className="app-home-skeleton-footer">
                    <div className="app-home-skeleton-avatar shimmer"></div>
                    <div className="app-home-skeleton-small shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {!loading && message && (
          <section className="app-home-empty-state">
            <h3>{t("could_not_load_events", "Could not load events")}</h3>
            <p>{message}</p>
          </section>
        )}

        {!loading && !message && filteredEvents.length === 0 && (
          <section className="app-home-empty-state contriba-empty-state">
            <div className="contriba-empty-icon">
              <Sparkles size={30} />
            </div>

            <span className="contriba-empty-label">
              {hasActiveFilters
                ? t("no_results_found", "No results found")
                : t("start_first_story", "Start the first contribution story")}
            </span>

            <h3>
              {hasActiveFilters
                ? t("no_events_match", "No events match your search")
                : t("no_public_events", "No public events yet")}
            </h3>

            <p>
              {hasActiveFilters
                ? t("try_another_search", "Try another keyword, category or clear your filters to explore more events.")
                : t("be_first_organizer", "Be the first organizer to create a beautiful contribution page for a wedding, graduation, birthday, church event or fundraiser.")}
            </p>

            <div className="contriba-empty-actions">
              {hasActiveFilters ? (
                <button type="button" onClick={clearSearch}>
                  {t("clear_filters", "Clear filters")}
                </button>
              ) : (
                <Link to={isAuthenticated ? "/create-event" : "/register"}>
                  {t("create_first_event", "Create First Event")}
                </Link>
              )}
            </div>

            {!hasActiveFilters && (
              <div className="contriba-empty-trust">
                <span>{t("secure_contributions", "Secure contributions")}</span>
                <span>{t("mobile_money_ready", "Mobile money ready")}</span>
                <span>{t("shareable_event_link", "Shareable event link")}</span>
              </div>
            )}
          </section>
        )}

        {!loading && !message && filteredEvents.length > 0 && (
          <section className="app-home-events-grid">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

export default AppHome;
