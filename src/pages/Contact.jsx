import "./pages.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Contact() {
  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="page-container">
          <span className="page-tag">CONTACT CONTRIBA</span>

          <h1 className="page-title">
            We are here to help
            <br />
            you move faster.
          </h1>

          <p className="page-description">
            Need support, have a question, or want to partner with Contriba?
            Reach us anytime using the official contact details below.
          </p>

          <div className="contact-grid">
            <div className="contact-card">
              <h2>Email Support</h2>
              <p>
                For app support, partnerships, questions, and general inquiries.
              </p>
              <a href="mailto:support@contriba.online">
                support@contriba.online
              </a>
            </div>

            <div className="contact-card">
              <h2>Call Us</h2>
              <p>Available for important support and business communication.</p>
              <a href="tel:+250798100125">+250 798 100 125</a>
            </div>

            <div className="contact-card">
              <h2>WhatsApp</h2>
              <p>Chat directly with the Contriba support team on WhatsApp.</p>
              <a
                href="https://wa.me/250783986276"
                target="_blank"
                rel="noopener noreferrer"
              >
                +250 783 986 276
              </a>
            </div>

            <div className="contact-card">
              <h2>Location</h2>
              <p>
                Contriba is proudly built in Kigali, Rwanda for African
                communities.
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Kigali%2C%20Rwanda"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kigali, Rwanda
              </a>
            </div>
          </div>

          <div className="about-grid" style={{ marginTop: "34px" }}>
            <div className="about-card">
              <h2>Support Hours</h2>
              <p>
                Monday to Friday, 8:00 AM – 6:00 PM. For urgent issues,
                WhatsApp is the fastest way to reach us.
              </p>
            </div>

            <div className="about-card">
              <h2>App First</h2>
              <p>
                Contriba is focused on the mobile app experience. This website
                helps users learn, contact support, read legal information, and
                download the app.
              </p>
            </div>
          </div>

          <div className="page-actions">
            <a
              href="https://wa.me/250783986276"
              target="_blank"
              rel="noopener noreferrer"
              className="page-button"
            >
              Chat on WhatsApp
            </a>

            <a
              href="mailto:support@contriba.online"
              className="page-button secondary"
            >
              Send Email
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Contact;