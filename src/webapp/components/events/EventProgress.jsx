import { useLanguage } from "../../../context/LanguageContext.jsx";
import { translations } from "../../../i18n/translations.js";
import "./EventProgress.css";

function pickText(language, key, fallback) {
  return translations?.[language]?.[key] || translations?.English?.[key] || fallback;
}

function EventProgress({ raised = 0, target = 0 }) {
  const { language } = useLanguage();

  const safeRaised = Number(raised || 0);
  const safeTarget = Number(target || 0);

  const rawPercent =
    safeTarget > 0 ? (safeRaised / safeTarget) * 100 : 0;

  const displayPercent = Math.min(rawPercent, 100);

  const progressWidth =
    safeRaised > 0
      ? Math.max(displayPercent, 2)
      : 0;

  return (
    <div className="event-progress">
      <div className="event-progress-track">
        <div
          className="event-progress-fill"
          style={{
            width: `${progressWidth}%`,
          }}
        />
      </div>

      <div className="event-progress-details">
        <span className="event-progress-percent">
          {displayPercent.toFixed(2)}% {pickText(language, "funded", "Funded")}
        </span>

        <strong className="event-progress-amount">
          RWF {safeRaised.toLocaleString()} / {safeTarget.toLocaleString()}
        </strong>
      </div>
    </div>
  );
}

export default EventProgress;
