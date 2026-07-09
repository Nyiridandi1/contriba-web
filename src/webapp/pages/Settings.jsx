import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle, Bell, Bot, CheckCircle2, ChevronDown, CreditCard, Globe,
  KeyRound, LifeBuoy, LockKeyhole, LogOut, Mail, Palette, Phone, Save,
  ShieldCheck, Sparkles, Trash2, UserRound, WalletCards
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import {
  clearSession, getSettings, saveSession, updateSettingsProfile,
  updateSettingsPreferences, updateSettingsNotifications, updateSettingsSecurity,
  updateSettingsPayment, updateSettingsAppearance, updateSettingsAI,
  changeSettingsPin, logoutAllSettingsSessions, deleteSettingsAccount
} from "../api/api";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext.jsx";
import "./Settings.css";

const LANGUAGES = ["English", "Kinyarwanda", "Français"];

const T = {
  English: {
    settings: "Settings",
    title: "Organizer control center",
    subtitle: "Configure your real account, preferences, payments, notifications, security, appearance and AI assistant from one active control center.",
    live: "Live Settings",
    connected: "Your Settings page is now connected to real account data. Every change you save will persist after refresh and login.",
    summary: "Account Summary",
    profile: "Profile",
    realAccount: "Real account details",
    accountDefaults: "Account Defaults",
    preferences: "Preferences",
    language: "Language",
    country: "Country",
    currency: "Currency",
    timezone: "Timezone",
    savePreferences: "Save Preferences",
    fullName: "Full name",
    emailAddress: "Email address",
    phoneNumber: "Phone number",
    saveProfile: "Save Profile",
    notifications: "Notifications",
    alerts: "Alerts and reports",
    security: "Security",
    pinProtection: "PIN and protection",
    payments: "Payments",
    payout: "Payout preferences",
    appearance: "Appearance",
    experience: "Dashboard experience",
    ai: "AI Assistant",
    smart: "Smart suggestions",
    legal: "Legal & Support",
    help: "Help center",
    sessions: "Sessions",
    access: "Account access",
    danger: "Danger Zone",
    deleteAccount: "Delete account",
    save: "Save",
    saving: "Saving...",
    saved: "Saved successfully",
    failed: "Could not save changes",
    logout: "Logout This Device",
    logoutAll: "Logout All Devices"
  },
  Kinyarwanda: {
    settings: "Igenamiterere",
    title: "Ikigo cyo kugenzura",
    subtitle: "Hindura konti yawe, ibyo ukunda, kwishyurwa, imenyesha, umutekano, isura n'umufasha wa AI ahantu hamwe.",
    live: "Igenamiterere rikora",
    connected: "Iyi paji ihujwe n'amakuru ya konti yawe. Ibyo ubika bizagumaho nyuma yo gusubiramo cyangwa kongera kwinjira.",
    summary: "Incamake ya konti",
    profile: "Umwirondoro",
    realAccount: "Amakuru ya konti",
    accountDefaults: "Ibisanzwe bya konti",
    preferences: "Ibyo ukunda",
    language: "Ururimi",
    country: "Igihugu",
    currency: "Ifaranga",
    timezone: "Igihe",
    savePreferences: "Bika ibyo ukunda",
    fullName: "Amazina yose",
    emailAddress: "Imeyili",
    phoneNumber: "Telefoni",
    saveProfile: "Bika umwirondoro",
    notifications: "Imenyesha",
    alerts: "Imenyesha na raporo",
    security: "Umutekano",
    pinProtection: "PIN n'ubwirinzi",
    payments: "Ubwishyu",
    payout: "Igenamiterere ryo kubikuza",
    appearance: "Isura",
    experience: "Uko dashboard igaragara",
    ai: "Umufasha wa AI",
    smart: "Inama z'ubwenge",
    legal: "Amategeko & Ubufasha",
    help: "Ikigo cy'ubufasha",
    sessions: "Ibikoresho",
    access: "Kwinjira kuri konti",
    danger: "Ahantu h'akaga",
    deleteAccount: "Siba konti",
    save: "Bika",
    saving: "Birabikwa...",
    saved: "Byabitswe neza",
    failed: "Ntibyabashije kubikwa",
    logout: "Sohoka kuri iki gikoresho",
    logoutAll: "Sohora ibikoresho byose"
  },
  Français: {
    settings: "Paramètres",
    title: "Centre de contrôle",
    subtitle: "Configurez votre compte, vos préférences, paiements, notifications, sécurité, apparence et assistant IA depuis un seul centre.",
    live: "Paramètres actifs",
    connected: "Votre page Paramètres est connectée aux vraies données du compte. Chaque changement sauvegardé restera après actualisation et connexion.",
    summary: "Résumé du compte",
    profile: "Profil",
    realAccount: "Détails du compte",
    accountDefaults: "Valeurs par défaut",
    preferences: "Préférences",
    language: "Langue",
    country: "Pays",
    currency: "Devise",
    timezone: "Fuseau horaire",
    savePreferences: "Enregistrer les préférences",
    fullName: "Nom complet",
    emailAddress: "Adresse email",
    phoneNumber: "Téléphone",
    saveProfile: "Enregistrer le profil",
    notifications: "Notifications",
    alerts: "Alertes et rapports",
    security: "Sécurité",
    pinProtection: "PIN et protection",
    payments: "Paiements",
    payout: "Préférences de retrait",
    appearance: "Apparence",
    experience: "Expérience du tableau de bord",
    ai: "Assistant IA",
    smart: "Suggestions intelligentes",
    legal: "Légal & Support",
    help: "Centre d'aide",
    sessions: "Sessions",
    access: "Accès au compte",
    danger: "Zone dangereuse",
    deleteAccount: "Supprimer le compte",
    save: "Enregistrer",
    saving: "Enregistrement...",
    saved: "Enregistré avec succès",
    failed: "Impossible d'enregistrer",
    logout: "Déconnecter cet appareil",
    logoutAll: "Déconnecter tous les appareils"
  }
};

