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
import { formatDateTime, formatMoney } from "./contributors/contributorHelpers";
import { useContributors } from "./contributors/useContributors";
import "./Contributors.css";

function Contributors() {
  const {
    contributors,
    stats,
    analytics,
    aiRecommendation,
    selectedEventTitle,
    selectedContributor,
    timeline,
    loading,
    actionLoading,
    notice,
    searchTerm,
    methodFilter,
    statusFilter,
    sortMode,
    currentPage,
    pagination,

    handleSearchChange,
    handleMethodFilter,
    handleStatusFilter,
    handleSortMode,
    handleEventSwitch,
    handleSelectContributor,
    handleNextPage,
    handlePrevPage,

    exportCSV,
    sendThankYou,
    openReceipt,
    downloadReceipt,
    copyInfo,
    callContributor,
  } = useContributors();

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
            <button onClick={exportCSV} disabled={actionLoading === "export"}>
              <Download size={18} />
              {actionLoading === "export" ? "Exporting..." : "Export"}
            </button>

            <button
              className="red"
              onClick={() => sendThankYou()}
              disabled={actionLoading === "thank-you"}
            >
              <Send size={18} />
              {actionLoading === "thank-you"
                ? "Sending..."
                : "Send Thank You"}
            </button>
          </div>
        </header>

        <section className="contributors-hero">
          <div>
            <span className="contributors-badge">
              <Sparkles size={16} />
              Smart CRM
            </span>

            <h2 onClick={handleEventSwitch} style={{ cursor: "pointer" }}>
              {selectedEventTitle}
            </h2>

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
        </section>

        <section className="contributors-layout">
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

                <button onClick={handleStatusFilter}>{statusFilter}</button>

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
                {contributors.map((person) => (
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
                      <span>{formatDateTime(person.time)}</span>
                    </div>

                    <div className="contributors-method">
                      <span>{person.method}</span>
                      <small>{formatDateTime(person.date)}</small>
                    </div>

                    <small
                      className={`contributors-status ${
                        person.status?.toLowerCase() || "pending"
                      }`}
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
                          sendThankYou(person);
                        }}
                      >
                        <MessageCircle size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openReceipt(person);
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

                {!loading && contributors.length === 0 && (
                  <div className="contributors-row">
                    <div className="contributors-person">
                      <div className="contributors-avatar">CO</div>
                      <div>
                        <strong>No contributors found</strong>
                        <span>Try search, filters, or another event</span>
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

              {pagination.total_pages > 1 && (
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
                    disabled={!pagination.has_previous}
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
                    Page {currentPage} of {pagination.total_pages}
                  </strong>

                  <button
                    onClick={handleNextPage}
                    disabled={!pagination.has_next}
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
              <div className="detail-avatar">{selectedContributor.avatar}</div>
              <h3>{selectedContributor.name}</h3>
              <p>{selectedContributor.phone}</p>

              <span
                className={`contributors-status ${
                  selectedContributor.status?.toLowerCase() || "pending"
                }`}
              >
                {selectedContributor.status === "Success" && (
                  <CheckCircle2 size={14} />
                )}
                {selectedContributor.status === "Pending" && <Clock size={14} />}
                {selectedContributor.status === "Failed" && (
                  <XCircle size={14} />
                )}
                {selectedContributor.status === "Success"
                  ? "Trusted Contributor"
                  : selectedContributor.status}
              </span>
            </div>

            <div className="detail-money-card">
              <span>Total contributed</span>
              <strong>{selectedContributor.total}</strong>
              <p>{selectedContributor.contributions} contributions completed</p>
            </div>

            <div className="detail-actions-grid">
              <button
                onClick={() => sendThankYou()}
                disabled={actionLoading === "thank-you"}
              >
                <MessageCircle size={17} />
                Thank You
              </button>

              <button onClick={() => callContributor()}>
                <Phone size={17} />
                Call
              </button>

              <button
                onClick={() => openReceipt()}
                disabled={actionLoading === "receipt"}
              >
                <FileText size={17} />
                Receipt
              </button>

              <button onClick={() => copyInfo()}>
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
                {timeline.map((item, index) => (
                  <div className="timeline-item" key={`${item.title}-${index}`}>
                    <span className={item.status}></span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.detail}</p>
                      <small>{formatDateTime(item.time)}</small>
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
                {selectedContributor.status === "Success"
                  ? "Send a personal thank-you message now. Contributors who receive a thank-you are more likely to share the event with others."
                  : selectedContributor.status === "Failed"
                  ? "Follow up with this contributor and help them complete payment again."
                  : "Send a warm reminder to help this contributor complete their payment."}
              </p>

              <button
                onClick={() => sendThankYou()}
                disabled={actionLoading === "thank-you"}
              >
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

            <div className="detail-section">
              <div className="detail-section-head">
                <span>Receipt Download</span>
                <FileText size={18} />
              </div>
              <p>
                Receipt ID: {selectedContributor.receipt_id || "Not generated yet"}
              </p>
              <button
                onClick={() => downloadReceipt()}
                disabled={actionLoading === "receipt-download"}
                style={{
                  width: "100%",
                  marginTop: 12,
                  height: 42,
                  border: 0,
                  borderRadius: 14,
                  color: "white",
                  background: "#E50914",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                {actionLoading === "receipt-download"
                  ? "Downloading..."
                  : "Download Receipt"}
              </button>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

export default Contributors;