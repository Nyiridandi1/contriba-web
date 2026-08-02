import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileSearch,
  Flag,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import { getToken } from "../api/api";
import "./Admin.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const FILTERS = [
  {
    key: "pending",
    label: "Pending",
    icon: Clock3,
  },
  {
    key: "verified",
    label: "Verified",
    icon: CheckCircle2,
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
  },
  {
    key: "all",
    label: "All",
    icon: FileSearch,
  },
];

const MODULES = [
  {
    title: "Reported Events",
    description:
      "Review suspicious, misleading, duplicate, impersonated, or abusive events.",
    icon: Flag,
    badge: "Coming soon",
  },
  {
    title: "User Management",
    description:
      "Manage user access, account status, roles, and organizer activity.",
    icon: UsersRound,
    badge: "Coming soon",
  },
  {
    title: "Event Management",
    description:
      "Review events, visibility, featured placement, and moderation status.",
    icon: CalendarDays,
    badge: "Coming soon",
  },
  {
    title: "Wallet & Withdrawals",
    description:
      "Review balances, payouts, cash-out activity, and payment issues.",
    icon: WalletCards,
    badge: "Coming soon",
  },
  {
    title: "Platform Analytics",
    description:
      "Track growth, contributions, events, users, and trust activity.",
    icon: BarChart3,
    badge: "Coming soon",
  },
  {
    title: "Platform Settings",
    description:
      "Manage platform controls, trust rules, moderation, and system settings.",
    icon: Settings,
    badge: "Coming soon",
  },
];

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-RW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function maskId(value) {
  if (!value) return "Not available";

  const clean = String(value);

  if (clean.length <= 4) {
    return "*".repeat(clean.length);
  }

  return `${"*".repeat(
    Math.max(clean.length - 4, 4)
  )}${clean.slice(-4)}`;
}

async function apiRequest(path, options = {}) {
  const token = getToken();

  if (!token) {
    return {
      success: false,
      httpStatus: 401,
      message: "Please log in again.",
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(options.body
            ? { "Content-Type": "application/json" }
            : {}),
          ...(options.headers || {}),
        },
      }
    );

    const result = await response
      .json()
      .catch(() => ({}));

    return {
      ...result,
      httpStatus: response.status,
    };
  } catch {
    return {
      success: false,
      httpStatus: 0,
      message:
        "Could not connect to the Contriba backend.",
    };
  }
}

function AdminSkeleton() {
  return (
    <div className="admin-skeleton">
      <section className="admin-hero admin-skeleton-hero">
        <div>
          <span className="admin-skeleton-line admin-skeleton-tag shimmer" />
          <span className="admin-skeleton-line admin-skeleton-title shimmer" />
          <span className="admin-skeleton-line admin-skeleton-copy shimmer" />
        </div>

        <div className="admin-skeleton-badge shimmer" />
      </section>

      <section className="admin-summary-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="admin-summary-card"
            key={index}
          >
            <span className="admin-skeleton-icon shimmer" />
            <span className="admin-skeleton-line admin-skeleton-small shimmer" />
            <span className="admin-skeleton-line admin-skeleton-number shimmer" />
          </div>
        ))}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <span className="admin-skeleton-line admin-skeleton-tag shimmer" />
            <span className="admin-skeleton-line admin-skeleton-heading shimmer" />
          </div>
        </div>

        <div className="admin-review-grid">
          <div className="admin-review-list">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className="admin-review-row admin-review-row-skeleton"
                key={index}
              >
                <span className="admin-skeleton-avatar shimmer" />

                <div>
                  <span className="admin-skeleton-line admin-skeleton-name shimmer" />
                  <span className="admin-skeleton-line admin-skeleton-small shimmer" />
                </div>

                <span className="admin-skeleton-pill shimmer" />
              </div>
            ))}
          </div>

          <div className="admin-review-detail admin-review-detail-skeleton">
            <span className="admin-skeleton-line admin-skeleton-heading shimmer" />
            <span className="admin-skeleton-line admin-skeleton-copy shimmer" />
            <span className="admin-skeleton-preview shimmer" />
          </div>
        </div>
      </section>
    </div>
  );
}

