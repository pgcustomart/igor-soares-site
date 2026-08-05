# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Institutional one-page site for Igor Soares, a Brazilian labor-law attorney ("Direito do Trabalho"). Domain: `igorsoares.adv.br`. Positioned as a premium portfolio piece — the goal is WhatsApp contact conversion, not lead-form capture.

The full product brief — market diagnosis, reference-site teardown, visual/brand concept, section-by-section wireframes, SEO strategy, conversion strategy, folder structure, and phased roadmap — lives in `docs/00-arquitetura-e-estrategia.md`. Read it before making structural or copy decisions.

## Status

Fase 1 (static Home + article pages, hand-built) is done and has since been superseded by Fase 2: the site is now database-driven with a custom admin panel (no WordPress/CMS — a purpose-built Node/Express + React system). See `docs/01-status-projeto.md` for the checkpoint history and `docs/03-painel-administrativo.md` for the admin system's architecture before resuming work.

## Stack

Two layers, kept deliberately separate:

- **Public site (visual layer):** still vanilla HTML5/CSS3/JS — no Bootstrap, Tailwind, jQuery, or bundler for the CSS/JS itself. `css/` and `js/` are unchanged in spirit from Fase 1: every stylesheet/script is linked individually in cascade order (base → components → sections), no `@import`. The only difference is the HTML around them is no longer static — it's rendered server-side per request from the database (see below), using the *exact same* markup, classes and asset paths the static files used.
- **Backend + admin (new in Fase 2):** Node.js + Express in `server/`, PostgreSQL (hosted on Railway) via Prisma, EJS for server-side rendering of the public pages, and a React + Vite single-page app in `admin-app/` for the admin panel (built and served at `/admin` by the same Express app). This is the one place in the repo with a build step and framework dependencies — it's isolated from the public site's vanilla stack on purpose, see `docs/03-painel-administrativo.md`.

Fonts loaded from Google Fonts CDN (Cormorant Garamond for headings, Inter for body/UI) with `preconnect` + `display=swap` — unchanged.

## Structure

```
css/base/, css/components/, css/sections/, css/pages/, css/main.css   (unchanged design system — see "Key architectural decisions")
js/components/  (header-scroll, faq-accordion, reveal-on-scroll, whatsapp-links, smooth-scroll — unchanged, still self-invoking IIFEs)
js/main.js
assets/images/, assets/favicon/
docs/  (strategy + status docs, including docs/03-painel-administrativo.md)

server/                    — Express app: API + SSR public site + admin static host
  prisma/schema.prisma      — DB schema (articles, FAQs, images, site settings, heroes, SEO, users)
  prisma/migrations/
  scripts/migrate-static-content.js  — one-time importer that seeded the DB from the original static HTML (kept for reference/reruns, not part of normal dev flow)
  src/app.js                — mounts static assets, /api/*, /admin (SPA), and the public SSR routes
  src/routes/, services/    — REST API (auth, articles, images, site settings/heroes/SEO, dashboard)
  src/views/                — EJS templates (pages/home, pages/artigos-hub, pages/artigo + shared partials) that replace the old static index.html / artigos/*/index.html
  uploads/                  — admin-uploaded images (webp-converted), served at /uploads
  admin-dist/                — built admin SPA output (generated, gitignored)
  tests/smoke.test.js       — node:test smoke suite (public routes, auth, article CRUD lifecycle)

admin-app/                 — React + Vite source for the admin panel (builds into server/admin-dist)
  src/pages/                — Dashboard, Articles (list + editor), Images, HeroHome, HeroArtigos, Settings, Seo, Login
  src/components/           — Layout, RichTextEditor (Tiptap), ImagePickerField/Modal
```

Section order on the Home (one-page, anchor-nav): Header/Nav → Hero → Sobre → Diferenciais → Áreas de Atuação (`#atuacao`) → Como Funciona → FAQ → Artigos → Contato → Mapa → Footer, plus a persistent floating WhatsApp CTA. Full wireframes are in `docs/00-arquitetura-e-estrategia.md`.

## What's editable from the admin panel vs. hardcoded in templates

