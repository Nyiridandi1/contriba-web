// ===============================
// CONTRIBUTORS HELPERS
// ===============================

export function formatMoney(amount = 0) {
  return `RWF ${Number(amount || 0).toLocaleString()}`;
}

export function formatNumber(number = 0) {
  return Number(number || 0).toLocaleString();
}

export function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function capitalize(text = "") {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export function normalizeContributor(contributor = {}) {
  return {
    id:
      contributor.id ||
      contributor.contribution_id ||
      contributor.contributor_id,

    name:
      contributor.name ||
      contributor.full_name ||
      "Unknown Contributor",

    phone: contributor.phone || "",

    email: contributor.email || "",

    amount: Number(contributor.amount || 0),

    method:
      contributor.payment_method ||
      contributor.method ||
      "Unknown",

    status:
      contributor.status || "pending",

    eventName:
      contributor.event_name ||
      contributor.event ||
      "General Event",

    message:
      contributor.message || "",

    receipt:
      contributor.receipt || null,

    timeline:
      contributor.timeline || [],

    createdAt:
      contributor.created_at ||
      contributor.createdAt,

    updatedAt:
      contributor.updated_at ||
      contributor.updatedAt,
  };
}

export function sortContributors(list = [], mode = "highest") {
  const items = [...list];

  switch (mode) {
    case "highest":
      return items.sort((a, b) => b.amount - a.amount);

    case "lowest":
      return items.sort((a, b) => a.amount - b.amount);

    case "latest":
      return items.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

    case "oldest":
      return items.sort(
        (a, b) =>
          new Date(a.createdAt) -
          new Date(b.createdAt)
      );

    case "name":
      return items.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

    default:
      return items;
  }
}

export function filterContributors({
  contributors = [],
  search = "",
  method = "",
  status = "",
  event = "",
}) {
  return contributors.filter((item) => {
    const q = search.toLowerCase();

    const matchSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q);

    const matchMethod =
      !method ||
      item.method === method;

    const matchStatus =
      !status ||
      item.status === status;

    const matchEvent =
      !event ||
      item.eventName === event;

    return (
      matchSearch &&
      matchMethod &&
      matchStatus &&
      matchEvent
    );
  });
}

export function paginate(array = [], page = 1, perPage = 10) {
  const total = array.length;

  const pages = Math.ceil(total / perPage);

  const start = (page - 1) * perPage;

  return {
    total,
    pages,
    page,
    data: array.slice(start, start + perPage),
  };
}

export function calculateAnalytics(contributors = []) {
  const totalContributors = contributors.length;

  const totalCollected = contributors.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const success = contributors.filter(
    (c) => c.status === "success"
  );

  const pending = contributors.filter(
    (c) => c.status === "pending"
  );

  const failed = contributors.filter(
    (c) => c.status === "failed"
  );

  const methods = {};

  contributors.forEach((c) => {
    methods[c.method] = (methods[c.method] || 0) + 1;
  });

  const mostUsedMethod =
    Object.keys(methods).sort(
      (a, b) => methods[b] - methods[a]
    )[0] || "None";

  return {
    totalContributors,

    totalCollected,

    successCount: success.length,

    pendingCount: pending.length,

    failedCount: failed.length,

    successRate:
      totalContributors === 0
        ? 0
        : Math.round(
            (success.length /
              totalContributors) *
              100
          ),

    averageContribution:
      totalContributors === 0
        ? 0
        : Math.round(
            totalCollected /
              totalContributors
          ),

    mostUsedMethod,
  };
}

export function buildTimeline(contributor) {
  const timeline =
    contributor.timeline || [];

  return timeline.sort(
    (a, b) =>
      new Date(b.date) -
      new Date(a.date)
  );
}

export function groupByEvent(contributors = []) {
  const groups = {};

  contributors.forEach((item) => {
    if (!groups[item.eventName]) {
      groups[item.eventName] = [];
    }

    groups[item.eventName].push(item);
  });

  return groups;
}

export function getTopContributors(
  contributors = [],
  limit = 5
) {
  return [...contributors]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

export function buildReceipt(contributor) {
  return {
    receiptNumber:
      contributor.receipt ||
      `RCT-${contributor.id}`,

    contributor: contributor.name,

    amount: formatMoney(
      contributor.amount
    ),

    method: contributor.method,

    date: formatDateTime(
      contributor.createdAt
    ),

    event: contributor.eventName,
  };
}

export function buildAIRecommendation(
  analytics
) {
  if (!analytics.totalContributors) {
    return {
      title: "No contributor data yet",
      message:
        "Create and share your first event to begin building contributor insights.",
    };
  }

  if (analytics.pendingCount > 0) {
    return {
      title: "Follow up pending contributors",
      message:
        "Sending reminders now can increase completed contributions.",
    };
  }

  return {
    title: "Great momentum",
    message:
      "Most contributors have completed payments. Consider sending thank-you messages.",
  };
}