# Downtown Chabad / CYP Cleveland - Chabadone page themes

## CYP Simchat Torah  (article 6284529)

Dark-and-gold restyle that matches the "Dancing with the Torah" banner.
Content is still edited in Chabadone as usual; nothing here hard-codes wording.

What it does
- Banner column widened from 750px to **1000px** (the image's native width), on a page background in the same near-black tone, bottom edge feathered into the page.
- Copy restyled: italic-serif opener, gold serif date/venue (replaces the editor's orange), PREGAME / POSTGAME as quiet cards, closing Chai Society line set off by a hairline.
- Blocks of text **fade and rise into view as you scroll**, staggered when several arrive together. Disabled automatically for visitors with "reduce motion" turned on.
- Form fields gathered into one dark card: labels above fields, matching inputs, gold focus ring, radio/checkbox rows, gold pill Submit. Validation, hidden fields, payment and the total behave exactly as before.
- The page H1 stays for screen readers/SEO but is visually hidden (the banner already carries the title); a small "Downtown Chabad & CYP Cleveland Presents" line sits above the banner.

### Install - option A: paste into the site-wide header (simplest)

1. Run `./build.sh` (or just open `dist/header-snippet.html`).
2. Paste the **entire** contents of `dist/header-snippet.html` into the Chabadone site-wide header, next to the Shabbat Reserve block.

It is safe on every page: the script only switches the theme on when the URL contains `aid/6284529` or `aid=6284529` (or the page holds form 6284529). Nothing else on the site changes.

### Install - option B: host the files (edit without touching the header)

Host `cyp-simchat-torah.css` and `cyp-simchat-torah.js` anywhere that serves them with the right content types (GitHub Pages, jsDelivr, Netlify, your own server), then paste only this into the header:

```html
<link rel="stylesheet" href="https://YOUR-HOST/cyp-simchat-torah.css">
<script src="https://YOUR-HOST/cyp-simchat-torah.js"></script>
```

After that, design changes only mean updating the hosted files. (Caches can delay changes; add `?v=2` to both URLs to force a refresh.)

### Tuning

All colours are variables at the top of the CSS (`--cyp-ink`, `--cyp-gold`, ...). To re-tone the page background to the banner, change `--cyp-ink`.

### Notes
- Web fonts (Cormorant Garamond, Montserrat) load from Google Fonts.
- The PREGAME/POSTGAME tags are made by the script from any paragraph that begins with an ALL-CAPS word and a colon, e.g. `POSTGAME: ...`.
- The form-card wrapper is found by content, not by field id, so adding or reordering fields in the form editor is fine.

### Updating an already-pasted header

`dist/header-snippet.html` always holds the complete, current version. If the older version is already in the header and only a small fix is needed, an add-on such as `dist/addon-field-contrast.html` can be pasted **below** the existing block instead of replacing it (the add-on is already merged into `dist/header-snippet.html`, so don't paste both).
