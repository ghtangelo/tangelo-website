# Tangelo Leads — Website Project

## Business brief
- **Business:** Tangelo Leads (legal entity: Horizon Solar Group LLC, dba Tangelo Leads; also dba Solarfig), a lead provider for home-services contractors
- **Tagline:** "Freshly picked, ready to close."
- **Owner:** Jon Cho
- **Customers:** solar, roofing, bath, and windows contractors, nationwide (Bath replaced HVAC per Jon)
- **Offer:** lead packages (public copy must NOT mention lead counts per package; do NOT advertise shared/exclusive status on the site, per Jon)
- **Delivery:** webhook to buyer's CRM, Excel, or email
- **Payment:** handled on the sales call / in the insertion order. The public site does not talk about paying upfront (Jon removed the payment FAQ).
- **Pricing:** NOT shown publicly. Visitors request pricing via the form, and a call follows.
- **Tone:** confident, friendly, professional, colorful; the brand "tangelo" is based on a fruit.
- **Never:** claim leads are exclusive; promise guaranteed results; copy competitor text, logos, or images.

## Workflow rules
- Work in phases and STOP at checkpoints for Jon's approval. Do not make design changes Jon did not ask for; when a change has side effects, say so first.
- Do not push/publish anything. Jon commits and pushes from GitHub Desktop.
- Jon reviews in a local preview (see Dev notes). Be honest about what was and was not verified.

