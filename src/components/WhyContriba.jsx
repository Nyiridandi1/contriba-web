import phone from "../assets/event-phone.png";
import { CheckCircle2, XCircle } from "lucide-react";
import "./WhyContriba.css";

function WhyContriba() {
  const oldWay = [
    "Collect money in WhatsApp groups",
    "No live contribution tracking",
    "People forget to contribute",
    "Hard to know who already paid",
  ];

  const newWay = [
    "Beautiful event page",
    "Real-time contribution progress",
    "Automatic payment tracking",
    "Professional experience for everyone",
  ];

  return (
    <section className="why-contriba reveal">

      <div className="section-title">

        <span>WHY CONTRIBA</span>

        <h2>
          Stop chasing contributions.
          <br />
          Let Contriba do the work.
        </h2>

      </div>

      <div className="comparison-layout">

        <div className="comparison-column">

          <h3 className="comparison-heading old">
            Without Contriba
          </h3>

          {oldWay.map((item, index) => (

            <div
              className="comparison-item old-item premium-hover"
              key={index}
            >
              <XCircle size={22} />

              <span>{item}</span>
            </div>

          ))}

        </div>

        <div className="comparison-phone">

          <div className="phone-ring"></div>

          <img
            src={phone}
            alt="Contriba Event"
            className="float-soft"
          />

        </div>

        <div className="comparison-column">

          <h3 className="comparison-heading new">
            With Contriba ❤️
          </h3>

          {newWay.map((item, index) => (

            <div
              className="comparison-item new-item premium-hover"
              key={index}
            >
              <CheckCircle2 size={22} />

              <span>{item}</span>
            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default WhyContriba;