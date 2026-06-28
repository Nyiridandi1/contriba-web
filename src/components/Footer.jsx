import "./Footer.css";
import { Link } from "react-router-dom";

import logo from "../assets/logo.png";
import appStore from "../assets/app-store.svg";
import googlePlay from "../assets/google-play.svg";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="contriba-footer">
      <div className="footer-noise"></div>
      <div className="footer-ring"></div>
      <div className="footer-ring footer-ring-two"></div>
      <div className="footer-glow"></div>
      <div className="footer-glow footer-glow-two"></div>

      <div className="contriba-footer-inner">
        <div className="footer-left">
          <Link to="/" className="footer-logo-link" aria-label="Contriba Home">
            <img
              src={logo}
              alt="Contriba"
              className="contriba-footer-logo float-soft"
            />
          </Link>

          <p>
            Rwanda's modern contribution platform for weddings, graduations,
            birthdays, church events and fundraisers.
          </p>

          <div className="footer-trust-pills">
            <span>Secure payments</span>
            <span>Mobile Money ready</span>
            <span>Made for Rwanda</span>
          </div>

          <div className="contriba-store-badges">
            <a
              href="https://play.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="premium-hover"
            >
              <img src={appStore} alt="App Store" />
            </a>

            <a
              href="https://play.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="premium-hover"
            >
              <img src={googlePlay} alt="Google Play" />
            </a>
          </div>

          <div className="footer-social-wrap">
            <h5>Stay connected</h5>

            <div className="contriba-socials">
              <a href="#" aria-label="Facebook" className="premium-hover">
                <FaFacebookF />
              </a>

              <a href="#" aria-label="Instagram" className="premium-hover">
                <FaInstagram />
              </a>

              <a href="#" aria-label="LinkedIn" className="premium-hover">
                <FaLinkedinIn />
              </a>

              <a
                href="https://wa.me/250783986276"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="premium-hover"
              >
                <FaWhatsapp />
              </a>

              <a href="#" aria-label="YouTube" className="premium-hover">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-column">
          <h4>Product</h4>

          <Link to="/#features">Features</Link>
          <Link to="/#how">How it works</Link>
          <Link to="/">Security</Link>

          <a
            href="https://play.google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        </div>

        <div className="footer-column">
          <h4>Company</h4>

          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>

        <div className="footer-column footer-support-card">
          <h4>Support</h4>

          <Link to="/contact">Help Center</Link>
          <Link to="/contact">FAQs</Link>

          <a
            href="https://wa.me/250783986276"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>

          <a href="mailto:support@contriba.online">Email</a>
        </div>
      </div>

      <div className="contriba-footer-bottom">
        <span>
          © 2026 <strong>Contriba.</strong> All rights reserved.
        </span>

        <span>Built with ❤️ in Kigali, Rwanda.</span>
      </div>
    </footer>
  );
}

export default Footer;