# FLYBOO.COM website

A static website made of plain HTML, CSS and JavaScript. There is nothing to install and no build step.

## Open it in Visual Studio Code

1. Unzip the folder and choose **File > Open Folder** in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and choose **Open with Live Server**. The site opens in your browser and refreshes when you save.

You can also double-click `index.html` to open it directly in a browser.

## Host it

Upload the **contents of this folder** (the files, not a parent folder) to any static host. Each option below is free for a site like this.

- **Cloudflare Pages:** create a project, choose "Upload assets" and drag the folder in.
- **Netlify:** open Sites and drag the folder onto the "Deploy manually" area.
- **GitHub Pages:** push the folder to a repository and enable Pages in its settings.
- **Traditional web hosting (cPanel / FTP):** upload everything into `public_html`.

The home page must stay named `index.html`.

## Folder map

| Path | What it is |
|---|---|
| `index.html` | Home (hero only for now) |
| `domestic-tours.html`, `international-tours.html`, `flights.html`, `forex.html` | Placeholder pages |
| `travel-visa.html` | Travel Visa page |
| `styleguide.html` | Design review page, not linked from the site. Safe to delete. |
| `assets/css/tokens.css` | All brand colours, spacing and type sizes in one place |
| `assets/css/main.css` | Shared components (header, buttons, cards, forms, footer) |
| `assets/css/visa.css` | Styles specific to the Travel Visa page |
| `assets/js/nav.js` | Mobile menu |
| `assets/js/visa-data.js` | Visa destination list (edit here to add or change countries) |
| `assets/js/visa.js` | Country search and enquiry form behaviour |
| `assets/img/` | Logo and images. See `assets/img/visa/README.md` for swapping in photos. |

## Before going live

- **Enquiry form:** it is not connected to email or a backend, so it only validates and says nothing has been sent. Set `ENQUIRY_ENDPOINT` at the top of `assets/js/visa.js` to a form service or API that accepts a JSON POST.
- **Photos:** the Travel Visa images are placeholders. See `assets/img/visa/README.md`.
- **Logo:** replace `assets/img/flyboo-logo.png` with the HD logo when available. Keep the same file name, and update the `width` and `height` attributes in the HTML if its proportions change.
- **Contact details, favicon and a privacy policy** have not been added yet.
- **Visa details** (fees, processing times, entry rules) must be verified against official sources before they are published.
