import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navbarMode, setNavbarMode] = useState("dark");
  const location = useLocation();

  useEffect(() => {
    const updateNavbarMode = () => {
      const checkPoint = 90;
      const darkSections = document.querySelectorAll(".dark-navbar-section");

      let shouldBeDark = false;

      darkSections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= checkPoint && rect.bottom >= checkPoint) {
          shouldBeDark = true;
        }
      });

      setNavbarMode(shouldBeDark ? "dark" : "light");
    };

    updateNavbarMode();

    window.addEventListener("scroll", updateNavbarMode);
    window.addEventListener("resize", updateNavbarMode);

    return () => {
      window.removeEventListener("scroll", updateNavbarMode);
      window.removeEventListener("resize", updateNavbarMode);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const scrollToSection = (id) => {
    closeMenu();

    if (location.pathname !== "/") {
      window.location.href = "/#" + id;
      return;
    }

    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className={`navbar navbar-${navbarMode}`}>
      <Link to="/" className="brand" onClick={closeMenu}>
        <img src={logo} alt="Contriba" />
      </Link>

      <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
        <button className="nav-link" onClick={() => scrollToSection("features")}>
          Features
        </button>

        <button className="nav-link" onClick={() => scrollToSection("how")}>
          How it works
        </button>

        <Link to="/about" className="nav-link" onClick={closeMenu}>
          About
        </Link>

        <Link to="/contact" className="nav-link" onClick={closeMenu}>
          Contact
        </Link>

        <Link to="/privacy" className="nav-link" onClick={closeMenu}>
          Privacy
        </Link>

        <Link to="/terms" className="nav-link mobile-only" onClick={closeMenu}>
          Terms
        </Link>

        <a
          href="https://play.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="download-btn mobile-download"
          onClick={closeMenu}
        >
          Download App
        </a>
      </nav>

      <a
        href="https://play.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="download-btn desktop-download"
      >
        Download App
      </a>

      <button
        className={`menu-toggle ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open navigation menu"
      >
        <span></span>
        <span></span>
      </button>
    </header>
  );
}

export default Navbar;