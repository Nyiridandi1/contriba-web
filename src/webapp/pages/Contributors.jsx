import { useEffect, useMemo, useState } from "react";

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

const PAGE_SIZE = 8;

const fallbackStats = {
  total_contributors: 0,
  total_collected: 0,
  thank_you_pending: 0,
  failed_pending: 0,
};

const defaultAiRecommendation = {
  title: "Loading contributor insights",
  message: "Contriba is checking your real contributor activity.",
};

function formatMoney(amount) {
  return `RWF ${Number(amount || 0).toLocaleString()}`;
}

function getRawAmount(person) {
  if (typeof person?.raw_amount === "number") return person.raw_amount;

  const cleaned = String(person?.amount || "")
    .replace(/RWF/gi, "")
    .replace(/,/g, "")
    .trim();

  return Number(cleaned || 0);
}

function getInitials(name) {
  if (!name || name === "Anonymous") return "AN";

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value) {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "Recently";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeContributor(person) {
  const name = person?.name || person?.contributor_name || "Unknown Contributor";
  const rawAmount = getRawAmount(person);
  const status = person?.status || "Pending";

  return {
    id: person?.id || crypto.randomUUID(),
    event_id: person?.event_id || null,
    event_title: person?.event_title || person?.event || "All Events",
    name,
    phone: person?.phone || person?.contributor_phone || "Hidden",
    amount: person?.amount || formatMoney(rawAmount),
    raw_amount: rawAmount,
    method: person?.method || person?.payment_method || "Unknown",
    date_raw: person?.created_at || person?.date || null,
    date: formatDate(person?.created_at || person?.date),
    time: formatTime(person?.created_at || person?.time),
    status,
    message: person?.message || "No message provided.",
    avatar: person?.avatar || getInitials(name),
    total: person?.total || person?.amount || formatMoney(rawAmount),
    contributions: person?.contributions || 1,
    transaction_id: person?.transaction_id || null,
    thank_you_sent: person?.thank_you_sent === true,
    receipt_id: person?.receipt_id || person?.transaction_id || null,
  };
}

function buildTimeline(contributor) {
  if (!contributor) {
    return [
      {
        title: "Waiting for contributors",
        detail: "Timeline will appear when real contributions are available.",
        time: "Now",
        status: "pending",
      },
    ];
  }

  if (contributor.status === "Success") {
    return [
      {
        title: "Payment confirmed",
        detail: `${contributor.amount} received through ${contributor.method}.`,
        time: contributor.time,
        status: "success",
      },
      {
        title: "Receipt generated",
        detail: contributor.receipt_id
          ? `Receipt / transaction ${contributor.receipt_id} is available.`
          : "Receipt was created automatically.",
        time: contributor.time,
        status: "success",
      },
      {
        title: contributor.thank_you_sent
          ? "Thank-you message sent"
          : "Thank-you message pending",
        detail: contributor.thank_you_sent
          ? "Organizer already thanked this contributor."
          : "Organizer has not sent a thank-you message yet.",
        time: "Now",
        status: contributor.thank_you_sent ? "success" : "pending",
      },
    ];
  }

  if (contributor.status === "Failed") {
    return [
      {
        title: "Payment failed",
        detail: `${contributor.amount} through ${contributor.method} was not completed.`,
        time: contributor.time,
        status: "failed",
      },
      {
        title: "Follow up needed",
        detail: "Contact this contributor and ask them to try again.",
        time: "Now",
        status: "pending",
      },
    ];
  }

  return [
    {
      title: "Payment pending",
      detail: `${contributor.amount} through ${contributor.method} is waiting for confirmation.`,
      time: contributor.time,
      status: "pending",
    },
    {
      title: "Reminder recommended",
      detail: "This contributor may need a warm reminder to complete payment.",
      time: "Now",
      status: "pending",
    },
  ];
}

function Contributors() {
  const [contributors, setContributors] = useState([]);
  const [stats, setStats] = useState(fallbackStats);
  const [aiRecommendation, setAiRecommendation] = useState(
    defaultAiRecommendation
  );
  const [selectedContributor, setSelectedContributor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("All Methods");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortMode, setSortMode] = useState("Highest Amount");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadContributors();
  }, []);

  async function loadContributors() {
    setLoading(true);

    const response = await getContributorsCRM();

    if (response?.success) {
      const realContributors = (response.contributors || []).map(
        normalizeContributor
      );

      setContributors(realContributors);
      setStats(response.stats || fallbackStats);
      setAiRecommendation(
        response.ai_recommendation || {
          title: "Contributor CRM connected",
          message: "Your real contributor data is now connected.",
        }
      );
      setSelectedContributor(realContributors[0] || null);
    } else {
      setContributors([]);
      setSelectedContributor(null);
      setStats(fallbackStats);
      setAiRecommendation({
        title: "Contributor data unavailable",
        message: response?.message || "Unable to load contributors right now.",
      });
    }

    setLoading(false);
  }

  const analytics = useMemo(() => {
    const success = contributors.filter((item) => item.status === "Success");
    const pending = contributors.filter((item) => item.status === "Pending");
    const failed = contributors.filter((item) => item.status === "Failed");

    const totalAmount = success.reduce(
      (sum, item) => sum + Number(item.raw_amount || 0),
      0
    );

    const averageAmount =
      success.length > 0 ? Math.round(totalAmount / success.length) : 0;

    const highestContributor = [...contributors].sort(
      (a, b) => Number(b.raw_amount || 0) - Number(a.raw_amount || 0)
    )[0];

    const methodCounts = contributors.reduce((acc, item) => {
      acc[item.method] = (acc[item.method] || 0) + 1;
      return acc;
    }, {});

    const mostUsedMethod =
      Object.entries(methodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "None yet";

    const successRate =
      contributors.length > 0
        ? Math.round((success.length / contributors.length) * 100)
        : 0;

    return {
      successCount: success.length,
      pendingCount: pending.length,
      failedCount: failed.length,
      averageAmount,
      highestContributor,
      mostUsedMethod,
      successRate,
    };
  }, [contributors]);

  const availableMethods = useMemo(() => {
    const uniqueMethods = contributors
      .map((person) => person.method)
      .filter(Boolean);

    return ["All Methods", ...Array.from(new Set(uniqueMethods))];
  }, [contributors]);

  const filteredContributors = useMemo(() => {
    let list = [...contributors];

    const search = searchTerm.trim().toLowerCase();

    if (search) {
      list = list.filter((person) => {
        return (
          person.name?.toLowerCase().includes(search) ||
          person.phone?.toLowerCase().includes(search) ||
          person.method?.toLowerCase().includes(search) ||
          person.status?.toLowerCase().includes(search) ||
          person.amount?.toLowerCase().includes(search) ||
          person.message?.toLowerCase().includes(search) ||
          person.event_title?.toLowerCase().includes(search)
        );
      });
    }

    if (methodFilter !== "All Methods") {
      list = list.filter((person) => person.method === methodFilter);
    }

    if (statusFilter !== "All Status") {
      list = list.filter((person) => person.status === statusFilter);
    }

    if (sortMode === "Highest Amount") {
      list.sort((a, b) => Number(b.raw_amount || 0) - Number(a.raw_amount || 0));
    }

    if (sortMode === "Lowest Amount") {
      list.sort((a, b) => Number(a.raw_amount || 0) - Number(b.raw_amount || 0));
    }

    if (sortMode === "Latest") {
      list.sort(
        (a, b) => new Date(b.date_raw || 0) - new Date(a.date_raw || 0)
      );
    }

    if (sortMode === "Oldest") {
      list.sort(
        (a, b) => new Date(a.date_raw || 0) - new Date(b.date_raw || 0)
      );
    }

    return list;
  }, [contributors, searchTerm, methodFilter, statusFilter, sortMode]);  const totalPages = Math.max(
    1,
    Math.ceil(filteredContributors.length / PAGE_SIZE)
  );

  const paginatedContributors = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredContributors.slice(start, start + PAGE_SIZE);
  }, [filteredContributors, currentPage]);

  const safeSelectedContributor =
    selectedContributor ||
    paginatedContributors[0] || {
      avatar: "CO",
      name: loading ? "Loading..." : "No contributor yet",
      phone: loading ? "Please wait" : "No contribution received yet",
      total: "RWF 0",
      contributions: 0,
      message: loading
        ? "Contriba is loading real contributor data."
        : "Real contributors will appear here after payments are created.",
      status: "Pending",
      amount: "RWF 0",
      method: "None",
      time: "Now",
    };

  const timeline = buildTimeline(selectedContributor || paginatedContributors[0]);

  function showNotice(message) {
    setNotice(message);

    setTimeout(() => {
      setNotice("");
    }, 2600);
  }

  function handleMethodFilter() {
    const currentIndex = availableMethods.indexOf(methodFilter);
    const nextIndex =
      currentIndex === availableMethods.length - 1 ? 0 : currentIndex + 1;

    setMethodFilter(availableMethods[nextIndex] || "All Methods");
    setCurrentPage(1);
  }

  function handleStatusFilter() {
    const filters = ["All Status", "Success", "Pending", "Failed"];
    const currentIndex = filters.indexOf(statusFilter);
    const nextIndex = currentIndex === filters.length - 1 ? 0 : currentIndex + 1;

    setStatusFilter(filters[nextIndex]);
    setCurrentPage(1);
  }

  function handleSortMode() {
    const modes = ["Highest Amount", "Lowest Amount", "Latest", "Oldest"];
    const currentIndex = modes.indexOf(sortMode);
    const nextIndex = currentIndex === modes.length - 1 ? 0 : currentIndex + 1;

    setSortMode(modes[nextIndex]);
    setCurrentPage(1);
  }

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  }

  function handleSelectContributor(person) {
    setSelectedContributor(person);
  }

  function handleExportCSV() {
    const rows = filteredContributors.map((person) => ({
      Name: person.name,
      Phone: person.phone,
      Event: person.event_title,
      Amount: person.amount,
      Method: person.method,
      Status: person.status,
      Date: person.date,
      Time: person.time,
      Message: person.message,
      ThankYouSent: person.thank_you_sent ? "Yes" : "No",
      Receipt: person.receipt_id || "",
    }));

    const headers = Object.keys(
      rows[0] || {
        Name: "",
        Phone: "",
        Event: "",
        Amount: "",
        Method: "",
        Status: "",
        Date: "",
        Time: "",
        Message: "",
        ThankYouSent: "",
        Receipt: "",
      }
    );

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => `"${String(row[header] || "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "contriba-contributors.csv";
    link.click();

    URL.revokeObjectURL(url);

    showNotice("CSV export downloaded.");
  }

  function handleCopyInfo() {
    if (!safeSelectedContributor) return;

    const text = `Contributor: ${safeSelectedContributor.name}
Phone: ${safeSelectedContributor.phone}
Event: ${safeSelectedContributor.event_title || "All Events"}
Amount: ${safeSelectedContributor.amount}
Method: ${safeSelectedContributor.method}
Status: ${safeSelectedContributor.status}
Message: ${safeSelectedContributor.message}`;

    navigator.clipboard.writeText(text);
    showNotice("Contributor info copied.");
  }

  function handleCallContributor() {
    if (!safeSelectedContributor?.phone || safeSelectedContributor.phone === "Hidden") {
      showNotice("Phone number is hidden.");
      return;
    }

    window.location.href = `tel:${safeSelectedContributor.phone}`;
  }

  function handleThankYou(person = safeSelectedContributor) {
    if (!person || person.name === "No contributor yet") {
      showNotice("No contributor selected.");
      return;
    }

    showNotice(
      `Thank-you action prepared for ${person.name}. Backend will be connected later.`
    );
  }

  function handleReceipt(person = safeSelectedContributor) {
    if (!person || person.name === "No contributor yet") {
      showNotice("No contributor selected.");
      return;
    }

    showNotice(
      person.receipt_id
        ? `Receipt ${person.receipt_id} ready. Backend download comes later.`
        : "Receipt preview will be connected after backend receipt API."
    );
  }

  function handleNextPage() {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }

  function handlePrevPage() {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }

  const uiAiTitle =
    contributors.length === 0
      ? aiRecommendation.title
      : analytics.failedCount + analytics.pendingCount > 0
      ? `${analytics.failedCount + analytics.pendingCount} payments need attention`
      : analytics.thankYouPending > 0
      ? `${stats.thank_you_pending} thank-you messages pending`
      : aiRecommendation.title;

  const uiAiMessage =
    contributors.length === 0
      ? aiRecommendation.message
      : analytics.failedCount + analytics.pendingCount > 0
      ? "Follow up with pending or failed contributors to recover missed support."
      : stats.thank_you_pending > 0
      ? "Send thank-you messages now to build trust and encourage sharing."
      : `Most used method is ${analytics.mostUsedMethod}. Success rate is ${analytics.successRate}%.`;

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
            {notice && (
              <p style={{ color: "#E50914", marginTop: 8 }}>{notice}</p>
            )}
          </div>

          <div className="contributors-top-actions">
            <button onClick={handleExportCSV}>
              <Download size={18} />
              Export
            </button>
            <button className="red" onClick={() => handleThankYou()}>
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
            <h2>All Event Supporters</h2>
            <p>
              Your strongest fundraising asset is your contributor list. Manage
              supporters like a real fintech CRM.
            </p>
          </div>

          <div className="contributors-hero-card">
            <span>AI Recommendation</span>
            <strong>{uiAiTitle}</strong>
            <p>{uiAiMessage}</p>
          </div>
        </section>

        <section className="contributors-stats-grid">
          <div className="contributors-stat-card">
            <span>Total Contributors</span>
            <strong>{stats.total_contributors}</strong>
            <p>
              <UsersRound size={15} />
              Success rate {analytics.successRate}%
            </p>
          </div>

          <div className="contributors-stat-card">
            <span>Total Collected</span>
            <strong>{formatMoney(stats.total_collected)}</strong>
            <p>
              <TrendingUp size={15} />
              Avg {formatMoney(analytics.averageAmount)}
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
        </section>        <section className="contributors-layout">
          <div className="contributors-left">
            <div className="contributors-toolbar">
              <div className="contributors-search">
                <Search size={18} />
                <input
                  placeholder="Search name, phone, method, message..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              <div className="contributors-filters">
                <button onClick={handleMethodFilter}>{methodFilter}</button>
                <button onClick={handleStatusFilter}>
                  {statusFilter === "All Status" ? "All Status" : statusFilter}
                </button>
                <button onClick={handleSortMode}>
                  <ArrowDownUp size={16} />
                  {sortMode}
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
                {paginatedContributors.map((person) => (
                  <div
                    className="contributors-row"
                    key={person.id}
                    onClick={() => handleSelectContributor(person)}
                  >
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
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleThankYou(person);
                        }}
                      >
                        <MessageCircle size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleReceipt(person);
                        }}
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleSelectContributor(person);
                        }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {!loading && paginatedContributors.length === 0 && (
                  <div className="contributors-row">
                    <div className="contributors-person">
                      <div className="contributors-avatar">CO</div>
                      <div>
                        <strong>No contributors found</strong>
                        <span>Try search or filters</span>
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
                      <button type="button">
                        <MessageCircle size={16} />
                      </button>
                      <button type="button">
                        <FileText size={16} />
                      </button>
                      <button type="button">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {filteredContributors.length > PAGE_SIZE && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 18px",
                    borderTop: "1px solid rgba(20, 20, 30, 0.06)",
                  }}
                >
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    style={{
                      height: 38,
                      padding: "0 14px",
                      borderRadius: 14,
                      border: "1px solid rgba(20, 20, 30, 0.08)",
                      background: "white",
                      fontWeight: 850,
                      cursor: "pointer",
                    }}
                  >
                    Previous
                  </button>

                  <strong style={{ fontSize: 13 }}>
                    Page {currentPage} of {totalPages}
                  </strong>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    style={{
                      height: 38,
                      padding: "0 14px",
                      borderRadius: 14,
                      border: "1px solid rgba(20, 20, 30, 0.08)",
                      background: "white",
                      fontWeight: 850,
                      cursor: "pointer",
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          <aside className="contributor-detail-panel">
            <div className="detail-profile">
              <div className="detail-avatar">
                {safeSelectedContributor.avatar}
              </div>
              <h3>{safeSelectedContributor.name}</h3>
              <p>{safeSelectedContributor.phone}</p>

              <span
                className={`contributors-status ${
                  safeSelectedContributor.status?.toLowerCase() || "pending"
                }`}
              >
                {safeSelectedContributor.status === "Success" && (
                  <CheckCircle2 size={14} />
                )}
                {safeSelectedContributor.status === "Pending" && (
                  <Clock size={14} />
                )}
                {safeSelectedContributor.status === "Failed" && (
                  <XCircle size={14} />
                )}
                {safeSelectedContributor.status === "Success"
                  ? "Trusted Contributor"
                  : safeSelectedContributor.status}
              </span>
            </div>

            <div className="detail-money-card">
              <span>Total contributed</span>
              <strong>{safeSelectedContributor.total}</strong>
              <p>
                {safeSelectedContributor.contributions} contributions completed
              </p>
            </div>

            <div className="detail-actions-grid">
              <button onClick={() => handleThankYou()}>
                <MessageCircle size={17} />
                Thank You
              </button>
              <button onClick={handleCallContributor}>
                <Phone size={17} />
                Call
              </button>
              <button onClick={() => handleReceipt()}>
                <FileText size={17} />
                Receipt
              </button>
              <button onClick={handleCopyInfo}>
                <Copy size={17} />
                Copy Info
              </button>
            </div>

            <div className="detail-section">
              <div className="detail-section-head">
                <span>Latest Message</span>
                <HeartHandshake size={18} />
              </div>
              <p>{safeSelectedContributor.message}</p>
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
                {safeSelectedContributor.status === "Success"
                  ? "Send a personal thank-you message now. Contributors who receive a thank-you are more likely to share the event with others."
                  : safeSelectedContributor.status === "Failed"
                  ? "Follow up with this contributor and help them complete payment again."
                  : "Send a warm reminder to help this contributor complete their payment."}
              </p>
              <button onClick={() => handleThankYou()}>
                Send Smart Thank You
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="detail-section">
              <div className="detail-section-head">
                <span>CRM Analytics</span>
                <TrendingUp size={18} />
              </div>
              <p>
                Average: {formatMoney(analytics.averageAmount)} • Best method:{" "}
                {analytics.mostUsedMethod} • Success rate:{" "}
                {analytics.successRate}%.
              </p>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

export default Contributors;