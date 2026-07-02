import {
  Activity,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  ShieldCheck,
  Wallet,
} from "lucide-react";

const activities = [
  {
    title: "Created Wedding Event",
    description: "Jean & Alice Wedding was successfully created.",
    time: "Today • 10:24 AM",
    icon: CalendarDays,
    color: "blue",
  },
  {
    title: "Generated Financial Report",
    description: "Downloaded June contribution report.",
    time: "Yesterday • 4:12 PM",
    icon: FileText,
    color: "purple",
  },
  {
    title: "Withdrawal Completed",
    description: "RWF 850,000 sent to MTN MoMo.",
    time: "Yesterday • 11:30 AM",
    icon: Wallet,
    color: "green",
  },
  {
    title: "Payment Method Added",
    description: "Visa ending with **** 4821 connected.",
    time: "2 Days Ago",
    icon: CreditCard,
    color: "orange",
  },
  {
    title: "Identity Verified",
    description: "Organizer identity verification completed.",
    time: "Last Week",
    icon: ShieldCheck,
    color: "red",
  },
  {
    title: "Profile Updated",
    description: "Personal information successfully updated.",
    time: "Last Week",
    icon: CheckCircle2,
    color: "green",
  },
];

function ProfileActivity() {
  return (
    <section className="profile-panel profile-activity-panel">
      <div className="profile-panel-heading">
        <div>
          <span>Recent Activity</span>
          <h3>Timeline</h3>
        </div>

        <Activity size={22} />
      </div>

      <div className="activity-timeline">
        {activities.map((item) => {
          const Icon = item.icon;

          return (
            <div className="activity-item" key={item.title}>
              <div className={`activity-icon ${item.color}`}>
                <Icon size={18} />
              </div>

              <div className="activity-content">
                <strong>{item.title}</strong>

                <p>{item.description}</p>

                <small>{item.time}</small>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ProfileActivity;