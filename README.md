# Vertex Line Solutions — Static Website

A static HTML / CSS / JavaScript rebuild of the Vertex Line Solutions homepage
(originally a WordPress + WooCommerce + Elementor site), recreated as clean,
self-contained front-end code using the site's own content, images and fonts.

## Structure

```
.
├── index.html            # The full homepage
├── assets/
│   ├── css/style.css     # All styles (design tokens, layout, responsive)
│   ├── js/main.js        # Menu drawer, back-to-top, marquee, contact form, smooth scroll
│   ├── fonts/            # Instrument Sans (woff2, self-hosted)
│   └── images/           # Logo, category icons, product photos, partner logos, banners
```

## Sections reproduced

Header (search + nav + logo + phone) · Hero · Feature bar · Shop by Category ·
Featured Products · PPE banner · Scrolling marquee · Our Commitment ·
Our Trusted Partners · Testimonials · Blogs & Insights · Locate Us + Contact form · Footer.

## Run it

It's fully static — just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

then visit <http://localhost:8000>.

## Notes

- **Fonts/images** are self-hosted under `assets/`, so the page works offline.
- The **"Locate Us" map** embeds Google Maps, so it needs an internet
  connection to display; everything else renders without one.
- The **contact form** is front-end only (shows a thank-you message); wire it to
  a backend or form service to actually send mail.
- Cart / account / checkout features of the original WooCommerce store are not
  included — this is a static marketing homepage.
