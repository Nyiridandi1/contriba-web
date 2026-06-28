import phone from "../assets/home-phone.png";
import { ShieldCheck, Smartphone, BellRing, Wallet } from "lucide-react";
import "./AppleShowcase.css";

function AppleShowcase() {
  return (
    <section className="apple-showcase reveal">

      <div className="apple-text">

        <span>ONE BEAUTIFUL APP</span>

        <h2>
          Everything you need,
          <br />
          all in one place.
        </h2>

        <p>
          Create events, receive contributions, invite contributors,
          track every payment and celebrate together from one beautiful app.
        </p>

        <div className="apple-features">

          <div className="premium-hover">
            <ShieldCheck size={22} />
            Secure Payments
          </div>

          <div className="premium-hover">
            <Wallet size={22} />
            Wallet Included
          </div>

          <div className="premium-hover">
            <BellRing size={22} />
            Live Notifications
          </div>

          <div className="premium-hover">
            <Smartphone size={22} />
            Beautiful Experience
          </div>

        </div>

      </div>

      <div className="apple-phone">

        <div className="apple-glow"></div>

        <img
          src={phone}
          alt="Contriba App"
          className="float-slow"
        />

      </div>

    </section>
  );
}

export default AppleShowcase;