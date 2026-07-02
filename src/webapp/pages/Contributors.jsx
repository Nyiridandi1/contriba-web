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
import "./Contributors.css";

const contributors = [
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
  {
    id: 2,
    name: "Grace N.",
    phone: "+250 782 444 220",
    amount: "RWF 250,000",
    method: "Airtel Money",
    date: "Today",
    time: "18 mins ago",
    status: "Success",
    message: "So happy for you. Wishing you a blessed marriage.",
    avatar: "GN",
    total: "RWF 250,000",
    contributions: 1,
  },
  {
    id: 3,
    name: "Patrick K.",
    phone: "+250 790 988 100",
    amount: "RWF 150,000",
    method: "Visa / Card",
    date: "Today",
    time: "1 hour ago",
    status: "Success",
    message: "God bless your union.",
    avatar: "PK",
    total: "RWF 150,000",
    contributions: 1,
  },
  {
    id: 4,
    name: "Anonymous",
    phone: "Hidden",
    amount: "RWF 100,000",
    method: "MTN MoMo",
    date: "Today",
    time: "3 hours ago",
    status: "Pending",
    message: "Wishing you the best.",
    avatar: "AN",
    total: "RWF 100,000",
    contributions: 1,
  },
  {
    id: 5,
    name: "Divine M.",
    phone: "+250 788 778 889",
    amount: "RWF 80,000",
    method: "Airtel Money",
    date: "Yesterday",
    time: "8:40 PM",
    status: "Success",
    message: "May your home be full of joy.",
    avatar: "DM",
    total: "RWF 180,000",
    contributions: 3,
  },
  {
    id: 6,
    name: "Jean Claude",
    phone: "+250 722 111 900",
    amount: "RWF 50,000",
    method: "MTN MoMo",
    date: "Yesterday",
    time: "6:12 PM",
    status: "Failed",
    message: "Payment failed before confirmation.",
    avatar: "JC",
    total: "RWF 0",
    contributions: 0,
  },
];

const timeline = [
  {
    title: "Payment confirmed",
    detail: "RWF 500,000 received through MTN MoMo.",
    time: "2 mins ago",
    status: "success",
  },
  {
    title: "Receipt generated",
    detail: "Receipt #CTR-2048 was created automatically.",
    time: "1 min ago",
    status: "success",
  },
  {
    title: "Thank-you message pending",
    detail: "Organizer has not sent a thank-you message yet.",
    time: "Now",
    status: "pending",
  },
];

function Contributors() {
  const selectedContributor = contributors[0];

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
            <strong>47 people viewed but did not pay</strong>
            <p>Send a warm reminder now and you may collect +RWF 420K tonight.</p>
          </div>
        </section>

        <section className="contributors-stats-grid">
          <div className="contributors-stat-card">
            <span>Total Contributors</span>
            <strong>287</strong>
            <p>
              <UsersRound size={15} />
              23 joined today
            </p>
          </div>

          <div className="contributors-stat-card">
            <span>Total Collected</span>
            <strong>RWF 3.85M</strong>
            <p>
              <TrendingUp size={15} />
              +18% today
            </p>
          </div>

          <div className="contributors-stat-card">
            <span>Thank-you Pending</span>
            <strong>41</strong>
            <p>
              <MessageCircle size={15} />
              Needs action
            </p>
          </div>

          <div className="contributors-stat-card">
            <span>Failed / Pending</span>
            <strong>14</strong>
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
                {contributors.map((person) => (
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