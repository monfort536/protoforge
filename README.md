# ProtoForge Studio

A complete static-site redesign for professional 3D printing, prototyping and custom manufacturing. All 67 original HTML routes are retained; material details, application details, process pages and workspace sections bring the total to 95.

## Run locally

```sh
npm run dev
```

Open http://127.0.0.1:4173. The local server requires Node.js and uses only built-in modules; no dependency installation is needed. `npm start` and `npm run preview` start the same server.

You can also open `index.html` directly for a static preview. Assets and navigation use project-relative paths, including on dashboard pages. For account features and browser APIs that restrict `file://` origins, use the localhost URL above.

## Build and verify

```sh
npm run build
npm test
node scripts/accessibility.mjs
```

`npm run build` regenerates the pages, validates local links, images, anchors and retained routes, then packages only public files into `dist/`. Browser tests require the local server and an installed Google Chrome. `netlify.toml` configures the existing hosting provider to publish `dist/`. This change has not been deployed.

The build needs only the Python standard library. Image optimization is a separate, optional authoring step requiring Pillow; optimized assets are already included and do not need regeneration for deployment.

## Editing the site

- `scripts/build.py`: reusable layout functions and page composition.
- `scripts/catalog.py`: services, applications, materials and process content.
- `scripts/editorial.py`: page-specific service guidance and journal articles.
- `assets/css/site.css`: responsive design system, dark mode and RTL support.
- `assets/js/site.js`: navigation, forms, estimator and local workspace interactions.
- `assets/images/optimized/`: responsive WebP images at 480px and up to 1200px.

HTML files are generated. Edit the sources and run the build instead of editing an individual generated page.

## What works

Both homepages have distinct positioning. Service, application and material pages explain how, what and with what to manufacture. The site includes process guidance, a material comparison table, application filters, a process recommender, a price breakdown, an enquiry form and a location block.

The local workspace supports registration/sign-in/sign-out, guest redirects, profile editing, file selection and drag/drop, format/size validation, IndexedDB file storage, model download, quote drafts, demo-order conversion, project search/deletion and saved materials. Records are scoped to the local account ID. Legacy plaintext demo credentials are migrated to salted PBKDF2 hashes on successful sign-in; active session records do not include password hashes.

## Integration boundaries

This repository was a static demo without a backend. The redesign does not pretend to create production infrastructure:

- Authentication and dashboard protection are browser-side demo behaviour, not a security boundary. Production requires a server-backed identity provider and authorization.
- Files and quote drafts stay on the device. They are not transmitted to a print team. Clearing browser data removes them.
- The estimator uses clearly labelled example USD rates. It does not analyse CAD geometry. No real payment is collected and demo orders do not enter manufacturing.
- The original FormSubmit enquiry endpoint is preserved. Automated tests mock its responses; live delivery and recipient activation were not tested or asserted.
- Address, phone, timeline and fictional company marks are labelled demonstration content. Business hours and the actual facility location require confirmation. The map shows the postal region, not a verified facility.
- Original administrative routes are preserved as explanatory pages. Invented customer records and fake administrative actions were removed; no real admin service existed to preserve.
- Unverified testimonials, certifications, precision guarantees and social-profile links were removed. Illustrative photography is labelled rather than presented as a verified company facility.

See [redesign verification](docs/REDESIGN-REPORT.md) and [image provenance and prompts](docs/IMAGE-ASSETS.md).
