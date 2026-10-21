# Implementation and maintenance

The homepage is generated from `site_content.json`. `BUILD_SOURCE_OF_TRUTH.md` controls the approved layout; source references were delivered in `Bienestar_BUILD_FOR_WORK_NO_FONTS.zip`.

Run `npm run build`, then `npm run check`. Cloudflare Pages runs `node scripts/build.mjs && node scripts/check.mjs` on pushes to `main` and publishes `public/` only if these checks pass. For new posts, commit `source/articles.json`; generated HTML and the shared footer do not need to be committed again. See `PUBLISHING.md` for the current workflow. No dependency installation, framework, server runtime or paid services are required. `npm run preview` serves the site on http://localhost:4173.

All text is Linux Libertine, self-hosted from the original OTF files in the CTAN libertine package: https://ctan.org/pkg/libertine . Font family metadata: Linux Libertine O. Source archive: https://mirrors.ctan.org/fonts/libertine.zip . License and GPL font exception are distributed beside the fonts. The supplied wordmark remains an image.

The portrait and QR PNG are byte-identical copies of the delivered assets. Their SHA-256 values are checked by `scripts/check.mjs`. CSS only scales/crops the portrait, with no filters, masks or retouching. The four comfort icons use CSS windows onto the original approved reference image, avoiding new or reinterpreted artwork. Text remains HTML in Linux Libertine.

The QR image links to the supplied vCard for download on the same phone. Its encoded UTF-8 payload was decoded and verified against that vCard. Neither QR nor vCard contains a street address.

`source/articles.json` is intentionally empty. Future entries may have `slug`, `title`, `paragraphs` (an array of plain strings), and `approved: true`. Only approved entries are generated as standalone static pages under `/articles/<slug>/`; no homepage listing, label, navigation or example is generated. Each future article and any visible section name/layout require approval before use. Remove the corresponding generated directory if an already published article is later withdrawn. No content-management service is connected.

Mobile adapts the same DOM order, stacking the portrait, reasons, offer and contact, and reducing the tile column counts. The original full portrait is shown on mobile. Desktop uses the approved left/right arrangement. Exact source text overrides typographic differences in the reference images (including punctuation and the account number).

## Approved follow-up corrections

The user approved a compact centered sticky wordmark with their name below, no navigation, and very faint pink/peach/mint edge light with a matching header. These follow-up instructions override the original header reference. The base paper color and Hero geometry remain unchanged. Only the wordmark uses CSS darken blending to avoid its baked-in light rectangle; portrait and QR are untouched.

Shared section/heading/item spacing replaces oversized pauses. Foundation and organization tiles use equal geometry. Offer dimensions stay unchanged; only the continuation subtitle moves up. The sole body-text correction is 4-letniego to czteroletniego in the last foundation tile. The supplied Linux Libertine OTF archive was verified against the installed regular font; its OFL license is included.


## Production correction, 2026-10-20

Approved correction reduces global typography, foundation/organization and comfort card height, brightens the neutral paper and restores edge pastel light. Offer cards retain their original typography and geometry. The remaining two 4-letniego occurrences become czteroletniego. Global scroll padding follows the explicit header height plus a 16px clearance. Original photo, QR, icons and all other content are unchanged.

## Background and domain follow-up

The neutral paper color #f6f2e6 is sampled from the light wall in the user's supplied photo. On desktop, pastel gradients are capped at 120px from each viewport edge; mobile retains its approved gradient geometry. The original portrait file is unchanged. The user requested disabling public pages.dev access only after their purchased custom domain is connected. No domain has been selected yet. Blog/news content remains deferred.

## Continuous wall background

The user approved recreating the fine speckles of the portrait wall without its unique cast shadow. A deterministic SVG contains only small, low-opacity wall speckles. Body and opaque sticky header share the same background definition. Pink and mint edge washes vary only horizontally, remain constant down the entire document, and fade completely within the capped edge width. No portrait pixels were changed. This replaces the earlier vertical radial gradients.

## Contact privacy update

The user explicitly approved replacing the original QR to remove their email. Current public HTML, source content, vCard and QR contain no email. The new deterministic SVG QR encodes the exact UTF-8 vCard bytes (name and phone only) with high error correction. Its center embeds the untouched original JPEG, proportionally scaled and clipped to the face. The rendered mobile QR was decoded and matched byte-for-byte to the vCard and the browser download. The old PNG is removed from the current published tree. Prior Git/deployment history is not rewritten.

The contact section centers the phone over the noninteractive QR. ZESKANUJ appears above a separate ZAPISZ KONTAKT download link with a small pointing-hand glyph from Linux Libertine.

## Contact opening limitation

The pointer is a separate, absolutely positioned SVG outside the anchor, so it cannot shift the centered label or act as a link. Its path is the existing Linux Libertine pointing-hand glyph. The link no longer has download; the vCard is served as text/vcard with Content-Disposition inline. This requests native handling without forcing download, but does not guarantee the same UI as a QR scanner. Android Chrome can still download a vCard; browsers do not provide universal direct contact creation. Android intent links are constrained to BROWSABLE activities; the AOSP contact editor does not advertise that category. Do not claim exact native equivalence based only on matching payloads.

## Popular mobile browser support

Approved mobile action: Kopiuj numer with Skopiowano feedback. The enhancement uses HTTPS Clipboard.writeText directly within the user tap, without user-agent sniffing or clipboard permission queries. Older/blocked environments try native copy via a selected readonly field, then select the visible phone and give a manual-copy instruction. It never downloads a contact or opens an external service. No-JS visitors retain the phone link and QR; the inactive copy button stays hidden. Controls are shown on small or touch screens; the approved desktop layout is retained. Target browsers include Chrome, Safari, Samsung Internet, Edge, Firefox, Opera and other standards-based browsers. Physical Safari/Android applications are not available in this test environment; do not claim native contact insertion or full device certification.
