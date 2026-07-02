import {
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

function ProfileVerification() {
  const verifications = [
    {
      icon: <Mail size={20} />,
      title: "Email Address",
      value: "Verified",
      status: "verified",
    },
    {
      icon: <Phone size={20} />,
      title: "Phone Number",
      value: "Verified",
      status: "verified",
    },
    {
      icon: <UserRound size={20} />,
      title: "National Identity",
      value: "Verified",
      status: "verified",
    },
    {
      icon: <CreditCard size={20} />,
      title: "Bank Account",
      value: "Pending Review",
      status: "pending",
    },
  ];

  return (
    <section className="profile-panel">
      <div className="profile-panel-heading">
        <div>
          <span>Verification Center</span>
          <h3>Identity & Security</h3>
        </div>

        <ShieldCheck size={22} />
      </div>

      <div className="verification-grid">
        {verifications.map((item) => (
          <div className="verification-card" key={item.title}>
            <div className="verification-top">
              <div className="verification-icon">
                {item.icon}
              </div>

              <div
                className={`verification-status ${
                  item.status === "verified"
                    ? "verified"
                    : "pending"
                }`}
              >
                {item.status === "verified" ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <BadgeCheck size={15} />
                )}

                {item.value}
              </div>
            </div>

            <h4>{item.title}</h4>

            <p>
              {item.status === "verified"
                ? "This verification has been successfully completed."
                : "Complete this verification to unlock every organizer feature."}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProfileVerification;