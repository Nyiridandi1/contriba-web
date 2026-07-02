import "./EventProgress.css";

function EventProgress({ raised, target }) {
  const percent = Math.min(Math.round((raised / target) * 100), 100);

  return (
    <div className="event-progress">
      <div className="event-progress-track">
        <div
          className="event-progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="event-progress-details">
        <span className="event-progress-percent">
          {percent}% Funded
        </span>

        <strong className="event-progress-amount">
          RWF {raised.toLocaleString()} / {target.toLocaleString()}
        </strong>
      </div>
    </div>
  );
}

export default EventProgress;