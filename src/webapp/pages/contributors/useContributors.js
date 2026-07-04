import { useEffect, useMemo, useState } from "react";

import {
  getContributorAIInsights,
  getContributorAnalytics,
  getContributorEvents,
  getContributorTimeline,
  getContributorsCRM,
} from "../../api/api";

import {
  buildAIRecommendation,
  buildTimeline,
  calculateAnalytics,
  filterContributors,
  formatMoney,
  getInitials,
  normalizeContributor,
  paginate,
  sortContributors,
} from "./contributorHelpers";

import {
  handleCallContributor,
  handleCopyContributor,
  handleDownloadReceipt,
  handleExportContributors,
  handleOpenReceipt,
  handleSendThankYou,
} from "./contributorActions";

const PAGE_SIZE = 8;

const fallbackStats = {
  total_contributors: 0,
  total_collected: 0,
  thank_you_pending: 0,
  failed_pending: 0,
};

const fallbackPagination = {
  page: 1,
  limit: PAGE_SIZE,
  total: 0,
  total_pages: 1,
  has_next: false,
  has_previous: false,
};

function mapStatusToBackend(status) {
  if (!status || status === "All Status") return "";
  return status.toLowerCase();
}

function mapSortToBackend(sort) {
  if (sort === "Highest Amount") return "highest";
  if (sort === "Lowest Amount") return "lowest";
  if (sort === "Oldest") return "oldest";
  return "latest";
}

function normalizeCRMContributor(person = {}) {
  const normalized = normalizeContributor(person);

  return {
    ...normalized,
    event_id: person.event_id || null,
    event_title: person.event_title || normalized.eventName || "All Events",
    amount: person.amount || formatMoney(normalized.amount),
    raw_amount: person.raw_amount || normalized.amount,
    method: person.method || normalized.method,
    status:
      person.status === "Success" ||
      person.status === "Pending" ||
      person.status === "Failed"
        ? person.status
        : normalized.status?.charAt(0).toUpperCase() +
          normalized.status?.slice(1),
    avatar: person.avatar || getInitials(normalized.name),
    total: person.total || person.amount || formatMoney(normalized.amount),
    contributions: person.contributions || 1,
    transaction_id: person.transaction_id || null,
    thank_you_sent: person.thank_you_sent === true,
    thank_you_sent_at: person.thank_you_sent_at || null,
    receipt_id: person.receipt_id || person.transaction_id || null,
    message: person.message || normalized.message || "No message provided.",
    date: person.date || normalized.createdAt,
    time: person.time || normalized.createdAt,
  };
}

