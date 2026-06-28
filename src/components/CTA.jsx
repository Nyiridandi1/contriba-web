import "./CTA.css";

function CTA() {
  return (
    <section className="cta reveal">
      <div className="cta-glow cta-glow-one"></div>
      <div className="cta-glow cta-glow-two"></div>

      <div className="cta-box premium-hover">
        <div className="cta-shape shape-one"></div>
        <div className="cta-shape shape-two"></div>
        <div className="cta-shine"></div>

        <span>READY TO START?</span>

        <h2>
          Create your first event
          <br />
          in less than two minutes.
        </h2>

        <p>
          Join thousands of Rwandans using Contriba to collect contributions
          clearly, securely and beautifully.
        </p>

        <div className="cta-buttons">
          <a href="#create" className="primary-btn">
            Create Event →
          </a>

          <a href="#download" className="secondary-btn">
            Download App
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTA;