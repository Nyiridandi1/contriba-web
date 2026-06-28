import { Link } from "react-router-dom";
import { Home, Search, Sparkles } from "lucide-react";
import "./NotFound.css";

function NotFound() {
  return (
    <main className="notfound-page">
      <div className="notfound-grid"></div>
      <div className="notfound-glow notfound-glow-one"></div>
      <div className="notfound-glow notfound-glow-two"></div>

      <section className="notfound-card active">
        <div className="notfound-icon pulse-soft">
          <Sparkles size={30} />
        </div>

        <span className="notfound-label">ERROR 404</span>

        <h1>Page not found.</h1>

        <p>
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to Contriba.
        </p>

        <div className="notfound-actions">
          <Link to="/" className="primary-btn premium-hover">
            <Home size={18} />
            Back Home
          </Link>

          <Link to="/contact" className="secondary-btn premium-hover">
            <Search size={18} />
            Contact Support
          </Link>
        </div>
      </section>
    </main>
  );
}

export default NotFound;