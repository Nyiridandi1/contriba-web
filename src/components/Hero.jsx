import phone from "../assets/home-phone.png";
import heroBg from "../assets/hero-bg.png";
import "./Hero.css";

function Hero() {
  const handleMouseMove = (event) => {
    if (window.innerWidth < 900) return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    event.currentTarget.style.setProperty("--move-x", `${x * 24}px`);
    event.currentTarget.style.setProperty("--move-y", `${y * 18}px`);
    event.currentTarget.style.setProperty("--glow-x", `${x * -35}px`);
    event.currentTarget.style.setProperty("--glow-y", `${y * -28}px`);
    event.currentTarget.style.setProperty("--mouse-x", `${mouseX}px`);
    event.currentTarget.style.setProperty("--mouse-y", `${mouseY}px`);
    event.currentTarget.style.setProperty("--shine-x", `${mouseX}px`);
    event.currentTarget.style.setProperty("--shine-y", `${mouseY}px`);
  };

  const handleMouseLeave = (event) => {
    event.currentTarget.style.setProperty("--move-x", "0px");
    event.currentTarget.style.setProperty("--move-y", "0px");
    event.currentTarget.style.setProperty("--glow-x", "0px");
    event.currentTarget.style.setProperty("--glow-y", "0px");
    event.currentTarget.style.setProperty("--mouse-x", "50%");
    event.currentTarget.style.setProperty("--mouse-y", "45%");
    event.currentTarget.style.setProperty("--shine-x", "50%");
    event.currentTarget.style.setProperty("--shine-y", "45%");
  };

  return (
    <main
      className="hero dark-navbar-section reveal"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundImage: `url(${heroBg})`,
      }}
    >
      <div className="hero-mouse-light"></div>

      <div className="hero-content">
        <div className="hero-left">
          <div className="hero-badge">
            Made for weddings, graduations, birthdays and fundraisers
          </div>

          <h1>
            Collect event contributions without stress.
          </h1>

          <p>
            Create a beautiful event page, share one simple link, receive MTN
            MoMo and Airtel Money contributions, and track every payment clearly
            in one place.
          </p>

          <div className="hero-actions">
            <a href="#create" className="primary-btn">
              Create Free Event
              <span>→</span>
            </a>

            <a href="#how" className="secondary-btn">
              See how Contriba works
            </a>
          </div>

          <div className="trust-row">
            <div>
              <strong>No confusion</strong>
              <span>Every contribution is organized</span>
            </div>

            <div>
              <strong>Easy sharing</strong>
              <span>Send one link to family and friends</span>
            </div>

            <div>
              <strong>Local payments</strong>
              <span>Built for MTN MoMo and Airtel Money</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="phone-glow"></div>

          <div className="hero-phone-wrap">
            <img
              src={phone}
              alt="Contriba App"
              className="hero-phone float-medium"
            />

            <div className="phone-reflection"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Hero;