function UnauthorizedState({ message }) {
  return (
    <section className="admin-access-state">
      <div className="admin-access-icon denied">
        <ShieldCheck size={34} />
      </div>

      <span>Protected Admin Area</span>
      <h2>Administrator access required</h2>

      <p>
        {message ||
          "This page is available only to authorized Contriba administrators."}
      </p>
    </section>
  );
}

function ReviewStatus({ status }) {
  const normalized = status || "pending";

  if (normalized === "verified") {
    return (
      <span className="admin-status verified">
        <CheckCircle2 size={14} />
        Verified
      </span>
    );
  }

  if (normalized === "rejected") {
    return (
      <span className="admin-status rejected">
        <XCircle size={14} />
        Rejected
      </span>
    );
  }

  return (
    <span className="admin-status pending">
      <Clock3 size={14} />
      Pending
    </span>
  );
}

function Admin() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] =
    useState(false);
  const [accessMessage, setAccessMessage] =
    useState("");

  const [admin, setAdmin] = useState(null);
  const [submissions, setSubmissions] =
    useState([]);
  const [selectedId, setSelectedId] =
    useState(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  const [documents, setDocuments] = useState({
    front_url: "",
    back_url: "",
  });

  const [documentsLoading, setDocumentsLoading] =
    useState(false);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] =
    useState(false);

  const [rejectOpen, setRejectOpen] =
    useState(false);
  const [rejectReason, setRejectReason] =
    useState("");

  async function loadAdmin() {
    setLoading(true);
    setMessage("");

    const meResult = await apiRequest(
      "/api/admin/kyc/me"
    );

    if (!meResult.success) {
      setAuthorized(false);
      setAccessMessage(
        meResult.message ||
          "Administrator access is required."
      );
      setLoading(false);
      return;
    }

    setAuthorized(true);
    setAdmin(meResult.admin || null);

    await loadSubmissions(filter, true);
    setLoading(false);
  }

  async function loadSubmissions(
    nextFilter = filter,
    preserveSelection = false
  ) {
    setMessage("");

    const result = await apiRequest(
      `/api/admin/kyc/submissions?status=${encodeURIComponent(
        nextFilter
      )}&page=1&limit=50`
    );

    if (!result.success) {
      setMessage(
        result.message ||
          "Could not load KYC submissions."
      );
      return;
    }

    const records = result.submissions || [];
    setSubmissions(records);

    if (!preserveSelection) {
      setSelectedId(records[0]?.id || null);
    } else if (
      selectedId &&
      records.some((item) => item.id === selectedId)
    ) {
      setSelectedId(selectedId);
    } else {
      setSelectedId(records[0]?.id || null);
    }
  }

  async function loadSubmissionDetails(
    submissionId
  ) {
    if (!submissionId) {
      setSelectedSubmission(null);
      setDocuments({
        front_url: "",
        back_url: "",
      });
      return;
    }

    setDocumentsLoading(true);
    setMessage("");

    const [detailsResult, documentsResult] =
      await Promise.all([
        apiRequest(
          `/api/admin/kyc/submissions/${submissionId}`
        ),
        apiRequest(
          `/api/admin/kyc/submissions/${submissionId}/documents`
        ),
      ]);

    if (!detailsResult.success) {
      setMessage(
        detailsResult.message ||
          "Could not load this submission."
      );
      setDocumentsLoading(false);
      return;
    }

    setSelectedSubmission(
      detailsResult.submission || null
    );

    if (documentsResult.success) {
      setDocuments(
        documentsResult.documents || {
          front_url: "",
          back_url: "",
        }
      );
    } else {
      setDocuments({
        front_url: "",
        back_url: "",
      });

      setMessage(
        documentsResult.message ||
          "Could not open the submitted documents."
      );
    }

    setDocumentsLoading(false);
  }

  useEffect(() => {
    loadAdmin();
  }, []);

  useEffect(() => {
    if (!authorized || loading) return;
    loadSubmissionDetails(selectedId);
  }, [selectedId, authorized, loading]);

  async function changeFilter(nextFilter) {
    setFilter(nextFilter);
    setSelectedSubmission(null);
    setDocuments({
      front_url: "",
      back_url: "",
    });
    await loadSubmissions(nextFilter);
  }

  async function handleApprove() {
    if (
      !selectedSubmission ||
      actionLoading ||
      selectedSubmission.is_own_submission
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Approve identity verification for ${
        selectedSubmission.full_name ||
        selectedSubmission.user?.name ||
        "this user"
      }?`
    );

    if (!confirmed) return;

    setActionLoading(true);
    setMessage("");

    const result = await apiRequest(
      `/api/admin/kyc/submissions/${selectedSubmission.id}/approve`,
      {
        method: "POST",
        body: JSON.stringify({}),
      }
    );

    setActionLoading(false);

    if (!result.success) {
      setMessage(
        result.message ||
          "Could not approve this submission."
      );
      return;
    }

    setMessage(
      "Identity verification approved successfully."
    );
    await loadSubmissions(filter);
  }

  async function handleReject() {
    if (
      !selectedSubmission ||
      actionLoading ||
      selectedSubmission.is_own_submission
    ) {
      return;
    }

    const reason = rejectReason.trim();

    if (reason.length < 5) {
      setMessage(
        "Provide a clear rejection reason of at least five characters."
      );
      return;
    }

    setActionLoading(true);
    setMessage("");

    const result = await apiRequest(
      `/api/admin/kyc/submissions/${selectedSubmission.id}/reject`,
      {
        method: "POST",
        body: JSON.stringify({
          reason,
        }),
      }
    );

    setActionLoading(false);

    if (!result.success) {
      setMessage(
        result.message ||
          "Could not reject this submission."
      );
      return;
    }

    setRejectOpen(false);
    setRejectReason("");
    setMessage(
      "Identity verification rejected."
    );
    await loadSubmissions(filter);
  }

  const filteredSubmissions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return submissions;

    return submissions.filter((submission) => {
      const values = [
        submission.full_name,
        submission.email,
        submission.phone,
        submission.national_id_number,
        submission.user?.name,
        submission.user?.email,
        submission.user?.phone,
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [submissions, search]);

  const counts = useMemo(() => {
    const pending = submissions.filter(
      (item) => item.status === "pending"
    ).length;

    const verified = submissions.filter(
      (item) => item.status === "verified"
    ).length;

    const rejected = submissions.filter(
      (item) => item.status === "rejected"
    ).length;

    return {
      total: submissions.length,
      pending,
      verified,
      rejected,
    };
  }, [submissions]);

  if (loading) {
    return (
      <main className="admin-page">
        <AppSidebar active="admin" />

        <section className="admin-main">
          <AdminSkeleton />
        </section>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="admin-page">
        <AppSidebar active="admin" />

        <section className="admin-main">
          <UnauthorizedState
            message={accessMessage}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <AppSidebar active="admin" />

      <section className="admin-main">
        {rejectOpen && (
          <div
            className="admin-modal-overlay"
            onClick={() => setRejectOpen(false)}
          >
            <div
              className="admin-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="admin-modal-header">
                <div>
                  <span>Reject verification</span>
                  <h3>Explain what needs fixing</h3>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setRejectOpen(false)
                  }
                  aria-label="Close rejection form"
                >
                  <X size={18} />
                </button>
              </div>

              <p>
                The user will see this reason on
                their Profile page and can submit
                clearer documents.
              </p>

              <textarea
                value={rejectReason}
                onChange={(event) =>
                  setRejectReason(
                    event.target.value
                  )
                }
                maxLength={500}
                placeholder="Example: The front image is blurry and the account name cannot be compared with the ID."
              />

              <div className="admin-modal-count">
                {rejectReason.length}/500
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() =>
                    setRejectOpen(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={handleReject}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <Loader2
                      className="admin-spin"
                      size={17}
                    />
                  ) : (
                    <XCircle size={17} />
                  )}
                  Reject Submission
                </button>
              </div>
            </div>
          </div>
        )}

        <header className="admin-hero">
          <div>
            <span>Contriba Operations</span>
            <h1>Admin Center</h1>

            <p>
              Review identity submissions, manage
              platform trust, and operate Contriba
              from one secure workspace.
            </p>
          </div>

          <div className="admin-account-badge">
            <ShieldCheck size={20} />

            <div>
              <small>Signed in as</small>
              <strong>
                {admin?.name || "Administrator"}
              </strong>
            </div>
          </div>
        </header>

        <section className="admin-summary-grid">
          <article className="admin-summary-card">
            <div className="admin-summary-icon">
              <FileSearch size={22} />
            </div>
            <span>Loaded submissions</span>
            <strong>{counts.total}</strong>
          </article>

          <article className="admin-summary-card">
            <div className="admin-summary-icon pending">
              <Clock3 size={22} />
            </div>
            <span>Pending review</span>
            <strong>{counts.pending}</strong>
          </article>

          <article className="admin-summary-card">
            <div className="admin-summary-icon verified">
              <CheckCircle2 size={22} />
            </div>
            <span>Verified</span>
            <strong>{counts.verified}</strong>
          </article>

          <article className="admin-summary-card">
            <div className="admin-summary-icon rejected">
              <XCircle size={22} />
            </div>
            <span>Rejected</span>
            <strong>{counts.rejected}</strong>
          </article>
        </section>

        {message && (
          <div
            className={`admin-message ${
              message.includes("success") ||
              message.includes("approved")
                ? "success"
                : ""
            }`}
          >
            {message.includes("success") ||
            message.includes("approved") ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}

            <span>{message}</span>
          </div>
        )}

        <section className="admin-panel admin-kyc-panel">
          <div className="admin-panel-header">
            <div>
              <span>Identity Verification</span>
              <h2>KYC Review Queue</h2>
              <p>
                Compare account details with the
                submitted National ID before making
                a decision.
              </p>
            </div>

            <button
              type="button"
              className="admin-refresh-btn"
              onClick={() =>
                loadSubmissions(filter)
              }
            >
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>

          <div className="admin-toolbar">
            <div className="admin-filters">
              {FILTERS.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.key}
                    type="button"
                    className={
                      filter === item.key
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      changeFilter(item.key)
                    }
                  >
                    <Icon size={15} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <label className="admin-search">
              <Search size={17} />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search name, email, phone or ID"
              />
            </label>
          </div>

          <div className="admin-review-grid">
            <div className="admin-review-list">
              {filteredSubmissions.length === 0 ? (
                <div className="admin-empty-state">
                  <ShieldCheck size={34} />
                  <strong>No submissions found</strong>
                  <p>
                    There are no KYC submissions
                    matching this filter.
                  </p>
                </div>
              ) : (
                filteredSubmissions.map(
                  (submission) => (
                    <button
                      type="button"
                      key={submission.id}
                      className={`admin-review-row ${
                        selectedId ===
                        submission.id
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedId(
                          submission.id
                        )
                      }
                    >
                      <div className="admin-review-avatar">
                        {submission.user?.avatar_url ? (
                          <img
                            src={
                              submission.user
                                .avatar_url
                            }
                            alt=""
                          />
                        ) : (
                          <UserRound size={19} />
                        )}
                      </div>

                      <div className="admin-review-row-copy">
                        <strong>
                          {submission.full_name ||
                            submission.user?.name ||
                            "Contriba User"}
                        </strong>

                        <span>
                          {submission.phone ||
                            submission.user?.phone ||
                            "Phone unavailable"}
                        </span>

                        <small>
                          {formatDate(
                            submission.created_at
                          )}
                        </small>
                      </div>

                      <ReviewStatus
                        status={submission.status}
                      />
                    </button>
                  )
                )
              )}
            </div>

            <div className="admin-review-detail">
              {!selectedSubmission ? (
                <div className="admin-empty-state large">
                  <Eye size={36} />
                  <strong>
                    Select a submission
                  </strong>
                  <p>
                    Choose a user from the review
                    queue to inspect their account
                    information and documents.
                  </p>
                </div>
              ) : documentsLoading ? (
                <div className="admin-detail-loading">
                  <Loader2
                    className="admin-spin"
                    size={26}
                  />
                  Loading secure documents...
                </div>
              ) : (
                <>
                  <div className="admin-detail-heading">
                    <div>
                      <span>Submission Review</span>
                      <h3>
                        {selectedSubmission.full_name ||
                          selectedSubmission.user
                            ?.name ||
                          "Contriba User"}
                      </h3>
                    </div>

                    <ReviewStatus
                      status={
                        selectedSubmission.status
                      }
                    />
                  </div>

                  {selectedSubmission.is_own_submission && (
                    <div className="admin-self-review-note">
                      <ShieldCheck size={18} />

                      <div>
                        <strong>
                          Self-review is blocked
                        </strong>
                        <span>
                          Another administrator must
                          review this submission.
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="admin-detail-info-grid">
                    <div>
                      <small>Account name</small>
                      <strong>
                        {selectedSubmission.user
                          ?.name ||
                          selectedSubmission.full_name ||
                          "Unavailable"}
                      </strong>
                    </div>

                    <div>
                      <small>Submitted name</small>
                      <strong>
                        {selectedSubmission.full_name ||
                          "Unavailable"}
                      </strong>
                    </div>

                    <div>
                      <small>Email</small>
                      <strong>
                        {selectedSubmission.email ||
                          selectedSubmission.user
                            ?.email ||
                          "Unavailable"}
                      </strong>
                    </div>

                    <div>
                      <small>Phone</small>
                      <strong>
                        {selectedSubmission.phone ||
                          selectedSubmission.user
                            ?.phone ||
                          "Unavailable"}
                      </strong>
                    </div>

                    <div>
                      <small>National ID</small>
                      <strong>
                        {maskId(
                          selectedSubmission.national_id_number
                        )}
                      </strong>
                    </div>

                    <div>
                      <small>Date of birth</small>
                      <strong>
                        {selectedSubmission.date_of_birth ||
                          "Unavailable"}
                      </strong>
                    </div>

                    <div>
                      <small>Nationality</small>
                      <strong>
                        {selectedSubmission.nationality ||
                          "Rwanda"}
                      </strong>
                    </div>

                    <div>
                      <small>Submitted</small>
                      <strong>
                        {formatDate(
                          selectedSubmission.created_at
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="admin-documents-grid">
                    <div className="admin-document-card">
                      <div className="admin-document-header">
                        <ImageIcon size={18} />
                        <strong>
                          Front of National ID
                        </strong>
                      </div>

                      {documents.front_url ? (
                        <a
                          href={documents.front_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={documents.front_url}
                            alt="Front of National ID"
                          />
                          <span>
                            <Eye size={15} />
                            Open full image
                          </span>
                        </a>
                      ) : (
                        <div className="admin-document-missing">
                          <ImageIcon size={28} />
                          Image unavailable
                        </div>
                      )}
                    </div>

                    <div className="admin-document-card">
                      <div className="admin-document-header">
                        <ImageIcon size={18} />
                        <strong>
                          Back of National ID
                        </strong>
                      </div>

                      {documents.back_url ? (
                        <a
                          href={documents.back_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={documents.back_url}
                            alt="Back of National ID"
                          />
                          <span>
                            <Eye size={15} />
                            Open full image
                          </span>
                        </a>
                      ) : (
                        <div className="admin-document-missing">
                          <ImageIcon size={28} />
                          Image unavailable
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedSubmission.rejection_reason && (
                    <div className="admin-rejection-history">
                      <XCircle size={18} />

                      <div>
                        <strong>
                          Rejection reason
                        </strong>
                        <span>
                          {
                            selectedSubmission.rejection_reason
                          }
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedSubmission.status ===
                    "pending" && (
                    <div className="admin-review-actions">
                      <button
                        type="button"
                        className="reject"
                        onClick={() =>
                          setRejectOpen(true)
                        }
                        disabled={
                          actionLoading ||
                          selectedSubmission.is_own_submission
                        }
                      >
                        <XCircle size={18} />
                        Reject
                      </button>

                      <button
                        type="button"
                        className="approve"
                        onClick={handleApprove}
                        disabled={
                          actionLoading ||
                          selectedSubmission.is_own_submission
                        }
                      >
                        {actionLoading ? (
                          <Loader2
                            className="admin-spin"
                            size={18}
                          />
                        ) : (
                          <CheckCircle2 size={18} />
                        )}
                        Approve Verification
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        <section className="admin-modules-section">
          <div className="admin-section-heading">
            <div>
              <span>Platform Operations</span>
              <h2>Management Modules</h2>
            </div>

            <LayoutDashboard size={24} />
          </div>

          <div className="admin-modules-grid">
            {MODULES.map((module) => {
              const Icon = module.icon;

              return (
                <article
                  className="admin-module-card"
                  key={module.title}
                >
                  <div className="admin-module-icon">
                    <Icon size={22} />
                  </div>

                  <div>
                    <strong>{module.title}</strong>
                    <p>{module.description}</p>
                  </div>

                  <span>{module.badge}</span>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Admin;