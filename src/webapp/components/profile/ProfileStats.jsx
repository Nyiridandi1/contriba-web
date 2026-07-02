import {
  CalendarDays,
  Wallet,
  Users,
  TrendingUp,
  ShieldCheck,
  Star,
} from "lucide-react";

function ProfileStats() {
  const stats = [
    {
      icon: <CalendarDays size={22} />,
      title: "Events Created",
      value: "18",
      sub: "+3 this month",
    },
    {
      icon: <Wallet size={22} />,
      title: "Total Collected",
      value: "RWF 18.4M",
      sub: "Across all events",
    },
    {
      icon: <Users size={22} />,
      title: "Contributors",
      value: "1,284",
      sub: "Growing community",
    },
    {
      icon: <TrendingUp size={22} />,
      title: "Success Rate",
      value: "97%",
      sub: "Completed events",
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Verification",
      value: "100%",
      sub: "Fully verified",
    },
    {
      icon: <Star size={22} />,
      title: "Trust Score",
      value: "98%",
      sub: "Excellent rating",
    },
  ];

  return (
    <section className="profile-stats-section">
      <div className="profile-section-title">
        <span>PROFILE OVERVIEW</span>
        <h2>Your organizer statistics</h2>
        <p>
          A quick overview of your activity and performance across Contriba.
        </p>
      </div>

      <div className="profile-stats-grid">
        {stats.map((item) => (
          <div className="profile-stat-card" key={item.title}>
            <div className="profile-stat-icon">
              {item.icon}
            </div>

            <h4>{item.title}</h4>

            <h2>{item.value}</h2>

            <p>{item.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProfileStats;