/**
 * CLIENT CONFIGURATION — Edit this file only for each new business
 */

const SITE_CONFIG = {
  businessName: "Nandhana Beauty Care",
  badgeText: "✦ Luxury Salon & Aesthetics ✦",
  tagline: "Hair, Skin & Bridal • Elevate Your Natural Glow",
  footerMessage: "Thank you for supporting our salon ❤️",
  promptText: "How would you like to continue?",

  logoUrl: "",
  logoAlt: "Nandhana Beauty Care logo",

  // ENTER CLIENT UPI ID HERE (e.g. "shopname@paytm", "9876543210@ybl")
  upiId: "8072117541@axl",

  // Name shown in the customer's UPI app when paying
  upiPayeeName: "REGO B",

  upiAmount: null,

  // ENTER CLIENT GOOGLE REVIEW URL HERE (Google direct review link)
  googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJRcEbiL8RBDsRHhv30-dJpM4",

  payButtonText: "PAY VIA ANY UPI APP",
  payButtonIcon: "⚡",
  reviewButtonText: "WRITE A GOOGLE REVIEW",
  reviewButtonIcon: "⭐",

  colors: {
    background: "#090a10",
    surface: "rgba(18, 22, 33, 0.8)",
    surfaceElevated: "rgba(26, 32, 48, 0.9)",
    textPrimary: "#fcfdff",
    textSecondary: "#9ca9ba",
    accentPay: "#10b981",
    accentPayHover: "#059669",
    accentReview: "#f59e0b",
    accentReviewHover: "#d97706",
    accentGold: "#e2b472",
    border: "rgba(255, 255, 255, 0.08)",
    shadow: "rgba(0, 0, 0, 0.45)",
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