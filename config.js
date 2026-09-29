/**
 * CLIENT CONFIGURATION — Edit this file only for each new business
 */

const SITE_CONFIG = {
  businessName: "Nandhana Beauty Care",
  badgeText: "✦ Luxury Salon & Aesthetics ✦",
  tagline: "Quality • Trust • Service",
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

  payButtonText: "Make Payment",
  payButtonIcon: "",
  reviewButtonText: "Leave a Review",
  reviewButtonIcon: "",

  colors: {
    background: "#f4f6f2",
    surface: "#ffffff",
    textPrimary: "#1a2e3b",
    textSecondary: "#6b7280",
    accentPay: "#2D9E5A",
    accentPayHover: "#248F4E",
    accentReview: "#4A9FF5",
    accentReviewHover: "#3B8FE5",
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