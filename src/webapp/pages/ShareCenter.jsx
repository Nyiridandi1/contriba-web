import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Link as LinkIcon,
  Printer,
  QrCode,
  Share2,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import "./ShareCenter.css";

const shareStats = [
  {
    title: "Total Visitors",
    value: "1,240",
    note: "29% became contributors",
    icon: UsersRound,
  },
  {
    title: "Total Shares",
    value: "486",
    note: "+72 today",
    icon: Share2,
  },
  {
    title: "QR Scans",
    value: "125",
    note: "64% conversion",
    icon: QrCode,
  },
  {
    title: "Potential Revenue",
    value: "RWF 420K",
    note: "If shared tonight",
    icon: TrendingUp,
  },
];

const shareChannels = [
  {
    title: "WhatsApp",
    description: "Best channel for family, friends and groups.",
    performance: "61%",
    label: "Highest converting",
    icon: FaWhatsapp,
    brand: "whatsapp",
  },
  {
    title: "Instagram",
    description: "Post your event poster, story or bio link.",
    performance: "16%",
    label: "Strong visual reach",
    icon: FaInstagram,
    brand: "instagram",
  },
  {
    title: "Facebook",
    description: "Share with community groups and relatives.",
    performance: "11%",
    label: "Community reach",
    icon: FaFacebookF,
    brand: "facebook",
  },
  {
    title: "Direct Link",
    description: "Copy the public event URL and send anywhere.",
    performance: "5%",
    label: "Fast sharing",
    icon: LinkIcon,
    brand: "default",
  },
];

const campaignMetrics = [
  { label: "Conversion", value: "64%" },
  { label: "Share CTR", value: "29%" },
  { label: "Visitors", value: "1,240" },
  { label: "Shares", value: "486" },
];

const topPromoters = [
  { name: "Grace N.", value: "RWF 620K generated" },
  { name: "Olivier Ishimwe", value: "RWF 500K generated" },
  { name: "Patrick K.", value: "RWF 210K generated" },
];

