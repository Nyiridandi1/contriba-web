import AppSidebar from "../components/AppSidebar";

import ProfileHero from "../components/profile/ProfileHero";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileVerification from "../components/profile/ProfileVerification";
import ProfilePayments from "../components/profile/ProfilePayments";
import ProfileSecurity from "../components/profile/ProfileSecurity";
import ProfilePerformance from "../components/profile/ProfilePerformance";
import ProfilePreferences from "../components/profile/ProfilePreferences";
import ProfileActivity from "../components/profile/ProfileActivity";
import ProfileDangerZone from "../components/profile/ProfileDangerZone";

import "./Profile.css";

function Profile() {
  return (
    <main className="profile-page">
      <AppSidebar active="profile" />

      <section className="profile-main">
        <header className="profile-topbar">
          <div>
            <span>Profile Center</span>
            <h1>Organizer account and trust profile</h1>
            <p>
              Manage your personal information, verification status, payment
              accounts, security settings and organizer reputation.
            </p>
          </div>
        </header>

        <ProfileHero />
        <ProfileStats />
        <ProfileInfo />

        <section className="profile-content-grid">
          <ProfileVerification />
          <ProfilePayments />
        </section>

        <section className="profile-content-grid">
          <ProfileSecurity />
          <ProfilePreferences />
        </section>

        <ProfilePerformance />

        <section className="profile-content-grid">
          <ProfileActivity />
          <ProfileDangerZone />
        </section>
      </section>
    </main>
  );
}

export default Profile;