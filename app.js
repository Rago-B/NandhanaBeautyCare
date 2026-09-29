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
      textPrimary: "--color-text",
      textSecondary: "--color-text-muted",
      accentPay: "--color-pay",
      accentPayHover: "--color-pay-hover",
      accentReview: "--color-review",
      accentReviewHover: "--color-review-hover",
      border: "--color-border",
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

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-active");
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function () {
      toast.classList.remove("is-active");
    }, 2800);
  }

  function copyToClipboard(text, onSuccess) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(onSuccess)
        .catch(function () {
          fallbackCopy(text, onSuccess);
        });
    } else {
      fallbackCopy(text, onSuccess);
    }
  }

  function fallbackCopy(text, onSuccess) {
    try {
      const temp = document.createElement("textarea");
      temp.value = text;
      temp.setAttribute("readonly", "");
      temp.style.position = "absolute";
      temp.style.left = "-9999px";
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
      onSuccess();
    } catch (e) {
      alert("UPI ID: " + text);
    }
  }

  function initLogo() {
    const img = document.getElementById("logo-img");
    const placeholder = document.getElementById("logo-placeholder");

    if (config.logoUrl) {
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
    } else {
      if (img) img.hidden = true;
      if (placeholder) {
        placeholder.hidden = false;
        // Only set text initials if placeholder has no child SVG (leaf emblem)
        if (!placeholder.querySelector("svg")) {
          const initials = (config.businessName || "B")
            .split(/\s+/)
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          placeholder.textContent = initials || "NB";
        }
      }
    }
  }

  function initQrCode(upiUrl) {
    const qrImg = document.getElementById("qr-image");
    const qrDrawer = document.getElementById("qr-drawer");
    const qrToggleBtn = document.getElementById("btn-toggle-qr");

    if (qrImg && upiUrl) {
      const qrApiUrl =
        "https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=" +
        encodeURIComponent(upiUrl);
      qrImg.src = qrApiUrl;
    }

    // Auto-open QR on desktop
    var isDesktop =
      window.matchMedia("(min-width: 768px)").matches ||
      (!("ontouchstart" in window) && navigator.maxTouchPoints === 0);

    if (isDesktop && qrDrawer && qrToggleBtn) {
      qrDrawer.classList.add("is-open");
      qrToggleBtn.setAttribute("aria-expanded", "true");
    }

    if (qrToggleBtn && qrDrawer) {
      qrToggleBtn.addEventListener("click", function () {
        var isOpen = qrDrawer.classList.toggle("is-open");
        qrToggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }
  }

  function initLinks() {
    const payBtn = document.getElementById("btn-pay");
    const reviewBtn = document.getElementById("btn-review");
    const appGPay = document.getElementById("app-gpay");
    const appPhonePe = document.getElementById("app-phonepe");
    const appPaytm = document.getElementById("app-paytm");
    const copyBtn = document.getElementById("btn-copy-upi");
    const copyBtnText = document.getElementById("copy-btn-text");

    const upiUrl = buildUpiDeepLink(config);

    // Detect Chrome on Android
    var isAndroid = /android/i.test(navigator.userAgent);
    var isChrome =
      /chrome|crios/i.test(navigator.userAgent) &&
      !/firefox|fxios/i.test(navigator.userAgent);

    // Build links
    if (config.upiId) {
      var encName = encodeURIComponent(
        config.upiPayeeName || config.businessName
      ).replace(/\+/g, "%20");
      var baseParams = "pa=" + config.upiId + "&pn=" + encName;
      if (config.upiAmount != null && config.upiAmount !== "") {
        baseParams += "&am=" + config.upiAmount + "&cu=INR";
      }

      var payLink, phonepeLink, gpayLink, paytmLink;

      if (isAndroid && isChrome) {
        payLink = "intent://pay?" + baseParams + "#Intent;scheme=upi;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end";
        phonepeLink = "intent://pay?" + baseParams + "#Intent;scheme=upi;package=com.phonepe.app;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end";
        gpayLink = "intent://pay?" + baseParams + "#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end";
        paytmLink = "intent://pay?" + baseParams + "#Intent;scheme=upi;package=net.one97.paytm;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end";
      } else {
        var rawUpi = "upi://pay?" + baseParams;
        payLink = rawUpi;
        phonepeLink = rawUpi;
        gpayLink = rawUpi;
        paytmLink = rawUpi;
      }

      if (payBtn) payBtn.setAttribute("href", payLink);
      if (appPhonePe) appPhonePe.setAttribute("href", phonepeLink);
      if (appGPay) appGPay.setAttribute("href", gpayLink);
      if (appPaytm) appPaytm.setAttribute("href", paytmLink);
    }

    // Placeholder guard for pay
    if (payBtn && (isPlaceholder(config.upiId) || isPlaceholder(config.upiPayeeName))) {
      payBtn.addEventListener("click", function (e) {
        e.preventDefault();
        alert("UPI is not configured yet. Open config.js and set upiId and upiPayeeName.");
      });
    }

    // Review link
    if (reviewBtn) {
      if (isPlaceholder(config.googleReviewUrl)) {
        reviewBtn.addEventListener("click", function (e) {
          e.preventDefault();
          alert("Google Review link is not configured. Open config.js and set googleReviewUrl.");
        });
      } else {
        reviewBtn.setAttribute("href", config.googleReviewUrl);
      }
    }

    // Copy UPI ID
    if (copyBtn && config.upiId) {
      copyBtn.addEventListener("click", function () {
        copyToClipboard(config.upiId, function () {
          if (copyBtnText) copyBtnText.textContent = "Copied! ✓";
          showToast("UPI ID copied: " + config.upiId + " ✓");
          setTimeout(function () {
            if (copyBtnText) copyBtnText.textContent = "Copy";
          }, 2400);
        });
      });
    }

    initQrCode(upiUrl);
  }

  function showPaySection() {
    var paySection = document.getElementById("pay-section");
    var reviewDone = document.getElementById("review-done");
    if (paySection) paySection.classList.add("section-visible");
    if (reviewDone) reviewDone.hidden = false;
    // Scroll to pay section smoothly
    if (paySection) {
      setTimeout(function () {
        paySection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }

  function initReviewGating() {
    var STORAGE_KEY = "nandhana_reviewed";
    var paySection = document.getElementById("pay-section");
    var reviewBtn = document.getElementById("btn-review");

    // If already reviewed before, show pay section immediately
    try {
      if (localStorage.getItem(STORAGE_KEY) === "true") {
        showPaySection();
        return;
      }
    } catch (e) {
      // localStorage unavailable — fall through
    }

    // Track when the user clicks the review button
    var reviewClicked = false;

    if (reviewBtn) {
      reviewBtn.addEventListener("click", function () {
        reviewClicked = true;
      });
    }

    // When user comes back to the page after visiting Google Review
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible" && reviewClicked) {
        reviewClicked = false;
        // Save to localStorage so pay stays visible on future visits
        try {
          localStorage.setItem(STORAGE_KEY, "true");
        } catch (e) {
          // ignore
        }
        showPaySection();
        showToast("Thank you for your review! 🎉");
      }
    });
  }

  function init() {
    applyTheme(config.colors || {});

    setText("business-name", config.businessName);
    setText("tagline", config.tagline);
    setText("footer-message", config.footerMessage);
    setText("upi-id-display", config.upiId);

    var payLabel = document.getElementById("pay-label");
    var reviewLabel = document.getElementById("review-label");
    var payIcon = document.getElementById("pay-icon");
    var reviewIcon = document.getElementById("review-icon");

    if (payIcon && config.payButtonIcon) payIcon.textContent = config.payButtonIcon;
    if (reviewIcon && config.reviewButtonIcon) reviewIcon.textContent = config.reviewButtonIcon;
    if (payLabel) payLabel.textContent = config.payButtonText || "PAY VIA ANY UPI APP";
    if (reviewLabel) reviewLabel.textContent = config.reviewButtonText || "WRITE A GOOGLE REVIEW";

    document.title = (config.businessName || "Salon") + " — Pay & Review";

    initLogo();
    initLinks();
    initReviewGating();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