const DEFAULT_SETTINGS = {
  preferences: { language: "English", country: "Rwanda", currency: "RWF", timezone: "Africa/Kigali", date_format: "DD/MM/YYYY", number_format: "1,000.00" },
  notifications: { contribution_alerts: true, payment_alerts: true, email_notifications: true, push_notifications: true, weekly_reports: true, marketing_emails: false },
  security: { two_factor_enabled: false, login_alerts: true, device_history_enabled: true },
  payment: { preferred_payout_method: "MTN MoMo", payout_phone: "", payout_name: "", auto_withdraw: false, minimum_withdraw_amount: 500 },
  appearance: { theme: "light", accent_color: "#E50914", compact_mode: false, reduce_motion: false },
  ai: { enabled: true, smart_suggestions: true, weekly_ai_reports: true, growth_reminders: true, ai_language: "English" },
};

function normalizeLanguage(value) {
  if (value === "French") return "Français";
  if (LANGUAGES.includes(value)) return value;
  return "English";
}

function mergeSettings(settings) {
  const merged = {
    ...DEFAULT_SETTINGS,
    ...(settings || {}),
    preferences: { ...DEFAULT_SETTINGS.preferences, ...(settings?.preferences || {}) },
    notifications: { ...DEFAULT_SETTINGS.notifications, ...(settings?.notifications || {}) },
    security: { ...DEFAULT_SETTINGS.security, ...(settings?.security || {}) },
    payment: { ...DEFAULT_SETTINGS.payment, ...(settings?.payment || {}) },
    appearance: { ...DEFAULT_SETTINGS.appearance, ...(settings?.appearance || {}) },
    ai: { ...DEFAULT_SETTINGS.ai, ...(settings?.ai || {}) },
  };

  merged.preferences.language = normalizeLanguage(merged.preferences.language);
  merged.ai.ai_language = normalizeLanguage(merged.ai.ai_language);
  return merged;
}

function formatPhone(phone) {
  if (!phone) return "";
  const clean = String(phone).replace(/[^\d]/g, "");
  if (clean.startsWith("250")) return `+${clean}`;
  if (clean.startsWith("0")) return `+250 ${clean.slice(1)}`;
  return phone;
}

function Toggle({ active, onClick, disabled }) {
  return (
    <button type="button" className={`settings-switch ${active ? "active" : ""}`} onClick={onClick} disabled={disabled}>
      <span />
    </button>
  );
}

function Field({ label, value, onChange, icon: Icon, type = "text", placeholder }) {
  return (
    <label className="settings-field">
      <span>{label}</span>
      <div>
        {Icon && <Icon size={17} />}
        <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || label} />
      </div>
    </label>
  );
}