## Contact details (current)
- Footer contact: (949) 478-7609, info@tangeloleads.com, 4930 Campus Drive, Newport Beach, CA 92660
- Very fine print in the footer's bottom row (right side): "Mailing address for compliance: 2810 Jackson Ave PH3B, Long Island City, NY 11101"
- Emails: footer and legal pages use **info@**; the "Prefer to talk?" line under the form and the form's error message use **sales@**.
- Privacy Policy "Contact Us" block uses the NY address (Jon's choice); Terms of Use contact block and the footer use Newport Beach. Jon was asked whether to align the Terms; not yet decided.

## Assets
- **Logo (current):** `assets/logo_color_new_transparent.png` ("Tangelo" wordmark, deeper orange `#F3741F`) -> `public/img/logo.png` (800px wide). Displayed at 156x50 (header) and 175x56 (footer); keep those sizes.
- **Favicon/icons:** built from `assets/icon_color_transparent.png` (the older, brighter-orange icon). Jon looked at a newer one and chose to keep this one. Files: `public/favicon.png`, `public/img/apple-touch-icon.png`, `public/img/favicon-512.png`.
- **Share image:** `public/img/og-image.png` (1200x630) made from `assets/logo_color_new.jpg`.
- **Hero photo:** `public/img/hero.jpg` (sunset aerial, Jon confirmed he has a license), shown behind a dark neutral overlay at position `center 30%`. It is slightly soft on high-resolution screens; Jon accepted that. A larger original would sharpen it.
- Colors: button/accent orange `#FF7E13` (hover `#FF9F07`); logo wordmark `#F3741F`; leaf green `#1BA43D`; navy `#12263F`. Navy text on the orange buttons is about 6.0:1. White text on orange fails AA, so buttons use navy text. Small orange labels on light backgrounds use burnt orange `#B84C00` (`--orange-text`), including the FAQ "+" and the footer icons; Jon chose this.
- Dark sections use the amber accent `#FFB627` for labels, card stripes, hero eyebrow and links under the form. Jon chose it over plain orange. Do not change it.
- Original sources are in `assets/` (not committed to GitHub; `assets/` and `theme-previews/` are git-ignored).

## Site (single page, `public/index.html`; static, no build step; deploy folder is `public/`)
Sections in order: sticky header (logo left; Verticals, How it works, Packages, Testimonials, FAQ; orange Request Pricing button; hamburger menu below 820px) -> Hero (photo, headline, one primary Request Pricing button; note line) -> Verticals (Solar, Roofing, Bath, Windows; cards overlap the hero) -> How it works (3 steps: request pricing, choose your package, leads delivered) -> Delivery options (webhook, Excel, email; dark band) -> Why Tangelo (speed, quality filtering, clear process) -> Packages (one "What every package includes" card; no counts, no prices; vertical chips; "Results vary... We cannot guarantee results.") -> Testimonials -> FAQ (8 questions) -> Contact form (dark band) -> Footer.
- **Testimonials:** currently VISIBLE with placeholders (1 large + 2 small video placeholders, 3 written-quote placeholders reading "REPLACE WITH A REAL CUSTOMER QUOTE", 3 text-message screenshot frames). Jon deferred real content to a later day. Replacement instructions are in HTML comments. To hide the section, add `hidden` to `<section id="testimonials">` and remove the nav link. DO NOT publish with the placeholders if avoidable.
- **FAQ questions:** what types of leads; how do I get started; can I choose where leads come from (targeting; narrower targeting can limit volume); what info comes with each lead; how delivered and how fast (usually within 36 hours); what if a lead isn't good; where do leads come from (publishers and advertisers); is there a long-term commitment (no long-term commitment, no monthly retainer, each order stands alone; insertion order + agreement). Wording avoids the word "commit" except the question and the "no long-term commitment" line.
- Copy that Jon edited: step 3 "...so your team can focus more on closing deals."; Quality filtering card "...so your team can spend more time on homeowners with a real project in mind."; package list item "Filtered to your criteria before delivery"; "Simple, transparent checkout process"; delivery band subtext "Choose a delivery method when you order."

## Contact form
- Fields: name, company, email, phone, vertical, service area, monthly lead volume (required), "Tell us about your goals (optional)", honeypot.
- Two OPTIONAL, UNCHECKED, NOT-required SMS consent boxes (transactional, marketing) with wording matched to Jon's A2P-approved Solarfig form (company name = Horizon Solar Group LLC dba Tangelo Leads), then "Review our Terms of Use and Privacy Policy." above the button. Do not make them required or pre-check them.
- Posts form-encoded fields (no-cors) to a GoHighLevel inbound webhook. Paste the real URL into `WEBHOOK_URL` at the top of `public/script.js`; paste the GHL calendar link into `BOOKING_URL` right below it (it feeds every `a.book-call` link; the Book a Call link under the form and the post-submit button). Both are still PLACEHOLDERS. Until the webhook is set, the form shows an error on any non-localhost site and a "Preview mode" success locally.
- GHL field names sent: full_name, first_name, last_name, company_name, email, phone, vertical, service_area, monthly_volume, message, sms_transactional_consent, sms_transactional_consent_text, sms_marketing_consent, sms_marketing_consent_text, consent_timestamp, source, page_url. GHL's webhook does not reply cross-site, so the page cannot detect a rejection (only network failures).
- Behavior: missing required fields -> fields marked red, message under the button, and a gentle smooth scroll to the FIRST missing field only if it is not already on screen. Success -> the form collapses into a "Thanks, we got your request!" panel with a Book a Call button; the navy section keeps its height (class `held`) so the page does not shrink; the panel scrolls smoothly to center. Jon prefers this over keeping the fields visible.

## Navigation and scrolling (in `public/script.js` and `public/styles.css`)
- Desktop nav links and the three Request Pricing buttons use `data-center`: sections center in the window; the real content (not the padding) is centered; taller-than-screen content gets the heading 24px under the header. How it works and Packages use `data-center-window` (centered on the whole window). Testimonials centers on the videos (`data-center-on=".vid-grid"`). The Request Pricing buttons land with the form section's top edge flush against the header (0px).
- Phones (<820px): menu links line the section heading 16px under the header; Request Pricing buttons land flush.
- The legal pages have the same full header and hamburger; their links go to `/#section` and the home page repositions the same way on arrival.
- Mobile menu closes on link tap, outside tap, Escape, and when widened to desktop.

## Footer
Logo with phone/email/address icon rows (icons burnt orange) under it; "Terms of Use" then "Privacy Policy" side by side on the right above the light divider; bottom row: "(c) year Tangelo Leads" left, compliance mailing address right in tiny 10px gray text. No hours listed.

## Legal pages (final language, Jon's A2P-approved text)
- `public/terms.html` = "Terms of Use": the Solarfig Terms name-swapped to Tangelo Leads, three solar-specific passages rewritten for lead generation, plus added business sections (Orders and Agreements, Payment, Delivery, Replacements and Refunds, Your Responsibilities; Compliance with Laws) and short additions to Limitation of Liability, Indemnification and Entire Agreement. The Communications Consent / Mobile Messaging Terms / Do-Not-Call block is byte-for-byte the approved text: do not edit it. Governing law: California. Effective Date: October 1, 2026.
- `public/privacy.html` = the Solarfig Privacy Policy name-swapped, business fields added to the Personal Information list, a "Your Choices" section added, Children's policy reworded for a business site. The three "no mobile information / text-messaging opt-in data will not be shared" lines are verbatim and must not be edited.
- No placeholder banners or brackets remain. An attorney has NOT reviewed them (Jon went with language already cleared by A2P and by a LeadConnector contact). Items worth an attorney's eye: the "may use Google Analytics / Flash cookies / credit card / 128-bit encryption" statements that do not describe this site today; consumer (homeowner) lead data is not described and was intentionally not added because sharing consumer mobile numbers could conflict with the "no mobile information shared" line.
- Footer and form link label is "Terms of Use" (page file is `terms.html`).

## Cache-busting
Stylesheet and script links carry a version tag (currently `?v=20261001d`) in index.html, privacy.html and terms.html. Bump it whenever CSS/JS changes so visitors and the preview do not show stale files.

## Dev notes
- Local preview: `ruby -run -e httpd /Users/jonathancho/Desktop/Tangelo/tangelo-website/public -p 8123` (use the ABSOLUTE path; a relative path stopped working after a session restart and every request returned 500). Then open http://localhost:8123/.
- No node/python/ImageMagick on this machine; `sips` handles images; `ruby` is available (use `-Eutf-8` when reading files with special characters).
- When testing scroll behavior in the preview pane, the tab must be in front, or its smooth-scroll animation pauses.
- Repo: https://github.com/ghtangelo/tangelo-website (private). Hosting: Vercel, auto-deploys when Jon pushes from GitHub Desktop (`vercel.json` points at `public/`). As of 2026-10-01 only the first commit is pushed; all later work is uncommitted/unpublished.

## Open items before launch
1. Paste the GHL webhook URL (`WEBHOOK_URL`) and calendar link (`BOOKING_URL`) in `public/script.js`.
2. Testimonials: replace placeholders with real content or hide the section (A2P reviewers will see the live site).
3. Decide whether the Terms of Use contact address should match the Privacy Policy (NY).
4. Optional attorney review of the legal pages.
5. Jon commits and pushes in GitHub Desktop; check on a real phone and a large monitor first.

## Copy guardrails
- Do not mention shared or exclusive anywhere in public marketing copy. Never claim leads are exclusive.
- No guarantees of results, revenue, or close rates.
- No prices anywhere on the public site; no lead counts per package.
- Original copy and imagery only.
