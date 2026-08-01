# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Institutional one-page site for Igor Soares, a Brazilian labor-law attorney ("Direito do Trabalho"). Domain: `igorsoares.adv.br`. Positioned as a premium portfolio piece — the goal is WhatsApp contact conversion, not lead-form capture.

The full product brief — market diagnosis, reference-site teardown, visual/brand concept, section-by-section wireframes, SEO strategy, conversion strategy, folder structure, and phased roadmap — lives in `docs/00-arquitetura-e-estrategia.md`. Read it before making structural or copy decisions; it also lists real data still pending from the client (OAB number, years of practice, address suite number, testimonials, tagline, article topics) that must not be faked with placeholders.

## Status

Fase 1 (estrutura visual completa da Home) is done — `index.html` has all 11 sections built and manually QA'd in a browser. See `docs/01-status-projeto.md` for the full checkpoint (what works, what's placeholder, what's next) before resuming work. Do not re-derive this from git history — there is no git repo initialized yet.

## Stack

Vanilla HTML5/CSS3/JS only — no Bootstrap, Tailwind, jQuery, or build tooling. No bundler: every CSS/JS file is linked individually in `index.html`'s `<head>`/before `</body>` in cascade order (base → components → sections for CSS) rather than using `@import`, to avoid the render-blocking waterfall `@import` causes. Fonts loaded from Google Fonts CDN (Cormorant Garamond for headings, Inter for body/UI) with `preconnect` + `display=swap`.

## Structure

```
index.html
css/base/ (reset, design-token variables, typography)
css/components/ (header, button, card, faq-accordion, whatsapp-float, footer)
css/sections/ (one file per page section)
css/main.css (canvas/presentation shell + global layout utilities — loaded after base, before components)
js/components/ (header-scroll, faq-accordion, reveal-on-scroll, whatsapp-links, smooth-scroll — each a self-invoking IIFE, auto-init on load)
js/main.js (empty orchestration placeholder — components are self-initializing; kept as the single script the HTML "ends" on)
assets/images/, assets/favicon/
docs/ (strategy + status docs — see below)
sitemap.xml, robots.txt, site.webmanifest
```

Section order (one-page, anchor-nav): Header/Nav → Hero → Sobre → Diferenciais → Áreas de Atuação (`#atuacao`) → Como Funciona → FAQ → Artigos → Contato → Mapa → Footer, plus a persistent floating WhatsApp CTA. Full wireframes are in `docs/00-arquitetura-e-estrategia.md`.

## Key architectural decisions

**Presentation canvas.** Above 1024px viewport width, the whole site renders inside a white "artboard" (`.site-canvas` in `css/main.css`) centered over a gray backdrop (`--color-gray-canvas: #e9e9e9`), max-width `--canvas-max: 1600px`, with a soft drop shadow — simulating a Figma/XD presentation frame for design review. Below 1024px the canvas styling drops entirely and the site is edge-to-edge (real production behavior on actual devices). The header uses `position: sticky` (not `fixed`) specifically so it respects the canvas's width instead of the full viewport. The floating WhatsApp button uses `position: fixed` with `right: max(20px, calc((100vw - var(--canvas-max)) / 2 + 28px))` so it anchors to the canvas's right edge on large monitors instead of drifting into the gray gutter.

**WhatsApp link system.** One phone number lives in a single place: `data-whatsapp="..."` on `<body>` in `index.html`. Every CTA is an `<a class="js-whatsapp" href="#" data-wa-message="...">`; `js/components/whatsapp-links.js` rewrites `href` to a `wa.me` deep link with a URL-encoded, per-button contextual message on page load. To change the real number, edit the one `data-whatsapp` attribute — never hardcode `wa.me/...` in markup.

**No-JS-safe reveal animations.** `.reveal` elements (fade-in-on-scroll) render fully visible by default. The hidden/animated state only applies under a `.js` class on `<html>`, flipped from `.no-js` by a tiny inline `<script>` at the very top of `<head>` (classic no-js/js progressive-enhancement pattern). This matters: don't add `opacity: 0` as the bare default for any `.reveal`-style rule, or above-the-fold content becomes permanently invisible if JS fails/is slow to load. `reveal-on-scroll.js` also force-reveals everything after a 2.5s timeout as a last-resort safety net.

**No internal pages.** This is strictly one-page — the "Artigos" section is a teaser grid (title + summary + an "Em breve" pill), not linked cards, because there are no article pages to send visitors to yet. Don't wire `<a href>` navigation out of that section until real article pages exist.

**Map section.** Not a bare iframe. `#mapa` composes a keyless Google Maps embed (`https://maps.google.com/maps?q=...&output=embed`, grayscale by default, full color on hover/focus) with an overlapping white card (address, hours, "Como chegar" directions link, WhatsApp CTA) — see `css/sections/mapa.css` for the overlap technique (negative margin pulling the card over the map edge on desktop).

**Image placeholders.** No real photography yet. `.media-frame` (in `css/components/card.css`) renders an intentional-looking placeholder — soft gradient, serif "IS" monogram, thin gold corner accent — instead of a broken `<img>` or a generic gray box. Swap these for real photography by replacing the `.media-frame` div's contents with an `<img>`, not by restyling the placeholder.

**Testing note.** The Chrome extension used for browser QA cannot load `file://` URLs (blocked as "unparseable"). Serve the project over local HTTP to test in-browser, e.g. `npx http-server -p 8080 -c-1 .`, then navigate to `http://localhost:8080/index.html`.

## Conventions

- No fabricated stats or placeholder credibility numbers (e.g. "0+ years") — omit a metric entirely rather than inventing one. This is the single biggest flaw identified in the reference site (`docs/00-arquitetura-e-estrategia.md` §2) — do not repeat it.
- No result-guarantee language in copy ("garantimos", "certeza de vitória") — tone is calm/direct, never alarmist.
- WhatsApp is the primary conversion path; don't introduce lead-capture forms as the main CTA.
- No stock legal iconography (hammers, Greek columns, oversized scales). Icons are hand-drawn minimal line SVGs (stroke-based, 24×24 viewBox) inlined directly in `index.html`.
- Any text marked `<!-- TODO: ... -->` or an obviously placeholder value (e.g. phone `(21) 00000-0000`, OAB `000.000`) is real-data-pending, not a mistake — see `docs/01-status-projeto.md` for the full list before replacing it with guessed values.
