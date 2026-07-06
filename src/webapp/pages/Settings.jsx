import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

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

        {loading ? (
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

                <div className="settings-summary-list">
                  {[1, 2, 3].map((item) => (
                    <div key={item}>
                      <span className="settings-skeleton-line settings-skeleton-line-sm shimmer" />
                      <small className="settings-skeleton-line settings-skeleton-line-xs shimmer" />
                    </div>
                  ))}
                </div>
              </aside>
            </section>

            {[1, 2, 3, 4].map((group) => (
              <section className="settings-content-grid" key={group}>
                {[1, 2].map((panel) => (
                  <section className="settings-panel settings-skeleton-panel" key={panel}>
                    <div className="settings-panel-heading">
                      <div>
                        <span className="settings-skeleton-line settings-skeleton-line-sm shimmer" />
                        <h3 className="settings-skeleton-line settings-skeleton-line-md shimmer" />
                      </div>
                      <div className="settings-skeleton-icon settings-skeleton-icon-small shimmer" />
                    </div>

                    <div className="settings-options-grid">
                      {[1, 2, 3].map((item) => (
                        <div className="settings-option-card settings-skeleton-card" key={item}>
                          <div className="settings-skeleton-icon shimmer" />
                          <span>
                            <strong className="settings-skeleton-line settings-skeleton-line-md shimmer" />
                            <p className="settings-skeleton-line settings-skeleton-line-sm shimmer" />
                          </span>
                          <button type="button" className="settings-skeleton-button shimmer" />
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </section>
            ))}
          </>
        ) : (
          <>
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
          </>
        )}
      </section>
    </main>
  );
}

export default Settings;