/* ============================================================
   >>> PASTE YOUR LINKS BETWEEN THE QUOTES BELOW <<<

   1) WEBHOOK_URL: your GoHighLevel "Inbound Webhook" URL. The contact form
      sends its fields here (as a standard form post), and a GHL workflow
      turns them into a contact.
   2) BOOKING_URL: your GoHighLevel calendar / booking link. Every
      "Book a call" link and the button shown after the form is submitted
      use this one address.
   ============================================================ */
const WEBHOOK_URL = "PASTE_YOUR_WEBHOOK_URL_HERE";
const BOOKING_URL = "PASTE_YOUR_GHL_CALENDAR_LINK_HERE";

(function () {
  "use strict";
  var form = document.getElementById("pricing-form");
  var statusEl = document.getElementById("form-status");
  var btn = document.getElementById("submit-btn");
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  // Point every "Book a call" link at the one booking address above
  if (BOOKING_URL.indexOf("PASTE_YOUR") !== 0) {
    document.querySelectorAll("a.book-call").forEach(function (a) { a.href = BOOKING_URL; });
  }
  if (!form) return;

  var isLocal = ["localhost", "127.0.0.1", "[::1]"].indexOf(location.hostname) !== -1;
  var notConfigured = WEBHOOK_URL.indexOf("PASTE_YOUR") === 0;

  var messages = {
    name: "Please enter your name.",
    company: "Please enter your company.",
    email: "Please enter a valid email address.",
    phone: "Please enter a phone number.",
    vertical: "Please choose a vertical.",
    area: "Please enter your service area.",
    volume: "Please choose a monthly lead volume."
  };

  function showError(field) {
    var p = form.querySelector('.err[data-for="' + field.id + '"]');
    var bad = !field.checkValidity() || (field.required && !field.value.trim());
    field.setAttribute("aria-invalid", bad ? "true" : "false");
    if (p) p.textContent = bad ? (messages[field.id] || "This field is required.") : "";
    return !bad;
  }

  var fields = Array.prototype.slice.call(form.querySelectorAll("[required]"));
  fields.forEach(function (f) {
    f.addEventListener("blur", function () { showError(f); });
    f.addEventListener("input", function () { if (f.getAttribute("aria-invalid") === "true") showError(f); });
  });

  function setStatus(kind, text) {
    statusEl.hidden = false;
    statusEl.className = "status " + kind;
    statusEl.textContent = text;
  }

  // Gentle error reveal: go to the FIRST (topmost) missing field. If it is already fully on screen, do not scroll at all; otherwise scroll smoothly just enough to show it.
  function revealProblem(bad) {
    var navEl = document.querySelector(".nav");
    var top = (navEl ? navEl.offsetHeight : 0) + 16;
    var vh = window.innerHeight;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var first = bad[0];
    var r = (first.closest("div") || first).getBoundingClientRect();
    if (r.top < top || r.bottom > vh - 16) {
      var delta = r.top < top ? r.top - top : r.bottom - (vh - 16);
      window.scrollBy({ top: delta, behavior: reduceMotion ? "auto" : "smooth" });
    }
    first.focus({ preventScroll: true });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = [];
    fields.forEach(function (f) { if (!showError(f)) bad.push(f); });
    if (bad.length) { revealProblem(bad); setStatus("bad", "Please fix the highlighted fields and try again."); return; }

    var raw = {};
    new FormData(form).forEach(function (v, k) { raw[k] = typeof v === "string" ? v.trim() : v; });
    if (raw.website) return; // honeypot filled: bot

    // Fields sent to GoHighLevel (map these in the workflow's Inbound Webhook trigger)
    var parts = (raw.name || "").split(/\s+/);
    var tx = form.querySelector("#sms_transactional");
    var mk = form.querySelector("#sms_marketing");
    function consentText(box) { var s = box && box.parentNode.querySelector("span"); return box && box.checked && s ? s.textContent.replace(/\s+/g, " ").trim() : ""; }
    var data = {
      full_name: raw.name,
      first_name: parts[0] || "",
      last_name: parts.slice(1).join(" "),
      company_name: raw.company,
      email: raw.email,
      phone: raw.phone,
      vertical: raw.vertical,
      service_area: raw.service_area,
      monthly_volume: raw.monthly_volume,
      message: raw.message || "",
      sms_transactional_consent: tx && tx.checked ? "yes" : "no",
      sms_transactional_consent_text: consentText(tx),
      sms_marketing_consent: mk && mk.checked ? "yes" : "no",
      sms_marketing_consent_text: consentText(mk),
      consent_timestamp: new Date().toISOString(),
      source: "tangeloleads.com",
      page_url: location.href
    };

    btn.disabled = true; btn.textContent = "Sending…"; statusEl.hidden = true;

    var success = document.getElementById("form-success");
    function done() {
      // Hold the navy section at its current height so the page does not shrink when the form collapses
      var contactSection = document.getElementById("contact");
      if (contactSection) { contactSection.style.minHeight = contactSection.offsetHeight + "px"; contactSection.classList.add("held"); }
      // Swap the form for the thank-you panel with the Book a Call button
      form.querySelectorAll(".form-grid, .form-foot, .fine").forEach(function (el) { el.hidden = true; });
      statusEl.hidden = true;
      if (success) {
        success.hidden = false;
        var h = success.querySelector("h3");
        if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    function fail() {
      setStatus("bad", "Something went wrong sending your request. Please email sales@tangeloleads.com and we'll help right away.");
    }
    function reset() { btn.disabled = false; btn.textContent = "Request Pricing"; }

    if (notConfigured) {
      if (isLocal) { // preview only: never fakes success on a live site
        console.info("[Tangelo] Webhook URL not set. Fields that would be sent:", data);
        setTimeout(function () { done(); if (success) { var n = document.createElement("p"); n.className = "fine"; n.textContent = "Preview mode: the webhook is not set up yet, so nothing was sent."; success.appendChild(n); } reset(); }, 400);
      } else { fail(); reset(); }
      return;
    }

    // Standard form post (no preflight). GoHighLevel's webhook does not answer cross-site
    // requests, so the reply can't be read; a network failure is still caught below.
    fetch(WEBHOOK_URL, { method: "POST", mode: "no-cors", body: new URLSearchParams(data) })
      .then(done)
      .catch(function (err) { console.warn("Form submit failed", err); fail(); })
      .then(reset);
  });
})();

/* Links marked data-center scroll so the target sits in the middle of the window
   (instead of at the top under the sticky header). The same positioning is used when
   the home page is opened with a #section in the address (for example from the
   Terms of Use or Privacy Policy pages), so arriving looks the same as clicking. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var phone = window.matchMedia("(max-width: 819px)");

  // Scroll to the section a nav link points at. smooth = animate (clicks) or jump (arriving on the page).
  function scrollToLink(link, smooth) {
    var target = document.querySelector(link.getAttribute("data-center-on") || link.getAttribute("href"));
    if (!target) return false;
    // Center the section's real content (inside its padding), not the padded box, so every section lines up the same way
    var isContact = link.getAttribute("href") === "#contact"; // the Request Pricing button keeps its original behavior
    if (!link.getAttribute("data-center-on") && !isContact) { target = target.querySelector(".wrap") || target; }
    var nav = document.querySelector(".nav");
    var navH = nav ? nav.offsetHeight : 0;
    var rect = target.getBoundingClientRect();
    var room = window.innerHeight - navH;
    // center in the space below the header; if the section is taller than that, align its top instead
    var gap = isContact ? 0 : 24; // breathing room under the header when the content is taller than the screen
    // data-center-window: center on the whole window (the header covers the top, so the usual centering looks a little low)
    var wanted = link.hasAttribute("data-center-window") ? (window.innerHeight - rect.height) / 2 - navH : (room - rect.height) / 2;
    var offset = wanted >= gap ? wanted : gap;
    var top = window.pageYOffset + rect.top - navH - offset;
    // Phones only: sections are taller than the screen.
    //  - Request Pricing buttons (#contact): line the section's top edge flush with the bottom of the header
    //  - menu links: line the section heading up just under the header (skips the empty top padding)
    if (phone.matches) {
      var section = document.querySelector(link.getAttribute("href")) || target;
      if (link.getAttribute("href") === "#contact") {
        top = window.pageYOffset + section.getBoundingClientRect().top - navH;
      } else {
        var head = section.querySelector(".sec-head") || section.querySelector(".card, .grid") || section;
        top = window.pageYOffset + head.getBoundingClientRect().top - navH - 16;
      }
    }
    window.scrollTo({ top: Math.max(0, top), behavior: smooth && !reduce ? "smooth" : "auto" });
    return true;
  }

  var links = document.querySelectorAll("a[data-center]");
  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (!document.querySelector(link.getAttribute("data-center-on") || link.getAttribute("href"))) return;
      e.preventDefault();
      scrollToLink(link, true);
      if (history.pushState) history.pushState(null, "", link.getAttribute("href"));
    });
  });

  // Arriving with a #section in the address: position it the same way (jump, no animation).
  // Runs once the page has loaded and again when fonts are ready, since both can change section heights.
  var hash = location.hash;
  if (hash && hash.length > 1 && links.length) {
    var arrival = null;
    links.forEach(function (l) { if (!arrival && l.getAttribute("href") === hash) arrival = l; });
    if (arrival) {
      var place = function () { scrollToLink(arrival, false); };
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      if (document.readyState === "complete") { place(); } else { window.addEventListener("load", place); }
      if (document.fonts && document.fonts.ready) { document.fonts.ready.then(place); }
    }
  }
})();

/* Mobile menu: open/close the hamburger menu */
(function () {
  "use strict";
  var nav = document.querySelector(".nav");
  var btn = document.querySelector(".menu-btn");
  if (!nav || !btn) return;
  function setOpen(open) {
    nav.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Menu");
  }
  btn.addEventListener("click", function () { setOpen(!nav.classList.contains("menu-open")); });
  nav.querySelectorAll("ul a, .brand, .wrap > .btn").forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setOpen(false); btn.focus(); } });
  document.addEventListener("click", function (e) { if (!nav.contains(e.target)) setOpen(false); });
  window.matchMedia("(min-width: 820px)").addEventListener("change", function (m) { if (m.matches) setOpen(false); });
})();
