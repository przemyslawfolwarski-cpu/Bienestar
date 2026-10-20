# Implementation and maintenance

The homepage is generated from `site_content.json`. `BUILD_SOURCE_OF_TRUTH.md` controls the approved layout; source references were delivered in `Bienestar_BUILD_FOR_WORK_NO_FONTS.zip`.

Run `npm run build`, then `npm run check`. Commit generated `public/index.html` together with source changes. Cloudflare Pages is configured to publish `public/` on pushes to `main`; its existing build command checks that `public/index.html` exists. No dependency installation, framework, server runtime or paid services are required. `npm run preview` serves the site on http://localhost:4173.

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
