import "./EventCategoryPill.css";

function EventCategoryPill({ Icon, label, active }) {
  return (
    <button className={`event-category-pill ${active ? "active" : ""}`}>
      <Icon size={17} />
      {label}
    </button>
  );
}

export default EventCategoryPill;