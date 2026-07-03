import { useEffect, useState } from "react";

import {
  ArrowDownUp,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Download,
  FileText,
  HeartHandshake,
  MessageCircle,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound,
  XCircle,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import { getContributorsCRM } from "../api/api";
import "./Contributors.css";

const demoContributors = [
  {
    id: 1,
    name: "Olivier Ishimwe",
    phone: "+250 788 123 456",
    amount: "RWF 500,000",
    method: "MTN MoMo",
    date: "Today",
    time: "2 mins ago",
    status: "Success",
    message: "Congratulations! God bless your union.",
    avatar: "OI",
    total: "RWF 750,000",
    contributions: 2,
  },
];

const timeline = [
  {
    title: "Payment confirmed",
    detail: "Payment received successfully.",
    time: "Recently",
    status: "success",
  },
  {
    title: "Receipt generated",
    detail: "Receipt was created automatically.",
    time: "Recently",
    status: "success",
  },
  {
    title: "Thank-you message pending",
    detail: "Organizer has not sent a thank-you message yet.",
    time: "Now",
    status: "pending",
  },
];

function formatMoney(amount) {
  return `RWF ${Number(amount || 0).toLocaleString()}`;
}

function Contributors() {
  const [contributors, setContributors] = useState([]);
  const [stats, setStats] = useState({
    total_contributors: 0,
    total_collected: 0,
    thank_you_pending: 0,
    failed_pending: 0,
  });
  const [aiRecommendation, setAiRecommendation] = useState({
    title: "Loading contributor insights",
    message: "Contriba is checking your real contributor activity.",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContributors();
  }, []);

  async function loadContributors() {
    setLoading(true);

    const response = await getContributorsCRM();

    if (response?.success) {
      setContributors(response.contributors || []);
      setStats(
        response.stats || {
          total_contributors: 0,
          total_collected: 0,
          thank_you_pending: 0,
          failed_pending: 0,
        }
      );
      setAiRecommendation(
        response.ai_recommendation || {
          title: "Contributor CRM connected",
          message: "Your real contributor data is now connected.",
        }
      );
    } else {
      setContributors([]);
      setAiRecommendation({
        title: "Contributor data unavailable",
        message: response?.message || "Unable to load contributors right now.",
      });
    }

    setLoading(false);
  }

  const displayContributors = contributors.length > 0 ? contributors : [];
  const selectedContributor =
    displayContributors[0] || {
      avatar: "CO",
      name: loading ? "Loading..." : "No contributor yet",
      phone: loading ? "Please wait" : "No contribution received yet",
      total: "RWF 0",
      contributions: 0,
      message: loading
        ? "Contriba is loading real contributor data."
        : "Real contributors will appear here after payments are created.",
    };

  return (
    <main className="contributors-page">
      <AppSidebar active="contributors" />

      <section className="contributors-main">
        <header className="contributors-topbar">
          <div>
            <span>Contributors Center</span>
            <h1>Contributor CRM</h1>
            <p>
              Know who paid, when they paid, how much they gave, and what action
              you should take next.
            </p>
          </div>

          <div className="contributors-top-actions">
            <button>
              <Download size={18} />
              Export
            </button>
            <button className="red">
              <Send size={18} />
              Send Thank You
            </button>
          </div>
        </header>

        <section className="contributors-hero">
          <div>
            <span className="contributors-badge">
              <Sparkles size={16} />
              Smart CRM
            </span>
            <h2>Jean & Alice Wedding Supporters</h2>
            <p>
              Your strongest fundraising asset is your contributor list. Manage
              supporters like a real fintech CRM.
            </p>
          </div>

          <div className="contributors-hero-card">
            <span>AI Recommendation</span>
            <strong>{aiRecommendation.title}</strong>
            <p>{aiRecommendation.message}</p>
          </div>
        </section>

        <section className="contributors-stats-grid">
          <div className="contributors-stat-card">
            <span>Total Contributors</span>
            <strong>{stats.total_contributors}</strong>
            <p>
              <UsersRound size={15} />
              Real contributors
            </p>
          </div>

          <div className="contributors-stat-card">
            <span>Total Collected</span>
            <strong>{formatMoney(stats.total_collected)}</strong>
            <p>
              <TrendingUp size={15} />
              From successful payments
            </p>
          </div>

          <div className="contributors-stat-card">
            <span>Thank-you Pending</span>
            <strong>{stats.thank_you_pending}</strong>
            <p>
              <MessageCircle size={15} />
              Needs action
            </p>
          </div>

          <div className="contributors-stat-card">
            <span>Failed / Pending</span>
            <strong>{stats.failed_pending}</strong>
            <p>
              <Clock size={15} />
              Follow up needed
            </p>
          </div>
        </section>

        <section className="contributors-layout">
          <div className="contributors-left">
            <div className="contributors-toolbar">
              <div className="contributors-search">
                <Search size={18} />
                <input placeholder="Search name, phone, method, message..." />
              </div>

              <div className="contributors-filters">
                <button>All Methods</button>
                <button>Success</button>
                <button>
                  <ArrowDownUp size={16} />
                  Highest Amount
                </button>
              </div>
            </div>

            <div className="contributors-table-card">
              <div className="contributors-table-head">
                <span>Contributor</span>
                <span>Amount</span>
                <span>Method</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              <div className="contributors-table-body">
                {displayContributors.map((person) => (
                  <div className="contributors-row" key={person.id}>
                    <div className="contributors-person">
                      <div className="contributors-avatar">{person.avatar}</div>
                      <div>
                        <strong>{person.name}</strong>
                        <span>{person.phone}</span>
                        <small>{person.message}</small>
                      </div>
                    </div>

                    <div className="contributors-amount">
                      <strong>{person.amount}</strong>
                      <span>{person.time}</span>
                    </div>

                    <div className="contributors-method">
                      <span>{person.method}</span>
                      <small>{person.date}</small>
                    </div>

                    <small
                      className={`contributors-status ${person.status.toLowerCase()}`}
                    >
                      {person.status === "Success" && <CheckCircle2 size={14} />}
                      {person.status === "Pending" && <Clock size={14} />}
                      {person.status === "Failed" && <XCircle size={14} />}
                      {person.status}
                    </small>

                    <div className="contributors-actions">
                      <button>
                        <MessageCircle size={16} />
                      </button>
                      <button>
                        <FileText size={16} />
                      </button>
                      <button>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {!loading && displayContributors.length === 0 && (
                  <div className="contributors-row">
                    <div className="contributors-person">
                      <div className="contributors-avatar">CO</div>
                      <div>
                        <strong>No contributors yet</strong>
                        <span>Waiting for real payments</span>
                        <small>
                          Real contributors will appear here after users
                          contribute to your events.
                        </small>
                      </div>
                    </div>

                    <div className="contributors-amount">
                      <strong>RWF 0</strong>
                      <span>Now</span>
                    </div>

                    <div className="contributors-method">
                      <span>None</span>
                      <small>Empty</small>
                    </div>

                    <small className="contributors-status pending">
                      <Clock size={14} />
                      Pending
                    </small>

                    <div className="contributors-actions">
                      <button>
                        <MessageCircle size={16} />
                      </button>
                      <button>
                        <FileText size={16} />
                      </button>
                      <button>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="contributor-detail-panel">
            <div className="detail-profile">
              <div className="detail-avatar">{selectedContributor.avatar}</div>
              <h3>{selectedContributor.name}</h3>
              <p>{selectedContributor.phone}</p>

              <span className="contributors-status success">
                <CheckCircle2 size={14} />
                Trusted Contributor
              </span>
            </div>

            <div className="detail-money-card">
              <span>Total contributed</span>
              <strong>{selectedContributor.total}</strong>
              <p>{selectedContributor.contributions} contributions completed</p>
            </div>

            <div className="detail-actions-grid">
              <button>
                <MessageCircle size={17} />
                Thank You
              </button>
              <button>
                <Phone size={17} />
                Call
              </button>
              <button>
                <FileText size={17} />
                Receipt
              </button>
              <button>
                <Copy size={17} />
                Copy Info
              </button>
            </div>

            <div className="detail-section">
              <div className="detail-section-head">
                <span>Latest Message</span>
                <HeartHandshake size={18} />
              </div>
              <p>{selectedContributor.message}</p>
            </div>

            <div className="detail-section">
              <div className="detail-section-head">
                <span>Payment Timeline</span>
                <ShieldCheck size={18} />
              </div>

              <div className="timeline-list">
                {timeline.map((item) => (
                  <div className="timeline-item" key={item.title}>
                    <span className={item.status}></span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.detail}</p>
                      <small>{item.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-ai-card">
              <span>
                <Sparkles size={15} />
                AI Next Action
              </span>
              <p>
                Send a personal thank-you message now. Contributors who receive
                a thank-you are more likely to share the event with others.
              </p>
              <button>
                Send Smart Thank You
                <ArrowRight size={16} />
              </button>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

export default Contributors;