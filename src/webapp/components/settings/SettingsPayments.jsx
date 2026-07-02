import {
  Building2,
  CheckCircle2,
  CreditCard,
  Plus,
  Smartphone,
  WalletCards,
} from "lucide-react";

const paymentSettings = [
  {
    title: "MTN MoMo",
    description: "+250 788 123 456",
    status: "Primary",
    icon: Smartphone,
  },
  {
    title: "Airtel Money",
    description: "+250 732 444 220",
    status: "Connected",
    icon: Smartphone,
  },
  {
    title: "Visa / Mastercard",
    description: "Card payments enabled",
    status: "Connected",
    icon: CreditCard,
  },
  {
    title: "Bank Account",
    description: "Bank of Kigali • **** 4821",
    status: "Pending",
    icon: Building2,
  },
];

function SettingsPayments() {
  return (
    <section className="settings-panel">
      <div className="settings-panel-heading">
        <div>
          <span>Payment Settings</span>
          <h3>Collection and withdrawal methods</h3>
        </div>

        <WalletCards size={22} />
      </div>

      <div className="settings-list">
        {paymentSettings.map((item) => {
          const Icon = item.icon;

          return (
            <button className="settings-list-item" type="button" key={item.title}>
              <div className="settings-option-icon">
                <Icon size={18} />
              </div>

              <span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </span>

              <small
                className={
                  item.status === "Primary"
                    ? "success"
                    : item.status === "Connected"
                    ? "blue"
                    : "warning"
                }
              >
                {item.status === "Primary" && <CheckCircle2 size={14} />}
                {item.status}
              </small>
            </button>
          );
        })}
      </div>

      <button className="settings-primary-action" type="button">
        <Plus size={18} />
        Add Payment Method
      </button>
    </section>
  );
}

export default SettingsPayments;