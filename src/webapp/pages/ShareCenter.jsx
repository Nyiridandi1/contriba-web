import { useEffect, useMemo, useState } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Printer,
  QrCode,
  RefreshCw,
  Share2,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import {
  getDashboard,
  getEventContributions,
  getMyEvents,
  getShareAnalytics,
  getShareInsights,
  getShareOverview,
  getSharePromoters,
  trackQrScan,
  trackShare,
} from "../api/api";
import "./ShareCenter.css";

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function money(value) {
  const amount = Number(value || 0);

  if (amount >= 1000000) {
    return `RWF ${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M`;
  }

  if (amount >= 1000) {
    return `RWF ${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  }

  return `RWF ${amount.toLocaleString()}`;
}

function count(value) {
  return Number(value || 0).toLocaleString();
}

function eventTitle(event) {
  return event?.title || event?.name || "Untitled event";
}

function eventLocation(event) {
  return event?.location || "Rwanda";
}

function eventRaised(event) {
  return Number(event?.total_raised || event?.raised || event?.amount_raised || 0);
}

function eventGoal(event) {
  return Number(event?.goal_amount || event?.target || event?.goal || 0);
}

function eventContributorCount(event) {
  return Number(
    event?.total_contributors ||
      event?.contributors ||
      event?.contributors_count ||
      0
  );
}

function publicEventLink(event) {
  if (!event?.id) {
    return window.location.origin;
  }

  const shareBase =
    import.meta.env.VITE_SHARE_BASE_URL ||
    "https://contriba-backend-production.up.railway.app";

  return `${shareBase}/share/events/${event.id}`;
}

function getContributionAmount(item) {
  return Number(item?.amount || item?.paid_amount || item?.total_amount || 0);
}

function getContributionName(item) {
  return (
    item?.contributor_name ||
    item?.name ||
    item?.sender_name ||
    item?.phone ||
    "Contributor"
  );
}

function isSuccessfulContribution(item) {
  const status = String(item?.status || item?.payment_status || "success").toLowerCase();
  return ["success", "paid", "completed", "confirmed"].includes(status);
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function escapeSvg(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}export default function ShareCenter() {
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [overview, setOverview] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [insights, setInsights] = useState({});
  const [promoters, setPromoters] = useState([]);

  const [dashboard, setDashboard] = useState({});
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent?.id) {
      loadShareData(selectedEvent.id);
    }
  }, [selectedEvent]);

  async function loadEvents() {
    try {
      setLoading(true);

      const [eventsRes, dashboardRes] = await Promise.all([
        getMyEvents(),
        getDashboard(),
      ]);

      const myEvents = safeArray(
        eventsRes?.events ||
          eventsRes?.data ||
          eventsRes
      );

      setEvents(myEvents);

      if (myEvents.length > 0) {
        setSelectedEvent(myEvents[0]);
      }

      setDashboard(dashboardRes || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadShareData(eventId) {
    try {
      const [
        overviewRes,
        analyticsRes,
        insightRes,
        promoterRes,
        contributionRes,
      ] = await Promise.all([
        getShareOverview(eventId),
        getShareAnalytics(eventId),
        getShareInsights(eventId),
        getSharePromoters(eventId),
        getEventContributions(eventId),
      ]);

      setOverview(overviewRes || {});
      setAnalytics(analyticsRes || {});
      setInsights(insightRes || {});

      setPromoters(
        safeArray(
          promoterRes?.promoters ||
            promoterRes?.data ||
            promoterRes
        )
      );

      setContributions(
        safeArray(
          contributionRes?.contributions ||
            contributionRes?.data ||
            contributionRes
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  const totalRaised = useMemo(() => {
    return events.reduce((sum, event) => sum + eventRaised(event), 0);
  }, [events]);

  const totalGoal = useMemo(() => {
    return events.reduce((sum, event) => sum + eventGoal(event), 0);
  }, [events]);

  const totalContributors = useMemo(() => {
    return events.reduce(
      (sum, event) => sum + eventContributorCount(event),
      0
    );
  }, [events]);

  const successfulContributions = useMemo(() => {
    return contributions.filter(isSuccessfulContribution);
  }, [contributions]);

  const publicLink = useMemo(() => {
    return publicEventLink(selectedEvent);
  }, [selectedEvent]);

  const visitors =
    overview.totalVisitors ??
    analytics.totalVisitors ??
    dashboard.totalVisitors ??
    0;

  const shares =
    overview.totalShares ??
    analytics.totalShares ??
    0;

  const qrScans =
    overview.totalQrScans ??
    analytics.totalQrScans ??
    0;

  const conversion =
    overview.conversionRate ??
    analytics.conversionRate ??
    0;

  const potentialRevenue =
    insights.potentialRevenue ??
    totalGoal - totalRaised;  const bestChannel =
    insights.bestChannel ||
    overview.bestPlatform ||
    analytics.bestPlatform ||
    "WhatsApp";

  const bestTime =
    insights.bestTime ||
    overview.bestTime ||
    analytics.bestTime ||
    "6PM – 9PM";

  const topPromoters = useMemo(() => {
    if (promoters.length > 0) return promoters.slice(0, 3);

    const totals = new Map();

    successfulContributions.forEach((item) => {
      const name = getContributionName(item);
      const amount = getContributionAmount(item);
      totals.set(name, (totals.get(name) || 0) + amount);
    });

    return Array.from(totals.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        total: amount,
      }))
      .sort((a, b) => Number(b.amount || b.total || 0) - Number(a.amount || a.total || 0))
      .slice(0, 3);
  }, [promoters, successfulContributions]);

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "share-toast";
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2500);
  }

  async function refreshShareCenter() {
    if (!selectedEvent?.id) {
      await loadEvents();
      return;
    }

    await loadShareData(selectedEvent.id);
    showToast("Share Center refreshed");
  }

  async function recordShare(platform) {
    if (!selectedEvent?.id) return;

    try {
      await trackShare({
        event_id: selectedEvent.id,
        platform,
      });

      await loadShareData(selectedEvent.id);
    } catch (err) {
      console.error(err);
    }
  }

  async function recordQrScan() {
    if (!selectedEvent?.id) return;

    try {
      await trackQrScan({
        event_id: selectedEvent.id,
        source: "share_center",
      });

      await loadShareData(selectedEvent.id);
    } catch (err) {
      console.error(err);
    }
  }

  async function copyLink(platform = "direct_link") {
    if (!selectedEvent) {
      showToast("Please create an event first");
      return;
    }

    try {
      await navigator.clipboard.writeText(publicLink);
      await recordShare(platform);
      showToast("Link copied");
    } catch {
      showToast("Could not copy link");
    }
  }

  async function shareNative() {
    if (!selectedEvent) {
      showToast("Please create an event first");
      return;
    }

    const shareData = {
      title: eventTitle(selectedEvent),
      text: `Support ${eventTitle(selectedEvent)} on Contriba.`,
      url: publicLink,
    };

    if (navigator.share) {
      try {
        setSharing(true);
        await navigator.share(shareData);
        await recordShare("native_share");
        showToast("Share opened");
      } catch {
        // user cancelled native share
      } finally {
        setSharing(false);
      }

      return;
    }

    await copyLink("native_share");
  }

  async function shareWhatsApp() {
    if (!selectedEvent) {
      showToast("Please create an event first");
      return;
    }

    const message = `Support ${eventTitle(selectedEvent)} on Contriba: ${publicLink}`;

    await recordShare("whatsapp");

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function shareFacebook() {
    if (!selectedEvent) {
      showToast("Please create an event first");
      return;
    }

    await recordShare("facebook");

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicLink)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function shareInstagram() {
    if (!selectedEvent) {
      showToast("Please create an event first");
      return;
    }

    const message = `Support ${eventTitle(selectedEvent)} on Contriba: ${publicLink}`;

    await navigator.clipboard.writeText(`${message}\n\n${publicLink}`);
    await recordShare("instagram");

    showToast("Instagram message copied");
  }

  function createPosterSvg(event, link) {
    const title = escapeSvg(eventTitle(event));
    const location = escapeSvg(eventLocation(event));
    const raised = escapeSvg(money(eventRaised(event)));
    const goal = escapeSvg(money(eventGoal(event)));
    const publicLinkText = escapeSvg(link);

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fff5f5"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#ffe5e7"/>
    </linearGradient>
    <linearGradient id="red" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E50914"/>
      <stop offset="100%" stop-color="#ff3348"/>
    </linearGradient>
  </defs>

  <rect width="1080" height="1350" fill="url(#bg)"/>
  <circle cx="940" cy="130" r="220" fill="#E50914" opacity="0.08"/>
  <rect x="80" y="80" width="920" height="1190" rx="64" fill="#ffffff" stroke="#ffe0e2" stroke-width="4"/>

  <text x="120" y="170" font-family="Arial" font-size="34" font-weight="900" fill="#E50914" letter-spacing="3">CONTRIBA EVENT</text>
  <text x="120" y="305" font-family="Arial" font-size="78" font-weight="900" fill="#101827">${title}</text>
  <text x="120" y="390" font-family="Arial" font-size="34" font-weight="700" fill="#667085">${location}</text>

  <rect x="120" y="475" width="840" height="230" rx="38" fill="#f8fafc"/>

  <text x="165" y="565" font-family="Arial" font-size="30" font-weight="800" fill="#667085">Raised so far</text>
  <text x="165" y="645" font-family="Arial" font-size="64" font-weight="900" fill="#101827">${raised}</text>

  <text x="565" y="565" font-family="Arial" font-size="30" font-weight="800" fill="#667085">Goal</text>
  <text x="565" y="645" font-family="Arial" font-size="64" font-weight="900" fill="#101827">${goal}</text>

  <rect x="120" y="790" width="840" height="128" rx="34" fill="url(#red)"/>
  <text x="185" y="870" font-family="Arial" font-size="42" font-weight="900" fill="#ffffff">Contribute securely on Contriba</text>

  <text x="120" y="1010" font-family="Arial" font-size="30" font-weight="800" fill="#667085">Open this link:</text>
  <text x="120" y="1070" font-family="Arial" font-size="26" font-weight="700" fill="#101827">${publicLinkText}</text>

  <text x="120" y="1210" font-family="Arial" font-size="28" font-weight="900" fill="#E50914">contriba.online</text>
</svg>`;
  }  async function downloadPoster() {
    if (!selectedEvent) {
      showToast("Please create an event first");
      return;
    }

    const svg = createPosterSvg(selectedEvent, publicLink);

    downloadFile(
      `${eventTitle(selectedEvent).replace(/\s+/g, "-")}-poster.svg`,
      svg,
      "image/svg+xml"
    );

    await recordShare("poster");
    showToast("Poster downloaded");
  }

  async function downloadQr() {
  if (!selectedEvent) {
    showToast("Please create an event first");
    return;
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=${encodeURIComponent(publicLink)}`;
  const safeTitle = escapeSvg(eventTitle(selectedEvent));
  const safeLink = escapeSvg(publicLink);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="700" height="860" viewBox="0 0 700 860">
  <rect width="700" height="860" fill="#ffffff"/>
  <text x="50" y="80" font-family="Arial" font-size="32" font-weight="900" fill="#111827">${safeTitle}</text>
  <image href="${qrUrl}" x="110" y="140" width="480" height="480"/>
  <text x="50" y="690" font-family="Arial" font-size="24" font-weight="700" fill="#667085">Scan to contribute securely on Contriba</text>
  <text x="50" y="750" font-family="Arial" font-size="20" font-weight="700" fill="#E50914">${safeLink}</text>
</svg>`;

  downloadFile(
    `${eventTitle(selectedEvent).replace(/\s+/g, "-").replace(/&/g, "and")}-qr.svg`,
    svg,
    "image/svg+xml"
  );

  await recordQrScan();
  showToast("QR downloaded");
}

  async function printQr() {
    if (!selectedEvent) {
      showToast("Please create an event first");
      return;
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=${encodeURIComponent(
      publicLink
    )}`;

    const printWindow = window.open("", "_blank", "width=720,height=900");

    if (!printWindow) {
      showToast("Popup blocked");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${eventTitle(selectedEvent)} QR</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              text-align: center;
            }

            img {
              width: 360px;
              height: 360px;
            }

            h1 {
              color: #111827;
            }

            p {
              color: #667085;
              font-weight: 700;
            }
          </style>
        </head>

        <body>
          <h1>${eventTitle(selectedEvent)}</h1>
          <img src="${qrUrl}" alt="QR Code" />
          <p>Scan to contribute securely on Contriba</p>
          <p>${publicLink}</p>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);

    printWindow.document.close();

    await recordQrScan();
  }

  async function generateSmartMessage() {
    if (!selectedEvent) {
      showToast("Please create an event first");
      return;
    }

    const remaining =
      overview?.stats?.remaining ??
      overview?.remaining ??
      potentialRevenue ??
      0;

    const message = `Hi, I’m sharing ${eventTitle(
      selectedEvent
    )} on Contriba. We still need ${money(
      remaining
    )} to reach the goal. Your support means a lot. Contribute here: ${publicLink}`;

    await navigator.clipboard.writeText(message);
    await recordShare("copy_link");

    showToast("Smart message copied");
  }

  const qrImage = selectedEvent
    ? `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
        publicLink
      )}`
    : "";

  const progress =
    overview?.stats?.progress ??
    overview?.progress ??
    (totalGoal > 0 ? Math.min((totalRaised / totalGoal) * 100, 100) : 0);

  const raised =
    overview?.stats?.raised ??
    overview?.raised ??
    eventRaised(selectedEvent);

  const goal =
    overview?.stats?.goal ??
    overview?.goal ??
    eventGoal(selectedEvent);

  const remaining =
    overview?.stats?.remaining ??
    overview?.remaining ??
    Math.max(goal - raised, 0);

  const currentContributors =
    overview?.stats?.contributors ??
    overview?.contributors ??
    eventContributorCount(selectedEvent);

  const channelCards = [
    {
      title: "WhatsApp",
      description: "Open WhatsApp with the real public event link.",
      performance:
        overview?.platform_counts?.whatsapp ??
        overview?.platformCounts?.whatsapp ??
        0,
      label: "tracked shares",
      icon: FaWhatsapp,
      brand: "whatsapp",
      action: shareWhatsApp,
    },
    {
      title: "Instagram",
      description: "Copy the event link for your bio, story or caption.",
      performance:
        overview?.platform_counts?.instagram ??
        overview?.platformCounts?.instagram ??
        0,
      label: "tracked copies",
      icon: FaInstagram,
      brand: "instagram",
      action: shareInstagram,
    },
    {
      title: "Facebook",
      description: "Open Facebook sharing with the event URL.",
      performance:
        overview?.platform_counts?.facebook ??
        overview?.platformCounts?.facebook ??
        0,
      label: "tracked shares",
      icon: FaFacebookF,
      brand: "facebook",
      action: shareFacebook,
    },
    {
      title: "Direct Link",
      description: "Copy the public event URL and send anywhere.",
      performance:
        overview?.platform_counts?.direct_link ??
        overview?.platformCounts?.direct_link ??
        overview?.platform_counts?.copy_link ??
        0,
      label: "tracked copies",
      icon: LinkIcon,
      brand: "default",
      action: () => copyLink("direct_link"),
    },
  ];

  const campaignDaily = safeArray(analytics?.daily);  if (loading) {
  return (
    <main className="share-page">
      <AppSidebar active="share" />

      <section className="share-main">
        <header className="share-topbar">
          <div>
            <span>Share Center</span>
            <h1>Growth and campaign center</h1>
            <p>Preparing your real event sharing data.</p>
          </div>
        </header>

        <section className="share-stats-grid">
          {[1, 2, 3, 4].map((item) => (
            <div className="share-stat-card share-skeleton-card" key={item}>
              <div className="share-skeleton-icon shimmer" />
              <span className="share-skeleton-line share-skeleton-line-sm shimmer" />
              <strong className="share-skeleton-line share-skeleton-line-md shimmer" />
              <p className="share-skeleton-line share-skeleton-line-xs shimmer" />
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}

  if (!selectedEvent) {
    return (
      <main className="share-page">
        <AppSidebar active="share" />

        <section className="share-main">
          <header className="share-topbar">
            <div>
              <span>Share Center</span>
              <h1>Growth and campaign center</h1>
              <p>Create an event first to unlock Share Center.</p>
            </div>
          </header>

          <section className="share-empty-state">
            <Sparkles size={34} />
            <h2>No organizer event found</h2>
            <p>
              Create an event first, then Share Center will generate your public link,
              QR code, poster and real analytics.
            </p>
          </section>
        </section>
      </main>
    );
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
              Share your real event link, track clicks, QR scans, shares and campaign
              performance from backend data.
            </p>
          </div>

          <div className="share-top-actions">
            <button onClick={refreshShareCenter}>
              <RefreshCw size={18} />
              Refresh
            </button>

            <button onClick={() => copyLink("copy_link")}>
              <Copy size={18} />
              Copy Link
            </button>

            <button className="red" onClick={shareNative} disabled={sharing}>
              <Share2 size={18} />
              {sharing ? "Sharing..." : "Share Event"}
            </button>
          </div>
        </header>

        <div className="share-event-selector">
          <label>
            Active event
            <select
              value={selectedEvent?.id || ""}
              onChange={(event) => {
                const nextEvent = events.find(
                  (item) => String(item.id) === String(event.target.value)
                );
                setSelectedEvent(nextEvent || null);
              }}
            >
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {eventTitle(event)}
                </option>
              ))}
            </select>
          </label>

          <a href={publicLink} target="_blank" rel="noreferrer">
            <ExternalLink size={16} />
            Open public page
          </a>
        </div>

        <section className="share-hero">
          <div className="share-hero-left">
            <span className="share-badge">
              <Sparkles size={16} />
              Real Growth Insight
            </span>

            <h2>Share {eventTitle(selectedEvent)} and grow contributions.</h2>

            <p>
              Best channel: <strong>{bestChannel}</strong>. Best time based on
              activity: <strong>{bestTime}</strong>. Keep sharing your public link
              and QR code to bring more supporters.
            </p>

            <div className="share-hero-actions">
              <button className="light" onClick={shareWhatsApp}>
                <FaWhatsapp />
                Share on WhatsApp
              </button>

              <button className="glass" onClick={downloadPoster}>
                <Download size={18} />
                Download Poster
              </button>
            </div>
          </div>

          <div className="share-hero-card">
            <TrendingUp size={28} />
            <span>Current Event Progress</span>
            <strong>{Number(progress || 0).toFixed(1)}% funded</strong>
            <p>
              {money(raised)} raised from {count(currentContributors)} contributors.
              Remaining: {money(remaining)}.
            </p>
          </div>
        </section>

        <section className="share-stats-grid">
          {[
            {
              title: "Visitors",
              value: count(overview?.stats?.visitors ?? visitors),
              note: "People who opened your event",
              icon: UsersRound,
            },
            {
              title: "Total Shares",
  value: count(overview?.stats?.shares ?? shares),
  note: "Times your event was shared",
  icon: Share2,
            },
            {
              title: "QR Scans",
              value: count(overview?.stats?.qr_scans ?? qrScans),
              note: "People who scanned your QR",
              icon: QrCode,
            },
            {
              title: "Conversion",
              value: `${Number(overview?.stats?.conversion ?? conversion ?? 0).toFixed(
                1
              )}%`,
              note: "Visitors to contributors",
              icon: TrendingUp,
            },
          ].map((item) => {
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
                <h3>Send your real event link where people respond</h3>
              </div>
              <Share2 size={22} />
            </div>

            <div className="share-channel-grid clean">
              {channelCards.map((item) => {
                const Icon = item.icon;

                return (
                  <button key={item.title} onClick={item.action}>
                    <div className={`share-channel-icon ${item.brand}`}>
                      <Icon />
                    </div>

                    <strong>{item.title}</strong>
                    <p>{item.description}</p>

                    <div className="channel-performance">
                      <b>{count(item.performance)}</b>
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
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
              <img src={qrImage} alt={`${eventTitle(selectedEvent)} QR code`} />
              <strong>{eventTitle(selectedEvent)}</strong>
              <span>Scan to contribute</span>
            </div>

            <div className="qr-actions assets">
              <button onClick={downloadQr}>
                <Download size={17} />
                Download QR
              </button>

              <button onClick={printQr}>
                <Printer size={17} />
                Print QR
              </button>

              <button onClick={downloadPoster}>
                <FileText size={17} />
                Poster
              </button>

              <button onClick={() => copyLink("copy_link")}>
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
              <div>
                <span>Conversion</span>
                <strong>
                  {Number(overview?.stats?.conversion ?? conversion ?? 0).toFixed(1)}%
                </strong>
              </div>

              <div>
                <span>Share CTR</span>
                <strong>
                  {Number(overview?.stats?.share_ctr ?? 0).toFixed(1)}%
                </strong>
              </div>

              <div>
                <span>Visitors</span>
                <strong>{count(overview?.stats?.visitors ?? visitors)}</strong>
              </div>

              <div>
                <span>Shares</span>
                <strong>{count(overview?.stats?.shares ?? shares)}</strong>
              </div>
            </div>

            <div className="campaign-bars">
              <div style={{ height: `${Math.max(Number(progress || 0), 8)}%` }}>
                <span>Goal</span>
              </div>

              <div
                style={{
                  height: `${Math.min(Number(currentContributors || 0) * 12, 88) || 8}%`,
                }}
              >
                <span>People</span>
              </div>

              <div
                style={{
                  height: `${Math.min(Number(overview?.stats?.shares || 0) * 12, 88) || 8}%`,
                }}
              >
                <span>Shares</span>
              </div>

              <div
                style={{
                  height: `${
                    Math.min(
                      Number(overview?.platform_counts?.whatsapp || 0) * 18,
                      88
                    ) || 8
                  }%`,
                }}
              >
                <span>WhatsApp</span>
              </div>

              <div
                style={{
                  height: `${
                    Math.min(
                      Number(overview?.platform_counts?.facebook || 0) * 18,
                      88
                    ) || 8
                  }%`,
                }}
              >
                <span>Facebook</span>
              </div>

              <div
                style={{
                  height: `${
                    Math.min(
                      Number(overview?.platform_counts?.direct_link || 0) * 18,
                      88
                    ) || 8
                  }%`,
                }}
              >
                <span>Link</span>
              </div>
            </div>

            {campaignDaily.length > 0 && (
              <div className="coach-summary-list">
                {campaignDaily.slice(-4).map((day) => (
                  <div key={day.date}>
                    <span>{day.date}</span>
                    <strong>
                      {count(day.visitors)} visits • {count(day.shares)} shares
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="share-panel ai-share-panel">
            <span className="share-badge dark">
              <Sparkles size={16} />
              AI Growth Coach
            </span>

            <h3>{bestChannel} is carrying your campaign.</h3>

            <p>
              Share again around {bestTime}. This panel is now based on your
              Share Center backend activity.
            </p>

            <div className="coach-summary-list">
              <div>
                <span>Best channel</span>
                <strong>{bestChannel}</strong>
              </div>

              <div>
                <span>Best time</span>
                <strong>{bestTime}</strong>
              </div>

              <div>
                <span>Potential remaining</span>
                <strong>{money(remaining)}</strong>
              </div>

              <div>
                <span>QR scans</span>
                <strong>{count(overview?.stats?.qr_scans ?? qrScans)}</strong>
              </div>
            </div>

            <div className="top-promoters-mini">
              {topPromoters.length > 0 ? (
                topPromoters.map((person) => (
                  <p key={person.name}>
                    <CheckCircle2 size={15} />
                    <span>{person.name}</span>
                    <b>{money(person.amount || person.total || 0)} contributed</b>
                  </p>
                ))
              ) : (
                <p>
                  <CheckCircle2 size={15} />
                  <span>No contributors yet</span>
                  <b>Share your link to start</b>
                </p>
              )}
            </div>

            {safeArray(insights?.insights).map((item) => (
              <p key={item} className="share-insight-line">
                {item}
              </p>
            ))}

            <button onClick={generateSmartMessage}>
              Generate Smart Message
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}