function ShareCenter() {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  const eventLink = "https://contriba.online/events/demo-event";

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(eventLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setCopied(false);
    }
  }

  async function handleShareEvent() {
    const shareData = {
      title: "Contriba Event",
      text: "Support this event on Contriba.",
      url: eventLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled native share.
      }
      return;
    }

    handleCopyLink();
  }

  return (
    <main className="share-page">
      <AppSidebar active="share" />

      <section className="share-main">
        <header className="share-topbar">
          <div>
            <span>Share Center</span>
            <h1>Growth and campaign center</h1>
            <p>
              Share your event, copy public links, download QR assets and use smart
              insights to reach more contributors.
            </p>
          </div>

          <div className="share-top-actions">
            <button onClick={handleCopyLink}>
              <Copy size={18} />
              Copy Link
            </button>

            <button className="red" onClick={handleShareEvent}>
              <Share2 size={18} />
              Share Event
            </button>
          </div>
        </header>

        <section className="share-hero">
          <div className="share-hero-left">
            <span className="share-badge">
              <Sparkles size={16} />
              AI Growth Insight
            </span>

            <h2>Share again tonight and increase contributions.</h2>

            <p>
              WhatsApp is your strongest channel. Your audience is most active
              between 6PM and 9PM, so sharing again tonight can help your event
              reach more supporters.
            </p>

            <div className="share-hero-actions">
              <button
                className="light"
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(
                      "Support this event on Contriba: " + eventLink
                    )}`,
                    "_blank"
                  )
                }
              >
                <FaWhatsapp />
                Share on WhatsApp
              </button>

              <button className="glass">
                <Download size={18} />
                Download Poster
              </button>
            </div>
          </div>

          <div className="share-hero-card">
            <TrendingUp size={28} />
            <span>Best Time To Share</span>
            <strong>Today 6PM – 9PM</strong>
            <p>
              Estimated uplift: +34% more contributions from WhatsApp and direct
              link traffic.
            </p>
          </div>
        </section>

        <section className="share-stats-grid">
          {loading ? (
            [1, 2, 3, 4].map((item) => (
              <div className="share-stat-card share-skeleton-card" key={item}>
                <div className="share-skeleton-icon shimmer" />
                <span className="share-skeleton-line share-skeleton-line-sm shimmer" />
                <strong className="share-skeleton-line share-skeleton-line-md shimmer" />
                <p className="share-skeleton-line share-skeleton-line-xs shimmer" />
              </div>
            ))
          ) : (
            shareStats.map((item) => {
              const Icon = item.icon;

              return (
                <div className="share-stat-card" key={item.title}>
                  <div className="share-stat-icon">
                    <Icon size={20} />
                  </div>

                  <span>{item.title}</span>
                  <strong>{item.value}</strong>
                  <p>{item.note}</p>
                </div>
              );
            })
          )}
        </section>

        <section className="share-content-grid">
          <div className="share-panel large">
            <div className="share-panel-heading">
              <div>
                <span>Share Channels</span>
                <h3>Send your event where people respond</h3>
              </div>
              <Share2 size={22} />
            </div>

            <div className="share-channel-grid clean">
              {loading ? (
                [1, 2, 3, 4].map((item) => (
                  <button className="share-channel-skeleton" key={item}>
                    <div className="share-skeleton-icon share-channel-icon-skeleton shimmer" />
                    <strong className="share-skeleton-line share-skeleton-line-md shimmer" />
                    <p className="share-skeleton-line share-skeleton-line-full shimmer" />
                    <div className="channel-performance">
                      <b className="share-skeleton-line share-skeleton-line-xs shimmer" />
                      <span className="share-skeleton-line share-skeleton-line-sm shimmer" />
                    </div>
                  </button>
                ))
              ) : (
                shareChannels.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button key={item.title}>
                      <div className={`share-channel-icon ${item.brand}`}>
                        <Icon />
                      </div>

                      <strong>{item.title}</strong>
                      <p>{item.description}</p>

                      <div className="channel-performance">
                        <b>{item.performance}</b>
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="share-panel qr-share-panel">
            <div className="share-panel-heading">
              <div>
                <span>QR & Assets</span>
                <h3>Ready-to-share materials</h3>
              </div>
              <QrCode size={22} />
            </div>

            <div className="share-qr-box">
              {loading ? (
                <>
                  <div className="share-skeleton-qr shimmer" />
                  <strong className="share-skeleton-line share-skeleton-line-md shimmer" />
                  <span className="share-skeleton-line share-skeleton-line-sm shimmer" />
                </>
              ) : (
                <>
                  <QrCode size={76} />
                  <strong>125 scans</strong>
                  <span>64% conversion rate</span>
                </>
              )}
            </div>

            <div className="qr-actions assets">
              <button>
                <Download size={17} />
                Download QR
              </button>

              <button>
                <Printer size={17} />
                Print QR
              </button>

              <button>
                <FileText size={17} />
                Poster
              </button>

              <button onClick={handleCopyLink}>
                <Copy size={17} />
                Copy Link
              </button>
            </div>
          </div>
        </section>

        <section className="share-content-grid final-grid">
          <div className="share-panel large">
            <div className="share-panel-heading">
              <div>
                <span>Campaign Analytics</span>
                <h3>Traffic and conversion</h3>
              </div>
              <BarChart3 size={22} />
            </div>

            <div className="campaign-kpi-grid">
              {loading ? (
                [1, 2, 3, 4].map((item) => (
                  <div className="share-kpi-skeleton" key={item}>
                    <span className="share-skeleton-line share-skeleton-line-sm shimmer" />
                    <strong className="share-skeleton-line share-skeleton-line-md shimmer" />
                  </div>
                ))
              ) : (
                campaignMetrics.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))
              )}
            </div>

            <div className="campaign-bars">
              <div style={{ height: "88%" }}>
                <span>WhatsApp</span>
              </div>

              <div style={{ height: "42%" }}>
                <span>Instagram</span>
              </div>

              <div style={{ height: "31%" }}>
                <span>Facebook</span>
              </div>

              <div style={{ height: "24%" }}>
                <span>QR</span>
              </div>

              <div style={{ height: "18%" }}>
                <span>Email</span>
              </div>

              <div style={{ height: "14%" }}>
                <span>SMS</span>
              </div>
            </div>
          </div>

          <div className="share-panel ai-share-panel">
            <span className="share-badge dark">
              <Sparkles size={16} />
              AI Growth Coach
            </span>

            <h3>WhatsApp is carrying your campaign.</h3>

            <p>
              Share again between 6PM and 9PM. Your best promoter is Grace N.,
              and your strongest channel is WhatsApp.
            </p>

            <div className="coach-summary-list">
              <div>
                <span>Best channel</span>
                <strong>WhatsApp</strong>
              </div>

              <div>
                <span>Best time</span>
                <strong>6PM – 9PM</strong>
              </div>

              <div>
                <span>Top promoter</span>
                <strong>Grace N.</strong>
              </div>

              <div>
                <span>Potential revenue</span>
                <strong>RWF 420K</strong>
              </div>
            </div>

            <div className="top-promoters-mini">
              {topPromoters.map((person) => (
                <p key={person.name}>
                  <CheckCircle2 size={15} />
                  <span>{person.name}</span>
                  <b>{person.value}</b>
                </p>
              ))}
            </div>

            <button>
              Generate Smart Message
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </section>
      {copied && <div className="share-toast">✓ Link copied</div>}
    </main>
  );
}

export default ShareCenter;
