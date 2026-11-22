# Vertex Line Solutions — Static Website

A full static HTML / CSS / JavaScript rebuild of the Vertex Line Solutions
website (originally WordPress + WooCommerce + Elementor), recreated as clean,
self-contained front-end code using the site's own content, images, product
data and fonts.

## What's included (64 pages)

| Area | Pages |
|------|-------|
| Core | Home, About Us, Contact Us, FAQ, Brands, Partners, UAE landing, Terms of Use |
| Shop | Products (all 43), 6 product-category pages, 43 individual product pages |
| Stores | Store Location, Our Stores |
| Blog | Blog listing + 2 full articles |

All pages share one header, footer, mobile menu and design system.

## Structure

```
.
├── index.html                      # Homepage
├── about-us/ contact-us/ faq/ ...  # One folder per page (index.html inside)
├── products/                       # Shop (all products + category sidebar)
├── product-category/<slug>/        # 6 category pages
├── product/<slug>/                 # 43 product detail pages
├── blog/ , blog/<slug>/            # Blog listing + articles
└── assets/
    ├── css/style.css               # All styles (tokens, layout, responsive)
    ├── js/main.js                  # Menu, slider, marquee, gallery, FAQ, form
    ├── fonts/                      # Instrument Sans (self-hosted woff2)
    └── images/                     # Logos, icons, product photos, banners
        ├── products/               # Product catalogue images
        └── pages/                  # Inner-page images, brand/partner logos
```

## Run it

Pages use **root-relative paths** (`/assets/...`, `/about-us/`), so serve the
folder from its root rather than opening files directly:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>. (Deploy the folder as-is to any static host
— Netlify, Vercel, GitHub Pages, S3, nginx, etc.)

## Notes

- **Self-contained**: fonts, images and the hero video are local, so the site
  works offline. The only online dependency is the embedded **Google Map** on
  the Contact / Store Location pages, which needs internet to render.
- **Hero**: the homepage hero is the site's own looping freight/logistics video
  (`assets/videos/hero.mp4`) with the overlay text and Prev/Next controls, matching
  the original Slider Revolution background. A poster image shows before it loads.
- **Product data** (43 products, 6 categories) was pulled from the live store
  and rendered into static pages. Since the original store lists no prices
  (B2B / quote model), product pages show a **"Request a Quote"** WhatsApp
  action instead of a cart.
- **Forms** (contact) are front-end only and show a confirmation message — wire
  them to a backend or form service (Formspree, etc.) to actually send mail.
- Dynamic WooCommerce features (live cart, checkout, accounts) are intentionally
  not part of this static build.

## How it was built

`index.html` and the inner pages are generated from a build script that pulls
the site's real content and the WooCommerce product feed, then renders each page
with a shared layout. The output is plain static files with no runtime
dependencies.
