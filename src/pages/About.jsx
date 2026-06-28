import "./pages.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="page-container">

          <span className="page-tag">
            ABOUT CONTRIBA
          </span>

          <h1 className="page-title">
            Making contributions
            <br />
            simple, secure
            <br />
            and transparent.
          </h1>

          <p className="page-description">
            Contriba is Rwanda's modern contribution platform designed
            to help families, friends, churches, organizations and
            communities collect digital contributions quickly,
            securely and transparently.
          </p>

          <div className="about-grid">

            <div className="about-card">
              <h2>Our Mission</h2>

              <p>
                To simplify event contributions by providing a secure,
                trusted and beautiful digital platform that makes
                collecting support effortless for everyone.
              </p>
            </div>

            <div className="about-card">
              <h2>Our Vision</h2>

              <p>
                To become Africa's most trusted contribution platform,
                connecting millions of people through generosity,
                celebrations and technology.
              </p>
            </div>

            <div className="about-card">
              <h2>Why Contriba?</h2>

              <p>
                Weddings, graduations, birthdays, church events and
                community fundraisers deserve a modern contribution
                experience that is simple, transparent and secure.
              </p>
            </div>

            <div className="about-card">
              <h2>Proudly Built in Rwanda 🇷🇼</h2>

              <p>
                Designed and developed in Kigali, Rwanda,
                Contriba is built to empower African communities
                through modern financial technology.
              </p>
            </div>

          </div>

          <div className="page-actions">

            <a href="/" className="page-button">
              Back Home
            </a>

            <a
              href="mailto:support@contriba.online"
              className="page-button secondary"
            >
              Contact Us
            </a>

          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;