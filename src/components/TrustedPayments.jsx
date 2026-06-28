import { useEffect, useRef, useState } from "react";
import {
  Users,
  CalendarDays,
  WalletCards,
  ShieldCheck,
  Smartphone,
  LockKeyhole,
  BarChart3,
  HeartHandshake,
} from "lucide-react";
import payments from "../assets/mtn-airtel.png";
import "./TrustedPayments.css";

function Counter({ end, suffix = "", decimals = 0 }) {
  const [value, setValue] = useState(0);
  const counterRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = counterRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;

        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          const currentValue = end * easedProgress;

          setValue(currentValue);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      },
      {
        threshold: 0.4,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [end]);

  const formattedValue = value.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });

  return (
    <span ref={counterRef}>
      {formattedValue}
      {suffix}
    </span>
  );
}

function TrustedPayments() {
  const trustCards = [
    {
      icon: <ShieldCheck />,
      title: "Secure contributions",
      text: "Every event is built around clear payment records and organized contribution tracking.",
    },
    {
      icon: <Smartphone />,
      title: "Mobile Money ready",
      text: "Designed for MTN MoMo and Airtel Money so contributors can support from anywhere.",
    },
    {
      icon: <BarChart3 />,
      title: "Real-time tracking",
      text: "Event owners can clearly see who contributed, how much was raised and what remains.",
    },
    {
      icon: <HeartHandshake />,
      title: "Built for community",
      text: "Perfect for weddings, graduations, birthdays, church events and family fundraisers.",
    },
  ];

  const stats = [
    {
      icon: <Users />,
      end: 10,
      suffix: "K+",
      label: "People ready to contribute",
    },
    {
      icon: <CalendarDays />,
      end: 2,
      suffix: "K+",
      label: "Events planned",
    },
    {
      icon: <WalletCards />,
      end: 350,
      suffix: "M+",
      label: "RWF contribution goal",
    },
    {
      icon: <LockKeyhole />,
      end: 99.9,
      suffix: "%",
      decimals: 1,
      label: "Platform reliability target",
    },
  ];

  return (
    <section className="trusted-section reveal">
      <div className="trusted-glow trusted-glow-one"></div>
      <div className="trusted-glow trusted-glow-two"></div>

      <div className="trusted-header">
        <span>TRUST & PAYMENTS</span>

        <h2>
          Built to make contributions feel clear, safe and simple.
        </h2>

        <p>
          Contriba gives every event a professional contribution page, trusted
          payment options and a clean dashboard to track support from family,
          friends and community.
        </p>
      </div>

      <div className="payment-card premium-hover">
        <div className="payment-copy">
          <span>Trusted Payments</span>

          <h3>
            Powered by Rwanda&apos;s leading mobile money providers.
          </h3>

          <p>
            Contributors can support events using familiar local payment options
            made for Rwanda.
          </p>
        </div>

        <div className="payment-logos">
          <img src={payments} alt="MTN and Airtel Money" />
        </div>
      </div>

      <div className="trust-grid">
        {trustCards.map((item) => (
          <article className="trust-card premium-hover" key={item.title}>
            <div className="trust-icon">{item.icon}</div>

            <h3>{item.title}</h3>

            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="stats-row">
        {stats.map((item) => (
          <article key={item.label} className="premium-hover stagger-item">
            <div className="stat-icon">{item.icon}</div>

            <div>
              <h3>
                <Counter
                  end={item.end}
                  suffix={item.suffix}
                  decimals={item.decimals || 0}
                />
              </h3>

              <p>{item.label}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TrustedPayments;