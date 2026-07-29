import {
  ArrowLeft,
  CalendarRange,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  RefreshCcw,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getTransactions, getWallet } from "../api/api";
import AppSidebar from "../components/AppSidebar";
import "./WalletStatement.css";

function formatMoney(value) {
  return `RWF ${Number(value || 0).toLocaleString()}`;
}

function parseUtcDate(value) {
  if (!value) return null;

  let timestamp = String(value).trim();
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(timestamp);

  if (!hasTimezone) {
    timestamp += "Z";
  }

  const date = new Date(timestamp);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateTime(value) {
  const date = parseUtcDate(value);

  if (!date) return "—";

  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMethodLabel(method) {
  const value = String(method || "").toLowerCase();

  if (value === "mtn") return "MTN MoMo";
  if (value === "airtel") return "Airtel Money";
  if (value === "bank") return "Bank Account";

  return "Mobile Money";
}

function maskDestination(value) {
  if (!value) return "";

  const text = String(value).replace(/\s+/g, "");

  if (text.length <= 4) return text;

  return `${text.slice(0, 4)}•••${text.slice(-3)}`;
}

function getTransactionMeta(item) {
  const isWithdrawal = item.type === "withdrawal" || item.type === "out";

  const method =
    item.payment_method ||
    item.method ||
    item.provider ||
    "";

  const destination =
    item.phone ||
    item.phone_number ||
    item.destination ||
    item.sender_phone ||
    "";

  const senderName = item.sender_name || "";

  return {
    isWithdrawal,
    methodLabel: getMethodLabel(method),
    destination: maskDestination(destination),
    senderName,
  };
}

function getRangeDates(range) {
  const now = new Date();

  if (range === "last-month") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 1);

    return { start, end };
  }

  if (range === "last-90") {
    const start = new Date(now);
    start.setDate(start.getDate() - 90);

    return { start, end: new Date(now.getTime() + 1000) };
  }

  if (range === "all") {
    return { start: null, end: null };
  }

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return { start, end };
}

