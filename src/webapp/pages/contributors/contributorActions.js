// ===============================
// CONTRIBUTORS ACTIONS
// ===============================

import {
  downloadContributorReceipt,
  exportContributorsCSV,
  getContributorReceipt,
  sendContributorThankYou,
} from "../../api/api";

export function downloadTextFile(filename, content, type = "text/plain") {
  const blob = new Blob([content], {
    type: `${type};charset=utf-8;`,
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export async function handleExportContributors(params = {}, fallbackRows = []) {
  const response = await exportContributorsCSV(params);

  if (response?.success && response.csv) {
    downloadTextFile(
      response.filename || "contriba-contributors.csv",
      response.csv,
      "text/csv"
    );

    return {
      success: true,
      message: "Contributors exported successfully.",
    };
  }

  if (fallbackRows.length > 0) {
    const headers = Object.keys(fallbackRows[0]);

    const csv = [
      headers.join(","),
      ...fallbackRows.map((row) =>
        headers
          .map((header) => `"${String(row[header] || "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    downloadTextFile("contriba-contributors.csv", csv, "text/csv");

    return {
      success: true,
      message: "Contributors exported from local data.",
    };
  }

  return {
    success: false,
    message: response?.message || "No contributors available to export.",
  };
}

export async function handleSendThankYou(contributor) {
  if (!contributor?.id || contributor.name === "No contributor yet") {
    return {
      success: false,
      message: "No contributor selected.",
    };
  }

  if (contributor.status !== "Success") {
    return {
      success: false,
      message: "Only successful contributors can receive a thank-you.",
    };
  }

  const response = await sendContributorThankYou(contributor.id);

  return {
    success: response?.success === true,
    message:
      response?.message ||
      (response?.success
        ? "Thank-you message sent."
        : "Failed to send thank-you message."),
    contribution: response?.contribution || null,
  };
}

export async function handleOpenReceipt(contributor) {
  if (!contributor?.id || contributor.name === "No contributor yet") {
    return {
      success: false,
      message: "No contributor selected.",
    };
  }

  const response = await getContributorReceipt(contributor.id);

  if (!response?.success) {
    return {
      success: false,
      message: response?.message || "Failed to open receipt.",
    };
  }

  const receipt = response.receipt;

  const receiptText = `
CONTRIBA RECEIPT
------------------------------
Receipt ID: ${receipt.receipt_id}
Event: ${receipt.event_title}
Contributor: ${receipt.contributor_name}
Phone: ${receipt.contributor_phone}
Amount: ${receipt.formatted_amount}
Payment Method: ${receipt.payment_method}
Status: ${receipt.status}
Transaction ID: ${receipt.transaction_id || "N/A"}
Message: ${receipt.message}
Paid At: ${receipt.paid_at}
Generated At: ${receipt.generated_at}
------------------------------
Thank you for supporting this event.
`;

  downloadTextFile(
    `${receipt.receipt_id || "contriba-receipt"}.txt`,
    receiptText,
    "text/plain"
  );

  return {
    success: true,
    message: "Receipt downloaded.",
    receipt,
  };
}

export async function handleDownloadReceipt(contributor) {
  if (!contributor?.id || contributor.name === "No contributor yet") {
    return {
      success: false,
      message: "No contributor selected.",
    };
  }

  const response = await downloadContributorReceipt(contributor.id);

  if (!response?.success) {
    return {
      success: false,
      message: response?.message || "Failed to download receipt.",
    };
  }

  downloadTextFile(
    response.filename || "contriba-receipt.txt",
    response.content || "",
    "text/plain"
  );

  return {
    success: true,
    message: "Receipt downloaded.",
  };
}

export async function handleCopyContributor(contributor) {
  if (!contributor || contributor.name === "No contributor yet") {
    return {
      success: false,
      message: "No contributor selected.",
    };
  }

  const text = `Contributor: ${contributor.name}
Phone: ${contributor.phone}
Event: ${contributor.event_title || "All Events"}
Amount: ${contributor.amount}
Method: ${contributor.method}
Status: ${contributor.status}
Message: ${contributor.message}`;

  await navigator.clipboard.writeText(text);

  return {
    success: true,
    message: "Contributor info copied.",
  };
}

export function handleCallContributor(contributor) {
  if (!contributor?.phone || contributor.phone === "Hidden") {
    return {
      success: false,
      message: "Phone number is hidden.",
    };
  }

  window.location.href = `tel:${contributor.phone}`;

  return {
    success: true,
    message: "Opening phone app.",
  };
}