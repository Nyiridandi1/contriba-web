import {
  CalendarPlus,
  Share2,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import "./HowItWorks.css";

function HowItWorks() {
  const steps = [
    {
      icon: <CalendarPlus size={36} />,
      title: "Create Your Event",
      text: "Create a wedding, graduation, birthday or fundraiser in less than two minutes.",
    },
    {
      icon: <Share2 size={36} />,
      title: "Share Your Link",
      text: "Invite friends and family through WhatsApp, SMS or social media.",
    },
    {
      icon: <Wallet size={36} />,
      title: "Receive Contributions",
      text: "People contribute instantly using MTN MoMo or Airtel Money.",
    },
    {
      icon: <CheckCircle2 size={36} />,
      title: "Reach Your Goal",
      text: "Track every contribution live until your event is fully funded.",
    },
  ];

  return (
    <section className="how-it-works reveal" id="how">
      <div className="section-title">
        <span>HOW IT WORKS</span>

        <h2>Collect contributions in four simple steps</h2>
      </div>

      <div className="steps">
        {steps.map((step, index) => (
          <div
            className="step-card premium-hover stagger-item"
            key={index}
          >
            <div className="step-number">{index + 1}</div>

            <div className="step-icon">{step.icon}</div>

            <h3>{step.title}</h3>

            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;