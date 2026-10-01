# Tangelo Leads — Website Project

## Business brief
- **Business:** Tangelo Leads, a lead provider for home-services contractors
- **Tagline:** "Freshly picked, ready to close."
- **Owner:** Jon Cho, jon@tangeloleads.com
- **Customers:** solar, roofing, bath, and windows contractors, nationwide
- **Offer:** lead packages (public copy must NOT mention lead counts per package, per Jon; do NOT advertise shared/exclusive status on the site, per Jon 2026-09-28)
- **Delivery:** webhook to buyer's CRM, Excel, or email
- **Payment:** collected upfront before leads are purchased
- **Pricing:** NOT shown publicly. Visitors request pricing via the form.
- **Tone:** confident, friendly, professional, colorful; the brand "tangelo" is based on a fruit.
- **Never:** claim leads are exclusive; promise guaranteed results; copy competitor text, logos, or images.

## Workflow rules
- Work in phases and STOP at each checkpoint for Jon's approval.
- Phase 1: this file. Phase 2: theme ideas (checkpoint: Jon picks a theme). Phase 3: build the site (checkpoint: local preview link + feedback).

## Assets
- Logo (OFFICIAL, from Jon 2026-09-29): `assets/logo_full_color_transparent.png` ("Tangelo Leads" wordmark) is used on the site as `public/img/logo.png`; white version at `public/img/logo-white.png`; icon `assets/icon_color_transparent.png` is the favicon. The old "Primary Logo Concept.png" is superseded.
- Inspiration screenshots: `assets/inspiration/` (empty as of 2026-09-28).
- Official logo colors (sampled): orange `#FF7E13`, gold `#FF9F07`, leaf green `#1BA43D`. Site orange var is `#FF7E13` (hover `#FF9F07`); navy text on it is 6.0:1. White text on orange still fails AA.
- White text on `#F57522` fails WCAG AA (2.8:1). Use dark text on orange buttons, or darker orange (`#B84C00`) for orange text on light backgrounds.

## Phase 2: theme ideas
- Three theme directions: see `theme-previews/index.html` (opens comparison of all three).
- Chosen theme: Job Site Navy (see Decisions)

## Phase 3 spec: the site
A fast, modern, mobile-first one-page site that gets contractors to request pricing or book a call.

Sections:
1. Hero: logo, tagline, one-line value prop, "Request Pricing" button
2. Verticals: solar, roofing, bath (replaced HVAC per Jon), windows
3. How it works: 3 steps (request pricing → choose package & pay → leads delivered)
4. Delivery options: webhook, Excel, email
5. Why Tangelo: speed, quality filtering, clear upfront process
6. Packages: describe packages (verticals, delivery; no lead counts, no prices) with NO prices. "Request Pricing" button scrolls to the form.
7. FAQ: replacements/refunds, delivery speed, verticals served (payment removed, discussed on the call)
8. Contact form: name, company, email, phone, vertical (dropdown), service area, monthly lead volume (dropdown), message
9. Footer: logo, email, Privacy Policy, Terms of Service

Also:
- Privacy Policy and Terms of Service pages with placeholder text clearly marked "ATTORNEY REVIEW NEEDED"
- Form POSTs to a webhook URL; use a placeholder for now and tell Jon exactly where to paste the real URL
- Basic SEO: page title, meta description, favicon from the logo, social share preview
- Simple and easy to deploy on Vercel (static site, no build step preferred)
- Test before finishing: mobile and desktop, all buttons/links work, form validates required fields, no console errors
- Checkpoint: start a local preview, give the link, wait for feedback

## Decisions
- Theme: FINAL = original "Job Site Navy" (navy #12263F hero and bands, cool gray bg, orange buttons with navy text). Jon tried a deep-green variant and a mid-green variant and preferred navy on 2026-09-29; both were removed.
- Accent on dark navy sections (labels, card stripes, hero eyebrow, form links) is the amber yellow-orange `#FFB627`, chosen by Jon over plain orange on 2026-09-29. Do not change it.
- Logo in a left-aligned sticky nav bar.
- Hero has one primary CTA (Request Pricing); "Book a call" is a text link by the form. GHL calendar link is still a placeholder.
- Testimonials section is built but hidden in index.html (`hidden` attribute) until real ones exist.
- How It Works stays on the one page.

## Copy guardrails
- Do not mention shared or exclusive anywhere in public marketing copy (Jon's decision). Never claim leads are exclusive. Terms of Service (attorney-reviewed) is where lead-sharing terms belong.
- No guarantees of results, revenue, or close rates.
- No prices anywhere on the public site.
- Original copy and imagery only.

## Environment notes
- No node/python/ImageMagick on this machine at last check (macOS `sips` works for images). Prefer a no-build static site.
