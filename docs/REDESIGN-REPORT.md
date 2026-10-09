# Redesign delivery

## Scope

Inspected the original frontend, its 67 HTML routes, inline scripts, shared scripts, authentication storage, page headings, forms and image references before rewriting. The inventory is preserved in `original-route-audit.json`.

Rebuilt 95 routes with one shared header/footer and design system. Both homepages, all original service and creative-service routes, About, Contact, Pricing, How It Works, material/app libraries and details, authentication, account pages, journal pages and utility routes are included. Original service URLs retain their original subject; the industrial manufacturing URL now explains low-volume production.

Added 21 generated illustrative manufacturing photographs and optimized the usable image library into two WebP sizes. Replaced the original Bootstrap/GSAP/Chart dependencies and duplicated scripts with native HTML, CSS and JavaScript. Native disclosure controls support touch and keyboard navigation; reduced-motion preferences are respected. Removed seven obsolete CSS/JS files after removing every reference to them.

## Validation

- Build: 95 pages generated, local references checked, public site packaged into `dist/`.
- Static checks: 6,620 local references, 371 image uses, retained original routes, one H1 per page, meaningful image alt attributes and valid local anchors.
- Browser checks: all 95 routes at 320, 375, 425, 768, 1024, 1280 and 1440px; 665 layout checks without horizontal overflow.
- Ten workflow tests: guest redirects, registration validation, login/logout, password hashing, file validation, process/material compatibility, file save/download, quote/order persistence, profile persistence, favourites, filtering, calculator breakdown/limits, mobile/keyboard navigation and mocked contact responses.
- Accessibility: axe WCAG A/AA checks on 12 representative public layouts; final scan has zero reported violations. Automated checks do not replace assistive-technology user testing.
- Screenshots: every route captured, with additional fully scrolled desktop/mobile reviews of principal page types. Contrast and image sizing issues discovered during review were fixed.

The concurrent image stress check exceeded the local development server’s loading timeout on five pages. Those pages were checked again sequentially with all images loaded and passed; the final QA report records the completed checks. The regular test runner now uses one worker for this local server.

Machine-readable evidence: `link-check.json`, `qa-results.json`, `accessibility-results.json`, `visual-review.json`. Local screenshots are in `docs/screenshots/` and intentionally excluded from Git.

## Business details still needing real data

The frontend is complete as a static, locally functional demo. Real authentication, cloud file storage, reviewed quotes, production tracking, administrative operations and payments need backend integrations. The original contact endpoint is retained, but delivery must be verified by its owner. Actual business address, phone, opening hours, approved rate card, customer identities, certifications and facility photography were not available in the repository and have not been invented.

No deployment, external message, payment or manufacturing order was performed.
