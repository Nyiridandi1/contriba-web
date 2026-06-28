import { CalendarPlus, Share2, WalletCards, BarChart3 } from "lucide-react";
import "./Features.css";

function Features() {
  const features = [
    {
      icon: <CalendarPlus />,
      title: "Create Events",
      text: "Set up weddings, graduations, birthdays, church events and fundraisers in minutes.",
    },
    {
      icon: <Share2 />,
      title: "Share Instantly",
      text: "Send one clean event link through WhatsApp, SMS, Instagram or any social platform.",
    },
    {
      icon: <WalletCards />,
      title: "Receive Securely",
      text: "Collect contributions through MTN MoMo and Airtel Money with a trusted payment flow.",
    },
    {
      icon: <BarChart3 />,
      title: "Track Progress",
      text: "See contributions, goals, contributors and progress clearly from your dashboard.",
    },
  ];

  return (
    <section className="features reveal" id="features">
      <div className="section-title">
        <span>POWERFUL FEATURES</span>

        <h2>
          Everything you need to collect contributions
          <br />
          with ease and confidence.
        </h2>
      </div>

      <div className="features-grid">
        {features.map((feature) => (
          <article
            className="feature-card premium-hover stagger-item"
            key={feature.title}
          >
            <div className="feature-icon">{feature.icon}</div>

            <h3>{feature.title}</h3>

            <p>{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Features;