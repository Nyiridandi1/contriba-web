import {
  Building2,
  CheckCircle2,
  CreditCard,
  Plus,
  Smartphone,
  WalletCards,
} from "lucide-react";

const paymentAccounts = [
  {
    title: "MTN MoMo",
    detail: "+250 788 123 456",
    status: "Primary",
    icon: Smartphone,
  },
  {
    title: "Airtel Money",
    detail: "+250 732 444 220",
    status: "Connected",
    icon: Smartphone,
  },
  {
    title: "Visa / Mastercard",
    detail: "Card payments enabled",
    status: "Connected",
    icon: CreditCard,
  },
  {
    title: "Bank Account",
    detail: "Bank of Kigali • **** 4821",
    status: "Pending",
    icon: Building2,
  },
];

function ProfilePayments() {
  return (
    <section className="profile-panel">
      <div className="profile-panel-heading">
        <div>
          <span>Payment Accounts</span>
          <h3>Withdrawal destinations</h3>
        </div>

        <WalletCards size={22} />
      </div>

      <div className="payment-account-list">
        {paymentAccounts.map((account) => {
          const Icon = account.icon;

          return (
            <div className="payment-account-item" key={account.title}>
              <div>
                <Icon size={18} />
              </div>

              <span>
                <strong>{account.title}</strong>
                <small>{account.detail}</small>
              </span>

              <small
                className={
                  account.status === "Primary"
                    ? "primary"
                    : account.status === "Connected"
                    ? "connected"
                    : "pending"
                }
              >
                {account.status === "Primary" && <CheckCircle2 size={13} />}
                {account.status}
              </small>
            </div>
          );
        })}
      </div>

      <button className="profile-add-payment-btn" type="button">
        <Plus size={18} />
        Add Payment Account
      </button>
    </section>
  );
}

export default ProfilePayments;