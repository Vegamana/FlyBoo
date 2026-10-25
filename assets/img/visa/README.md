# Travel Visa page — image slots

The SVG files in this folder are **placeholders**. Replace them with licensed photographs when ready.

| Slot | Current placeholder | Used in `travel-visa.html` | Recommended photo |
|---|---|---|---|
| Hero background | `hero-placeholder.svg` | `.visa-hero__bg img` | Wide beach / ocean / destination scene, about 2000×1125, JPG or WebP, under ~250 KB |
| United Arab Emirates card | `card-uae.svg` | first `.dest-card` | About 800×600 (4:3), JPG or WebP |
| Singapore card | `card-singapore.svg` | second `.dest-card` | About 800×600 |
| Thailand card | `card-thailand.svg` | third `.dest-card` | About 800×600 |
| Malaysia card | `card-malaysia.svg` | fourth `.dest-card` | About 800×600 |
| United Kingdom card | `card-uk.svg` | fifth `.dest-card` | About 800×600 |
| Schengen Area card | `card-schengen.svg` | sixth `.dest-card` | About 800×600 |

## Swapping in a photo

1. Add the photo to this folder, for example `hero.jpg` or `card-thailand.jpg`.
2. In `travel-visa.html`, change that image's `src` to the new file name.
3. Update `width` and `height` to the photo's real pixel size, so the page does not shift while loading.
4. Replace the empty `alt=""` with a short description of the photo. Placeholders are decorative, but real photos need alt text.

The hero has a dark overlay (`.visa-hero__bg::after` in `assets/css/visa.css`), so white text stays readable on bright photos. Check the headline after swapping the hero image.

Only use photographs you have the rights to publish.
