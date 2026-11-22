/* Static site generator for Vertex Line Solutions clone */
const fs = require('fs');
const path = require('path');

// OUT = repo root (parent of this build/ folder); data lives in build/data/
const OUT = path.join(__dirname, '..');
const DATA = __dirname;
const products = JSON.parse(fs.readFileSync(DATA + '/data/products.json'));
const categories = JSON.parse(fs.readFileSync(DATA + '/data/categories.json'));
const pages = JSON.parse(fs.readFileSync(DATA + '/data/pages_content.json'));

/* ---------- helpers ---------- */
const he = s => (s == null ? '' : String(s));
function decode(s){
  return he(s).replace(/&#0?38;|&amp;/g,'&').replace(/&#8211;/g,'–').replace(/&#8217;/g,'’')
    .replace(/&#8220;/g,'“').replace(/&#8221;/g,'”').replace(/&#8230;/g,'…').replace(/&#039;|&#39;/g,"'")
    .replace(/&#8216;/g,'‘').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&#8212;/g,'—');
}
function esc(s){return he(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function T(s){return esc(decode(s));} // decode entities then re-escape for safe text
function strip(h){ // keep a safe subset of html from product descriptions
  return he(h)
    .replace(/<script[\s\S]*?<\/script>/gi,'')
    .replace(/<style[\s\S]*?<\/style>/gi,'')
    .replace(/ on\w+="[^"]*"/gi,'')
    .replace(/<(?!\/?(p|ul|ol|li|strong|b|em|i|br|h2|h3|h4|span|table|thead|tbody|tr|td|th)\b)[^>]*>/gi,'');
}
const prodBase = src => path.basename(he(src)).replace(/-\d+x\d+(?=\.\w+$)/,'');
function imgProd(src){return '/assets/images/products/' + prodBase(src);}
function imgPage(src){return '/assets/images/pages/' + path.basename(he(src)).replace(/-\d+x\d+(?=\.\w+$)/,'');}

function catSlugToUrl(slug){return '/product-category/' + slug + '/';}
const catBySlug = {};
categories.forEach(c => catBySlug[c.slug] = c);

function writePage(rel, html){
  const dir = path.join(OUT, rel);
  fs.mkdirSync(dir, {recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'), html);
}

/* ---------- shared chrome ---------- */
const PHONE = '+971 521535979', TEL = '971521535979';
const WA = 'https://api.whatsapp.com/send?phone=971521535979&text=Hello%2C%20I%27m%20interested%20in%20your%20safety%20products%20and%20would%20like%20more%20information.';

function catDropdown(){
  return categories.map(c=>`<li><a href="${catSlugToUrl(c.slug)}">${T(c.name)}</a></li>`).join('')
    + `<li><a href="/products/">All Products</a></li>`
    + `<li><a href="/brands/">Brands</a></li>`
    + `<li><a href="/partners/">Partners</a></li>`;
}

function header(active){
  const nav = [
    ['Home','/','home'],
    ['About Us','/about-us/','about'],
    ['Products','/products/','products','sub'],
  ];
  const navHtml = nav.map(([label,href,key,sub])=>{
    if(sub){
      return `<li class="has-sub"><a href="${href}">${label} <svg class="caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></a><ul class="submenu">${catDropdown()}</ul></li>`;
    }
    return `<li><a href="${href}"${key===active?' style="color:var(--accent)"':''}>${label}</a></li>`;
  }).join('');
  return `
<div class="topbar"><div class="container">
  <span>Delivering Reliable, Certified Solutions for a Safer Workplace</span>
  <div class="topbar__right"><a href="tel:971521535979">UAE: +971 521535979</a><a href="tel:966581249030">KSA: +966 581249030</a></div>
</div></div>
<header class="site-header"><div class="container"><div class="header-inner">
  <div class="header-left">
    <button class="burger" aria-label="Open menu" id="burger"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
    <form class="search" action="/products/" onsubmit="return false;"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" placeholder="I'm looking for..."></form>
    <nav><ul class="main-nav">${navHtml}</ul></nav>
  </div>
  <a class="logo" href="/" aria-label="Vertex Line Solutions"><img src="/assets/images/logo.png" alt="Vertex Line Solutions"></a>
  <div class="header-right">
    <a class="header-link" href="/blog/">Blogs &amp; Insights</a>
    <a class="header-link" href="/contact-us/">Contact Us</a>
    <a class="phone-btn" href="tel:${TEL}"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 0 0-1.02.24l-2.2 2.2a15.07 15.07 0 0 1-6.6-6.6l2.2-2.2a1 1 0 0 0 .25-1.02A11.36 11.36 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z"/></svg> ${PHONE}</a>
  </div>
</div></div></header>`;
}

function footer(){
  return `
<footer class="site-footer"><div class="container">
  <div class="footer-grid">
    <div class="footer-brand">
      <img src="/assets/images/logo.png" alt="Vertex Line Solutions">
      <p><a href="tel:${TEL}">${PHONE}</a></p>
      <p><a href="mailto:sales@vertexlinesolutions.com">sales@vertexlinesolutions.com</a></p>
      <div class="social">
        <a href="https://facebook.com/vertexlinesolutions" aria-label="Facebook" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg></a>
        <a href="https://www.instagram.com/vertexlinesolutions/" aria-label="Instagram" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg></a>
        <a href="https://www.linkedin.com/company/vertex-line-solutions/" aria-label="LinkedIn" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 8A1.5 1.5 0 1 0 6.5 5a1.5 1.5 0 0 0 0 3zM5 9.5h3V19H5zM10 9.5h2.9v1.3c.4-.7 1.4-1.5 2.9-1.5 3.1 0 3.2 2 3.2 4.6V19h-3v-4.3c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V19h-3z"/></svg></a>
        <a href="${WA}" aria-label="WhatsApp" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.2 1.1-1.7 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.1.1.3 0 .5l-.4.6c-.2.2-.3.4-.1.7.5.9 1.1 1.5 1.9 2 .3.2.5.1.7-.1l.6-.7c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.1.1.6-.1 1.1z"/></svg></a>
      </div>
    </div>
    <div class="footer-col"><h4>Quick Links</h4><ul>
      <li><a href="/">Home</a></li><li><a href="/about-us/">About Us</a></li><li><a href="/products/">Products</a></li><li><a href="/contact-us/">Contact Us</a></li></ul></div>
    <div class="footer-col"><h4>Quick Links</h4><ul>
      <li><a href="/terms-of-use/">Terms Of Use</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/store-location/">Store Location</a></li><li><a href="/our-stores/">Our Stores</a></li></ul></div>
    <div class="footer-col footer-find"><h4>Find Us</h4>
      <p>Find a location nearest you to reduce shipping costs and make shopping easier. <a href="https://maps.google.com/?q=Vertex+Line+Solutions" target="_blank" rel="noopener" style="color:var(--accent)">Show on google maps.</a></p>
      <div class="ph"><strong>UAE :</strong> <a href="tel:971521535979">+971 521535979</a></div>
      <div class="ph"><strong>KSA :</strong> <a href="tel:966581249030">+966 581249030</a></div>
    </div>
  </div>
  <div class="footer-bottom">&copy; 2026 Waiz Enterprise. All rights reserved.</div>
</div></footer>
<a class="wa-float" href="${WA}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.2 1.1-1.7 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.1.1.3 0 .5l-.4.6c-.2.2-.3.4-.1.7.5.9 1.1 1.5 1.9 2 .3.2.5.1.7-.1l.6-.7c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.1.1.6-.1 1.1z"/></svg></a>
<button class="to-top" id="toTop" aria-label="Back to top"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg></button>
<div class="drawer-backdrop" id="drawerBackdrop"></div>
<aside class="drawer" id="drawer">
  <div class="drawer__head"><img src="/assets/images/logo.png" alt="Vertex Line Solutions"><button class="drawer__close" id="drawerClose" aria-label="Close menu">&times;</button></div>
  <form class="drawer-search" action="/products/" onsubmit="return false;"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" placeholder="I'm looking for..."></form>
  <nav>
    <a href="/" data-close>Home</a><a href="/about-us/" data-close>About Us</a><a href="/products/" data-close>Products</a>
    <a href="/brands/" data-close>Brands</a><a href="/partners/" data-close>Partners</a><a href="/blog/" data-close>Blogs &amp; Insights</a>
    <a href="/faq/" data-close>FAQ</a><a href="/contact-us/" data-close>Contact Us</a><a href="tel:${TEL}" data-close>${PHONE}</a>
  </nav>
</aside>
<script src="/assets/js/main.js"></script>`;
}

function layout({title, desc, active, body, ogimg}){
  return `<!doctype html>
<html lang="en-US">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${T(title)}</title>
<meta name="description" content="${esc(decode(desc||''))}">
<link rel="icon" href="/assets/images/favicon.png" sizes="any">
<link rel="apple-touch-icon" href="/assets/images/favicon.png">
<link rel="stylesheet" href="/assets/css/style.css">
<meta property="og:title" content="${T(title)}">
<meta property="og:type" content="website">
<meta property="og:image" content="${ogimg||'/assets/images/ppe-banner.png'}">
</head>
<body>
${header(active)}
${body}
${footer()}
</body>
</html>`;
}

function pageHero(h1, crumbs){
  const bc = crumbs.map((c,i)=>{
    if(i===crumbs.length-1) return `<span class="current">${T(c[0])}</span>`;
    return `<a href="${c[1]}">${T(c[0])}</a><span class="sep">/</span>`;
  }).join(' ');
  return `<section class="page-hero"><div class="container"><h1>${T(h1)}</h1><div class="breadcrumb">${bc}</div></div></section>`;
}

/* ===================== PRODUCT CARD ===================== */
function productCard(p){
  const img = p.images && p.images[0] ? imgProd(p.images[0].src) : '/assets/images/logo.png';
  return `<a class="product" href="/product/${p.slug}/"><div class="product__media"><img src="${img}" alt="${T(p.name)}" loading="lazy"></div><div class="product__body"><h3>${T(p.name)}</h3></div></a>`;
}

/* ===================== HOME ===================== */
const homeCats = [
  ['Industrial Tools & Equipments','cat-industrial-tools.png','industrial-tools-and-equipments'],
  ['Construction & Infrastructure','cat-construction.png','construction-and-nfrastructure'],
  ['Electrical & Power Solution','cat-electrical.png','electrical-and-power-solution'],
  ['Automotive & Machinery Spare Parts','cat-automotive.png',null],
  ['Safety & PPE products','cat-ppe.png','ppe-suppliers-jubail-saudi-arabia'],
  ['Oil & Lubricants','cat-oil.png',null],
  ['General Industrial Supplies','cat-general-industrial.png',null],
  ['Hardware & Fasteners','cat-hardware.png',null],
  ['Marine Supplies & Equipment','cat-marine.png',null],
  ['Roads & Safety Management','cat-roads.png','roads-and-safety-management'],
  ['Chemicals, Paints & Sealants','cat-chemicals.png','chemicals-paints-and-sealants'],
  ['Corporate Gifting Solutions','cat-gifting.png',null],
  ['Fire Fighting & Safety Systems','cat-firefighting.png',null],
  ['Office Supplies & Equipments','cat-office.png',null],
];
const PARTNERS = [['saudi-aramco.png','Saudi Aramco'],['Adnoc-logo.webp','ADNOC'],['dulsco.png','Dulsco'],['arvento-edge.png','Arvento Edge'],['medegemea.png','MedEdge'],['neom.png','NEOM']];
function partnerRow(){return `<div class="partner-row">${PARTNERS.map(([f,a])=>`<img src="/assets/images/pages/${f}" alt="${a}">`).join('')}</div>`;}
function commitSection(){
  return `<section class="section" id="commitment"><div class="container">
  <div class="sec-head"><h2>Our Commitment</h2><p>Our products are designed for everyone, environmentally friendly.</p></div>
  <div class="commit-grid">
    <div class="commit"><svg class="commit__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 21c-4-1-8-4-8-10 4 0 7 1 8 5 1-4 4-5 8-5 0 6-4 9-8 10z"/><path d="M11 21v-6"/></svg><h3>Trusted Safety Solutions</h3><p>Get access to certified PPE and industrial tools trusted by professionals across multiple sectors.</p></div>
    <div class="commit"><svg class="commit__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M15 9a3 3 0 0 0-3-2c-1.7 0-3 1-3 2.4 0 3 6 1.6 6 4.6 0 1.5-1.4 2.5-3 2.5a3 3 0 0 1-3-2"/><path d="M12 6v1.5M12 16.5V18"/></svg><h3>Competative Pricing</h3><p>We offer high-quality products at affordable rates, ideal for businesses of all sizes.</p></div>
    <div class="commit"><svg class="commit__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 3h13v11H1z"/><path d="M14 7h4l3 3v4h-7z"/><circle cx="5.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/></svg><h3>Fast &amp; Reliable Delivery</h3><p>Enjoy quick, hassle-free delivery across the UAE with guaranteed product quality.</p></div>
  </div></div></section>`;
}
function testiSection(){
  const T1='vertexline Solutions has become our go-to place for all safety equipment. Their products are reliable, well-priced, and delivered right on time. Truly a hassle-free experience!.. Thank you! 🤗';
  const T2='We&rsquo;ve been purchasing safety gear from vertexline Solutions for months now, and the quality has always been consistent. They understand exactly what businesses need and provide the best options... 🥰';
  const T3='vertexline Solutions never disappoints. Their safety equipment range is excellent, and the team is always responsive. We trust them completely for all our workplace safety needs. 🤗';
  const card=(n,t)=>`<div class="testi"><div class="testi__stars">★★★★★</div><div class="testi__head"><span class="testi__name">${n}</span><span class="testi__badge">✓ Verified Buyer</span></div><p>${t}</p></div>`;
  return `<section class="section"><div class="container"><div class="sec-head"><h2>Customer Say!</h2><p>Customers love our products and we always strive to please them all.</p></div>
  <div class="testi-grid">${card('Susan Gibson.',T1)}${card('Algistino Linonel',T2)}${card('Carie-Gosée H.',T3)}</div></div></section>`;
}
function blogCardsSection(){
  return `<section class="section" id="blogs" style="background:var(--bg-soft)"><div class="container"><div class="sec-head"><h2>Blogs and Insights</h2></div>
  <div class="blog-grid">
    <article class="blog-card"><a href="/blog/why-choosing-the-right-safety-equipment-supplier/" class="blog-card__media"><img src="/assets/images/blog-1.png" alt=""><span class="blog-card__tag">BLOG</span></a>
      <div class="blog-card__body"><h3><a href="/blog/why-choosing-the-right-safety-equipment-supplier/">Why Choosing the Right Safety Equipment Supplier in Saudi Arabia Matters for Your Business</a></h3>
      <p>When a worker steps onto a job site, whether it is a petrochemical plant in Jubail or a construction corridor&hellip;</p>
      <a class="blog-card__more" href="/blog/why-choosing-the-right-safety-equipment-supplier/">READ MORE &raquo;</a>
      <div class="blog-card__meta"><span>WaizUser</span><span class="dot"></span><span>March 29, 2026</span></div></div></article>
    <article class="blog-card"><a href="/blog/mandatory-ppe-for-aramco-approved-projects/" class="blog-card__media"><img src="/assets/images/blog-2.jpg" alt=""><span class="blog-card__tag">BLOG</span></a>
      <div class="blog-card__body"><h3><a href="/blog/mandatory-ppe-for-aramco-approved-projects/">Mandatory PPE for Aramco Approved Projects in Saudi Arabia</a></h3>
      <p>Aramco-approved projects require certified PPE including hard hats, safety glasses, gloves, safety footwear, high-visibility clothing, respiratory protection, and fall protection.</p>
      <a class="blog-card__more" href="/blog/mandatory-ppe-for-aramco-approved-projects/">READ MORE &raquo;</a>
      <div class="blog-card__meta"><span>A Raaz</span><span class="dot"></span><span>February 23, 2026</span></div></div></article>
  </div></div></section>`;
}
function contactSection(){
  return `<section class="section" id="contact"><div class="container"><div class="contact-grid">
    <div><h2 class="block-title">Locate US</h2><div class="map-wrap"><iframe title="Map" src="https://maps.google.com/maps?q=Jubail%2C%20Saudi%20Arabia&z=11&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div>
    <div><h2 class="block-title">Contact Us</h2><form class="contact-form" id="contactForm" novalidate>
      <div class="row"><div class="field"><label for="cname">Name</label><input id="cname" type="text" placeholder="Name"></div><div class="field"><label for="cemail">Email</label><input id="cemail" type="email" placeholder="Email"></div></div>
      <div class="field"><label for="cmsg">Message</label><textarea id="cmsg" placeholder="Enter please your message"></textarea></div>
      <button class="btn" type="submit">Send</button><div class="form-note ok" id="formNote" hidden></div>
    </form></div>
  </div></div></section>`;
}
function buildHome(){
  const featured = products.slice(0,10).map(productCard).join('');
  const cats = homeCats.map(([name,icon,slug])=>{
    const href = slug ? catSlugToUrl(slug) : '/products/';
    return `<a class="cat" href="${href}"><span class="cat__circle"><img src="/assets/images/${icon}" alt=""></span><span>${name}</span></a>`;
  }).join('');
  const body = `
<section class="hero">
  <video class="hero-video" id="heroVideo" autoplay muted loop playsinline preload="auto" poster="/assets/images/hero-poster.jpg"><source src="/assets/videos/hero.mp4" type="video/mp4"></video>
  <div class="container"><div class="hero-content">
  <div class="hero-eyebrow">Simplifying International Procurement</div>
  <h1>End-to-End Sourcing Made Simple</h1>
  <p>We manage supplier identification, quality checks, pricing, and logistics to deliver a transparent and efficient sourcing experience from factory selection to final delivery.</p>
  <a class="btn" href="/contact-us/">Start Sourcing Today</a>
</div></div><div class="hero-nav"><button type="button" id="heroPrev">Prev</button><span class="sep">/</span><button type="button" id="heroNext">Next</button></div></section>

<section class="features"><div class="container">
  <div class="feature"><svg class="feature__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3z"/><polyline points="9 12 11 14 15 10"/></svg><div><h4>Certified &amp; Trusted Products</h4><p>Every product meets strict safety standards.</p></div></div>
  <div class="feature"><svg class="feature__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg><div><h4>Wide Range of Safety Solutions</h4><p>Complete safety and industrial solutions in one place.</p></div></div>
  <div class="feature"><svg class="feature__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><div><h4>Reliable Business Support</h4><p>Quick response, smooth delivery, and trusted support.</p></div></div>
  <div class="feature"><svg class="feature__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3z"/><circle cx="12" cy="11" r="2.4"/></svg><div><h4>Committed to Workplace Safety</h4><p>Helping businesses maintain safe and efficient workplaces.</p></div></div>
</div></section>

<section class="section" id="categories"><div class="container"><div class="sec-head"><h2>Shop by Category</h2><p>Define your outdoor lifestyle with gear that blends rugged function and modern design.</p></div><div class="cat-grid">${cats}</div></div></section>

<section class="section products-section" id="products"><div class="container"><div class="sec-head"><h2>Featured Products</h2><p>Premium camping gear crafted for durability, comfort, and unforgettable outdoor adventures.</p></div><div class="prod-grid">${featured}</div><div style="text-align:center;margin-top:36px"><a class="btn" href="/products/">View All Products</a></div></div></section>

<section class="section section--tight"><div class="container"><div class="ppe-banner"><img src="/assets/images/ppe-banner.png" alt="PPE Suppliers in Saudi Arabia"><div class="ppe-banner__content"><h2>PPE Suppliers in<br>Saudi Arabia</h2><a class="btn btn--ghost" href="${catSlugToUrl('ppe-suppliers-jubail-saudi-arabia')}">PPE Products</a></div></div></div></section>

<div class="marquee"><div class="marquee__track" id="marqueeTrack">
  <span>Your Trusted Partner for Premium Safety &amp; Industrial Products <i class="star">✦</i> Delivering Reliable, Certified Solutions for a Safer Workplace <i class="star">✦</i></span>
  <span>Your Trusted Partner for Premium Safety &amp; Industrial Products <i class="star">✦</i> Delivering Reliable, Certified Solutions for a Safer Workplace <i class="star">✦</i></span>
</div></div>

${commitSection()}
<section class="section partners"><div class="container"><div class="sec-head" style="max-width:900px"><h2>Our Trusted Partners</h2><p>We collaborate with leading suppliers and service partners to ensure you receive reliable products, consistent quality, and dependable support. Our partnerships help us deliver better value, faster service, and a wider selection of safety and industrial solutions for every workplace.</p></div>${partnerRow()}</div></section>
${testiSection()}
${blogCardsSection()}
${contactSection()}`;
  writePage('.', layout({title:'Vertex Line Solutions - Safety Equipment Supplier in Saudi Arabia', desc:'Vertex Line Solutions — your trusted partner for premium safety and industrial products. End-to-end sourcing made simple.', active:'home', body}));
}

/* ===================== SHOP / PRODUCTS ===================== */
function buildShop(){
  const aside = `<aside class="shop-aside"><h4>Categories</h4><ul>
    <li><a href="/products/" class="active">All Products <span class="count">${products.length}</span></a></li>
    ${categories.map(c=>`<li><a href="${catSlugToUrl(c.slug)}">${T(c.name)} <span class="count">${c.count}</span></a></li>`).join('')}
  </ul></aside>`;
  const grid = products.map(productCard).join('');
  const body = `${pageHero('Products',[['Home','/'],['Products']])}
  <section class="section"><div class="container"><div class="shop">${aside}
    <div><p class="shop-count">Showing all <strong>${products.length}</strong> products</p><div class="prod-grid">${grid}</div></div>
  </div></div></section>`;
  writePage('products', layout({title:'Products - Vertex Line Solutions', desc:'Browse our full range of certified safety and industrial products.', active:'products', body}));
}

function buildCategory(c){
  const items = products.filter(p=>(p.categories||[]).some(x=>x.slug===c.slug));
  const aside = `<aside class="shop-aside"><h4>Categories</h4><ul>
    <li><a href="/products/">All Products <span class="count">${products.length}</span></a></li>
    ${categories.map(x=>`<li><a href="${catSlugToUrl(x.slug)}"${x.slug===c.slug?' class="active"':''}>${T(x.name)} <span class="count">${x.count}</span></a></li>`).join('')}
  </ul></aside>`;
  const grid = items.length ? items.map(productCard).join('') : `<p style="color:var(--muted)">Products in this category are available on request. <a href="/contact-us/" style="color:var(--accent)">Contact us</a> for a quote.</p>`;
  const body = `${pageHero(decode(c.name),[['Home','/'],['Products','/products/'],[decode(c.name)]])}
  <section class="section"><div class="container"><div class="shop">${aside}
    <div><p class="shop-count">Showing <strong>${items.length}</strong> product${items.length===1?'':'s'} in ${T(c.name)}</p><div class="prod-grid">${grid}</div></div>
  </div></div></section>`;
  writePage('product-category/'+c.slug, layout({title:decode(c.name)+' - Vertex Line Solutions', desc:'Shop '+decode(c.name)+' at Vertex Line Solutions.', active:'products', body}));
}

function buildProduct(p){
  const imgs = (p.images||[]);
  const main = imgs[0] ? imgProd(imgs[0].src) : '/assets/images/logo.png';
  const thumbs = imgs.map((im,i)=>`<img src="${imgProd(im.src)}" data-full="${imgProd(im.src)}" class="${i===0?'active':''}" alt="${T(p.name)} ${i+1}">`).join('');
  const cat = (p.categories||[])[0];
  const catLink = cat ? `<a href="${catSlugToUrl(cat.slug)}" style="color:inherit">${T(cat.name)}</a>` : 'Safety & Industrial';
  const waLink = 'https://api.whatsapp.com/send?phone=971521535979&text='+encodeURIComponent('Hello, I would like a quote for: '+decode(p.name));
  const descHtml = strip(p.description) || `<p>${T(p.short_description).replace(/<[^>]+>/g,'')}</p>`;
  const body = `${pageHero(decode(p.name),[['Home','/'],['Products','/products/'],[decode(p.name)]])}
  <section class="section"><div class="container"><div class="pd">
    <div class="pd-gallery"><div class="pd-main"><img id="pdMain" src="${main}" alt="${T(p.name)}"></div>${imgs.length>1?`<div class="pd-thumbs">${thumbs}</div>`:''}</div>
    <div class="pd-info"><div class="pd-cat">${catLink}</div><h1>${T(p.name)}</h1>
      <div class="pd-short">${strip(p.short_description)}</div>
      <div class="pd-quote"><a class="btn" href="${waLink}" target="_blank" rel="noopener">Request a Quote</a><a class="btn btn--ghost" style="border-color:var(--accent);color:var(--accent)" href="/contact-us/">Contact Sales</a></div>
      <div class="pd-meta">Category: <span>${cat?T(cat.name):'Safety & Industrial'}</span>${p.sku?` &nbsp;·&nbsp; SKU: <span>${T(p.sku)}</span>`:''}</div>
    </div>
  </div>
  <div class="pd-desc"><h2>Description</h2>${descHtml}</div>
  </div></section>`;
  writePage('product/'+p.slug, layout({title:decode(p.name)+' - Vertex Line Solutions', desc:decode(p.short_description).replace(/<[^>]+>/g,'').slice(0,160), active:'products', body, ogimg:main}));
}

/* ===================== ABOUT ===================== */
function buildAbout(){
  const body = `${pageHero('About Us',[['Home','/'],['About Us']])}
  <section class="section"><div class="container"><div class="split">
    <div><h6 style="color:var(--accent);text-transform:uppercase;letter-spacing:1.5px;font-size:13px">About Vertex Line Solutions</h6>
      <h2 style="font-size:34px">We provide high-quality safety products.</h2>
      <p style="font-size:15.5px;line-height:1.8;color:var(--text)">Vertex Line Solutions, powered by Waiz Enterprise, is dedicated to supplying durable, certified, and dependable safety and industrial products. We help businesses across the UAE and Saudi Arabia maintain safe, efficient, and compliant workplaces through reliable sourcing and trusted service.</p>
      <p style="font-size:15.5px;line-height:1.8;color:var(--text)">From PPE and industrial tools to chemicals, electrical, and construction supplies, we deliver quality products backed by expert guidance and fast, reliable delivery.</p>
      <a class="btn" href="/contact-us/">Get in Touch</a>
    </div>
    <div><img src="/assets/images/pages/about-us.png" alt="About Vertex Line Solutions" onerror="this.src='/assets/images/ppe-banner.png'"></div>
  </div></div></section>
  ${commitSection()}
  <section class="section" style="background:var(--bg-soft)"><div class="container"><div class="sec-head"><h2>Reliable Solutions for Every Workplace</h2><p>Why choose us</p></div>
    <div class="duo"><div class="card"><h5>Our Vision</h5><p>To become the most trusted safety and industrial products partner across the region — known for quality, reliability, and dependable service.</p></div>
    <div class="card"><h5>Our Mission</h5><p>To supply certified, high-quality safety equipment and industrial products that protect workers and keep businesses running safely and efficiently.</p></div></div>
  </div></section>
  <section class="section partners"><div class="container"><div class="sec-head" style="max-width:900px"><h2>Our Trusted Partners</h2></div>${partnerRow()}</div></section>`;
  writePage('about-us', layout({title:'About Us - Vertex Line Solutions', desc:'Vertex Line Solutions supplies durable, certified safety and industrial products across the UAE and Saudi Arabia.', active:'about', body}));
}

/* ===================== CONTACT ===================== */
function buildContact(){
  const body = `${pageHero('Contact Us',[['Home','/'],['Contact Us']])}
  <section class="section"><div class="container">
    <div class="contact-cards">
      <div class="contact-card"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 0 0-1.02.24l-2.2 2.2a15.07 15.07 0 0 1-6.6-6.6l2.2-2.2a1 1 0 0 0 .25-1.02A11.36 11.36 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z"/></svg><h5>Phone No:</h5><p><a href="tel:971521535979">+971 521535979</a>\n<a href="tel:966581249030">+966 581249030</a></p></div>
      <div class="contact-card"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/></svg><h5>Email:</h5><p><a href="mailto:sales@vertexlinesolutions.com">sales@vertexlinesolutions.com</a></p></div>
      <div class="contact-card"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg><h5>Address:</h5><p>Jabal Street, Al Merqab District\nAl Jubail 35514, Eastern Province\nKingdom of Saudi Arabia</p></div>
    </div>
    <div class="contact-grid">
      <div><h2 class="block-title">Locate US</h2><div class="map-wrap"><iframe title="Map" src="https://maps.google.com/maps?q=Al%20Jubail%2C%20Saudi%20Arabia&z=12&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div>
      <div><h2 class="block-title">Support Customer</h2><form class="contact-form" id="contactForm" novalidate>
        <div class="row"><div class="field"><label for="cname">Name</label><input id="cname" type="text" placeholder="Name"></div><div class="field"><label for="cemail">Email</label><input id="cemail" type="email" placeholder="Email"></div></div>
        <div class="field"><label for="cmsg">Message</label><textarea id="cmsg" placeholder="Enter please your message"></textarea></div>
        <button class="btn" type="submit">Send</button><div class="form-note ok" id="formNote" hidden></div>
      </form></div>
    </div>
  </div></section>`;
  writePage('contact-us', layout({title:'Contact Us - Vertex Line Solutions', desc:'Contact Vertex Line Solutions for certified safety and industrial products.', active:'contact', body}));
}

/* ===================== FAQ ===================== */
function buildFaq(){
  const faqs = [
    ['What products does Vertexline Solutions offer?','Vertexline Solutions supplies a wide range of safety and industrial products, including certified PPE, protective footwear, tools, chemicals, electrical supplies, and construction equipment.'],
    ['Are your safety products certified and compliant with standards?','Yes. All our products meet strict quality, safety, and performance standards. We work only with trusted manufacturers and suppliers.'],
    ['Who can purchase from Vertexline Solutions?','We serve businesses of all sizes, including construction companies, factories, warehouses, maintenance teams, and industrial operators.'],
    ['Do you deliver across the UAE?','Yes. We provide fast and reliable delivery across the UAE, ensuring your safety products reach you on time and in perfect condition.'],
    ['How do you ensure product quality?','Our products are carefully sourced from trusted suppliers, tested for durability, and selected to meet workplace safety requirements.'],
    ['Are your prices competitive for bulk or business orders?','Absolutely. We offer competitive pricing for both small and large orders, making our products cost-effective for every business.'],
    ['Can you help us choose the right safety equipment?','Yes. Our experienced team provides product guidance and support, helping you select the most suitable safety equipment for your needs.'],
    ['Do you supply eco-friendly or sustainable safety products?','We are committed to responsible sourcing and offer environmentally conscious products wherever possible, supporting safer and greener workplaces.'],
  ];
  const list = faqs.map(([q,a],i)=>`<div class="faq-item${i===0?' open':''}"><button class="faq-q">${T(q)}<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button><div class="faq-a"><p>${T(a)}</p></div></div>`).join('');
  const body = `${pageHero('FAQ',[['Home','/'],['FAQ']])}
  <section class="section"><div class="container"><div class="sec-head"><h2>Frequently Asked Questions</h2><p>Everything you need to know about our products and service.</p></div><div class="faq-list">${list}</div></div></section>`;
  writePage('faq', layout({title:'FAQ - Vertex Line Solutions', desc:'Frequently asked questions about Vertex Line Solutions safety and industrial products.', active:'', body}));
}

/* ===================== PARTNERS / BRANDS ===================== */
function buildPartners(){
  const body = `${pageHero('Partners',[['Home','/'],['Partners']])}
  <section class="section"><div class="container"><div class="sec-head" style="max-width:900px"><h2>Our Trusted Partners</h2><p>We collaborate with leading suppliers and service partners to ensure you receive reliable products, consistent quality, and dependable support across every workplace.</p></div>
  <div class="logo-grid">${PARTNERS.map(([f,a])=>`<div class="logo-cell"><img src="/assets/images/pages/${f}" alt="${a}"></div>`).join('')}</div></div></section>`;
  writePage('partners', layout({title:'Partners - Vertex Line Solutions', desc:'Our trusted suppliers and service partners.', active:'partners', body}));
}
function buildBrands(){
  // collect brand logos from the brands page extraction
  const imgs = (pages['brands'].blocks.filter(b=>b.t==='img').map(b=>path.basename(b.src).replace(/-\d+x\d+(?=\.\w+$)/,''))
    .filter(f=>!/Untitled-design|logo\.png|favicon/i.test(f)));
  const uniq = [...new Set(imgs)];
  const cells = uniq.map(f=>`<div class="logo-cell"><img src="/assets/images/pages/${f}" alt="Brand" loading="lazy"></div>`).join('');
  const body = `${pageHero('Brands',[['Home','/'],['Brands']])}
  <section class="section"><div class="container"><div class="sec-head" style="max-width:860px"><h2>Brands We Supply</h2><p>We stock and supply trusted international brands across safety, industrial, electrical, and construction categories.</p></div>
  <div class="logo-grid">${cells}</div></div></section>`;
  writePage('brands', layout({title:'Brands - Vertex Line Solutions', desc:'Trusted international brands supplied by Vertex Line Solutions.', active:'brands', body}));
}

/* ===================== ALL CATEGORIES ===================== */
function buildAllCategories(){
  const cats = homeCats.map(([name,icon,slug])=>{
    const href = slug ? catSlugToUrl(slug) : '/products/';
    return `<a class="cat" href="${href}"><span class="cat__circle"><img src="/assets/images/${icon}" alt=""></span><span>${name}</span></a>`;
  }).join('');
  const body = `${pageHero('All Categories',[['Home','/'],['All Categories']])}
  <section class="section"><div class="container"><div class="sec-head"><h2>Shop by Category</h2><p>Explore our complete range of safety and industrial product categories.</p></div><div class="cat-grid">${cats}</div></div></section>`;
  writePage('all-categories', layout({title:'All Categories - Vertex Line Solutions', desc:'Browse all product categories.', active:'products', body}));
}

/* ===================== STORE LOCATION ===================== */
function buildStoreLocation(){
  const body = `${pageHero('Store Location',[['Home','/'],['Store Location']])}
  <section class="section"><div class="container"><div class="contact-grid">
    <div><h2 class="block-title">Our Head Office</h2>
      <p style="font-size:15.5px;line-height:1.9;color:var(--text)"><strong>Vertex Line Solutions</strong><br>Jabal Street, Al Merqab District<br>Al Jubail 35514, Eastern Province<br>Kingdom of Saudi Arabia</p>
      <p style="font-size:15px;color:var(--text)"><strong>UAE:</strong> <a href="tel:971521535979" style="color:var(--accent)">+971 521535979</a><br><strong>KSA:</strong> <a href="tel:966581249030" style="color:var(--accent)">+966 581249030</a><br><strong>Email:</strong> <a href="mailto:sales@vertexlinesolutions.com" style="color:var(--accent)">sales@vertexlinesolutions.com</a></p>
      <a class="btn" href="https://maps.google.com/?q=Al+Jubail+Saudi+Arabia" target="_blank" rel="noopener">Open in Google Maps</a>
    </div>
    <div><div class="map-wrap" style="min-height:460px"><iframe title="Map" src="https://maps.google.com/maps?q=Al%20Jubail%2C%20Saudi%20Arabia&z=12&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div>
  </div></div></section>`;
  writePage('store-location', layout({title:'Store Location - Vertex Line Solutions', desc:'Find Vertex Line Solutions in Al Jubail, Saudi Arabia.', active:'', body}));
}

/* ===================== OUR STORES ===================== */
function buildOurStores(){
  const stores = [
    ['South Fulton','100 Main Street, South Fulton, GA 30291, United States.\n+1 (973) 435-3638'],
    ['Place Ste-Foy','Place Ste-Foy, Québec, QC G1V 4J3, Canada\n+1 (418) 765-4321'],
    ['Santiago Store','Av. Apoquindo 4501, Las Condes, Santiago, Chile.\n+56 (2) 348-9275'],
    ['Sydney Store','100 George Street, Sydney, NSW 2000, Australia.\n+61 (2) 4829-3756'],
    ['Southland Park','123 Southland Drive, Calgary, AB T2J 5K3, Canada.\n+1 (403) 729-8642'],
    ['Stockholm Town','45 Drottninggatan, Stockholm, 111 51, Sweden.\n+46 (8) 5298-3746'],
  ];
  const hours = 'Mon - Friday: 8:00am - 5:00pm\nSaturday - Sunday: 10:00am - 5:00pm';
  const cards = stores.map(([n,a])=>`<div class="store-card"><h3>${n}</h3><p>${a}</p><div class="hours">${hours}</div></div>`).join('');
  const body = `${pageHero('Our Stores',[['Home','/'],['Our Stores']])}
  <section class="section"><div class="container"><div class="sec-head"><h2>Visit Our Stores</h2><p>Find a Vertex Line Solutions location near you.</p></div><div class="store-grid">${cards}</div></div></section>`;
  writePage('our-stores', layout({title:'Our Stores - Vertex Line Solutions', desc:'Vertex Line Solutions store locations.', active:'', body}));
}

/* ===================== GENERIC CONTENT (uae, terms) ===================== */
function cleanBlocks(key){
  const out=[];
  for(const b of pages[key].blocks){
    const txt = b.t==='img'? '' : (b.txt||'');
    if(['Quick Links','Search Our Site'].includes(txt)) break;
    if(['Menu','Categories'].includes(txt)) continue;
    out.push(b);
  }
  return out;
}
function renderBlocks(blocks){
  let html='', inList=false;
  const close=()=>{ if(inList){html+='</ul>';inList=false;} };
  for(const b of blocks){
    if(b.t==='img'){ close(); html+=`<img src="${imgPage(b.src)}" alt="${T(b.alt||'')}" loading="lazy">`; continue; }
    const txt=b.txt||'';
    if(b.t==='li'){ if(!inList){html+='<ul>';inList=true;} html+=`<li>${T(txt)}</li>`; continue; }
    close();
    if(/^h[1-6]$/.test(b.t)){ const lvl=b.t==='h1'?'h2':b.t; html+=`<${lvl}>${T(txt)}</${lvl}>`; }
    else if(b.t==='btn'){ html+=`<p><a class="btn" href="/contact-us/">${T(txt)}</a></p>`; }
    else html+=`<p>${T(txt).replace(/\n/g,'<br>')}</p>`;
  }
  close();
  return html;
}
function buildGeneric(key, slug, title, active){
  const blocks=cleanBlocks(key);
  // drop leading duplicate of title heading
  const body = `${pageHero(title,[['Home','/'],[title]])}
  <section class="section"><div class="container"><div class="prose wide">${renderBlocks(blocks)}</div></div></section>`;
  writePage(slug, layout({title:decode(pages[key].title||title), desc:title+' - Vertex Line Solutions', active, body}));
}

/* ===================== BLOG ===================== */
function articleBlocks(key){
  const blocks=cleanBlocks(key).filter(b=>b.t!=='img'||true);
  return renderBlocks(blocks);
}
function buildBlogList(){
  const card=(href,img,title,excerpt,author,date)=>`<article class="blog-card"><a href="${href}" class="blog-card__media"><img src="${img}" alt=""><span class="blog-card__tag">BLOG</span></a><div class="blog-card__body"><h3><a href="${href}">${title}</a></h3><p>${excerpt}</p><a class="blog-card__more" href="${href}">READ MORE &raquo;</a><div class="blog-card__meta"><span>${author}</span><span class="dot"></span><span>${date}</span></div></div></article>`;
  const body=`${pageHero('Blogs & Insights',[['Home','/'],['Blog']])}
  <section class="section"><div class="container"><div class="bloglist-grid">
    ${card('/blog/why-choosing-the-right-safety-equipment-supplier/','/assets/images/blog-1.png','Why Choosing the Right Safety Equipment Supplier in Saudi Arabia Matters for Your Business','When a worker steps onto a job site, whether it is a petrochemical plant in Jubail or a construction corridor…','WaizUser','March 29, 2026')}
    ${card('/blog/mandatory-ppe-for-aramco-approved-projects/','/assets/images/blog-2.jpg','Mandatory PPE for Aramco Approved Projects in Saudi Arabia','Aramco-approved projects require certified PPE including hard hats, safety glasses, gloves, safety footwear, and more.','A Raaz','February 23, 2026')}
  </div></div></section>`;
  writePage('blog', layout({title:'Blogs & Insights - Vertex Line Solutions', desc:'Safety and industrial insights from Vertex Line Solutions.', active:'', body}));
}
function buildPost(key, slug, title, img, author, date){
  const content = articleBlocks(key);
  const body=`${pageHero('Blogs & Insights',[['Home','/'],['Blog','/blog/'],[title]])}
  <section class="section"><div class="container"><article class="article">
    <div class="article-hero"><img src="${img}" alt="${T(title)}"></div>
    <div class="article-meta"><span>${author}</span><span>•</span><span>${date}</span></div>
    <h1>${T(title)}</h1>
    ${content}
    <div style="margin-top:34px"><a class="btn" href="/blog/">&laquo; Back to Blog</a></div>
  </article></div></section>`;
  writePage('blog/'+slug, layout({title:title+' - Vertex Line Solutions', desc:title, active:'', body}));
}

/* ===================== RUN ===================== */
buildHome();
buildShop();
categories.forEach(buildCategory);
products.forEach(buildProduct);
buildAbout();
buildContact();
buildFaq();
buildPartners();
buildBrands();
buildAllCategories();
buildStoreLocation();
buildOurStores();
buildGeneric('uae','uae','PPE & Industrial Safety Equipment Supplier in UAE','');
buildGeneric('terms','terms-of-use','Terms of Use','');
buildBlogList();
buildPost('post-safety','why-choosing-the-right-safety-equipment-supplier','Why Choosing the Right Safety Equipment Supplier in Saudi Arabia Matters for Your Business','/assets/images/blog-1.png','WaizUser','March 29, 2026');
buildPost('post-ppe','mandatory-ppe-for-aramco-approved-projects','Mandatory PPE for Aramco Approved Projects in Saudi Arabia','/assets/images/blog-2.jpg','A Raaz','February 23, 2026');

console.log('Build complete.');
