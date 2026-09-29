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
      accentGold: "--color-gold",
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
    const emblem = document.getElementById("luxury-emblem");

    if (config.logoUrl) {
      if (img) {
        img.src = config.logoUrl;
        img.alt = config.logoAlt || config.businessName;
        img.hidden = false;
        img.addEventListener("error", function () {
          img.hidden = true;
          if (emblem) emblem.hidden = false;
        });
      }
      if (emblem) emblem.hidden = true;
    } else {
      if (img) img.hidden = true;
      if (emblem) emblem.hidden = false;
    }
  }

  function initQrCode(upiUrl) {
    const qrImg = document.getElementById("qr-image");
    const qrDrawer = document.getElementById("qr-drawer");
    const qrToggleBtn = document.getElementById("btn-toggle-qr");

    if (qrImg && upiUrl) {
      const qrApiUrl =
        "https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=" +
        encodeURIComponent(upiUrl);
      qrImg.src = qrApiUrl;
    }

    // Auto-open QR code if viewed on desktop / laptop so users can scan directly
    const isDesktop =
      window.matchMedia("(min-width: 768px)").matches ||
      (!("ontouchstart" in window) && navigator.maxTouchPoints === 0);

    if (isDesktop && qrDrawer && qrToggleBtn) {
      qrDrawer.classList.add("is-open");
      qrToggleBtn.setAttribute("aria-expanded", "true");
    }

    if (qrToggleBtn && qrDrawer) {
      qrToggleBtn.addEventListener("click", function () {
        const isOpen = qrDrawer.classList.toggle("is-open");
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
    const fallback = document.getElementById("upi-fallback");

    const upiUrl = buildUpiDeepLink(config);

    // Detect Chrome on Android (Chromium requires intent:// URI syntax, Firefox uses upi://)
    const isAndroid = /android/i.test(navigator.userAgent);
    const isChrome =
      /chrome|crios/i.test(navigator.userAgent) &&
      !/firefox|fxios/i.test(navigator.userAgent);

    let payLink = upiUrl;
    let phonepeLink = upiUrl;
    let gpayLink = upiUrl;
    let paytmLink = upiUrl;

    if (config.upiId) {
      const encName = encodeURIComponent(
        config.upiPayeeName || config.businessName
      ).replace(/\+/g, "%20");
      let baseParams = `pa=${config.upiId}&pn=${encName}`;
      if (config.upiAmount != null && config.upiAmount !== "") {
        baseParams += `&am=${config.upiAmount}&cu=INR`;
      }

      if (isAndroid && isChrome) {
        payLink = `intent://pay?${baseParams}#Intent;scheme=upi;end;`;
        phonepeLink = `intent://pay?${baseParams}#Intent;scheme=upi;package=com.phonepe.app;end;`;
        gpayLink = `intent://pay?${baseParams}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end;`;
        paytmLink = `intent://pay?${baseParams}#Intent;scheme=upi;package=net.one97.paytm;end;`;
      } else {
        const rawUpi = `upi://pay?${baseParams}`;
        payLink = rawUpi;
        phonepeLink = rawUpi;
        gpayLink = rawUpi;
        paytmLink = rawUpi;
      }

      if (appPhonePe) appPhonePe.setAttribute("href", phonepeLink);
      if (appGPay) appGPay.setAttribute("href", gpayLink);
      if (appPaytm) appPaytm.setAttribute("href", paytmLink);
    }

    // Primary Pay Anchor Link
    if (payBtn) {
      if (isPlaceholder(config.upiId) || isPlaceholder(config.upiPayeeName)) {
        payBtn.addEventListener("click", function (e) {
          e.preventDefault();
          alert(
            "UPI is not configured yet. Open config.js and set upiId and upiPayeeName."
          );
        });
      } else {
        payBtn.setAttribute("href", payLink);
      }
    }

    // Review Link
    if (reviewBtn) {
      if (isPlaceholder(config.googleReviewUrl)) {
        reviewBtn.addEventListener("click", function (e) {
          e.preventDefault();
          alert(
            "Google Review link is not configured yet. Open config.js and set googleReviewUrl."
          );
        });
      } else {
        reviewBtn.setAttribute("href", config.googleReviewUrl);
      }
    }

    // Copy UPI ID button
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

  function init() {
    applyTheme(config.colors || {});

    setText("business-name", config.businessName);
    setText("badge-text", config.badgeText || "✦ Luxury Salon & Aesthetics ✦");
    setText("tagline", config.tagline);
    setText("merchant-name", config.upiPayeeName || config.businessName);
    setText("footer-message", config.footerMessage);
    setText("upi-id-display", config.upiId);

    const payLabel = document.getElementById("pay-label");
    const reviewLabel = document.getElementById("review-label");
    const payIcon = document.getElementById("pay-icon");
    const reviewIcon = document.getElementById("review-icon");

    if (payIcon && config.payButtonIcon) payIcon.textContent = config.payButtonIcon;
    if (reviewIcon && config.reviewButtonIcon) reviewIcon.textContent = config.reviewButtonIcon;
    if (payLabel) payLabel.textContent = config.payButtonText || "PAY VIA ANY UPI APP";
    if (reviewLabel) reviewLabel.textContent = config.reviewButtonText || "WRITE A GOOGLE REVIEW";

    document.title = (config.businessName || "Salon") + " — Pay & Review";

    initLogo();
    initLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
