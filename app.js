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

  function bindActions() {
    const payBtn = document.getElementById("btn-pay");
    const reviewBtn = document.getElementById("btn-review");
    const fallback = document.getElementById("upi-fallback");
    const upiDisplay = document.getElementById("upi-id-display");
    const copyBtn = document.getElementById("btn-copy-upi");

    // Display UPI ID in the fallback box
    if (upiDisplay && config.upiId) {
      upiDisplay.textContent = config.upiId;
    }

    // Copy UPI ID button
    if (copyBtn && config.upiId) {
      copyBtn.addEventListener("click", function () {
        function onCopied() {
          copyBtn.textContent = "Copied! ✓";
          setTimeout(function () {
            copyBtn.textContent = "Copy";
          }, 2000);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(config.upiId).then(onCopied).catch(fallbackCopy);
        } else {
          fallbackCopy();
        }

        function fallbackCopy() {
          const temp = document.createElement("textarea");
          temp.value = config.upiId;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand("copy");
          document.body.removeChild(temp);
          onCopied();
        }
      });
    }

    // Direct anchor link for UPI Payment (Option A)
    if (payBtn) {
      if (isPlaceholder(config.upiId) || isPlaceholder(config.upiPayeeName)) {
        payBtn.addEventListener("click", function (e) {
          e.preventDefault();
          alert(
            "UPI is not configured yet. Open config.js and set upiId and upiPayeeName for your client."
          );
        });
      } else {
        const upiUrl = buildUpiDeepLink(config);
        payBtn.setAttribute("href", upiUrl);

        payBtn.addEventListener("click", function () {
          // On desktop / non-UPI devices, deep link won't open.
          // Show fallback hint after a short delay so user can see and copy the UPI ID
          window.setTimeout(function () {
            if (fallback) fallback.classList.add("is-visible");
          }, 1000);
        });
      }
    }

    // Direct anchor link for Google Review
    if (reviewBtn) {
      if (isPlaceholder(config.googleReviewUrl)) {
        reviewBtn.addEventListener("click", function (e) {
          e.preventDefault();
          alert(
            "Google Review link is not configured. Open config.js and set googleReviewUrl."
          );
        });
      } else {
        reviewBtn.setAttribute("href", config.googleReviewUrl);
      }
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
