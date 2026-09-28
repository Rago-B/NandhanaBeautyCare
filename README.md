# QR Business Landing Page

Mobile-first landing page for QR codes: **Pay Now** (direct UPI deep link) and **Give a Review** (Google Review URL). No payment gateway, database, or customer login.

## Quick setup

1. Open **`config.js`** — this is the only file you need to edit for each client.
2. Host the folder on any static host (GitHub Pages, Netlify, Cloudflare Pages, your web server).
3. Generate a QR code that points to your hosted **`index.html`** URL.

---

## 1. Where to enter the UPI ID

In **`config.js`**, find the UPI section:

```javascript
// ENTER CLIENT UPI ID HERE (e.g. "shopname@paytm", "9876543210@ybl")
upiId: "YOUR_UPI_ID",

// Name shown in the customer's UPI app when paying
upiPayeeName: "YOUR_BUSINESS_NAME",
```

Replace `YOUR_UPI_ID` with the business VPA (e.g. `cafe@okaxis`).  
Replace `YOUR_BUSINESS_NAME` in `upiPayeeName` with the payee name shown in UPI apps (can match `businessName`).

Optional fixed amount:

```javascript
upiAmount: 500,  // INR; use null to let the customer enter the amount
```

The Pay button builds a link like:

`upi://pay?pa=...&pn=...`

via `buildUpiDeepLink()` in the same file.

---

## 2. Where to enter the Google Review URL

In **`config.js`**:

```javascript
// ENTER CLIENT GOOGLE REVIEW URL HERE
googleReviewUrl: "YOUR_GOOGLE_REVIEW_LINK",
```

Replace with the business **Write a review** link from Google Maps:

1. Open [Google Maps](https://maps.google.com) and search for the business.
2. Select the listing 뿯↽ **Write a review** (or Share 뿯↽ copy link that opens reviews).
3. Paste the full HTTPS URL into `googleReviewUrl`.

The Review button opens this URL in a new tab with `noopener,noreferrer`.

---

## 3. How to test Pay Now on Android

1. Deploy the site to HTTPS (or use a tunnel such as ngrok) — UPI deep links work best from a real URL on the device.
2. On your Android phone, open Chrome and go to your landing page URL (or scan a test QR that points to it).
3. Tap **Pay Now**.
4. Android should show an app chooser (Google Pay, PhonePe, Paytm, etc.) or open your default UPI app.
5. Confirm payee name and UPI ID match what you set in `config.js`.

**Tips**

- Test on the same network as production; avoid placeholders (`YOUR_UPI_ID`) — the page will alert if they are still set.
- If nothing opens, ensure `upiId` is a valid VPA and you are not testing only on desktop (desktop may not have a UPI handler).
- iPhone: UPI apps are less universal; many Indian UPI apps are Android-first. Test on the client’s primary audience devices.

**Local quick test (same phone)**

- Serve files: `npx serve .` in this folder, use your PC’s LAN IP on phone, or upload to staging.

---

## 4. How to generate the QR code for this landing page

1. **Publish** the site and copy the public URL, e.g.  
   `https://yourdomain.com/` or `https://youruser.github.io/qr-business-landing/`
2. **Create a QR** that encodes that URL (not the UPI string — the QR should open this landing page).
3. Use any trusted generator:
   - [https://www.qr-code-generator.com/](https://www.qr-code-generator.com/)
   - Google Chrome: share menu 뿯↽ Create QR code (for the open tab)
   - Print shops / signage tools
4. **Print** the QR at a size scannable from your counter distance (often 3–5 cm minimum on print; test before bulk print).
5. Optional: add short text under the QR: “Scan to pay or review.”

---

## Other configuration (`config.js`)

| Field | Purpose |
|--------|---------|
| `businessName` | Heading on the page |
| `logoUrl` | Path/URL to logo image; empty = initials placeholder |
| `tagline`, `footerMessage`, `promptText` | Copy on the page |
| `payButtonText`, `reviewButtonText`, icons | Button labels |
| `colors` | Theme (background, pay/review button colors, etc.) |

## Project files

- `index.html` — structure and accessibility
- `styles.css` — mobile-first layout and animations
- `config.js` — **client settings**
- `app.js` — applies config, UPI navigation, review link

## License

Use freely for client projects.
