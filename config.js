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
    background: "#ffffff",
    surface: "#f7f8fa",
    textPrimary: "#1a1a1a",
    textSecondary: "#6b7280",
    accentPay: "#111111",
    accentPayHover: "#333333",
    accentReview: "#111111",
    accentReviewHover: "#333333",
    border: "#e5e7eb",
  },
};

function buildUpiDeepLink(config) {
  const payeeName = encodeURIComponent(config.upiPayeeName || config.businessName || "").replace(/\+/g, "%20");
  let query = `pa=${config.upiId}&pn=${payeeName}`;
  if (config.upiAmount != null && config.upiAmount !== "") {
    query += `&am=${config.upiAmount}&cu=INR`;
  }
  return `upi://pay?${query}`;
}