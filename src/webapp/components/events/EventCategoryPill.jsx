import "./EventCategoryPill.css";

function EventCategoryPill({ Icon, label, active = false, onClick }) {
  return (
    <button
      type="button"
      className={`event-category-pill ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {Icon && <Icon size={16} />}
      {label}
    </button>
  );
}

export default EventCategoryPill;