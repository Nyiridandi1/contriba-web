import "./pages.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Terms() {
  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="page-container">
          <span className="page-tag">TERMS OF SERVICE</span>

          <h1 className="page-title">
            Simple rules for
            <br />
            using Contriba.
          </h1>

          <p className="page-description">
            These Terms of Service explain the basic rules and responsibilities
            that apply when you use Contriba’s mobile app and website.
          </p>

          <div className="legal-grid">
            <div className="legal-card">
              <h2>1. Using Contriba</h2>
              <p>
                By using Contriba, you agree to use the platform responsibly,
                lawfully, and only for legitimate events, contributions,
                celebrations, and fundraisers.
              </p>
            </div>

            <div className="legal-card">
              <h2>2. User Accounts</h2>
              <p>
                You are responsible for keeping your account information secure
                and for all activity that happens under your account.
              </p>
            </div>

            <div className="legal-card">
              <h2>3. Events & Contributions</h2>
              <p>
                Event creators are responsible for the accuracy of event
                information, contribution goals, invited contributors, and how
                collected funds are used.
              </p>
            </div>

            <div className="legal-card">
              <h2>4. Payments</h2>
              <p>
                Contributions may be processed through third-party payment
                providers such as MTN MoMo, Airtel Money, Visa, Mastercard, or
                other supported services.
              </p>
            </div>

            <div className="legal-card">
              <h2>5. Prohibited Use</h2>
              <p>
                You may not use Contriba for fraud, illegal fundraising, false
                information, scams, money laundering, harmful activity, or any
                activity that violates applicable laws.
              </p>
            </div>

            <div className="legal-card">
              <h2>6. Service Availability</h2>
              <p>
                We work to keep Contriba reliable, but we cannot guarantee that
                the app or website will always be available without interruption.
              </p>
            </div>

            <div className="legal-card">
              <h2>7. Updates</h2>
              <p>
                We may update these Terms from time to time. Continued use of
                Contriba after updates means you accept the updated Terms.
              </p>
            </div>

            <div className="legal-card">
              <h2>8. Contact</h2>
              <p>
                For questions about these Terms, contact us at{" "}
                <a href="mailto:support@contriba.online">
                  support@contriba.online
                </a>
                .
                <br />
                Phone: <a href="tel:+250798100125">+250 798 100 125</a>
                <br />
                Location: Kigali, Rwanda
              </p>
            </div>
          </div>

          <div className="page-actions">
            <a href="/" className="page-button">
              Back Home
            </a>

            <a href="/privacy" className="page-button secondary">
              View Privacy Policy
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Terms;