Only what the client actually needs to change without a code deploy is DB-driven. Everything else (Sobre, Diferenciais, Áreas de Atuação, Como Funciona, FAQ on the Home) stays hardcoded in `server/src/views/pages/home.ejs`, matching the original static copy exactly — don't wire these to the database without a real product reason, and don't add new visible UI to the public pages to "use" a settings field (e.g. Instagram/LinkedIn URLs feed `sameAs` in JSON-LD only, since the current design has no visible social icons).

Admin-editable: articles (full content + SEO + FAQ + related + cover image), Home hero, Artigos hero, site settings (phone/WhatsApp/email/address/hours/maps/socials/OAB), SEO (Home + Artigos hub defaults), and the image library.

## Key architectural decisions

**Presentation canvas.** Above 1024px viewport width, the whole site renders inside a white "artboard" (`.site-canvas` in `css/main.css`) centered over a gray backdrop (`--color-gray-canvas: #e9e9e9`), max-width `--canvas-max: 1600px`, with a soft drop shadow — simulating a Figma/XD presentation frame for design review. Below 1024px the canvas styling drops entirely and the site is edge-to-edge (real production behavior on actual devices). The header uses `position: sticky` (not `fixed`) specifically so it respects the canvas's width instead of the full viewport. The floating WhatsApp button uses `position: fixed` with `right: max(20px, calc((100vw - var(--canvas-max)) / 2 + 28px))` so it anchors to the canvas's right edge on large monitors instead of drifting into the gray gutter.

**WhatsApp link system.** The phone number lives in the database (`SiteSettings.whatsapp`, editable at `/admin` → Configurações) and is injected server-side into `data-whatsapp="..."` on `<body>` by every EJS page template. Every CTA is still an `<a class="js-whatsapp" href="#" data-wa-message="...">`; `js/components/whatsapp-links.js` (unchanged) rewrites `href` to a `wa.me` deep link with a URL-encoded, per-button contextual message on page load. Never hardcode `wa.me/...` in a template — always the `js-whatsapp` + `data-wa-message` pattern.

**No-JS-safe reveal animations.** `.reveal` elements (fade-in-on-scroll) render fully visible by default. The hidden/animated state only applies under a `.js` class on `<html>`, flipped from `.no-js` by a tiny inline `<script>` at the very top of `<head>` (classic no-js/js progressive-enhancement pattern). This matters: don't add `opacity: 0` as the bare default for any `.reveal`-style rule, or above-the-fold content becomes permanently invisible if JS fails/is slow to load. `reveal-on-scroll.js` also force-reveals everything after a 2.5s timeout as a last-resort safety net.

**Articles are real pages now, DB-driven.** `server/src/views/pages/artigo.ejs` renders `/artigos/:slug/` from the `Article` table (Prisma) — title, excerpt, cover image, body HTML (authored via the Tiptap editor in `/admin`), FAQ, CTA, SEO fields, JSON-LD, and related articles. The article body is trusted HTML written through the admin's rich-text editor (not raw user input from the public site), rendered unescaped (`<%- article.bodyHtml %>`) intentionally.

**Map section.** Not a bare iframe. `#mapa` composes a keyless Google Maps embed (URL from `SiteSettings.googleMapsUrl`, grayscale by default, full color on hover/focus) with an overlapping white card (address, hours, "Como chegar" directions link, WhatsApp CTA) — see `css/sections/mapa.css` for the overlap technique (negative margin pulling the card over the map edge on desktop).

**Testing note.** For the public site, boot the server (`cd server && npm run dev`, needs `server/.env` with `DATABASE_URL`) and browse `http://localhost:8080/` — this replaces the old `http-server` static-file workflow. The admin panel's dev server (`cd admin-app && npm run dev`) proxies `/api` and `/uploads` to `localhost:8080`.

## Conventions

- No fabricated stats or placeholder credibility numbers (e.g. "0+ years") — omit a metric entirely rather than inventing one.
- No result-guarantee language in copy ("garantimos", "certeza de vitória") — tone is calm/direct, never alarmist.
- WhatsApp is the primary conversion path; don't introduce lead-capture forms as the main CTA.
- No stock legal iconography (hammers, Greek columns, oversized scales). Icons are hand-drawn minimal line SVGs (stroke-based, 24×24 viewBox) inlined directly in the EJS templates.
- The admin panel must never expose structural HTML/CSS/JS/layout editing to the client — only content fields (see "What's editable" above). Don't add a "custom HTML" or "custom CSS" field to any admin form.
