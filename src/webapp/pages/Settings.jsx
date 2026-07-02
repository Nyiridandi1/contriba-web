import AppSidebar from "../components/AppSidebar";

import SettingsHero from "../components/settings/SettingsHero";
import SettingsGeneral from "../components/settings/SettingsGeneral";
import SettingsNotifications from "../components/settings/SettingsNotifications";
import SettingsSecurity from "../components/settings/SettingsSecurity";
import SettingsPayments from "../components/settings/SettingsPayments";
import SettingsAppearance from "../components/settings/SettingsAppearance";
import SettingsAI from "../components/settings/SettingsAI";
import SettingsLegal from "../components/settings/SettingsLegal";
import SettingsDangerZone from "../components/settings/SettingsDangerZone";

import "./Settings.css";

function Settings() {
  return (
    <main className="settings-page">
      <AppSidebar active="settings" />

      <section className="settings-main">
        <header className="settings-topbar">
          <div>
            <span>Settings</span>
            <h1>Organizer control center</h1>
            <p>
              Configure your account, payments, notifications, security,
              appearance, AI assistant and platform preferences.
            </p>
          </div>
        </header>

        <SettingsHero />

        <section className="settings-content-grid">
          <SettingsGeneral />
          <SettingsNotifications />
        </section>

        <section className="settings-content-grid">
          <SettingsSecurity />
          <SettingsPayments />
        </section>

        <section className="settings-content-grid">
          <SettingsAppearance />
          <SettingsAI />
        </section>

        <section className="settings-content-grid">
          <SettingsLegal />
          <SettingsDangerZone />
        </section>
      </section>
    </main>
  );
}

export default Settings;