(function () {
  "use strict";

  if (typeof SITE_CONFIG === "undefined") {
    console.error("SITE_CONFIG is missing. Load config.js before app.js.");
    return;
  }

  const config = SITE_CONFIG;

  function applyTheme(colors) {
    const root = document.documentElement;
    const map = {
      background: "--color-bg",
      surface: "--color-surface",
      surfaceElevated: "--color-surface-elevated",
      textPrimary: "--color-text",
      textSecondary: "--color-text-muted",
      accentPay: "--color-pay",
      accentPayHover: "--color-pay-hover",
      accentReview: "--color-review",
      accentReviewHover: "--color-review-hover",
      border: "--color-border",
      shadow: "--color-shadow",
    };
    Object.entries(map).forEach(([key, cssVar]) => {
      if (colors[key] != null) {
        root.style.setProperty(cssVar, colors[key]);
      }
    });
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text != null) el.textContent = text;
  }

  function isPlaceholder(value) {
    if (!value || typeof value !== "string") return true;
    return value.startsWith("YOUR_");
  }

  function openUpiPayment() {
    if (isPlaceholder(config.upiId) || isPlaceholder(config.upiPayeeName)) {
      alert(
        "UPI is not configured yet. Open config.js and set upiId and upiPayeeName for your client."
      );
      return;
    }

    const upiUrl = buildUpiDeepLink(config);
    window.location.href = upiUrl;

    // On desktop browsers, deep link may not open; show hint after a short delay
    window.setTimeout(function () {
      const fallback = document.getElementById("upi-fallback");
      if (fallback) fallback.classList.add("is-visible");
    }, 1200);
  }

  function openGoogleReview() {
    const url = config.googleReviewUrl;
    if (isPlaceholder(url)) {
      alert(
        "Google Review link is not configured. Open config.js and set googleReviewUrl."
      );
      return;
    }

    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) {
      window.location.href = url;
    }
  }

  function bindActions() {
    const payBtn = document.getElementById("btn-pay");
    const reviewBtn = document.getElementById("btn-review");

    if (payBtn) {
      payBtn.addEventListener("click", openUpiPayment);
    }
    if (reviewBtn) {
      reviewBtn.addEventListener("click", openGoogleReview);
    }
  }

  function initLogo() {
    const wrap = document.getElementById("logo-wrap");
    const img = document.getElementById("logo-img");
    const placeholder = document.getElementById("logo-placeholder");

    if (!config.logoUrl) {
      if (img) img.hidden = true;
      if (placeholder) {
        placeholder.hidden = false;
        const initials = (config.businessName || "B")
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        placeholder.textContent = initials || "Logo";
      }
      return;
    }

    if (img) {
      img.src = config.logoUrl;
      img.alt = config.logoAlt || config.businessName;
      img.hidden = false;
      img.addEventListener("error", function () {
        img.hidden = true;
        if (placeholder) placeholder.hidden = false;
      });
    }
    if (placeholder) placeholder.hidden = true;
  }

  function init() {
    applyTheme(config.colors || {});

    setText("business-name", config.businessName);
    setText("tagline", config.tagline);
    setText("prompt-text", config.promptText);
    setText("footer-message", config.footerMessage);

    const payLabel = document.getElementById("pay-label");
    const reviewLabel = document.getElementById("review-label");
    const payIcon = document.getElementById("pay-icon");
    const reviewIcon = document.getElementById("review-icon");

    if (payIcon) payIcon.textContent = config.payButtonIcon || "";
    if (reviewIcon) reviewIcon.textContent = config.reviewButtonIcon || "";
    if (payLabel) payLabel.textContent = config.payButtonText || "PAY NOW";
    if (reviewLabel) reviewLabel.textContent = config.reviewButtonText || "GIVE A REVIEW";

    document.title = config.businessName + " — Pay & Review";

    initLogo();
    bindActions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
