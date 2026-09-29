/**
 * CLIENT CONFIGURATION — Edit this file only for each new business
 */

const SITE_CONFIG = {
  businessName: "Nandhana Beauty Care",
  tagline: "Thank you for choosing us!",
  footerMessage: "Thank you for your support ❤️",
  promptText: "How would you like to continue?",

  logoUrl: "",
  logoAlt: "Business logo",

  // ENTER CLIENT UPI ID HERE (e.g. "shopname@paytm", "9876543210@ybl")
  upiId: "8072117541@axl",

  // Name shown in the customer's UPI app when paying
  upiPayeeName: "REGO B",

  upiAmount: null,

  // ENTER CLIENT GOOGLE REVIEW URL HERE (Google direct review link)
  googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJRcEbiL8RBDsRHhv30-dJpM4",

  payButtonText: "PAY NOW",
  payButtonIcon: "💳",
  reviewButtonText: "GIVE A REVIEW",
  reviewButtonIcon: "⭐",

  colors: {
    background: "#0f1419",
    surface: "#1a2332",
    surfaceElevated: "#243044",
    textPrimary: "#f4f6f8",
    textSecondary: "#9aa8b8",
    accentPay: "#22c55e",
    accentPayHover: "#16a34a",
    accentReview: "#f59e0b",
    accentReviewHover: "#d97706",
    border: "rgba(255, 255, 255, 0.08)",
    shadow: "rgba(0, 0, 0, 0.35)",
  },
};

function buildUpiDeepLink(config) {
  const params = new URLSearchParams();
  params.set("pa", config.upiId);
  params.set("pn", config.upiPayeeName);
  params.set("cu", "INR");
  if (config.upiAmount != null && config.upiAmount !== "") {
    params.set("am", String(config.upiAmount));
  }
  return `upi://pay?${params.toString()}`;
}