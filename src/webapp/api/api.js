const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://contriba-backend-production.up.railway.app";

async function apiCall(endpoint, method = "GET", body = null) {
  try {
    const token = localStorage.getItem("contriba_token");

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Contriba API Error:", error);

    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

async function uploadFile(endpoint, fieldName, file) {
  try {
    const token = localStorage.getItem("contriba_token");

    const formData = new FormData();
    formData.append(fieldName, file);

    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Contriba Upload Error:", error);

    return {
      success: false,
      message: "Upload failed. Please try again.",
    };
  }
}

/* =========================
   AUTH
========================= */

export const registerWithPin = (name, phone, pin) =>
  apiCall("/api/auth/register", "POST", { name, phone, pin });

export const loginWithPin = (phone, pin) =>
  apiCall("/api/auth/login", "POST", { phone, pin });

export const updateProfile = (data) =>
  apiCall("/api/auth/update-profile", "POST", data);

export const updateAvatar = (avatar_url) =>
  apiCall("/api/auth/update-avatar", "POST", { avatar_url });

export const uploadAvatar = (file) =>
  uploadFile("/api/upload/avatar", "avatar", file);

export const uploadEventPhoto = (file) =>
  uploadFile("/api/upload/event-photo", "event_photo", file);

export const changePin = (old_pin, new_pin) =>
  apiCall("/api/auth/change-pin", "POST", { old_pin, new_pin });

export const updatePushToken = (push_token) =>
  apiCall("/api/auth/update-push-token", "POST", { push_token });

// ── OTP Email Verification ──
export const sendOTP = (name, phone, email, isReset = false) =>
  apiCall("/api/auth/send-otp", "POST", {
    name,
    phone,
    email,
    isReset,
  });

export const verifyOTP = (email, otp, name, phone, pin) =>
  apiCall("/api/auth/verify-otp", "POST", { email, otp, name, phone, pin });

/* =========================
   DASHBOARD
========================= */

export const getDashboard = () => apiCall("/api/dashboard");

/* =========================
   EVENTS
========================= */

export const getEvents = () => apiCall("/api/events");

export const getMyEvents = () => apiCall("/api/events/my-events");

export const getEvent = (id) => apiCall(`/api/events/${id}`);

export const createEvent = (eventData) =>
  apiCall("/api/events", "POST", eventData);

export const updateEvent = (id, eventData) =>
  apiCall(`/api/events/${id}`, "PUT", eventData);

export const deleteEvent = (id) =>
  apiCall(`/api/events/${id}`, "DELETE");

export const likeEvent = (id) =>
  apiCall(`/api/events/${id}/like`, "POST");

export const unlikeEvent = (id) =>
  apiCall(`/api/events/${id}/like`, "DELETE");

export const getEventLikes = (id) =>
  apiCall(`/api/events/${id}/likes`);

/* =========================
   CONTRIBUTIONS
========================= */

export const initiateContribution = (data) =>
  apiCall("/api/contributions/initiate", "POST", data);

export const getEventContributions = (eventId) =>
  apiCall(`/api/contributions/event/${eventId}`);

export const getContributorsCRM = () =>
  apiCall("/api/contributions/crm");

export const confirmContribution = (id, transactionId) =>
  apiCall(`/api/contributions/${id}/confirm`, "PUT", {
    transaction_id: transactionId,
  });

/* =========================
   PAYMENTS
========================= */

export const cashIn = (data) =>
  apiCall("/api/payments/cashin", "POST", data);

export const checkPaymentStatus = (reference) =>
  apiCall(`/api/payments/status/${reference}`);

export const cashOut = (data) =>
  apiCall("/api/payments/cashout", "POST", data);

/* =========================
   WALLET
========================= */

export const getWallet = () => apiCall("/api/wallet");

export const getTransactions = () =>
  apiCall("/api/wallet/transactions");

export const withdrawFunds = (data) =>
  apiCall("/api/wallet/withdraw", "POST", data);

export const topUpWallet = (data) =>
  apiCall("/api/wallet/topup", "POST", data);

/* =========================
   NOTIFICATIONS
========================= */

export const getNotifications = () =>
  apiCall("/api/notifications");

export const markNotificationRead = (id) =>
  apiCall(`/api/notifications/${id}/read`, "PUT");

export const markAllNotificationsRead = () =>
  apiCall("/api/notifications/read-all", "PUT");

/* =========================
   COMMENTS
========================= */

export const getEventComments = (eventId) =>
  apiCall(`/api/comments/${eventId}`);

export const addEventComment = (eventId, data) =>
  apiCall(`/api/comments/${eventId}`, "POST", data);

export const deleteEventComment = (id) =>
  apiCall(`/api/comments/${id}`, "DELETE");

/* =========================
   SESSION
========================= */

export const saveSession = (token, user) => {
  localStorage.setItem("contriba_token", token);
  localStorage.setItem("contriba_user", JSON.stringify(user));
};

export const getToken = () => {
  return localStorage.getItem("contriba_token");
};

export const getUser = () => {
  const user = localStorage.getItem("contriba_user");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem("contriba_token");
  localStorage.removeItem("contriba_user");
};