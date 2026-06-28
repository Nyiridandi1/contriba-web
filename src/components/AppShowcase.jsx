import dashboard from "../assets/dashboard-phone.png";
import event from "../assets/event-phone.png";
import wallet from "../assets/wallet-phone.png";
import "./AppShowcase.css";

function AppShowcase() {
  return (
    <section className="showcase reveal">
      <div className="section-title">
        <span>THE APP</span>

        <h2>
          Everything you need
          <br />
          to manage your event.
        </h2>

        <p>
          Create events, receive contributions, monitor progress,
          and manage everything from one beautiful app.
        </p>
      </div>

      <div className="phones-row">

        <div className="phone-card premium-hover">
          <img
            src={dashboard}
            alt="Dashboard"
            className="float-slow"
          />

          <h3>Dashboard</h3>

          <p>
            Track contributions live.
          </p>
        </div>

        <div className="phone-card active premium-hover">
          <img
            src={event}
            alt="Event Page"
            className="float-fast"
          />

          <h3>Event Page</h3>

          <p>
            Beautiful pages people love.
          </p>
        </div>

        <div className="phone-card premium-hover">
          <img
            src={wallet}
            alt="Wallet"
            className="float-medium"
          />

          <h3>Wallet</h3>

          <p>
            Secure payments instantly.
          </p>
        </div>

      </div>
    </section>
  );
}

export default AppShowcase;