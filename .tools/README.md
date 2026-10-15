# Tintek Roofing & Cladding — Home Page Redesign

A conversion-focused redesign of the [tintek.com.au](https://tintek.com.au) home page. Single static `index.html` — no build step, no dependencies.

## View locally

Just open `index.html` in any browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## What's in here

- `index.html` — the full redesigned home page
- `images/` — assets scraped from the existing live site (logo, service photos, gallery, process icons, partner logos)

## Brand

- Colours: `#095998`, `#224484`, `#0B2E60` (kept from existing site)
- Fonts: Arimo (body) + Poppins (headings)
- Accent: `#f59e0b` (amber) for primary CTAs

## Sections

1. Top contact bar
2. Sticky nav with dropdowns + click-to-call + Free Quote CTA
3. Hero with overlay, trust tag, dual CTA, 4 glassmorphism stat cards
4. Benefits strip (overlapping hero)
5. Services grid (8 services, hover-reveal)
6. Why Choose Tintek (5 numbered cards)
7. About split layout with "10+ yrs" badge
8. Expertise — Residential / Commercial / Industrial (dark section)
9. 8-step process
10. Gallery (bento grid)
11. Customer reviews (dual marquee, real Google reviews)
12. Urgency CTA banner
13. **Multi-step quote wizard** (4 steps + success)
14. Partner logos strip
15. Service areas tag cloud
16. Footer + sticky mobile CTA bar

Built by [Rankify](https://rankify.com.au).
