import {
  Building2,
  Globe,
  Languages,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

const personalInfo = [
  {
    label: "Full Name",
    value: "ISHIMWE Olivier",
    icon: UserRound,
  },
  {
    label: "Email Address",
    value: "olivier@contriba.rw",
    icon: Mail,
  },
  {
    label: "Phone Number",
    value: "+250 788 123 456",
    icon: Phone,
  },
  {
    label: "Location",
    value: "Kigali, Rwanda",
    icon: MapPin,
  },
  {
    label: "Country",
    value: "Rwanda",
    icon: Globe,
  },
  {
    label: "Preferred Language",
    value: "English / Kinyarwanda",
    icon: Languages,
  },
];

const organizationInfo = [
  {
    label: "Organization",
    value: "Contriba Organizer",
    icon: Building2,
  },
  {
    label: "Role",
    value: "Founder",
    icon: UserRound,
  },
  {
    label: "Website",
    value: "contriba.rw",
    icon: Globe,
  },
];

function ProfileInfo() {
  return (
    <section className="profile-content-grid">
      <div className="profile-panel large">
        <div className="profile-panel-heading">
          <div>
            <span>Personal Information</span>
            <h3>Account details</h3>
          </div>
          <UserRound size={22} />
        </div>

        <div className="personal-info-grid">
          {personalInfo.map((item) => {
            const Icon = item.icon;

            return (
              <div className="personal-info-item" key={item.label}>
                <div>
                  <Icon size={18} />
                </div>

                <span>
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="profile-panel">
        <div className="profile-panel-heading">
          <div>
            <span>Organization</span>
            <h3>Organizer identity</h3>
          </div>
          <Building2 size={22} />
        </div>

        <div className="organization-card">
          <div className="organization-mark">CO</div>

          <strong>Contriba Organizer</strong>

          <p>
            Public organizer profile used to build trust with contributors and
            event supporters.
          </p>

          <div className="organization-list">
            {organizationInfo.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label}>
                  <Icon size={16} />
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileInfo;