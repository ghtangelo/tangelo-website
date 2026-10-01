/* ============================================================
   >>> PASTE YOUR REAL WEBHOOK URL BETWEEN THE QUOTES BELOW <<<
   The contact form POSTs JSON to this URL (e.g. a Zapier, Make,
   or Google Apps Script webhook).
   ============================================================ */
const WEBHOOK_URL = "PASTE_YOUR_WEBHOOK_URL_HERE";

(function () {
  "use strict";
  var form = document.getElementById("pricing-form");
  var statusEl = document.getElementById("form-status");
  var btn = document.getElementById("submit-btn");
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
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

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstBad = null;
    fields.forEach(function (f) { if (!showError(f) && !firstBad) firstBad = f; });
    if (firstBad) { firstBad.focus(); setStatus("bad", "Please fix the highlighted fields and try again."); return; }

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = typeof v === "string" ? v.trim() : v; });
    if (data.website) return; // honeypot filled: bot
    delete data.website;
    data.submitted_at = new Date().toISOString();
    data.source = "tangeloleads.com";
    data.page = location.href;

    btn.disabled = true; btn.textContent = "Sending…"; statusEl.hidden = true;

    function done() {
      form.reset();
      fields.forEach(function (f) { f.removeAttribute("aria-invalid"); });
      setStatus("ok", "Thanks! We got your request and will reach out shortly to help you find the right package.");
    }
    function fail() {
      setStatus("bad", "Something went wrong sending your request. Please email jon@tangeloleads.com and we'll help right away.");
    }
    function reset() { btn.disabled = false; btn.textContent = "Request Pricing"; }

    if (notConfigured) {
      if (isLocal) { // preview only: never fakes success on a live site
        console.info("[Tangelo] Webhook URL not set. Payload that would be sent:", data);
        setTimeout(function () { done(); statusEl.textContent += " (Preview mode: webhook not configured, nothing was sent.)"; reset(); }, 400);
      } else { fail(); reset(); }
      return;
    }

    fetch(WEBHOOK_URL, {
      method: "POST",
      // text/plain avoids a CORS preflight, so simple webhooks (Zapier, Make, Apps Script) accept it
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(data)
    }).then(function (r) { if (!r.ok && r.type !== "opaque") throw new Error(r.status); done(); })
      .catch(function (err) { console.warn("Form submit failed", err); fail(); })
      .then(reset);
  });
})();

/* Links marked data-center scroll so the target sits in the middle of the window
   (instead of at the top under the sticky header). */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("a[data-center]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      var nav = document.querySelector(".nav");
      var navH = nav ? nav.offsetHeight : 0;
      var rect = target.getBoundingClientRect();
      var room = window.innerHeight - navH;
      // center in the space below the header; if the section is taller than that, align its top instead
      var offset = rect.height < room ? (room - rect.height) / 2 : 0;
      var top = window.pageYOffset + rect.top - navH - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
      if (history.pushState) history.pushState(null, "", link.getAttribute("href"));
    });
  });
})();
