import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTelegram,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Globe,
  Link as LinkIcon,
  Mail,
  Phone,
  Printer,
  QrCode,
  RefreshCcw,
  Send,
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
    title: "Expected Extra",
    value: "RWF 420K",
    note: "If shared tonight",
    icon: TrendingUp,
  },
];

const shareChannels = [
  {
    title: "WhatsApp",
    description: "Best performing channel for this event.",
    performance: "61%",
    icon: FaWhatsapp,
    brand: "whatsapp",
  },
  {
    title: "Facebook",
    description: "Share with family, friends and groups.",
    performance: "11%",
    icon: FaFacebookF,
    brand: "facebook",
  },
  {
    title: "Instagram",
    description: "Post story, bio link or event poster.",
    performance: "16%",
    icon: FaInstagram,
    brand: "instagram",
  },
  {
    title: "Telegram",
    description: "Send event link to groups and communities.",
    performance: "4%",
    icon: FaTelegram,
    brand: "telegram",
  },
  {
    title: "X / Twitter",
    description: "Share short updates and event milestones.",
    performance: "2%",
    icon: FaXTwitter,
    brand: "twitter",
  },
  {
    title: "LinkedIn",
    description: "Share formal campaigns and community fundraisers.",
    performance: "3%",
    icon: FaLinkedinIn,
    brand: "linkedin",
  },
  {
    title: "Email",
    description: "Send formal invitations and reminders.",
    performance: "7%",
    icon: Mail,
    brand: "default",
  },
  {
    title: "SMS",
    description: "Reach people without social media.",
    performance: "3%",
    icon: Phone,
    brand: "default",
  },
  {
    title: "Direct Link",
    description: "Copy and share the public event URL.",
    performance: "5%",
    icon: LinkIcon,
    brand: "default",
  },
];

const liveActivity = [
  "Someone opened your public event page",
  "A guest scanned your QR code",
  "Grace shared your event on WhatsApp",
  "Patrick clicked contribute from Instagram",
  "Olivier completed a contribution",
];

const topSharers = [
  {
    name: "Grace N.",
    shares: "42 shares",
    result: "RWF 620K generated",
  },
  {
    name: "Olivier Ishimwe",
    shares: "31 shares",
    result: "RWF 500K generated",
  },
  {
    name: "Patrick K.",
    shares: "18 shares",
    result: "RWF 210K generated",
  },
];

function ShareCenter() {
  return (
    <main className="share-page">
      <AppSidebar active="share" />

      <section className="share-main">
        <header className="share-topbar">
          <div>
            <span>Share Center</span>
            <h1>Growth and campaign center</h1>
            <p>
              Share your event, track visitor sources, download QR codes,
              generate posters and use AI insights to collect more
              contributions.
            </p>
          </div>

          <div className="share-top-actions">
            <button>
              <Copy size={18} />
              Copy Link
            </button>

            <button className="red">
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
              Most contributors are coming from WhatsApp. Your audience is most
              active between 6PM and 9PM. Sharing now could generate an
              estimated RWF 420,000.
            </p>

            <div className="share-hero-actions">
              <button className="light">
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
          {shareStats.map((item) => {
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
          })}
        </section>

        <section className="share-content-grid">
          <div className="share-panel large">
            <div className="share-panel-heading">
              <div>
                <span>Share Channels</span>
                <h3>Send your event everywhere</h3>
              </div>
              <Share2 size={22} />
            </div>

            <div className="share-channel-grid">
              {shareChannels.map((item) => {
                const Icon = item.icon;

                return (
                  <button key={item.title}>
                    <div className={`share-channel-icon ${item.brand}`}>
                      <Icon />
                    </div>

                    <strong>{item.title}</strong>
                    <p>{item.description}</p>

                    <span>
                      {item.performance} traffic
                      <ArrowRight size={16} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="share-panel qr-share-panel">
            <div className="share-panel-heading">
              <div>
                <span>QR Code Center</span>
                <h3>Scan to contribute</h3>
              </div>
              <QrCode size={22} />
            </div>

            <div className="share-qr-box">
              <QrCode size={76} />
              <strong>125 scans</strong>
              <span>64% conversion rate</span>
            </div>

            <div className="qr-actions">
              <button>
                <Download size={17} />
                Download QR
              </button>

              <button>
                <Printer size={17} />
                Print QR
              </button>
            </div>
          </div>
        </section>

        <section className="share-content-grid">
          <div className="share-panel poster-panel">
            <div className="share-panel-heading">
              <div>
                <span>Event Poster</span>
                <h3>Auto-generated campaign poster</h3>
              </div>
              <FileText size={22} />
            </div>

            <div className="poster-preview">
              <div className="poster-preview-card">
                <span>Jean & Alice Wedding</span>
                <h3>Contribute Easily</h3>
                <p>
                  Support Jean & Alice through MTN MoMo, Airtel Money or Card.
                </p>

                <div className="poster-qr">
                  <QrCode size={42} />
                </div>
              </div>
            </div>

            <div className="poster-actions">
              <button>
                <Download size={17} />
                Download PNG
              </button>

              <button>
                <FileText size={17} />
                Download PDF
              </button>

              <button>
                <Printer size={17} />
                Print Poster
              </button>
            </div>
          </div>

          <div className="share-panel ai-share-panel">
            <span className="share-badge dark">
              <Sparkles size={16} />
              AI Campaign Coach
            </span>

            <h3>Ask Grace and Olivier to share again.</h3>

            <p>
              Your top sharers are already bringing high-value contributors.
              Sending them a personal message could increase total collection by
              another RWF 300K–500K.
            </p>

            <button>
              Generate Smart Message
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        <section className="share-content-grid">
          <div className="share-panel large">
            <div className="share-panel-heading">
              <div>
                <span>Campaign Analytics</span>
                <h3>Traffic and conversion</h3>
              </div>
              <BarChart3 size={22} />
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

          <div className="share-panel">
            <div className="share-panel-heading">
              <div>
                <span>Top Sharers</span>
                <h3>People helping growth</h3>
              </div>
              <UsersRound size={22} />
            </div>

            <div className="top-sharer-list">
              {topSharers.map((person) => (
                <div className="top-sharer-item" key={person.name}>
                  <div>
                    <strong>{person.name}</strong>
                    <span>{person.shares}</span>
                  </div>

                  <small>{person.result}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="share-content-grid">
          <div className="share-panel">
            <div className="share-panel-heading">
              <div>
                <span>Invite Contributors</span>
                <h3>Reach more people</h3>
              </div>
              <Send size={22} />
            </div>

            <div className="invite-actions-grid">
              <button>
                <UsersRound size={18} />
                Import Contacts
              </button>

              <button>
                <Mail size={18} />
                Email Invite
              </button>

              <button>
                <Phone size={18} />
                SMS Invite
              </button>

              <button>
                <Globe size={18} />
                Public Link
              </button>
            </div>
          </div>

          <div className="share-panel">
            <div className="share-panel-heading">
              <div>
                <span>Live Visitor Feed</span>
                <h3>Happening now</h3>
              </div>
              <RefreshCcw size={22} />
            </div>

            <div className="share-activity-list">
              {liveActivity.map((item) => (
                <p key={item}>
                  <CheckCircle2 size={16} />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default ShareCenter;