export function useContributors() {
  const [contributors, setContributors] = useState([]);
  const [events, setEvents] = useState([
    { id: "all", title: "All Event Supporters" },
  ]);

  const [stats, setStats] = useState(fallbackStats);
  const [backendAnalytics, setBackendAnalytics] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState(
    buildAIRecommendation({ totalContributors: 0 })
  );

  const [selectedContributor, setSelectedContributor] = useState(null);
  const [timeline, setTimeline] = useState([]);

  const [selectedEventId, setSelectedEventId] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("All Methods");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortMode, setSortMode] = useState("Highest Amount");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(fallbackPagination);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [notice, setNotice] = useState("");

  function showNotice(message) {
    setNotice(message);

    setTimeout(() => {
      setNotice("");
    }, 2600);
  }

  async function loadEvents() {
    const response = await getContributorEvents();

    if (response?.success && response.events?.length) {
      setEvents(response.events);
    }
  }

  async function loadContributors(pageOverride = currentPage) {
    setLoading(true);

    const response = await getContributorsCRM({
      page: pageOverride,
      limit: PAGE_SIZE,
      search: searchTerm,
      event_id: selectedEventId,
      method: methodFilter === "All Methods" ? "" : methodFilter,
      status: mapStatusToBackend(statusFilter),
      sort: mapSortToBackend(sortMode),
    });

    if (response?.success) {
      const list = (response.contributors || []).map(normalizeCRMContributor);

      setContributors(list);
      setStats(response.stats || fallbackStats);
      setPagination(response.pagination || fallbackPagination);
      setBackendAnalytics(response.analytics || null);

      if (response.ai_recommendation) {
        setAiRecommendation(response.ai_recommendation);
      }

      if (response.events?.length) {
        setEvents(response.events);
      }

      setSelectedContributor((current) => {
        if (!list.length) return null;
        if (!current) return list[0];

        return list.find((person) => person.id === current.id) || list[0];
      });
    } else {
      setContributors([]);
      setStats(fallbackStats);
      setPagination(fallbackPagination);
      setSelectedContributor(null);
      setAiRecommendation({
        title: "Contributor data unavailable",
        message: response?.message || "Unable to load contributor CRM data.",
      });
    }

    setLoading(false);
  }

  async function loadAnalytics() {
    const response = await getContributorAnalytics({
      event_id: selectedEventId,
      search: searchTerm,
      method: methodFilter === "All Methods" ? "" : methodFilter,
      status: mapStatusToBackend(statusFilter),
      sort: mapSortToBackend(sortMode),
    });

    if (response?.success) {
      setBackendAnalytics(response.analytics || null);
    }
  }

  async function loadAIInsights() {
    const response = await getContributorAIInsights({
      event_id: selectedEventId,
      search: searchTerm,
      method: methodFilter === "All Methods" ? "" : methodFilter,
      status: mapStatusToBackend(statusFilter),
      sort: mapSortToBackend(sortMode),
    });

    if (response?.success && response.ai_recommendation) {
      setAiRecommendation(response.ai_recommendation);
    }
  }

  async function loadTimeline(contributor = selectedContributor) {
    if (!contributor?.id || contributor.name === "No contributor yet") {
      setTimeline(buildTimeline(contributor || { timeline: [] }));
      return;
    }

    const response = await getContributorTimeline(contributor.id);

    if (response?.success && response.timeline?.length) {
      setTimeline(
        response.timeline.map((item) => ({
          title: item.title,
          detail: item.detail,
          status: item.status,
          time: item.created_at || "Now",
        }))
      );
    } else {
      setTimeline([
        {
          title: "Timeline",
          detail: "No saved timeline yet.",
          status: "pending",
          time: "Now",
        },
      ]);
    }
  }

  useEffect(() => {
    loadEvents();
    loadContributors(1);
  }, []);

  useEffect(() => {
    loadContributors(currentPage);
    loadAnalytics();
    loadAIInsights();
  }, [selectedEventId, methodFilter, statusFilter, sortMode, currentPage]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setCurrentPage(1);
      loadContributors(1);
      loadAnalytics();
      loadAIInsights();
    }, 350);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    loadTimeline(selectedContributor);
  }, [selectedContributor]);

  const localAnalytics = useMemo(() => {
    const mapped = contributors.map((person) => ({
      ...person,
      amount: person.raw_amount || person.amount || 0,
      status: String(person.status || "").toLowerCase(),
      method: person.method,
      eventName: person.event_title,
    }));

    return calculateAnalytics(mapped);
  }, [contributors]);

  const analytics = useMemo(() => {
    if (!backendAnalytics) {
      return {
        successRate: localAnalytics.successRate || 0,
        averageAmount: localAnalytics.averageContribution || 0,
        mostUsedMethod: localAnalytics.mostUsedMethod || "None yet",
        successCount: localAnalytics.successCount || 0,
        pendingCount: localAnalytics.pendingCount || 0,
        failedCount: localAnalytics.failedCount || 0,
      };
    }

    return {
      successRate: backendAnalytics.success_rate || 0,
      averageAmount: backendAnalytics.average_contribution || 0,
      mostUsedMethod: backendAnalytics.most_used_method || "None yet",
      successCount: backendAnalytics.successful_contributions || 0,
      pendingCount: backendAnalytics.pending_contributions || 0,
      failedCount: backendAnalytics.failed_contributions || 0,
    };
  }, [backendAnalytics, localAnalytics]);

  const availableMethods = useMemo(() => {
    const uniqueMethods = contributors.map((person) => person.method).filter(Boolean);
    return ["All Methods", ...Array.from(new Set(uniqueMethods))];
  }, [contributors]);

  const localFilteredContributors = useMemo(() => {
    const normalized = contributors.map((person) => ({
      ...person,
      amount: person.raw_amount || 0,
      eventName: person.event_title || "All Events",
    }));

    const filtered = filterContributors({
      contributors: normalized,
      search: searchTerm,
      method: methodFilter === "All Methods" ? "" : methodFilter,
      status:
        statusFilter === "All Status" ? "" : statusFilter.toLowerCase(),
      event: "",
    });

    const sortKey =
      sortMode === "Highest Amount"
        ? "highest"
        : sortMode === "Lowest Amount"
        ? "lowest"
        : sortMode === "Oldest"
        ? "oldest"
        : "latest";

    return sortContributors(filtered, sortKey);
  }, [contributors, searchTerm, methodFilter, statusFilter, sortMode]);

  const frontendPagination = useMemo(() => {
    return paginate(localFilteredContributors, currentPage, PAGE_SIZE);
  }, [localFilteredContributors, currentPage]);

  const displayContributors = contributors;

  const safeSelectedContributor =
    selectedContributor ||
    displayContributors[0] || {
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
      event_title: "All Events",
    };

  const selectedEventTitle =
    events.find((event) => event.id === selectedEventId)?.title ||
    "All Event Supporters";

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
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

  function handleEventSwitch() {
    if (!events.length) return;

    const currentIndex = events.findIndex((event) => event.id === selectedEventId);
    const nextIndex = currentIndex === events.length - 1 ? 0 : currentIndex + 1;

    setSelectedEventId(events[nextIndex]?.id || "all");
    setCurrentPage(1);
  }

  function handleSelectContributor(person) {
    setSelectedContributor(person);
  }

  function handleNextPage() {
    setCurrentPage((page) =>
      Math.min(page + 1, pagination.total_pages || frontendPagination.pages || 1)
    );
  }

  function handlePrevPage() {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }

  async function exportCSV() {
    setActionLoading("export");

    const rows = displayContributors.map((person) => ({
      Name: person.name,
      Phone: person.phone,
      Event: person.event_title,
      Amount: person.amount,
      Method: person.method,
      Status: person.status,
      Message: person.message,
      Receipt: person.receipt_id || "",
    }));

    const result = await handleExportContributors(
      {
        event_id: selectedEventId,
        search: searchTerm,
        method: methodFilter === "All Methods" ? "" : methodFilter,
        status: mapStatusToBackend(statusFilter),
        sort: mapSortToBackend(sortMode),
      },
      rows
    );

    showNotice(result.message);
    setActionLoading("");
  }

  async function sendThankYou(contributor = safeSelectedContributor) {
    setActionLoading("thank-you");

    const result = await handleSendThankYou(contributor);

    showNotice(result.message);

    if (result.success) {
      await loadContributors(currentPage);
      await loadTimeline(contributor);
    }

    setActionLoading("");
  }

  async function openReceipt(contributor = safeSelectedContributor) {
    setActionLoading("receipt");

    const result = await handleOpenReceipt(contributor);

    showNotice(result.message);

    if (result.success) {
      await loadTimeline(contributor);
    }

    setActionLoading("");
  }

  async function downloadReceipt(contributor = safeSelectedContributor) {
    setActionLoading("receipt-download");

    const result = await handleDownloadReceipt(contributor);

    showNotice(result.message);

    if (result.success) {
      await loadTimeline(contributor);
    }

    setActionLoading("");
  }

  async function copyInfo(contributor = safeSelectedContributor) {
    const result = await handleCopyContributor(contributor);
    showNotice(result.message);
  }

  function callContributor(contributor = safeSelectedContributor) {
    const result = handleCallContributor(contributor);
    showNotice(result.message);
  }

  return {
    contributors: displayContributors,
    stats,
    analytics,
    aiRecommendation,
    events,
    selectedEventId,
    selectedEventTitle,
    selectedContributor: safeSelectedContributor,
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
    availableMethods,

    loadContributors,
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
  };
}