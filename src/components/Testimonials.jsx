import { Quote, ShieldCheck } from "lucide-react";
import "./Testimonials.css";

function Testimonials() {
  const testimonials = [
    {
      name: "Aline Uwase",
      role: "Wedding Organizer",
      initials: "AU",
      event: "Wedding",
      quote:
        "Contriba made our wedding contributions simple, clear and organized. Everyone had one trusted link to use.",
    },
    {
      name: "Jean Claude",
      role: "Graduation Event",
      initials: "JC",
      event: "Graduation",
      quote:
        "One link replaced endless WhatsApp messages. I could see every contribution and follow up easily.",
    },
    {
      name: "Grace Mukamana",
      role: "Church Fundraiser",
      initials: "GM",
      event: "Fundraiser",
      quote:
        "People trusted it quickly because the event page looked professional, secure and very easy to use.",
    },
    {
      name: "Eric Niyonzima",
      role: "Birthday Event",
      initials: "EN",
      event: "Birthday",
      quote:
        "It helped us receive support faster and manage everything from one clean contribution page.",
    },
  ];

  return (
    <section className="testimonials reveal">
      <div className="testimonials-glow testimonials-glow-one"></div>
      <div className="testimonials-glow testimonials-glow-two"></div>

      <div className="section-title testimonials-title">
        <span>TESTIMONIALS</span>

        <h2>
          Loved by people creating meaningful moments.
        </h2>

        <p>
          From weddings to graduations and fundraisers, Contriba helps families
          collect support with clarity, trust and less stress.
        </p>
      </div>

      <div className="testimonial-slider">
        <div className="testimonial-track">
          {[...testimonials, ...testimonials].map((item, index) => (
            <article className="testimonial-card premium-hover" key={index}>
              <div className="testimonial-top">
                <div className="quote-badge">
                  <Quote size={24} />
                </div>

                <div className="event-pill">
                  <ShieldCheck size={15} />
                  {item.event}
                </div>
              </div>

              <div className="stars">★★★★★</div>

              <p>“{item.quote}”</p>

              <div className="testimonial-user">
                <div className="avatar">{item.initials}</div>

                <div>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;