function SelectField({ label, value, onChange, options, icon: Icon }) {
  return (
    <label className="settings-field">
      <span>{label}</span>
      <div>
        {Icon && <Icon size={17} />}
        <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
          {options.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <ChevronDown size={16} />
      </div>
    </label>
  );
}

function SettingsSkeleton() {
  return (
    <>
      <section className="settings-hero settings-skeleton-hero">
        <div className="settings-hero-left">
          <div className="settings-skeleton-pill shimmer" />
          <div className="settings-skeleton-line settings-skeleton-title shimmer" />
          <div className="settings-skeleton-line settings-skeleton-line-full shimmer" />
          <div className="settings-skeleton-line settings-skeleton-line-md shimmer" />
          <div className="settings-tags">
            <div className="settings-skeleton-chip shimmer" />
            <div className="settings-skeleton-chip shimmer" />
            <div className="settings-skeleton-chip shimmer" />
          </div>
        </div>
        <aside className="settings-hero-summary">
          <div className="settings-skeleton-line settings-skeleton-line-sm shimmer" />
          <div className="settings-skeleton-line settings-skeleton-line-md shimmer" />
          <div className="settings-skeleton-line settings-skeleton-line-full shimmer" />
        </aside>
      </section>
    </>
  );
}

function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { updateTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [toast, setToast] = useState("");
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  const [pinForm, setPinForm] = useState({ current: "", next: "", confirm: "" });

  const currentLanguage = normalizeLanguage(settings.preferences.language || language);
  const t = T[currentLanguage] || T.English;

  const accountStatus = useMemo(() => ({
    notifications: settings.notifications.contribution_alerts || settings.notifications.email_notifications || settings.notifications.push_notifications ? "Active" : "Muted",
    security: settings.security.two_factor_enabled ? "2FA Enabled" : "PIN Protected",
    region: settings.preferences.country || "Rwanda"
  }), [settings]);

  function showToast(message) {
    setToast(message);
    window.clearTimeout(window.__contribaSettingsToast);
    window.__contribaSettingsToast = window.setTimeout(() => setToast(""), 2600);
  }

  async function loadSettings() {
    setLoading(true);
    const result = await getSettings();

    if (result.success) {
      const merged = mergeSettings(result.settings);
      setSettings(merged);
      updateTheme(merged.appearance);
      setLanguage(merged.preferences.language);
      setUser(result.user);
      setProfileForm({
        name: result.user?.name || "",
        email: result.user?.email || "",
        phone: result.user?.phone || "",
      });
    } else {
      showToast(result.message || "Failed to load settings");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadSettings();
    return () => window.clearTimeout(window.__contribaAppearanceAutoSave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveSection(section, payload, apiFunction) {
    setSavingKey(section);
    const result = await apiFunction(payload);

    if (result.success) {
      if (result.settings) {
        const merged = mergeSettings(result.settings);
        setSettings(merged);

        if (section === "appearance") updateTheme(merged.appearance);
        if (section === "preferences") setLanguage(merged.preferences.language);
      }

      showToast(result.message || t.saved);
    } else {
      showToast(result.message || t.failed);
    }

    setSavingKey("");
    return result;
  }

  async function saveProfile() {
    setSavingKey("profile");
    const result = await updateSettingsProfile(profileForm);

    if (result.success) {
      setUser(result.user);
      const token = localStorage.getItem("contriba_token");
      if (token && result.user) saveSession(token, result.user);
      showToast("Profile updated successfully");
    } else {
      showToast(result.message || t.failed);
    }

    setSavingKey("");
  }

  async function handleChangePin() {
    if (!pinForm.current || !pinForm.next || !pinForm.confirm) return showToast("Fill all PIN fields");
    if (pinForm.next.length < 4) return showToast("New PIN must be at least 4 digits");
    if (pinForm.next !== pinForm.confirm) return showToast("New PIN and confirmation do not match");

    setSavingKey("pin");
    const result = await changeSettingsPin(pinForm.current, pinForm.next);

    if (result.success) {
      setPinForm({ current: "", next: "", confirm: "" });
      showToast("PIN changed successfully");
    } else {
      showToast(result.message || t.failed);
    }

    setSavingKey("");
  }

  async function handleLogoutAll() {
    if (!window.confirm("Logout all other devices?")) return;
    setSavingKey("logout-all");
    const result = await logoutAllSettingsSessions();
    showToast(result.message || (result.success ? "Sessions updated" : t.failed));
    setSavingKey("");
  }

  async function handleDeleteAccount() {
    const typed = window.prompt("Type DELETE to confirm account deletion");
    if (typed !== "DELETE") return showToast("Account deletion cancelled");

    setSavingKey("delete-account");
    const result = await deleteSettingsAccount("DELETE");

    if (result.success) {
      clearSession();
      logout?.();
      navigate("/login");
    } else {
      showToast(result.message || t.failed);
      setSavingKey("");
    }
  }

  function handleLogout() {
    clearSession();
    logout?.();
    navigate("/login");
  }

  function updateLocalSettings(section, key, value) {
    setSettings((prev) => {
      const nextSection = { ...prev[section], [key]: value };

      if (section === "preferences" && key === "language") {
        nextSection.language = normalizeLanguage(value);
        setLanguage(nextSection.language);
      }

      if (section === "preferences" && key === "country") {
        const map = { Rwanda: "RWF", Kenya: "KES", Uganda: "UGX", Tanzania: "TZS", Burundi: "BIF", France: "EUR" };
        nextSection.currency = map[value] || prev.preferences.currency;
      }

      const nextSettings = { ...prev, [section]: nextSection };

      if (section === "appearance") {
        updateTheme(nextSection);
        window.clearTimeout(window.__contribaAppearanceAutoSave);
        window.__contribaAppearanceAutoSave = window.setTimeout(async () => {
          await updateSettingsAppearance(nextSection);
        }, 650);
      }

      return nextSettings;
    });
  }

  const saveLocalSection = (section, apiFunction) => saveSection(section, settings[section], apiFunction);

  const notificationsList = [
    ["contribution_alerts", "Contribution Alerts", "Notify me when someone contributes."],
    ["payment_alerts", "Payment Alerts", "Payment success and failure alerts."],
    ["email_notifications", "Email Notifications", "Receive important updates by email."],
    ["push_notifications", "Push Notifications", "Mobile and browser push alerts."],
    ["weekly_reports", "Weekly Reports", "Send weekly event performance reports."],
    ["marketing_emails", "Marketing Emails", "Tips, product updates and launch news."],
  ];

  const aiList = [
    ["enabled", "Enable AI Assistant", "Allow Contriba to show smart suggestions."],
    ["smart_suggestions", "Growth Suggestions", "Suggest better sharing and fundraising actions."],
    ["weekly_ai_reports", "Weekly AI Reports", "Summarize weekly performance."],
    ["growth_reminders", "Growth Reminders", "Remind you when campaigns need activity."],
  ];

  return (
    <main className="settings-page">
      <AppSidebar active="settings" />

      <section className="settings-main">
        <header className="settings-topbar">
          <div>
            <span>{t.settings}</span>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
        </header>

        {loading ? <SettingsSkeleton /> : (
          <>
            <section className="settings-hero">
              <div className="settings-hero-left">
                <span className="settings-badge"><Sparkles size={16} />{t.live}</span>
                <h2>{user?.name ? `${user.name}'s ${t.title}` : t.title}</h2>
                <p>{t.connected}</p>
                <div className="settings-tags">
                  <div><Mail size={15} />{user?.email || "Email not added"}</div>
                  <div><Phone size={15} />{formatPhone(user?.phone) || "Phone not added"}</div>
                  <div><Globe size={15} />{settings.preferences.timezone}</div>
                </div>
              </div>

              <aside className="settings-hero-summary">
                <span>{t.summary}</span>
                <div>
                  <h3>{user?.email_verified ? "Verified organizer" : "Organizer account"}</h3>
                  <p>Your profile, notification preferences and security controls are managed from the backend.</p>
                </div>
                <div className="settings-summary-list">
                  <div><strong>{t.security}</strong><small>{accountStatus.security}</small></div>
                  <div><strong>{t.notifications}</strong><small>{accountStatus.notifications}</small></div>
                  <div><strong>{t.region}</strong><small>{accountStatus.region}</small></div>
                </div>
              </aside>
            </section>

            <section className="settings-content-grid">
              <section className="settings-panel">
                <div className="settings-panel-heading">
                  <div><span>{t.profile}</span><h3>{t.realAccount}</h3></div>
                  <UserRound size={22} />
                </div>
                <div className="settings-form-grid">
                  <Field label={t.fullName} icon={UserRound} value={profileForm.name} onChange={(v) => setProfileForm((p) => ({ ...p, name: v }))} />
                  <Field label={t.emailAddress} icon={Mail} value={profileForm.email} onChange={(v) => setProfileForm((p) => ({ ...p, email: v }))} />
                  <Field label={t.phoneNumber} icon={Phone} value={profileForm.phone} onChange={(v) => setProfileForm((p) => ({ ...p, phone: v }))} />
                  <button type="button" className="settings-save-button" onClick={saveProfile} disabled={savingKey === "profile"}>
                    <Save size={17} />{savingKey === "profile" ? t.saving : t.saveProfile}
                  </button>
                </div>
              </section>

              <section className="settings-panel">
                <div className="settings-panel-heading">
                  <div><span>{t.accountDefaults}</span><h3>{t.preferences}</h3></div>
                  <Globe size={22} />
                </div>
                <div className="settings-form-grid">
                  <SelectField label={t.language} icon={Globe} value={settings.preferences.language} options={LANGUAGES} onChange={(v) => updateLocalSettings("preferences", "language", v)} />
                  <SelectField label={t.country} icon={Globe} value={settings.preferences.country} options={["Rwanda", "Kenya", "Uganda", "Tanzania", "Burundi", "France"]} onChange={(v) => updateLocalSettings("preferences", "country", v)} />
                  <SelectField label={t.currency} icon={WalletCards} value={settings.preferences.currency} options={["RWF", "KES", "UGX", "TZS", "BIF", "USD", "EUR"]} onChange={(v) => updateLocalSettings("preferences", "currency", v)} />
                  <SelectField label={t.timezone} icon={Globe} value={settings.preferences.timezone} options={["Africa/Kigali", "Africa/Nairobi", "Africa/Kampala", "Africa/Dar_es_Salaam", "Europe/Paris", "UTC"]} onChange={(v) => updateLocalSettings("preferences", "timezone", v)} />
                  <button className="settings-save-button" onClick={() => saveLocalSection("preferences", updateSettingsPreferences)} disabled={savingKey === "preferences"}>
                    <Save size={17} />{savingKey === "preferences" ? t.saving : t.savePreferences}
                  </button>
                </div>
              </section>
            </section>

            <section className="settings-content-grid">
              <section className="settings-panel">
                <div className="settings-panel-heading">
                  <div><span>{t.notifications}</span><h3>{t.alerts}</h3></div>
                  <Bell size={22} />
                </div>
                <div className="settings-toggle-list">
                  {notificationsList.map(([key, title, desc]) => (
                    <div className="settings-toggle-card" key={key}>
                      <div className="settings-toggle-left">
                        <div className="settings-option-icon"><Bell size={18} /></div>
                        <span><strong>{title}</strong><p>{desc}</p></span>
                      </div>
                      <Toggle active={settings.notifications[key]} onClick={() => updateLocalSettings("notifications", key, !settings.notifications[key])} />
                    </div>
                  ))}
                  <button className="settings-save-button" onClick={() => saveLocalSection("notifications", updateSettingsNotifications)} disabled={savingKey === "notifications"}>
                    <Save size={17} />{savingKey === "notifications" ? t.saving : "Save Notifications"}
                  </button>
                </div>
              </section>

              <section className="settings-panel">
                <div className="settings-panel-heading">
                  <div><span>{t.security}</span><h3>{t.pinProtection}</h3></div>
                  <LockKeyhole size={22} />
                </div>
                <div className="settings-toggle-list">
                  <div className="settings-toggle-card">
                    <div className="settings-toggle-left">
                      <div className="settings-option-icon"><ShieldCheck size={18} /></div>
                      <span><strong>Two-Factor Authentication</strong><p>Keep this ready for stronger account security.</p></span>
                    </div>
                    <Toggle active={settings.security.two_factor_enabled} onClick={() => updateLocalSettings("security", "two_factor_enabled", !settings.security.two_factor_enabled)} />
                  </div>
                  <div className="settings-toggle-card">
                    <div className="settings-toggle-left">
                      <div className="settings-option-icon"><ShieldCheck size={18} /></div>
                      <span><strong>Login Alerts</strong><p>Notify me when a new login happens.</p></span>
                    </div>
                    <Toggle active={settings.security.login_alerts} onClick={() => updateLocalSettings("security", "login_alerts", !settings.security.login_alerts)} />
                  </div>
                  <button className="settings-save-button" onClick={() => saveLocalSection("security", updateSettingsSecurity)} disabled={savingKey === "security"}>
                    <Save size={17} />{savingKey === "security" ? t.saving : "Save Security"}
                  </button>
                </div>

                <div className="settings-pin-box">
                  <strong>Change PIN</strong>
                  <Field label="Current PIN" type="password" icon={KeyRound} value={pinForm.current} onChange={(v) => setPinForm((p) => ({ ...p, current: v }))} />
                  <Field label="New PIN" type="password" icon={KeyRound} value={pinForm.next} onChange={(v) => setPinForm((p) => ({ ...p, next: v }))} />
                  <Field label="Confirm PIN" type="password" icon={KeyRound} value={pinForm.confirm} onChange={(v) => setPinForm((p) => ({ ...p, confirm: v }))} />
                  <button className="settings-save-button" onClick={handleChangePin} disabled={savingKey === "pin"}>
                    <KeyRound size={17} />{savingKey === "pin" ? "Changing..." : "Change PIN"}
                  </button>
                </div>
              </section>
            </section>

            <section className="settings-content-grid">
              <section className="settings-panel">
                <div className="settings-panel-heading">
                  <div><span>{t.payments}</span><h3>{t.payout}</h3></div>
                  <CreditCard size={22} />
                </div>
                <div className="settings-form-grid">
                  <SelectField label="Preferred payout method" icon={WalletCards} value={settings.payment.preferred_payout_method} options={["MTN MoMo", "Airtel Money", "Bank Account"]} onChange={(v) => updateLocalSettings("payment", "preferred_payout_method", v)} />
                  <Field label="Payout phone" icon={Phone} value={settings.payment.payout_phone} onChange={(v) => updateLocalSettings("payment", "payout_phone", v)} placeholder="0788123456" />
                  <Field label="Payout name" icon={UserRound} value={settings.payment.payout_name} onChange={(v) => updateLocalSettings("payment", "payout_name", v)} placeholder="Account owner name" />
                  <Field label="Minimum withdraw amount" type="number" icon={WalletCards} value={settings.payment.minimum_withdraw_amount} onChange={(v) => updateLocalSettings("payment", "minimum_withdraw_amount", Number(v || 0))} />
                  <div className="settings-toggle-card">
                    <div className="settings-toggle-left">
                      <div className="settings-option-icon"><WalletCards size={18} /></div>
                      <span><strong>Auto Withdraw</strong><p>Automatically request payout when eligible.</p></span>
                    </div>
                    <Toggle active={settings.payment.auto_withdraw} onClick={() => updateLocalSettings("payment", "auto_withdraw", !settings.payment.auto_withdraw)} />
                  </div>
                  <button className="settings-save-button" onClick={() => saveLocalSection("payment", updateSettingsPayment)} disabled={savingKey === "payment"}>
                    <Save size={17} />{savingKey === "payment" ? t.saving : "Save Payments"}
                  </button>
                </div>
              </section>

              <section className="settings-panel">
                <div className="settings-panel-heading">
                  <div><span>{t.appearance}</span><h3>{t.experience}</h3></div>
                  <Palette size={22} />
                </div>
                <div className="settings-form-grid">
                  <SelectField label="Theme" icon={Palette} value={settings.appearance.theme} options={["light", "dark", "system"]} onChange={(v) => updateLocalSettings("appearance", "theme", v)} />
                  <SelectField label="Accent color" icon={Palette} value={settings.appearance.accent_color} options={["#E50914", "#7A001F", "#111827", "#16A34A"]} onChange={(v) => updateLocalSettings("appearance", "accent_color", v)} />
                  {[
                    ["compact_mode", "Compact Mode", "Reduce spacing and make dashboard cards tighter."],
                    ["reduce_motion", "Reduce Motion", "Limit animations and movement effects."]
                  ].map(([key, title, desc]) => (
                    <div className="settings-toggle-card" key={key}>
                      <div className="settings-toggle-left">
                        <div className="settings-option-icon"><Palette size={18} /></div>
                        <span><strong>{title}</strong><p>{desc}</p></span>
                      </div>
                      <Toggle active={settings.appearance[key]} onClick={() => updateLocalSettings("appearance", key, !settings.appearance[key])} />
                    </div>
                  ))}
                  <button className="settings-save-button" onClick={() => saveLocalSection("appearance", updateSettingsAppearance)} disabled={savingKey === "appearance"}>
                    <Save size={17} />{savingKey === "appearance" ? t.saving : "Save Appearance"}
                  </button>
                </div>
              </section>
            </section>

            <section className="settings-content-grid">
              <section className="settings-panel">
                <div className="settings-panel-heading">
                  <div><span>{t.ai}</span><h3>{t.smart}</h3></div>
                  <Bot size={22} />
                </div>
                <div className="settings-toggle-list">
                  {aiList.map(([key, title, desc]) => (
                    <div className="settings-toggle-card" key={key}>
                      <div className="settings-toggle-left">
                        <div className="settings-option-icon"><Sparkles size={18} /></div>
                        <span><strong>{title}</strong><p>{desc}</p></span>
                      </div>
                      <Toggle active={settings.ai[key]} onClick={() => updateLocalSettings("ai", key, !settings.ai[key])} />
                    </div>
                  ))}
                  <SelectField label="AI Language" icon={Bot} value={settings.ai.ai_language} options={LANGUAGES} onChange={(v) => updateLocalSettings("ai", "ai_language", v)} />
                  <button className="settings-save-button" onClick={() => saveLocalSection("ai", updateSettingsAI)} disabled={savingKey === "ai"}>
                    <Save size={17} />{savingKey === "ai" ? t.saving : "Save AI Settings"}
                  </button>
                </div>
              </section>

              <section className="settings-panel settings-support-panel">
                <div className="settings-panel-heading">
                  <div><span>{t.legal}</span><h3>{t.help}</h3></div>
                  <LifeBuoy size={22} />
                </div>
                <div className="settings-list">
                  <a className="settings-list-item" href="/privacy"><div className="settings-option-icon"><ShieldCheck size={18} /></div><span><strong>Privacy Policy</strong><p>Review how Contriba protects your account data.</p></span><small>Open</small></a>
                  <a className="settings-list-item" href="/terms"><div className="settings-option-icon"><CheckCircle2 size={18} /></div><span><strong>Terms of Service</strong><p>Platform rules and organizer responsibilities.</p></span><small>Open</small></a>
                  <a className="settings-list-item" href="mailto:support@contriba.online"><div className="settings-option-icon"><Mail size={18} /></div><span><strong>Support</strong><p>Contact support@contriba.online for help.</p></span><small className="success">Email</small></a>
                </div>
              </section>
            </section>

            <section className="settings-content-grid">
              <section className="settings-panel settings-logout-panel">
                <div className="settings-panel-heading"><div><span>{t.sessions}</span><h3>{t.access}</h3></div><LogOut size={22} /></div>
                <p className="settings-logout-copy">Logout from this device or mark all sessions for logout. Keep your account protected when using shared computers.</p>
                <div className="settings-danger-actions">
                  <button type="button" className="settings-logout-button" onClick={handleLogout}><LogOut size={18} />{t.logout}</button>
                  <button type="button" className="settings-logout-button" onClick={handleLogoutAll} disabled={savingKey === "logout-all"}><ShieldCheck size={18} />{savingKey === "logout-all" ? "Processing..." : t.logoutAll}</button>
                </div>
              </section>

              <section className="settings-panel settings-danger-panel">
                <div className="settings-panel-heading"><div><span>{t.danger}</span><h3>{t.deleteAccount}</h3></div><AlertTriangle size={22} /></div>
                <p className="settings-logout-copy">Account deletion disables your organizer profile. Use this only when you are sure.</p>
                <button type="button" className="settings-delete-button" onClick={handleDeleteAccount} disabled={savingKey === "delete-account"}><Trash2 size={18} />{savingKey === "delete-account" ? "Deleting..." : t.deleteAccount}</button>
              </section>
            </section>
          </>
        )}
      </section>

      {toast && <div className="settings-toast">{toast}</div>}
    </main>
  );
}

export default Settings;