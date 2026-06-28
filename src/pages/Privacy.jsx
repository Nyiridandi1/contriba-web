import "./pages.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Privacy() {
  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="page-container">
          <span className="page-tag">PRIVACY POLICY</span>

          <h1 className="page-title">
            Your privacy
            <br />
            matters to us.
          </h1>

          <p className="page-description">
            This Privacy Policy explains how Contriba collects, uses, stores,
            and protects your information when you use our mobile app and
            website.
          </p>

          <div className="legal-grid">
            <div className="legal-card">
              <h2>1. Information We Collect</h2>
              <p>
                We may collect your name, phone number, email address, account
                information, event details, contribution records, payment status,
                device information, and support messages.
              </p>
            </div>

            <div className="legal-card">
              <h2>2. How We Use Your Information</h2>
              <p>
                We use your information to create your account, manage events,
                process contributions, send notifications, provide support,
                improve security, and improve the Contriba experience.
              </p>
            </div>

            <div className="legal-card">
              <h2>3. Payments</h2>
              <p>
                Contriba may connect users with payment providers such as MTN
                MoMo, Airtel Money, Visa, Mastercard, or other supported payment
                services. We do not sell your payment information.
              </p>
            </div>

            <div className="legal-card">
              <h2>4. Data Security</h2>
              <p>
                We use reasonable technical and organizational measures to
                protect your information from unauthorized access, loss, misuse,
                or disclosure.
              </p>
            </div>

            <div className="legal-card">
              <h2>5. Sharing Information</h2>
              <p>
                We may share limited information with trusted service providers
                only when needed to operate Contriba, process payments, prevent
                fraud, comply with law, or provide customer support.
              </p>
            </div>

            <div className="legal-card">
              <h2>6. Your Rights</h2>
              <p>
                You may request access, correction, or deletion of your personal
                information by contacting us at{" "}
                <a href="mailto:support@contriba.online">
                  support@contriba.online
                </a>
                .
              </p>
            </div>

            <div className="legal-card">
              <h2>7. Children’s Privacy</h2>
              <p>
                Contriba is not intended for children under 13. We do not
                knowingly collect personal information from children.
              </p>
            </div>

            <div className="legal-card">
              <h2>8. Contact Us</h2>
              <p>
                Email:{" "}
                <a href="mailto:support@contriba.online">
                  support@contriba.online
                </a>
                <br />
                Phone: <a href="tel:+250798100125">+250 798 100 125</a>
                <br />
                WhatsApp:{" "}
                <a
                  href="https://wa.me/250783986276"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +250 783 986 276
                </a>
                <br />
                Location: Kigali, Rwanda
              </p>
            </div>
          </div>

          <div className="page-actions">
            <a href="/" className="page-button">
              Back Home
            </a>

            <a href="/terms" className="page-button secondary">
              View Terms
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Privacy;