function downloadTextFile(filename, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const text = String(value ?? "");

  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function WalletStatement() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("this-month");

  async function loadStatement() {
    setLoading(true);

    const [walletResult, transactionResult] = await Promise.all([
      getWallet(),
      getTransactions(),
    ]);

    if (walletResult.success) {
      setWallet(walletResult.wallet);
    }

    if (transactionResult.success) {
      setTransactions(transactionResult.transactions || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadStatement();
  }, []);

  const rangeDates = useMemo(() => getRangeDates(range), [range]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      if (!rangeDates.start || !rangeDates.end) return true;

      const date = parseUtcDate(item.created_at);

      if (!date) return false;

      return date >= rangeDates.start && date < rangeDates.end;
    });
  }, [transactions, rangeDates]);

  const successfulTransactions = useMemo(
    () =>
      filteredTransactions.filter(
        (item) => item.status === "success" || item.status === "completed"
      ),
    [filteredTransactions]
  );

  const deposits = successfulTransactions
    .filter((item) => item.type === "deposit" || item.type === "in")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const withdrawals = successfulTransactions
    .filter((item) => item.type === "withdrawal" || item.type === "out")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const currentBalance = Number(wallet?.balance || 0);
  const openingBalance = currentBalance - deposits + withdrawals;
  const netMovement = deposits - withdrawals;

  const rangeLabel = useMemo(() => {
    if (range === "all") return "All wallet activity";

    const { start, end } = rangeDates;
    if (!start || !end) return "All wallet activity";

    const effectiveEnd = new Date(end.getTime() - 1);

    return `${start.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })} – ${effectiveEnd.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  }, [range, rangeDates]);

  function exportCsv() {
    const rows = [
      ["Contriba Wallet Statement"],
      ["Statement Period", rangeLabel],
      ["Generated At", new Date().toLocaleString("en-US")],
      [],
      ["Opening Balance", openingBalance],
      ["Deposits", deposits],
      ["Withdrawals", withdrawals],
      ["Net Movement", netMovement],
      ["Current Balance", currentBalance],
      [],
      [
        "Date",
        "Type",
        "Name / Destination",
        "Method",
        "Reference",
        "Amount",
        "Status",
      ],
    ];

    filteredTransactions.forEach((item) => {
      const meta = getTransactionMeta(item);
      const descriptor = meta.isWithdrawal
        ? meta.destination || "Withdrawal destination"
        : meta.senderName || meta.destination || "Contributor";

      rows.push([
        formatDateTime(item.created_at),
        meta.isWithdrawal ? "Withdrawal" : "Deposit",
        descriptor,
        meta.methodLabel,
        item.reference || item.transaction_id || "",
        Number(item.amount || 0),
        item.status || "",
      ]);
    });

    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");

    downloadTextFile(
      `contriba-wallet-statement-${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
      "text/csv;charset=utf-8;"
    );
  }

  function printStatement() {
    window.print();
  }

  return (
    <main className="wallet-statement-page">
      <AppSidebar active="wallet" />

      <section className="wallet-statement-main">
        <header className="wallet-statement-topbar">
          <div>
            <Link to="/wallet" className="wallet-statement-back">
              <ArrowLeft size={17} />
              Back to Wallet
            </Link>

            <span className="wallet-statement-eyebrow">Wallet Statement</span>
            <h1>Account activity statement</h1>
            <p>
              Review money received, withdrawals completed and your current
              wallet position from one financial record.
            </p>
          </div>

          <div className="wallet-statement-actions">
            <button type="button" onClick={exportCsv}>
              <FileSpreadsheet size={18} />
              Export CSV
            </button>

            <button type="button" className="primary" onClick={printStatement}>
              <Download size={18} />
              Print / PDF
            </button>
          </div>
        </header>

        <section className="wallet-statement-toolbar">
          <div>
            <CalendarRange size={18} />
            <span>{rangeLabel}</span>
          </div>

          <div className="wallet-statement-range-buttons">
            <button
              className={range === "this-month" ? "active" : ""}
              onClick={() => setRange("this-month")}
            >
              This month
            </button>

            <button
              className={range === "last-month" ? "active" : ""}
              onClick={() => setRange("last-month")}
            >
              Last month
            </button>

            <button
              className={range === "last-90" ? "active" : ""}
              onClick={() => setRange("last-90")}
            >
              Last 90 days
            </button>

            <button
              className={range === "all" ? "active" : ""}
              onClick={() => setRange("all")}
            >
              All
            </button>

            <button
              type="button"
              className="refresh"
              onClick={loadStatement}
              title="Refresh statement"
            >
              <RefreshCcw size={16} />
            </button>
          </div>
        </section>

        <section className="wallet-statement-summary">
          <article>
            <span>Opening balance</span>
            <strong>{loading ? "—" : formatMoney(openingBalance)}</strong>
            <p>Balance before this statement period.</p>
          </article>

          <article>
            <span>Total received</span>
            <strong>{loading ? "—" : formatMoney(deposits)}</strong>
            <p>Successful wallet deposits.</p>
          </article>

          <article>
            <span>Total withdrawn</span>
            <strong>{loading ? "—" : formatMoney(withdrawals)}</strong>
            <p>Successful payout transactions.</p>
          </article>

          <article className="highlight">
            <span>Current balance</span>
            <strong>{loading ? "—" : formatMoney(currentBalance)}</strong>
            <p>Available wallet balance now.</p>
          </article>
        </section>

        <section className="wallet-statement-panel">
          <div className="wallet-statement-panel-heading">
            <div>
              <span>Statement activity</span>
              <h2>Transactions</h2>
            </div>

            <div className="wallet-statement-net">
              <span>Net movement</span>
              <strong>{loading ? "—" : formatMoney(netMovement)}</strong>
            </div>
          </div>

          <div className="wallet-statement-table">
            <div className="wallet-statement-table-head">
              <span>Date & time</span>
              <span>Details</span>
              <span>Reference</span>
              <span>Amount</span>
              <span>Status</span>
            </div>

            {loading && (
              <div className="wallet-statement-empty">
                <WalletCards size={28} />
                <strong>Loading statement...</strong>
              </div>
            )}

            {!loading && filteredTransactions.length === 0 && (
              <div className="wallet-statement-empty">
                <FileText size={28} />
                <strong>No transactions in this period</strong>
                <span>Choose another statement period to view more activity.</span>
              </div>
            )}

            {!loading &&
              filteredTransactions.map((item, index) => {
                const meta = getTransactionMeta(item);

                return (
                  <div
                    className="wallet-statement-row"
                    key={item.id || item.reference || index}
                  >
                    <div>
                      <strong>{formatDateTime(item.created_at)}</strong>
                      <span>
                        {meta.isWithdrawal ? "Withdrawal" : "Deposit"}
                      </span>
                    </div>

                    <div>
                      <strong>{meta.methodLabel}</strong>
                      <span>
                        {meta.isWithdrawal
                          ? meta.destination || "Mobile money destination"
                          : [
                              meta.senderName,
                              meta.destination,
                            ]
                              .filter(Boolean)
                              .join(" • ") || "Contributor"}
                      </span>
                    </div>

                    <div className="wallet-statement-reference">
                      {item.reference || item.transaction_id || "—"}
                    </div>

                    <strong
                      className={
                        meta.isWithdrawal
                          ? "wallet-statement-amount withdrawal"
                          : "wallet-statement-amount deposit"
                      }
                    >
                      {meta.isWithdrawal ? "- " : "+ "}
                      {formatMoney(item.amount)}
                    </strong>

                    <small
                      className={
                        item.status === "success" ||
                        item.status === "completed"
                          ? "completed"
                          : "processing"
                      }
                    >
                      {(item.status === "success" ||
                        item.status === "completed") && (
                        <CheckCircle2 size={14} />
                      )}
                      {item.status === "success" ||
                      item.status === "completed"
                        ? "Completed"
                        : item.status === "pending"
                        ? "Processing"
                        : item.status || "Unknown"}
                    </small>
                  </div>
                );
              })}
          </div>
        </section>

        <footer className="wallet-statement-footer">
          <p>
            This statement is generated from your Contriba wallet transaction
            records. Payment-provider charges that are not stored as separate
            transaction fields are not presented as standalone statement fees.
          </p>
          <span>Generated {new Date().toLocaleString("en-US")}</span>
        </footer>
      </section>
    </main>
  );
}

export default WalletStatement;