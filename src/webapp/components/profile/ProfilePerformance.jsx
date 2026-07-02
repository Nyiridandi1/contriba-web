import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Coins,
  TrendingUp,
  Users,
} from "lucide-react";

const performance = [
  {
    title: "Events Created",
    value: "18",
    growth: "+3 this month",
  },
  {
    title: "Money Collected",
    value: "RWF 18.4M",
    growth: "+12%",
  },
  {
    title: "Contributors",
    value: "1,284",
    growth: "+94",
  },
  {
    title: "Average Contribution",
    value: "RWF 14,300",
    growth: "+6%",
  },
];

function ProfilePerformance() {
  return (
    <section className="profile-panel profile-performance-panel">
      <div className="profile-panel-heading">
        <div>
          <span>Organizer Performance</span>
          <h3>Financial performance overview</h3>
        </div>

        <BarChart3 size={22} />
      </div>

      <div className="profile-performance-summary">
        <div className="performance-score-card">
          <div className="performance-score-circle">
            <strong>98%</strong>
            <small>Score</small>
          </div>

          <div>
            <h4>Excellent Organizer</h4>

            <p>
              Your contribution campaigns are performing better than 92% of
              organizers on Contriba.
            </p>
          </div>
        </div>

        <div className="performance-stat-grid">
          {performance.map((item) => (
            <div className="performance-stat-card" key={item.title}>
              <span>{item.title}</span>

              <strong>{item.value}</strong>

              <small>
                <ArrowUpRight size={14} />
                {item.growth}
              </small>
            </div>
          ))}
        </div>
      </div>

      <div className="performance-chart-card">
        <div className="chart-header">
          <h4>Organizer Growth</h4>

          <span>Last 6 Months</span>
        </div>

        <div className="performance-bars">
          <div style={{ height: "42%" }}>
            <span>Jan</span>
          </div>

          <div style={{ height: "56%" }}>
            <span>Feb</span>
          </div>

          <div style={{ height: "63%" }}>
            <span>Mar</span>
          </div>

          <div style={{ height: "74%" }}>
            <span>Apr</span>
          </div>

          <div style={{ height: "88%" }}>
            <span>May</span>
          </div>

          <div style={{ height: "96%" }}>
            <span>Jun</span>
          </div>
        </div>
      </div>

      <div className="performance-footer">

        <div>
          <CalendarDays size={18} />
          <span>18 Active Events</span>
        </div>

        <div>
          <Users size={18} />
          <span>1,284 Contributors</span>
        </div>

        <div>
          <Coins size={18} />
          <span>RWF 18.4M Raised</span>
        </div>

        <div>
          <TrendingUp size={18} />
          <span>97% Success Rate</span>
        </div>

      </div>
    </section>
  );
}

export default ProfilePerformance;