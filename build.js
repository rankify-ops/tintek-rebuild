// =============================================================
// Tintek Roofing site builder
// Generates every page (services, roofing, locations, etc.)
// from a shared layout. Run: `node build.js`
// =============================================================
const fs = require('fs');
const path = require('path');

// ---------- helpers ----------
const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slugDepth = slug => slug.split('/').filter(Boolean).length;
const root = slug => '../'.repeat(slugDepth(slug));

// ---------- nav data ----------
const NAV = {
  services: [
    ['/services/emergency-roof-repairs-gold-coast/', 'Emergency Roof Repairs'],
    ['/services/gutter-guard-gold-coast/', 'Gutter Guard'],
    ['/services/gutters-downpipes-gold-coast/', 'Gutters & Downpipes'],
    ['/roofing/re-roofing-roof-replacements/', 'Re-Roofing & Replacements'],
    ['/services/roof-inspection-gold-coast/', 'Roof Inspections'],
    ['/services/roof-ventilation-gold-coast/', 'Roof Ventilation'],
    ['/services/roof-repairs-gold-coast/', 'Roof Repairs'],
  ],
  roofing: [
    ['/roofing/new-roofing-gold-coast/', 'New Roofing'],
    ['/roofing/re-roofing-roof-replacements/', 'Re-Roofing & Replacements'],
    ['/roofing/heritage-roofing/', 'Heritage Roofing'],
    ['/roofing/residential-roofing/', 'Residential Roofing'],
    ['/roofing/commercial-roofing-gold-coast/', 'Commercial Roofing'],
    ['/roofing/industrial-roofing/', 'Industrial Roofing'],
  ],
  skylights: [
    ['/gold-coast-skylights/velux-skylights/', 'Velux Skylights'],
    ['/gold-coast-skylights/velux-skylights/velux-vs/', '— VELUX VS (Manual)'],
    ['/gold-coast-skylights/velux-skylights/velux-vss/', '— VELUX VSS (Solar)'],
    ['/gold-coast-skylights/velux-skylights/velux-vse/', '— VELUX VSE (Electric)'],
    ['/gold-coast-skylights/velux-skylights/velux-fs/', '— VELUX FS (Fixed)'],
    ['/gold-coast-skylights/velux-skylights/velux-fcm/', '— VELUX FCM (Curb-Mount Fixed)'],
    ['/gold-coast-skylights/velux-skylights/velux-vcm/', '— VELUX VCM (Curb-Mount Manual)'],
    ['/gold-coast-skylights/velux-skylights/velux-vcs/', '— VELUX VCS (Curb-Mount Solar)'],
    ['/gold-coast-skylights/velux-skylights/velux-ggl-gpl/', '— VELUX GGL/GPL (Pivot)'],
    ['/gold-coast-skylights/solatube-skylights/', 'Solatube Skylights'],
    ['/gold-coast-skylights/solatube-skylights/daylighting-system/', '— Daylighting System'],
    ['/gold-coast-skylights/solatube-skylights/heavenly-intelligent/', '— Heavenly Intelligent'],
    ['/gold-coast-skylights/solatube-skylights/solatube-econotube/', '— Econotube'],
    ['/gold-coast-skylights/solatube-skylights/commercial-solatube/', '— Commercial Solatube'],
    ['/gold-coast-skylights/solatube-skylights/solatube-solastar/', '— SolaStar'],
  ],
  locations: [
    ['/locations/gold-coast-roofing-services/', 'Gold Coast'],
    ['/locations/tweed-heads/', 'Tweed Heads'],
    ['/locations/burleigh/', 'Burleigh'],
    ['/locations/palm-beach/', 'Palm Beach'],
    ['/locations/roofing-murwillumbah/', 'Murwillumbah'],
    ['/locations/cabarita-beach/', 'Cabarita Beach'],
    ['/locations/nerang/', 'Nerang'],
    ['/locations/mudgeeraba/', 'Mudgeeraba'],
    ['/locations/roofing-pottsville/', 'Pottsville'],
    ['/locations/kingscliff/', 'Kingscliff'],
    ['/locations/banora-point/', 'Banora Point'],
    ['/locations/robina/', 'Robina'],
  ],
};

// =============================================================
// Component builders
// =============================================================

function head(p) {
  const url = `https://tintek.com.au${p.slug}`;
  const ogImg = p.ogImg || `https://tintek.com.au/images/PRINT__DSC8213_reduced.jpg`;
  const r = root(p.slug);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(p.metaTitle)}</title>
<meta name="description" content="${esc(p.metaDesc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Tintek Roofing & Cladding">
<meta property="og:title" content="${esc(p.metaTitle)}">
<meta property="og:description" content="${esc(p.metaDesc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImg}">
<meta property="og:locale" content="en_AU">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.metaTitle)}">
<meta name="twitter:description" content="${esc(p.metaDesc)}">
<meta name="twitter:image" content="${ogImg}">
<meta name="geo.region" content="AU-QLD"><meta name="geo.placename" content="Gold Coast">
<meta name="theme-color" content="#0B2E60">
<link rel="icon" type="image/png" sizes="32x32" href="${r}images/favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="${r}images/favicon.png">
<link rel="apple-touch-icon" href="${r}images/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Arimo:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${r}assets/styles.css">
${p.schema ? `<script type="application/ld+json">${JSON.stringify(p.schema)}</script>` : ''}
</head>
<body>`;
}

function topbar() { return `
<div class="topbar">
  <div class="topbar-in">
    <div class="topbar-l">
      <a href="tel:0428219634"><span class="ic">📞</span>0428 219 634</a>
      <a href="mailto:admin@tintek.com.au"><span class="ic">✉</span>admin@tintek.com.au</a>
    </div>
    <div class="topbar-r"><a href="#">Servicing the Gold Coast, Brisbane & Northern NSW</a></div>
  </div>
</div>`; }

function nav(p) {
  const r = root(p.slug);
  const drop = (items) => items.map(([url, label]) => `<a href="${r.replace(/\/$/,'')}${url}">${label}</a>`).join('');
  return `
<nav class="nav" id="nav">
  <div class="nav-in">
    <a href="${r || '/'}" class="logo"><img src="${r}images/Asset-1.png" alt="Tintek Roofing & Cladding"></a>
    <ul class="nav-l">
      <li><a href="${r}services/">Services <span class="chev">▼</span></a><div class="dropdown">${drop(NAV.services)}</div></li>
      <li><a href="${r}roofing/">Roofing <span class="chev">▼</span></a><div class="dropdown">${drop(NAV.roofing)}</div></li>
      <li><a href="${r}gold-coast-skylights/">Skylights <span class="chev">▼</span></a><div class="dropdown">${drop(NAV.skylights)}</div></li>
      <li><a href="${r}locations/">Service Areas</a></li>
      <li><a href="${r}about/">About</a></li>
      <li><a href="${r}contact/">Contact</a></li>
    </ul>
    <div class="nav-r">
      <a href="tel:0428219634" class="nav-ph"><span class="ph-ic">📞</span>0428 219 634</a>
      <a href="#quote-form" class="nav-cta" data-fallback="${r}contact/#quote-form">Free Quote</a>
      <button class="mob-tog" id="mobTog" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</nav>`;
}

function drawer(p) {
  const r = root(p.slug);
  return `
<div class="mdrawer" id="mdrawer">
  <button class="mdrawer-close" id="mdClose" aria-label="Close menu">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M6 18L18 6"/></svg>
  </button>
  <ul class="mdrawer-list">
    <li><a href="${r}services/">Services</a></li>
    ${NAV.services.map(([u,l]) => `<li><a href="${r.replace(/\/$/,'')}${u}" class="sublink">${l}</a></li>`).join('')}
    <li><a href="${r}roofing/">Roofing</a></li>
    ${NAV.roofing.map(([u,l]) => `<li><a href="${r.replace(/\/$/,'')}${u}" class="sublink">${l}</a></li>`).join('')}
    <li><a href="${r}gold-coast-skylights/">Skylights</a></li>
    ${NAV.skylights.map(([u,l]) => `<li><a href="${r.replace(/\/$/,'')}${u}" class="sublink">${l}</a></li>`).join('')}
    <li><a href="${r}locations/">Service Areas</a></li>
    <li><a href="${r}about/">About</a></li>
    <li><a href="${r}faq/">FAQ</a></li>
    <li><a href="${r}contact/">Contact</a></li>
  </ul>
  <div class="mdrawer-cta">
    <a href="tel:0428219634" class="mc-call">📞 0428 219 634</a>
    <a href="#quote-form" class="mc-quote" data-fallback="${r}contact/#quote-form">Get a Free Quote →</a>
  </div>
</div>`;
}

function innerHero(p) {
  const r = root(p.slug);
  const bg = p.heroImg ? `${r}images/${p.heroImg}` : `${r}images/PRINT__DSC8213_reduced.jpg`;
  // Most inner pages render a quoteForm() at the bottom — link the hero CTA to that local form.
  // /contact/ itself has its own form too (id="quote-form"), so #quote-form is safe everywhere.
  const quoteHref = p.contactCta ? `${r}contact/#quote-form` : '#quote-form';
  return `
<section class="ihero">
  <div class="ihero-bg"><img src="${bg}" alt=""></div>
  <div class="ihero-inner">
    <div class="ctr">
      <nav class="bcrumb">
        <a href="${r || '/'}">Home</a>${p.crumbs.map(([u,l]) => ` <span>›</span> <a href="${r.replace(/\/$/,'')}${u}">${esc(l)}</a>`).join('')}
        <span>›</span> <span class="bcrumb-cur">${esc(p.crumbCurrent || p.h1)}</span>
      </nav>
      <div class="ihero-tag">${p.heroTag || '⚡ Free Quote · No Obligation'}</div>
      <h1>${p.h1Markup || esc(p.h1)}</h1>
      <p class="ihero-sub">${p.heroSub}</p>
      <div class="ihero-btns">
        <a href="${quoteHref}" class="btn-p">Get Your Free Quote →</a>
        <a href="tel:0428219634" class="btn-glass">📞 0428 219 634</a>
      </div>
    </div>
  </div>
</section>`;
}

function trustStrip() { return `
<section class="tstrip">
  <div class="ctr">
    <div class="tstrip-grid">
      <div class="tstrip-i"><div class="tstrip-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h12v4a6 6 0 0 1-12 0V4z"/><path d="M6 6H4v2a2 2 0 0 0 2 2"/><path d="M18 6h2v2a2 2 0 0 1-2 2"/><path d="M9 20h6"/><path d="M12 14v6"/></svg></div><div><div class="tstrip-v">QLD Owned</div><div class="tstrip-l">Local family business</div></div></div>
      <div class="tstrip-i"><div class="tstrip-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9"/></svg></div><div><div class="tstrip-v">4.8 Rating</div><div class="tstrip-l">20+ Google reviews</div></div></div>
      <div class="tstrip-i"><div class="tstrip-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L4 5v7c0 5 3.5 9 8 10 4.5-1 8-5 8-10V5l-8-3z"/><path d="M9 12l2 2 4-4"/></svg></div><div><div class="tstrip-v">Licensed</div><div class="tstrip-l">QBCC & fully insured</div></div></div>
      <div class="tstrip-i"><div class="tstrip-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="18" rx="2"/><path d="M9 4V2h6v2"/><path d="M9 10h6M9 14h6M9 18h4"/></svg></div><div><div class="tstrip-v">10+ Years</div><div class="tstrip-l">Hands-on experience</div></div></div>
    </div>
  </div>
</section>`; }

function featureGrid(features) { return `
<section class="sec">
  <div class="ctr">
    <div class="sec-head">
      <div class="divider"><span class="sec-tag">${features.tag || 'Features'}</span></div>
      <h2 class="sec-t fade">${esc(features.title)}</h2>
      ${features.sub ? `<p class="sec-sub fade">${esc(features.sub)}</p>` : ''}
    </div>
    <div class="fgrid">
      ${features.items.map(f => `
        <div class="fcard fade">
          <div class="fcard-ic">${f.icon}</div>
          <h3>${esc(f.title)}</h3>
          <p>${esc(f.desc)}</p>
        </div>`).join('')}
    </div>
  </div>
</section>`; }

function splitSection(s, p) {
  const r = root(p.slug);
  const flip = s.flip ? ' split-flip' : '';
  const quoteHref = s.localForm ? '#quote-form' : `${r}contact/#quote-form`;
  return `
<section class="sec split-sec${flip ? ' alt' : ''}">
  <div class="ctr">
    <div class="split-g${flip}">
      <div class="split-img fade"><img src="${r}images/${s.img}" alt="${esc(s.imgAlt || s.title)}"></div>
      <div class="split-content fade">
        <span class="sec-tag">${esc(s.tag)}</span>
        <h2 class="sec-t">${esc(s.title)}</h2>
        ${s.body.map(p => `<p class="sec-sub" style="margin-bottom:14px">${p}</p>`).join('')}
        ${s.bullets ? `<div class="about-list">${s.bullets.map(b => `<div class="al-item"><div class="al-check">✓</div>${esc(b)}</div>`).join('')}</div>` : ''}
        <a href="${quoteHref}" class="btn-blue" style="margin-top:8px">Get a Free Quote →</a>
      </div>
    </div>
  </div>
</section>`;
}

function urgency(p, custom) {
  const r = root(p.slug);
  const heading = custom?.heading || `Ready for a roof that <span class="em">lasts a lifetime?</span>`;
  const body = custom?.body || `Book your obligation-free roof inspection and quote today. We service the entire Gold Coast, Tweed Heads, Brisbane and Northern NSW — usually with a quote in your inbox within 48 hours.`;
  // If the page has its own quote form (product/contact pages), link to it locally; otherwise jump to /contact/
  const quoteHref = custom?.localForm ? '#quote-form' : `${r}contact/#quote-form`;
  return `
<div class="sec" style="padding-bottom:56px;padding-top:56px">
  <div class="urg fade">
    <div class="urg-in">
      <div class="urg-tag">⚡ Free Quote — No Obligation</div>
      <h3>${heading}</h3>
      <p>${esc(body)}</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <a href="${quoteHref}" class="btn-p">Request a Quote →</a>
        <a href="tel:0428219634" class="btn-glass">📞 0428 219 634</a>
      </div>
    </div>
  </div>
</div>`;
}

function reviewsSection() { return `
<section class="rev-sec">
  <div class="rev-header">
    <div class="divider"><span class="sec-tag">Reviews</span></div>
    <h2 class="sec-t fade">What Our Customers Say</h2>
    <div class="gbadge fade">
      <svg width="22" height="22" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.8 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.8-3.4-11.4-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.2-2.6-.4-3.9z"/></svg>
      <span class="gs">★★★★★</span><span class="gv">4.8</span><span class="gc">20+ Google reviews</span>
    </div>
  </div>
  <div class="marquee-row right"><div class="marquee-track">
    ${REVIEWS_A.concat(REVIEWS_A).map(r => rcard(r)).join('')}
  </div></div>
  <div class="marquee-row left"><div class="marquee-track">
    ${REVIEWS_B.concat(REVIEWS_B).map(r => rcard(r)).join('')}
  </div></div>
</section>`; }

const REVIEWS_A = [
  ['C','Charlotte Xiang',`Highly recommend Jacob and team! Very competitive price with high quality work. Very responsive, great communication! Will definitely use his service again!`],
  ['I','Indi Marais',`Very happy with the service from Jacob at Tintek roofing and cladding, very efficient and transparent throughout the whole process.`],
  ['K','Kylie Wansink',`Can highly recommend Jacob from Tintek. Very professional, great to work with and an excellent job replacing a tiled roof on a double story with new colourbond.`],
  ['T','Thomas Flood',`Not overly priced and worked efficiently to fix our roof and gutters, highly recommend!`],
  ['S','Sharon Mason',`Jacob did a great job — I'm more than happy with his work on my new roof. I chose him as a roofing specialist over using a builder.`],
  ['B','Billy Gregory',`Very professional and quality work, highly recommended!`],
];
const REVIEWS_B = [
  ['B','B Jake',`We recently had Jacob from Tintek come to our property and do repairs. His customer service is amazing — constant communication, timely, good work ethic, very efficient.`],
  ['S','Suzan Van Der Meulen',`Jacob did a great job fixing my gutters. He arrived on time and completed the work within the estimated time. He also pointed out other issues to discuss.`],
  ['I','Ian Anderson',`Excellent service and communication throughout the entire process. The skylight was professionally installed, everything handled with care and expertise.`],
  ['J','Jeni Wright',`Fantastic work from Tintek. Fast on-time service. Removed a downpipe from on top of the townhouse garage roof, adjusted the fall on the guttering and installed a new one.`],
  ['A','Alan & Caryn Broad',`Great experience! We were nervous having our entire roof replaced but Jacob & his team did a fantastic job from start to finish. Communication was great.`],
  ['Sa','Sandie Luxford',`Thanks so much for an outstanding job! The team replaced our old tiles with a stunning new Colorbond roof. Attention to detail and quality was amazing.`],
];
function rcard([initial, name, text]) {
  return `<div class="rcard"><div class="rs">★★★★★</div><p class="rt">"${esc(text)}"</p><div class="ra"><div class="rav">${esc(initial)}</div><div><div class="ran">${esc(name)}</div><div class="ral">Google Review</div></div></div></div>`;
}

function quoteForm(p, opts) {
  opts = opts || {};
  const product = opts.product || '';
  const intro = opts.intro || `Tell us a few quick details about your project and we'll come back with a tailored solution and obligation-free quote.`;
  const heading = opts.heading || `Get a free quote<br>in 60 seconds`;
  const tag = opts.tag || `⚡ Request a Free Quote Below`;
  const title = opts.title || `Quick 60-Second Quote`;
  return `
<section class="sec form-sec" id="quote">
  <div class="ctr">
    <div class="form-g">
      <div class="form-info fade">
        <span class="sec-tag">${product?'Product Quote':'Free Quote'}</span>
        <h2 class="sec-t">${heading}</h2>
        <p class="sec-sub">${esc(intro)}</p>
        <div class="fperks">
          <div class="fperk"><div class="fpd">✓</div>Free, no-obligation quote</div>
          <div class="fperk"><div class="fpd">✓</div>Quote turnaround within 48 hours</div>
          <div class="fperk"><div class="fpd">✓</div>QBCC licensed & fully insured</div>
          <div class="fperk"><div class="fpd">✓</div>Industry-leading manufacturer warranties</div>
        </div>
        <div class="form-contacts">
          <div class="fc-item"><div class="fc-ic">📞</div><div><div class="fc-l">Phone</div><a href="tel:0428219634" class="fc-v">0428 219 634</a></div></div>
          <div class="fc-item"><div class="fc-ic">✉</div><div><div class="fc-l">Email</div><a href="mailto:admin@tintek.com.au" class="fc-v">admin@tintek.com.au</a></div></div>
        </div>
      </div>
      <div class="qform fade" id="quote-form"${product?` data-product="${esc(product)}"`:''}>
        <div class="qform-head">
          <div class="qform-tag">${tag}</div>
          <h3 class="qform-title">${esc(title)}</h3>
          ${product?`<p class="qform-product-note">Enquiring about: <strong>${esc(product)}</strong></p>`:''}
        </div>
        <div class="fsteps"><div class="fstep active"></div><div class="fstep"></div><div class="fstep"></div><div class="fstep"></div></div>
        <div class="fslide active" data-s="1">
          <h3>What kind of project?</h3><p class="fsub">Pick the option that best describes your needs.</p>
          <div class="og">
            <button class="ob" data-v="new" onclick="sel(this)"><div class="oico">🏠</div><div class="olbl">New Roofing</div></button>
            <button class="ob" data-v="reroof" onclick="sel(this)"><div class="oico">🔄</div><div class="olbl">Re-Roofing</div></button>
            <button class="ob" data-v="repair" onclick="sel(this)"><div class="oico">🔧</div><div class="olbl">Repairs</div></button>
            <button class="ob" data-v="other" onclick="sel(this)"><div class="oico">💬</div><div class="olbl">Other</div></button>
          </div>
          <div class="fnav"><button class="fn" onclick="nxt()">Next →</button></div>
        </div>
        <div class="fslide" data-s="2">
          <h3>What type of property?</h3><p class="fsub">This helps us recommend the right materials.</p>
          <div class="og">
            <button class="ob" data-v="residential" onclick="sel(this)"><div class="oico">🏡</div><div class="olbl">Residential</div></button>
            <button class="ob" data-v="commercial" onclick="sel(this)"><div class="oico">🏢</div><div class="olbl">Commercial</div></button>
            <button class="ob" data-v="industrial" onclick="sel(this)"><div class="oico">🏭</div><div class="olbl">Industrial</div></button>
            <button class="ob" data-v="heritage" onclick="sel(this)"><div class="oico">🏛️</div><div class="olbl">Heritage</div></button>
          </div>
          <div class="fnav"><button class="fb" onclick="prv()">← Back</button><button class="fn" onclick="nxt()">Next →</button></div>
        </div>
        <div class="fslide" data-s="3">
          <h3>How urgent is the work?</h3><p class="fsub">We can prioritise emergency callouts where needed.</p>
          <div class="og">
            <button class="ob" data-v="emergency" onclick="sel(this)"><div class="oico">🚨</div><div class="olbl">Emergency</div></button>
            <button class="ob" data-v="month" onclick="sel(this)"><div class="oico">⏱️</div><div class="olbl">Within a month</div></button>
            <button class="ob" data-v="3months" onclick="sel(this)"><div class="oico">📅</div><div class="olbl">Within 3 months</div></button>
            <button class="ob" data-v="planning" onclick="sel(this)"><div class="oico">💭</div><div class="olbl">Just planning</div></button>
          </div>
          <div class="fnav"><button class="fb" onclick="prv()">← Back</button><button class="fn" onclick="nxt()">Next →</button></div>
        </div>
        <div class="fslide" data-s="4">
          <h3>Almost done — your details</h3><p class="fsub">We'll be in touch within 24 hours.</p>
          <input type="text" class="finp" placeholder="Your name" id="fn" autocomplete="name" required>
          <input type="tel" class="finp" placeholder="Phone number" id="fp" autocomplete="tel" required>
          <input type="email" class="finp" placeholder="Email address" id="fe" autocomplete="email" required>
          <input type="text" class="finp" placeholder="Suburb" id="fs" autocomplete="address-level2" required>
          <input type="text" id="fhp" name="_honey" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0" aria-hidden="true">
          <div class="fnav"><button type="button" class="fb" onclick="prv()">← Back</button><button type="button" class="fn" onclick="sub(event)">Request My Quote →</button></div>
        </div>
        <div class="fslide" data-s="5">
          <div style="text-align:center;padding:32px 0">
            <div style="font-size:2.6rem;margin-bottom:12px">✅</div>
            <h3 style="margin-bottom:8px;font-size:1.4rem">Thanks — we're on it!</h3>
            <p class="fsub" style="margin:0;font-size:.95rem">We'll be in touch within 24 hours with your tailored quote and recommendations.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`; }

const AREAS = ['Gold Coast','Tweed Heads','Burleigh','Palm Beach','Murwillumbah','Cabarita Beach','Nerang','Mudgeeraba','Pottsville','Kingscliff','Banora Point','Robina','Brisbane','Surfers Paradise','Broadbeach','Coolangatta','Currumbin','Northern NSW'];

function areasSection(p) {
  const r = root(p.slug);
  const map = {
    'Gold Coast': '/locations/gold-coast-roofing-services/',
    'Tweed Heads': '/locations/tweed-heads/',
    'Burleigh': '/locations/burleigh/',
    'Palm Beach': '/locations/palm-beach/',
    'Murwillumbah': '/locations/roofing-murwillumbah/',
    'Cabarita Beach': '/locations/cabarita-beach/',
    'Nerang': '/locations/nerang/',
    'Mudgeeraba': '/locations/mudgeeraba/',
    'Pottsville': '/locations/roofing-pottsville/',
    'Kingscliff': '/locations/kingscliff/',
    'Banora Point': '/locations/banora-point/',
    'Robina': '/locations/robina/',
  };
  return `
<section class="sec areas-sec" id="areas">
  <div class="ctr">
    <div class="sec-head">
      <div class="divider"><span class="sec-tag">Service Areas</span></div>
      <h2 class="sec-t fade">Servicing the Gold Coast & Beyond</h2>
      <p class="sec-sub fade">Locally based, with a team that travels right across the Gold Coast, Tweed Heads, Brisbane and Northern NSW.</p>
    </div>
    <div class="atags fade">
      ${AREAS.map(a => map[a] ? `<a href="${r.replace(/\/$/,'')}${map[a]}" class="atag">${a}</a>` : `<span class="atag">${a}</span>`).join('')}
    </div>
  </div>
</section>`;
}

function partners(p) {
  const r = root(p.slug);
  return `
<section class="partners">
  <div class="ctr">
    <div class="partners-row">
      <img src="${r}images/colo-lg-600x113-1.png" alt="Colorbond">
      <img src="${r}images/Velux_logo.svg" alt="Velux">
      <img src="${r}images/logo-1.webp" alt="Solatube">
      <img src="${r}images/master-builder.png" alt="Master Builder">
    </div>
  </div>
</section>`;
}

function footer(p) {
  const r = root(p.slug);
  return `
<footer class="foot">
  <div class="ctr">
    <div class="foot-g">
      <div class="foot-brand">
        <a href="${r || '/'}" class="logo"><img src="${r}images/Asset-1.png" alt="Tintek Roofing & Cladding"></a>
        <p>Our strong reputation is built on exceptional products, outstanding service, and competitive pricing. We stand behind the quality of our craftsmanship.</p>
        <div class="foot-soc"><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">ig</a><a href="#" aria-label="Google">G</a></div>
      </div>
      <div><h4>Quick Links</h4><ul class="foot-l">
        <li><a href="${r || '/'}">Home</a></li>
        <li><a href="${r}about/">About</a></li>
        <li><a href="${r}services/">Services</a></li>
        <li><a href="${r}faq/">FAQ</a></li>
        <li><a href="${r}contact/">Contact</a></li>
      </ul></div>
      <div><h4>Services</h4><ul class="foot-l">
        ${NAV.roofing.map(([u,l]) => `<li><a href="${r.replace(/\/$/,'')}${u}">${l}</a></li>`).join('')}
      </ul></div>
      <div><h4>Contact</h4><ul class="foot-l">
        <li><a href="tel:0428219634">📞 0428 219 634</a></li>
        <li><a href="mailto:admin@tintek.com.au">✉ admin@tintek.com.au</a></li>
        <li><a>📍 Gold Coast, QLD</a></li>
      </ul></div>
    </div>
    <div class="foot-b">
      <span>© 2026 Tintek Roofing & Cladding. All Rights Reserved.</span>
      <span><a href="${r}terms/">Terms</a> · <a href="${r}privacy/">Privacy</a> · Website by <a href="https://rankify.com.au">Rankify</a></span>
    </div>
  </div>
</footer>`;
}

function sticky(p) {
  const r = root(p.slug);
  return `
<div class="sticky">
  <a href="tel:0428219634" class="sc">📞 Call Us</a>
  <a href="#quote-form" class="sq" data-fallback="${r}contact/#quote-form">Free Quote</a>
</div>`;
}

function scriptTag(p) {
  return `<script src="${root(p.slug)}assets/script.js"></script></body></html>`;
}

// =============================================================
// Section helper compositions
// =============================================================

function processSection(p) {
  const r = root(p.slug);
  const steps = [
    [1,'13.png','Get In Touch','Call our office or enquire online for an obligation-free quotation.'],
    [2,'15.png','Meet On Site','We discuss your needs and measure the scope of work.'],
    [3,'16.png','Submit Quotation','Comprehensive quotation outlining the scope of works.'],
    [4,'12.png','Quote Acceptance','Signed acceptance with material, profile and colour selections.'],
    [5,'19.png','Schedule Work','Coordinate tradespeople and suppliers to schedule the start date.'],
    [6,'17.png','Roofing Begins','Installation of roofing and materials per the quotation.'],
    [7,'18.png','Job Completion','Finished job inspected and site left clean and tidy.'],
    [8,'14.png','Customer Satisfaction','Invoice and warranties issued, customer feedback requested.'],
  ];
  return `
<section class="sec proc-sec">
  <div class="ctr">
    <div class="sec-head">
      <div class="divider"><span class="sec-tag">Our Process</span></div>
      <h2 class="sec-t fade">From Contract to Completion</h2>
      <p class="sec-sub fade">A clear, transparent 8-step process so you always know exactly what's happening — and when.</p>
    </div>
    <div class="proc-g">
      ${steps.map(([n,img,t,d]) => `
        <div class="pstep fade"><span class="pstep-num">${n}</span><div class="pstep-ico"><img src="${r}images/${img}" alt=""></div><h4>${esc(t)}</h4><p>${esc(d)}</p></div>
      `).join('')}
    </div>
  </div>
</section>`;
}

function gallery(p) {
  const r = root(p.slug);
  const imgs = ['gallery-9ee77e48-1-1.jpg','gallery-3c80b64a-2-min-1.webp','gallery-b54b74e4-4-min-1.webp','gallery-b1d2cb41-17-min.webp','gallery-2a7353e5-23-min.webp','gallery-32892cd8-7-min-1.webp','gallery-0a5ac8ac-24-min.webp','gallery-8c55512e-15-min.webp'];
  return `
<section class="sec">
  <div class="ctr">
    <div class="sec-head">
      <div class="divider"><span class="sec-tag">Recent Work</span></div>
      <h2 class="sec-t fade">Premium Colorbond Roofs</h2>
      <p class="sec-sub fade">A selection of recently completed metal roofing projects across the Gold Coast.</p>
    </div>
    <div class="gal-g">
      ${imgs.map(i => `<div class="gal-i fade"><img src="${r}images/${i}" alt="Roofing project"></div>`).join('')}
    </div>
  </div>
</section>`;
}

function whyMini() { return `
<section class="sec why-sec">
  <div class="ctr">
    <div class="sec-head">
      <div class="divider"><span class="sec-tag">Why Choose Tintek</span></div>
      <h2 class="sec-t fade">Queensland's Preferred Roofing Company</h2>
      <p class="sec-sub fade">A reputation built on exceptional products, outstanding service, and a commitment to quality on every single project.</p>
    </div>
    <div class="why-mini">
      <div class="wm-card fade"><div class="wm-ic">🏆</div><h4>Queensland Owned & Operated</h4><p>Local family-run business. When you call, you talk to us.</p></div>
      <div class="wm-card fade"><div class="wm-ic">🛠️</div><h4>10+ Years Experience</h4><p>A decade of hands-on metal roofing expertise.</p></div>
      <div class="wm-card fade"><div class="wm-ic">🛡️</div><h4>Licensed & Insured</h4><p>Fully QBCC licensed and comprehensively insured.</p></div>
      <div class="wm-card fade"><div class="wm-ic">📋</div><h4>Industry Warranties</h4><p>Backed by leading manufacturer warranties on every job.</p></div>
    </div>
  </div>
</section>`; }

function productGrid(p, prods) {
  const r = root(p.slug);
  return `
<section class="sec proc-sec">
  <div class="ctr">
    <div class="sec-head">
      <div class="divider"><span class="sec-tag">${esc(prods.tag||'Product Range')}</span></div>
      <h2 class="sec-t fade">${esc(prods.title)}</h2>
      ${prods.sub?`<p class="sec-sub fade">${esc(prods.sub)}</p>`:''}
    </div>
    <div class="prodgrid">
      ${prods.items.map(it=>{
        const inner = `<div class="prodcard-img"><img src="${r}images/${it.img}" alt="${esc(it.title)}"></div>
          <h3>${esc(it.title)}</h3>
          ${it.desc?`<p>${esc(it.desc)}</p>`:''}
          ${it.link?`<span class="sarrow" style="margin-top:10px">View Details <span>→</span></span>`:''}`;
        return it.link
          ? `<a href="${r.replace(/\/$/,'')}${it.link}" class="prodcard fade clickable">${inner}</a>`
          : `<div class="prodcard fade">${inner}</div>`;
      }).join('')}
    </div>
  </div>
</section>`;
}

function showcaseGrid(p, items) {
  const r = root(p.slug);
  return `
<section class="sec">
  <div class="ctr">
    <div class="sec-head">
      <div class="divider"><span class="sec-tag">${esc(items.tag||'Inspiration')}</span></div>
      <h2 class="sec-t fade">${esc(items.title)}</h2>
      ${items.sub?`<p class="sec-sub fade">${esc(items.sub)}</p>`:''}
    </div>
    <div class="showcase-g">
      ${items.imgs.map((i,idx)=>`<div class="showcase-i fade${idx===0?' big':''}"><img src="${r}images/${i}" alt="Skylight inspiration"></div>`).join('')}
    </div>
  </div>
</section>`;
}

function relatedServices(p, exclude=[]) {
  const r = root(p.slug);
  const services = [
    {url:'/services/roof-repairs-gold-coast/', title:'Roof Repairs', desc:'Fast, reliable roof repairs to fix leaks, broken tiles and damaged sheets.'},
    {url:'/roofing/re-roofing-roof-replacements/', title:'Re-Roofing & Replacements', desc:'Premium Colorbond re-roofing — transform your home and save on energy.'},
    {url:'/services/roof-inspection-gold-coast/', title:'Roof Inspections', desc:'Thorough roof inspections with detailed reports and recommendations.'},
    {url:'/services/gutters-downpipes-gold-coast/', title:'Gutters & Downpipes', desc:'Custom Colorbond gutters and downpipes that protect your home for decades.'},
    {url:'/services/gutter-guard-gold-coast/', title:'Gutter Guard', desc:'Stop blocked gutters and protect against leaves, vermin and embers.'},
    {url:'/services/roof-ventilation-gold-coast/', title:'Roof Ventilation', desc:'Solar and whirlybird ventilation to reduce heat and humidity.'},
    {url:'/services/emergency-roof-repairs-gold-coast/', title:'Emergency Repairs', desc:'Storm damage or leaking roof? Same-day callouts available.'},
    {url:'/gold-coast-skylights/', title:'Skylights', desc:'Velux & Solatube skylights — bring natural light into any room.'},
  ].filter(s => !exclude.includes(s.url)).slice(0,4);
  return `
<section class="sec proc-sec">
  <div class="ctr">
    <div class="sec-head">
      <div class="divider"><span class="sec-tag">Related Services</span></div>
      <h2 class="sec-t fade">Other Services You Might Need</h2>
    </div>
    <div class="rel-g">
      ${services.map(s => `<a href="${r.replace(/\/$/,'')}${s.url}" class="rel-card fade">
        <h4>${esc(s.title)}</h4><p>${esc(s.desc)}</p>
        <span class="sarrow">Learn More <span>→</span></span>
      </a>`).join('')}
    </div>
  </div>
</section>`;
}

function faqSection(faqs) { return `
<section class="sec">
  <div class="ctr">
    <div class="sec-head">
      <div class="divider"><span class="sec-tag">FAQ</span></div>
      <h2 class="sec-t fade">Frequently Asked Questions</h2>
    </div>
    <div class="faq-list">
      ${faqs.map((f,i) => `
        <details class="faq-item fade"${i===0?' open':''}>
          <summary>${esc(f.q)}<span class="faq-icon">+</span></summary>
          <div class="faq-a">${f.a}</div>
        </details>`).join('')}
    </div>
  </div>
</section>`; }

// =============================================================
// LAYOUT
// =============================================================
function layout(p) {
  return [
    head(p),
    topbar(),
    nav(p),
    drawer(p),
    p.bodyHTML,
    sticky(p),
    scriptTag(p)
  ].join('');
}

// =============================================================
// PAGE BUILDERS — by type
// =============================================================

function buildServicePage(s) {
  const p = {
    slug: s.slug,
    metaTitle: s.metaTitle,
    metaDesc: s.metaDesc,
    h1: s.h1,
    heroSub: s.heroSub,
    heroImg: s.heroImg,
    crumbs: s.crumbs || [['/services/', 'Services']],
    crumbCurrent: s.crumbCurrent || s.h1,
    schema: {
      "@context":"https://schema.org","@type":"Service",
      "name":s.h1,"provider":{"@type":"RoofingContractor","name":"Tintek Roofing & Cladding","telephone":"+61428219634"},
      "areaServed":"Gold Coast, QLD, Australia","description":s.metaDesc
    }
  };
  p.bodyHTML = [
    innerHero(p),
    trustStrip(),
    splitSection({tag:'Overview',title:s.overviewTitle,body:s.overviewBody,bullets:s.overviewBullets,img:s.splitImg||s.heroImg||'PRINT__DSC8213_reduced.jpg',localForm:true},p),
    featureGrid({tag:"What's Included",title:s.featuresTitle,sub:s.featuresSub,items:s.features}),
    urgency(p,{heading:`Need ${s.shortName.toLowerCase()}? <span class="em">Get a free quote today.</span>`,body:`Free, no-obligation quote within 48 hours. QBCC licensed, fully insured, industry warranties.`,localForm:true}),
    whyMini(),
    s.gallery!==false ? gallery(p) : '',
    reviewsSection(),
    s.faqs ? faqSection(s.faqs) : '',
    relatedServices(p, [s.slug]),
    productQuoteForm(p,{
      topic: s.h1,
      kind: 'service',
      intro: `Tell us a few quick details about your ${s.shortName.toLowerCase()} and we'll come back with a fixed-price quote — free, no obligation, within 48 hours.`
    }),
    partners(p),
    areasSection(p),
    footer(p),
  ].join('');
  return p;
}

function buildSkylightPage(s) {
  const p = {
    slug: s.slug,
    metaTitle: s.metaTitle,
    metaDesc: s.metaDesc,
    h1: s.h1,
    heroSub: s.heroSub,
    heroImg: s.heroImg,
    crumbs: s.crumbs || [],
    crumbCurrent: s.crumbCurrent || s.h1,
  };
  p.bodyHTML = [
    innerHero(p),
    trustStrip(),
    splitSection({tag:'Overview',title:s.overviewTitle,body:s.overviewBody,bullets:s.overviewBullets,img:s.splitImg||s.heroImg||'PRINT__DSC8213_reduced.jpg'},p),
    s.products ? productGrid(p,s.products) : '',
    featureGrid({tag:"Why Tintek",title:s.featuresTitle,sub:s.featuresSub,items:s.features}),
    s.showcase ? showcaseGrid(p,s.showcase) : '',
    urgency(p,{heading:`Light up your home — <span class="em">free quote today.</span>`,body:`We'll bring samples and lay out your skylight options with a fixed-price quote. Free, no obligation.`}),
    whyMini(),
    reviewsSection(),
    s.faqs ? faqSection(s.faqs) : '',
    relatedServices(p, [s.slug]),
    quoteForm(p),
    partners(p),
    areasSection(p),
    footer(p),
  ].join('');
  return p;
}

// Simple single-step quote form for product / service pages.
// No wizard / project-type questions — the customer is on a specific page
// so the context is implicit. Just collect contact details.
function productQuoteForm(p, opts) {
  opts = opts || {};
  const topic = opts.topic || opts.product || '';        // product OR service name
  const kind = opts.kind || 'product';                    // 'product' | 'service'
  const isService = kind === 'service';
  const tagLabel = isService ? 'Service Quote' : 'Product Quote';
  const headingPrefix = isService ? 'Quote for' : 'Quote on the';
  const introDefault = isService
    ? `Tell us a few details and we'll come back with a fixed-price quote on ${topic} — fast, no-obligation.`
    : `Tell us a few details and we'll come back with a fixed-price quote on the ${topic} — supply, install, and warranty included.`;
  const intro = opts.intro || introDefault;
  // "Certified X installer" perk only makes sense for known product brands
  const installerPerk = topic.startsWith('VELUX') ? 'Certified Velux installer'
    : topic.startsWith('Solatube') ? 'Certified Solatube installer'
    : 'Fully QBCC licensed & insured';
  return `
<section class="sec form-sec" id="quote">
  <div class="ctr">
    <div class="form-g">
      <div class="form-info fade">
        <span class="sec-tag">${tagLabel}</span>
        <h2 class="sec-t">${headingPrefix}<br><span style="color:var(--blue)">${esc(topic)}</span></h2>
        <p class="sec-sub">${esc(intro)}</p>
        <div class="fperks">
          <div class="fperk"><div class="fpd">✓</div>Free, no-obligation quote</div>
          <div class="fperk"><div class="fpd">✓</div>Quote turnaround within 48 hours</div>
          <div class="fperk"><div class="fpd">✓</div>${esc(installerPerk)}</div>
          <div class="fperk"><div class="fpd">✓</div>Industry-leading manufacturer warranties</div>
        </div>
        <div class="form-contacts">
          <div class="fc-item"><div class="fc-ic">📞</div><div><div class="fc-l">Phone</div><a href="tel:0428219634" class="fc-v">0428 219 634</a></div></div>
          <div class="fc-item"><div class="fc-ic">✉</div><div><div class="fc-l">Email</div><a href="mailto:admin@tintek.com.au" class="fc-v">admin@tintek.com.au</a></div></div>
        </div>
      </div>
      <div class="qform fade" id="quote-form" data-topic="${esc(topic)}" data-kind="${kind}">
        <div class="qform-head">
          <div class="qform-tag">⚡ ${isService?'Quote':'Quote'} — ${esc(topic)}</div>
          <h3 class="qform-title">Request a Quote</h3>
          <p class="qform-product-note">Enquiring about: <strong>${esc(topic)}</strong></p>
        </div>
        <div class="psimple">
          <p class="fsub" style="margin-bottom:18px">Fill in your details and we'll get back within 24 hours.</p>
          <input type="text" class="finp" placeholder="Your name" id="fn" autocomplete="name" required>
          <input type="tel" class="finp" placeholder="Phone number" id="fp" autocomplete="tel" required>
          <input type="email" class="finp" placeholder="Email address" id="fe" autocomplete="email" required>
          <input type="text" class="finp" placeholder="Suburb" id="fs" autocomplete="address-level2" required>
          <textarea class="finp" placeholder="Anything else we should know? (optional)" id="fnotes" rows="3" style="resize:vertical;font-family:inherit"></textarea>
          <input type="text" id="fhp" name="_honey" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0" aria-hidden="true">
          <button type="button" class="fn" onclick="subSimple(event)" style="width:100%;margin-top:6px">Request My Quote →</button>
        </div>
        <div class="psimple-success" style="display:none;text-align:center;padding:32px 0">
          <div style="font-size:2.6rem;margin-bottom:12px">✅</div>
          <h3 style="margin-bottom:8px;font-size:1.4rem">Thanks — we're on it!</h3>
          <p class="fsub" style="margin:0;font-size:.95rem">We'll be in touch within 24 hours with your tailored quote${topic?' on '+esc(isService?topic:'the '+topic):''}.</p>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function productHero(p, s) {
  const r = root(p.slug);
  const isVelux = s.parent === 'velux';
  const brandLogo = isVelux ? `${r}images/Velux_logo.svg` : `${r}images/logo-1.webp`;
  return `
<section class="prodbar">
  <div class="prodbar-bg"></div>
  <div class="ctr prodbar-in">
    <nav class="bcrumb">
      <a href="${r||'/'}">Home</a>${(s.crumbs||[]).map(([u,l])=>` <span>›</span> <a href="${r.replace(/\/$/,'')}${u}">${esc(l)}</a>`).join('')}
      <span>›</span> <span class="bcrumb-cur">${esc(s.crumbCurrent||s.h1)}</span>
    </nav>
  </div>
</section>

<section class="prodhero">
  <div class="ctr">
    <div class="prodhero-g">
      <div class="prodhero-img fade">
        <img src="${r}images/${s.productImg||s.heroImg}" alt="${esc(s.h1)}">
        ${s.warrantyImg?`<img class="warranty-badge" src="${r}images/${s.warrantyImg}" alt="Warranty">`:''}
      </div>
      <div class="prodhero-content fade">
        <img class="brand-logo brand-logo-${isVelux?'velux':'solatube'}" src="${brandLogo}" alt="${isVelux?'Velux':'Solatube'}">
        <h1>${esc(s.h1)}</h1>
        <p class="prodhero-sub">${esc(s.heroSub)}</p>
        ${s.productFeatures?`<h3 class="pf-title">Product Features</h3><ul class="pf-list">${s.productFeatures.map(f=>`<li>${esc(f)}</li>`).join('')}</ul>`:''}
        <div class="prodhero-btns">
          ${s.brochure?`<a href="${s.brochure}" target="_blank" rel="noopener" class="btn-blue">Download Brochure</a>`:''}
          <a href="#quote-form" class="btn-p">Request a Quote →</a>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function explainerSection(p, s) {
  if (!s.explainers) return '';
  const r = root(p.slug);
  return `
<section class="sec explainer-sec">
  <div class="ctr">
    ${s.explainerTitle?`<div class="sec-head"><h2 class="sec-t fade" style="font-size:clamp(1.4rem,2.4vw,2rem)">${esc(s.explainerTitle)}</h2></div>`:''}
    <div class="exp-cards">
      ${s.explainers.map(e=>`
        <div class="exp-card fade">
          <div class="exp-img"><img src="${r}images/${e.img}" alt="${esc(e.title)}"></div>
          <h3>${esc(e.title)}</h3>
          <ul>${e.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}</ul>
        </div>`).join('')}
    </div>
  </div>
</section>`;
}

function buildProductPage(s) {
  const p = {
    slug:s.slug,
    metaTitle:s.metaTitle,
    metaDesc:s.metaDesc,
    h1:s.h1,
    heroSub:s.heroSub,
    heroImg:s.heroImg,
    crumbs:s.crumbs,
    crumbCurrent:s.crumbCurrent||s.h1,
  };
  p.bodyHTML = [
    productHero(p,s),
    trustStrip(),
    explainerSection(p,s),
    s.specs ? `<section class="sec proc-sec"><div class="ctr">
      <div class="sec-head"><div class="divider"><span class="sec-tag">Specifications</span></div><h2 class="sec-t fade">At a glance</h2></div>
      <div class="specs-g">${s.specs.map(sp=>`<div class="spec-i fade"><span class="spec-k">${esc(sp[0])}</span><span class="spec-v">${esc(sp[1])}</span></div>`).join('')}</div>
    </div></section>` : '',
    urgency(p,{
      heading:`Get a free quote on the <span class="em">${esc(s.h1)}.</span>`,
      body:`Our certified installers will measure your roof, recommend the right model, and give you a fixed-price quote — free, with no obligation.`,
      localForm:true
    }),
    productQuoteForm(p,{
      topic:s.h1,
      kind:'product',
      intro:`Tell us a few details and we'll come back with a fixed-price quote on the ${s.h1} — supply, install, and warranty included. Free, no obligation.`
    }),
    relatedSkylights(p,s.parent,s.slug),
    partners(p),
    areasSection(p),
    footer(p)
  ].join('');
  return p;
}

function relatedSkylights(p, parent, exclude) {
  const r = root(p.slug);
  const sets = {
    velux: [
      {url:'/gold-coast-skylights/velux-skylights/velux-vs/',img:'vs-cb_column-1.png',title:'VELUX VS',desc:'Manually operated top-hung skylights.'},
      {url:'/gold-coast-skylights/velux-skylights/velux-vss/',img:'VSSS062004AE_1600x1600.webp',title:'VELUX VSS',desc:'Solar-powered opening, no wiring.'},
      {url:'/gold-coast-skylights/velux-skylights/velux-vse/',img:'VSE_955x844.webp',title:'VELUX VSE',desc:'Electric opening with rain sensor.'},
      {url:'/gold-coast-skylights/velux-skylights/velux-fs/',img:'fixed.jpg',title:'VELUX FS',desc:'Fixed deck-mounted skylight.'},
      {url:'/gold-coast-skylights/velux-skylights/velux-fcm/',img:'fcm-pitch-940.png',title:'VELUX FCM',desc:'Fixed curb-mount skylight.'},
      {url:'/gold-coast-skylights/velux-skylights/velux-vcm/',img:'vcm-pitch-940-1.jpg',title:'VELUX VCM',desc:'Manual opening curb-mount.'},
      {url:'/gold-coast-skylights/velux-skylights/velux-vcs/',img:'vcs-landscape.png',title:'VELUX VCS',desc:'Solar opening curb-mount.'},
      {url:'/gold-coast-skylights/velux-skylights/velux-ggl-gpl/',img:'vs-cb_column-1.png',title:'VELUX GGL/GPL',desc:'Pivot roof window.'},
    ],
    solatube: [
      {url:'/gold-coast-skylights/solatube-skylights/daylighting-system/',img:'Solatube-Daylighting-System.png',title:'Solatube Daylighting',desc:'The original tubular skylight.'},
      {url:'/gold-coast-skylights/solatube-skylights/heavenly-intelligent/',img:'Solatube-Heavenly-Intelligent.png',title:'Heavenly Intelligent',desc:'Smart skylight with LED + dimming.'},
      {url:'/gold-coast-skylights/solatube-skylights/solatube-econotube/',img:'Solatube-Econotube.png',title:'Solatube Econotube',desc:'Affordable, high-quality daylight.'},
      {url:'/gold-coast-skylights/solatube-skylights/commercial-solatube/',img:'SkyVault-Series2.png',title:'Commercial Solatube',desc:'Heavy-duty SkyVault for commercial.'},
      {url:'/gold-coast-skylights/solatube-skylights/solatube-solastar/',img:'solar-star-1_1024x1024.jpg',title:'Solatube SolaStar',desc:'Solar-powered roof exhaust fan.'},
    ]
  };
  const items = (sets[parent]||[]).filter(x => x.url !== exclude);
  return `
<section class="sec proc-sec">
  <div class="ctr">
    <div class="sec-head">
      <div class="divider"><span class="sec-tag">Other Models</span></div>
      <h2 class="sec-t fade">Explore the rest of the range</h2>
    </div>
    <div class="prodgrid">
      ${items.map(it=>`<a href="${r.replace(/\/$/,'')}${it.url}" class="prodcard fade clickable">
        <div class="prodcard-img"><img src="${r}images/${it.img}" alt="${esc(it.title)}"></div>
        <h3>${esc(it.title)}</h3>
        <p>${esc(it.desc)}</p>
      </a>`).join('')}
    </div>
  </div>
</section>`;
}

function buildLocationPage(l) {
  const p = {
    slug: l.slug,
    metaTitle: l.title || `Roofing in ${l.suburb} - Tintek Roofing & Cladding`,
    metaDesc: l.desc || `Premier metal roofing specialists in ${l.suburb}. Free quotes, industry warranties, fully licensed. Serving ${l.suburb} & surrounds. Call 0428 219 634.`,
    h1: l.h1 || `We Service and Repair Roofs in ${l.suburb}`,
    heroSub: `Trusted metal roofing, re-roofing, and gutter specialists serving ${l.suburb} homes and businesses. Local team, premium Colorbond, free quotes.`,
    heroImg: l.heroImg || 'PRINT__DSC8213_reduced.jpg',
    crumbs: [['/locations/', 'Service Areas']],
    crumbCurrent: l.suburb,
    schema: {
      "@context":"https://schema.org","@type":"RoofingContractor",
      "name":`Tintek Roofing — ${l.suburb}`,
      "telephone":"+61428219634","email":"admin@tintek.com.au",
      "areaServed":{"@type":"Place","name":l.suburb},
      "address":{"@type":"PostalAddress","addressLocality":l.suburb,"addressRegion":"QLD","addressCountry":"AU"}
    }
  };
  p.bodyHTML = [
    innerHero(p),
    trustStrip(),
    splitSection({
      tag:`${l.suburb} Roofing`,
      title:`Local roofing experts who know ${l.suburb}`,
      body:[
        l.intro1 || `${l.suburb} homes face their share of harsh sun, salt spray, and summer storms — which is exactly why locals choose Tintek for premium Colorbond metal roofing built to handle it all.`,
        l.intro2 || `From single-storey re-roofs to complex multi-level builds, our local team brings over a decade of hands-on experience to every ${l.suburb} project.`
      ],
      bullets:[`Local team familiar with ${l.suburb} homes`,'Premium Colorbond installations','Storm & emergency repairs','Re-roofing specialists','Gutters, downpipes & gutter guards','Skylights, ventilation & inspections'],
      img:l.splitImg || l.heroImg || 'PRINT__DSC8213_reduced.jpg'
    },p),
    featureGrid({tag:'What We Do',title:`Our ${l.suburb} Roofing Services`,sub:`A full suite of roofing services for ${l.suburb} homes and businesses — all delivered by one local team.`,items:[
      {icon:'🏠',title:'Re-Roofing',desc:`Replace your old tiled or metal roof with a premium Colorbond system tailored for ${l.suburb}.`},
      {icon:'🚨',title:'Emergency Repairs',desc:`Storm or leak emergency? Same-day callouts available across ${l.suburb}.`},
      {icon:'🔍',title:'Roof Inspections',desc:`Detailed roof inspections with full reports — perfect before buying or selling.`},
      {icon:'💧',title:'Gutters & Downpipes',desc:`Custom Colorbond guttering installed across ${l.suburb} homes.`},
      {icon:'☀️',title:'Skylights',desc:`Velux & Solatube installations to brighten ${l.suburb} interiors.`},
      {icon:'🌬️',title:'Ventilation',desc:`Solar and whirlybird ventilation to keep ${l.suburb} homes cool in summer.`},
    ]}),
    urgency(p,{heading:`${l.suburb}'s trusted roofing team — <span class="em">free quote today.</span>`,body:`We service ${l.suburb} and surrounding suburbs with same-week quotes and emergency callouts. Get in touch to book your inspection.`}),
    whyMini(),
    gallery(p),
    reviewsSection(),
    quoteForm(p),
    partners(p),
    areasSection(p),
    footer(p)
  ].join('');
  return p;
}

function buildRoofingTypePage(s) {
  const p = {
    slug: s.slug,
    metaTitle: s.metaTitle,
    metaDesc: s.metaDesc,
    h1: s.h1,
    heroSub: s.heroSub,
    heroImg: s.heroImg,
    crumbs: [['/roofing/','Roofing']],
    crumbCurrent: s.crumbCurrent || s.h1,
  };
  p.bodyHTML = [
    innerHero(p),
    trustStrip(),
    splitSection({tag:'Overview',title:s.overviewTitle,body:s.overviewBody,bullets:s.overviewBullets,img:s.splitImg||s.heroImg||'PRINT__DSC8213_reduced.jpg',localForm:true},p),
    featureGrid({tag:'Why Choose This',title:s.featuresTitle,sub:s.featuresSub,items:s.features}),
    urgency(p,{heading:`Ready for your <span class="em">${s.shortName} project?</span>`,body:`Book a free, no-obligation quote with the Gold Coast's preferred roofing team.`,localForm:true}),
    processSection(p),
    gallery(p),
    reviewsSection(),
    s.faqs ? faqSection(s.faqs) : '',
    productQuoteForm(p,{
      topic: s.h1,
      kind: 'service',
      intro: `Tell us about your ${s.shortName.toLowerCase()} project and we'll come back with a fixed-price quote — free, no obligation, within 48 hours.`
    }),
    partners(p),
    areasSection(p),
    footer(p),
  ].join('');
  return p;
}

// =============================================================
// PAGE DEFINITIONS
// =============================================================

const SERVICE_PAGES = [
  {
    slug:'/services/emergency-roof-repairs-gold-coast/',
    metaTitle:'Emergency Roof Repairs - Tintek Roofing & Cladding',
    metaDesc:'Storm damage, leaks, fallen trees? Tintek offers fast emergency roof repairs across the Gold Coast. Same-day callouts. Call 0428 219 634 now.',
    h1:'Emergency Roof Repairs Gold Coast',
    shortName:'emergency repairs',
    crumbCurrent:'Emergency Roof Repairs',
    heroSub:`Storm damage, leaks, or fallen branches? We're on standby for fast, same-day emergency roof repairs across the Gold Coast and Northern NSW.`,
    heroImg:'Colorbond_RESI_Wahroonga_0161_RT2_2000-1.webp',
    splitImg:'Colorbond_RESI_Wahroonga_0161_RT2_2000-1.webp',
    overviewTitle:'When you need a roofer fast',
    overviewBody:[`Storms hit hard on the Gold Coast — and a leaking roof can't wait. Tintek's emergency response team is on standby with the tools, materials, and experience to make your roof watertight again, fast.`,`We tarp, patch, replace damaged sheets, fix flashings, and re-secure loose tiles or panels — usually on the same day you call.`],
    overviewBullets:['Same-day emergency callouts','Storm & hail damage repairs','Fallen tree damage','Leak detection & repair','Insurance claim support','Tarp & make-safe service'],
    featuresTitle:`What's included in our emergency response`,
    featuresSub:`Everything you need to get your roof secure again — handled by one local, licensed team.`,
    features:[
      {icon:'⏱️',title:'Same-Day Response',desc:'Call before lunch and we usually have a tradesman on site that afternoon.'},
      {icon:'🚨',title:'Make-Safe Service',desc:'Tarping, sealing, and securing loose materials so further damage stops immediately.'},
      {icon:'🔧',title:'Permanent Repairs',desc:`We don't just patch — we fix the root cause so the leak doesn't come back.`},
      {icon:'📄',title:'Insurance Reports',desc:`Detailed photos, write-ups, and quotes to support your insurance claim.`},
    ],
    faqs:[
      {q:`How fast can you get to me?`,a:`We aim to be on-site the same day for genuine emergencies across the Gold Coast and Tweed. Call us early — slots fill fast in storm season.`},
      {q:`Do you do insurance work?`,a:`Yes — we handle insurance claims regularly and provide detailed photo reports, scope of works, and itemised quotes that insurance assessors love.`},
      {q:`What if it's after hours?`,a:`Leave a voicemail or message and we'll get back to you first thing. For genuine after-hours emergencies, we'll do our best to get someone there.`},
    ]
  },
  {
    slug:'/services/gutter-guard-gold-coast/',
    metaTitle:'Gutter Guard - Tintek Roofing & Cladding',
    metaDesc:'Premium gutter guard installation across the Gold Coast. Stop blocked gutters, leaves, vermin & embers. Free quotes. Call 0428 219 634.',
    h1:'Gutter Guard Gold Coast',
    shortName:'gutter guard',
    crumbCurrent:'Gutter Guard',
    heroSub:`Stop blocked gutters once and for all. Our premium gutter guard systems keep leaves, vermin, and embers out — so your roof and gutters last longer.`,
    heroImg:'aluminium-corrugated-gutter.jpg',
    splitImg:'aluminium-corrugated-gutter.jpg',
    overviewTitle:'Block leaves, embers, and vermin for good',
    overviewBody:[`Blocked gutters cause more damage than most homeowners realise — overflowing water rots fascia, rusts roofs, and floods ceilings. In bushfire-prone areas, dry leaves in gutters are also a major ember risk.`,`Tintek installs premium aluminium and steel mesh gutter guard systems that stop debris at the source, while still allowing maximum water flow.`],
    overviewBullets:['Premium aluminium & steel mesh','Bushfire-rated options available','Stops leaves, vermin & embers','Custom-fit to your gutters','10+ year warranties','Cleaning & maintenance reduced'],
    featuresTitle:'Why Tintek gutter guard works',
    featuresSub:`We don't fit cheap mesh that sags and rusts. Every system is custom-cut and screwed for a watertight, lifetime fit.`,
    features:[
      {icon:'🛡️',title:'BAL-Rated Available',desc:'Bushfire Attack Level rated mesh available for properties in bushfire-prone areas.'},
      {icon:'🦎',title:'Vermin-Proof',desc:'Stops snakes, possums, rats, and birds from nesting in your roof cavity.'},
      {icon:'🌧️',title:'Maximum Flow',desc:`Mesh design lets storm water through fast, even in heavy Gold Coast downpours.`},
      {icon:'⏱️',title:'Lifetime of Savings',desc:'Less roof maintenance, longer-lasting gutters, no ladder-cleaning every season.'},
    ],
    faqs:[
      {q:`Will it stop ALL leaves?`,a:`A quality steel-mesh system catches 99%+ of debris. Tiny seeds and pine needles can sometimes settle on top — but they blow off in heavy wind or rain.`},
      {q:`Does it work on Colorbond gutters?`,a:`Yes. We custom-fit gutter guard to all gutter profiles including Colorbond, quad, half-round, and box gutters.`},
      {q:`What's the warranty?`,a:`10+ year manufacturer warranty on the mesh, plus our installation warranty. Quality systems last 20+ years in Gold Coast conditions.`},
    ]
  },
  {
    slug:'/services/gutters-downpipes-gold-coast/',
    metaTitle:'Gutters and Downpipes - Tintek Roofing & Cladding',
    metaDesc:'Custom Colorbond gutters and downpipes installed across the Gold Coast. Free quotes, full colour range, industry warranties. Call 0428 219 634.',
    h1:'Gutters & Downpipes Gold Coast',
    shortName:'gutters & downpipes',
    crumbCurrent:'Gutters & Downpipes',
    heroSub:`Custom Colorbond gutters and downpipes — supplied, fitted, and finished by one local team. Choose from the full Colorbond colour range.`,
    heroImg:'Colorbond_RESI_Wahroonga_0161_RT2_2000-1.webp',
    splitImg:'Colorbond_RESI_Wahroonga_0161_RT2_2000-1.webp',
    overviewTitle:'Gutters that match your roof — and last decades',
    overviewBody:[`Your gutters and downpipes do more than collect rainwater — they protect your roof structure, fascia, and foundations from water damage. Faulty gutters are one of the leading causes of expensive home repairs.`,`Tintek supplies and fits custom-rolled Colorbond gutters in any profile and colour, plus matching downpipes, brackets, and rainheads. Old gutters out, new ones in — usually within a single day.`],
    overviewBullets:['Full Colorbond colour range','Quad, half-round & box profiles','Custom on-site rolling','Matching downpipes & rainheads','Old gutters removed & disposed','30+ year manufacturer warranty'],
    featuresTitle:`What's included in your installation`,
    featuresSub:`Premium materials, expert install, and zero shortcuts — so you only pay once.`,
    features:[
      {icon:'🎨',title:'Any Colorbond Colour',desc:`Match or contrast your roof — choose from the full Colorbond range.`},
      {icon:'📐',title:'Custom Rolled On-Site',desc:`Single-length seamless gutters rolled to your exact measurements.`},
      {icon:'💧',title:'Proper Fall',desc:`Set with the right fall so water flows fast and never pools.`},
      {icon:'🛡️',title:`Industry Warranties`,desc:`Backed by Colorbond's 30+ year warranty plus our workmanship warranty.`},
    ],
  },
  {
    slug:'/services/roof-inspection-gold-coast/',
    metaTitle:'Roof Inspection - Tintek Roofing & Cladding',
    metaDesc:'Comprehensive roof inspections across the Gold Coast. Detailed photo reports, no-obligation quotes for any repairs. Call 0428 219 634.',
    h1:'Roof Inspections Gold Coast',
    shortName:'roof inspections',
    crumbCurrent:'Roof Inspections',
    heroSub:`Buying a property? Selling? Insurance claim? Get a thorough, professional roof inspection with a detailed photo report — usually within 48 hours.`,
    heroImg:'6-Benefits-of-Installing-a-Metal-Roof-On-Your-Commercial-Property.webp',
    splitImg:'6-Benefits-of-Installing-a-Metal-Roof-On-Your-Commercial-Property.webp',
    overviewTitle:'Know exactly what you\'re dealing with',
    overviewBody:[`A proper roof inspection picks up problems before they become disasters. We climb every roof, photograph every issue, and put it all in a clear written report — so you know what you've got, what needs fixing, and what it'll cost.`,`Perfect for pre-purchase, pre-sale, insurance claims, or just peace of mind.`],
    overviewBullets:['On-roof physical inspection','Photographic evidence of every issue','Written report with findings','Repair cost estimates','Insurance-ready documentation','24-48 hour turnaround'],
    featuresTitle:`What gets inspected`,
    featuresSub:`We don't just glance from the ground — we walk every roof and check every detail.`,
    features:[
      {icon:'🏠',title:'Roof Sheets / Tiles',desc:`Damaged, lifted, missing, or corroded sheets and tiles.`},
      {icon:'💧',title:'Gutters & Downpipes',desc:`Rust, leaks, blockages, fall, and joint condition.`},
      {icon:'🔧',title:'Flashings & Penetrations',desc:`Around chimneys, vents, skylights, and valleys — the most common leak points.`},
      {icon:'🌫️',title:'Insulation & Ventilation',desc:`Roof cavity ventilation, insulation condition, and signs of moisture.`},
    ],
    faqs:[
      {q:`How much does a roof inspection cost?`,a:`We offer free quotes for any work — and a fixed-fee detailed written inspection report typically starts from a few hundred dollars depending on roof size. Call us for an exact figure.`},
      {q:`Do you do pre-purchase inspections?`,a:`Yes — pre-purchase roof inspections are one of our most-requested services. We turn around a written report within 48 hours so you can make an informed decision.`},
    ]
  },
  {
    slug:'/services/roof-ventilation-gold-coast/',
    metaTitle:'Roof Ventilation - Tintek Roofing & Cladding',
    metaDesc:'Roof ventilation systems across the Gold Coast — whirlybirds, solar vents, ridge ventilators. Reduce heat & humidity. Call 0428 219 634.',
    h1:'Roof Ventilation Gold Coast',
    shortName:'roof ventilation',
    crumbCurrent:'Roof Ventilation',
    heroSub:`Cooler home, lower power bills, longer-lasting roof. We install whirlybirds, solar vents, and ridge ventilators that actually move air.`,
    heroImg:'Untitled-design-2025-09-06T125010.309.webp',
    splitImg:'Untitled-design-2025-09-06T125010.309.webp',
    overviewTitle:'Make your home livable in summer',
    overviewBody:[`A poorly ventilated roof cavity can hit 70°C+ on a Gold Coast summer day — radiating heat down into your living spaces and forcing your air-con to work overtime.`,`Proper roof ventilation extracts that hot air, drops cavity temps by 15–25°C, and gives your insulation a chance to do its job.`],
    overviewBullets:['Whirlybirds (passive turbine vents)','Solar-powered roof vents','Ridge ventilators','Eave vents & soffit grilles','Reduces summer heat','Prevents moisture & mould'],
    featuresTitle:`Why ventilation matters`,
    featuresSub:`Most Gold Coast roofs are dramatically under-ventilated. Here's what good ventilation does for your home.`,
    features:[
      {icon:'❄️',title:'Cooler Living Spaces',desc:`Drops roof cavity temps by up to 25°C, making your home noticeably cooler.`},
      {icon:'💸',title:'Lower Power Bills',desc:`Less heat means less air-con — savings start the day it's installed.`},
      {icon:'🛡️',title:'Protects Your Roof',desc:`Heat stress shortens roof life. Ventilation extends it significantly.`},
      {icon:'🌫️',title:'Stops Mould',desc:`Removes humid air before it condenses and rots roof timbers or grows mould.`},
    ],
  },
  {
    slug:'/services/roof-repairs-gold-coast/',
    metaTitle:'Roof Repairs - Tintek Roofing & Cladding',
    metaDesc:'Professional roof repairs across the Gold Coast — leaks, broken tiles, damaged metal sheets, flashings. Free quotes. Call 0428 219 634.',
    h1:'Roof Repairs Gold Coast',
    shortName:'roof repairs',
    crumbCurrent:'Roof Repairs',
    heroSub:`Leak? Broken tile? Loose flashing? We fix every type of roof repair — quickly, properly, and with a workmanship warranty.`,
    heroImg:'6-Benefits-of-Installing-a-Metal-Roof-On-Your-Commercial-Property.webp',
    splitImg:'6-Benefits-of-Installing-a-Metal-Roof-On-Your-Commercial-Property.webp',
    overviewTitle:'Fix the leak — not just patch it',
    overviewBody:[`A roof leak rarely fixes itself — and the longer it goes, the more damage it causes inside. Tintek diagnoses the actual source of the leak, then carries out a permanent repair using matching materials.`,`Whether it's a single broken tile, a corroded flashing, or a major repair after storm damage, we tackle the root cause first time.`],
    overviewBullets:['Leak detection & repair','Broken/cracked tile replacement','Damaged metal sheet replacement','Flashing & valley repairs','Ridge cap re-bedding & re-pointing','Full workmanship warranty'],
    featuresTitle:`What we repair`,
    features:[
      {icon:'💧',title:'Roof Leaks',desc:`Diagnose the actual source — not just where it shows up on the ceiling — and fix it for good.`},
      {icon:'🧱',title:'Broken Tiles',desc:`Match-replace cracked, slipped, or missing tiles with matching profiles.`},
      {icon:'🔩',title:'Metal Sheet Damage',desc:`Replace corroded, hailed, or storm-damaged Colorbond and zinc sheets.`},
      {icon:'⚡',title:'Storm Damage',desc:`Tarping, make-safe, then permanent repairs after wind, hail, or fallen trees.`},
    ],
    faqs:[
      {q:`Will my repair match the rest of the roof?`,a:`We do everything we can to match — same Colorbond colour, same tile profile. On older roofs that have faded, we can recommend a partial recolour or section replacement to keep things tidy.`},
    ]
  },
  {
    slug:'/roofing/re-roofing-roof-replacements/',
    metaTitle:'Re-Roofing & Roof Replacements - Tintek Roofing & Cladding',
    metaDesc:'Revive your roof with our expert roof restoration services in Gold Coast. We specialize in re roofing & roof replacements. Call for a free consultation!',
    h1:'Re-Roofing & Roof Replacements',
    shortName:'re-roofing',
    crumbCurrent:'Re-Roofing & Replacements',
    heroSub:`Replace your tired old tile or metal roof with premium Colorbond. Tile-to-metal conversion specialists. Transform your home's look — and its value.`,
    heroImg:'HOUSE2-3_0.jpg',
    splitImg:'HOUSE2-3_0.jpg',
    overviewTitle:'A brand-new roof, in as little as a few days',
    overviewBody:[`Re-roofing is the single most impactful home improvement you can make — it transforms your home's look, kills decades of maintenance headaches, and adds real resale value.`,`Tintek specialises in tile-to-Colorbond conversions, full metal replacements, and complete re-roofs of every size. We supply, install, and warranty the whole job.`],
    overviewBullets:['Tile-to-metal conversions','Full Colorbond colour range','30+ year manufacturer warranty','Existing roof removed & disposed','New gutters, flashings, ridges','Most jobs done in 3–5 days'],
    featuresTitle:`Why re-roof with Tintek`,
    featuresSub:`Premium materials, expert installation, and a fixed-price quote with no surprises.`,
    features:[
      {icon:'🏠',title:'Tile-to-Metal Specialists',desc:`We take old tiled roofs off and replace with premium Colorbond — usually 1/3 the weight.`},
      {icon:'🎨',title:'Full Colorbond Range',desc:`Choose from every Colorbond colour — we'll bring samples to your home.`},
      {icon:'🛡️',title:'30+ Year Warranties',desc:`Industry-leading warranties on materials AND our workmanship.`},
      {icon:'📈',title:'Adds Real Value',desc:`A new Colorbond roof typically adds 5–10% to your home's resale value.`},
    ],
  },
];

const ROOFING_TYPE_PAGES = [
  {
    slug:'/roofing/new-roofing-gold-coast/',
    metaTitle:'Cost of New Roof | Tintek Roofing & Cladding',
    metaDesc:'Discover the cost of a new roof with us. We offer competitive pricing for Colorbond roofs. Contact us for a detailed estimate!',
    h1:'New Roofing',
    shortName:'new roofing',
    crumbCurrent:'New Roofing',
    heroSub:`Builder-grade roofing for new homes and developments. Premium Colorbond, on-time delivery, and a finish that sets your build apart.`,
    heroImg:'8-1-hero.jpg',
    splitImg:'8-1-hero.jpg',
    overviewTitle:'Get the new build right, the first time',
    overviewBody:[`A new home deserves a new roof done right. Tintek partners with builders, owner-builders, and project managers across the Gold Coast to deliver premium Colorbond roofing on schedule, on budget, and to spec.`,`We work to your build program — no delays, clear communication, and a finish that holds up for decades.`],
    overviewBullets:['Builder-friendly scheduling','Premium Colorbond systems','On-time, on-budget delivery','Custom flashings & detailing','Insulation & sarking installation','Sign-off ready, defect-free finish'],
    featuresTitle:`Why builders choose Tintek`,
    features:[
      {icon:'📅',title:'On-Time, Every Time',desc:`Reliable lead times so your build doesn't stall waiting on the roof.`},
      {icon:'📞',title:'Direct Communication',desc:`You talk to us — not a call centre. Quick decisions, no chasing.`},
      {icon:'🎨',title:'Full Colour Range',desc:`Every Colorbond colour available, including new Matt finishes.`},
      {icon:'✅',title:'Sign-Off Ready',desc:`Defect-free finish so your final inspection passes first time.`},
    ],
  },
  {
    slug:'/roofing/heritage-roofing/',
    metaTitle:'Heritage Roofing - Tintek Roofing & Cladding',
    metaDesc:'Preserve the charm of your property with expert heritage roofing services. Skilled in roof restoration, roof leak repair, get in touch today!',
    h1:'Heritage Roofing',
    shortName:'heritage roofing',
    crumbCurrent:'Heritage Roofing',
    heroSub:`Period-correct materials, traditional techniques, and modern weathertightness — for roofs that respect the original architecture.`,
    heroImg:'98239326-095c-4425-88ba-2e36e8d89808-min.webp',
    splitImg:'98239326-095c-4425-88ba-2e36e8d89808-min.webp',
    overviewTitle:'Heritage character. Modern protection.',
    overviewBody:[`Heritage homes deserve more than a generic re-roof. Original profiles, traditional joinery, and the right materials all matter — both for council compliance and for the integrity of the home.`,`Tintek has a soft spot for heritage projects. We source period-correct profiles, work to council guidelines, and deliver a finish that looks like it belongs.`],
    overviewBullets:['Period-correct profiles & finishes','Council-compliant restoration','Galvanised, zinc & specialty metals','Traditional flashings & detailing','Pre-purchase heritage roof reports','Insurance-grade documentation'],
    featuresTitle:`What sets our heritage work apart`,
    features:[
      {icon:'🏛️',title:'Period Profiles',desc:`We source and install original-spec profiles — corrugated, shallow rib, custom orb.`},
      {icon:'📐',title:'Traditional Detailing',desc:`Lead flashings, soldered joins, custom gutters — done the old-school way.`},
      {icon:'📜',title:'Council-Compliant',desc:`We work within heritage overlay guidelines and supply documentation as required.`},
    ],
  },
  {
    slug:'/roofing/residential-roofing/',
    metaTitle:'Residential Roofing - Tintek Roofing & Cladding',
    metaDesc:'Expert residential roofing in Gold Coast. Services include roofing repairs, Colorbond roof installations, and leaking roof fixes.',
    h1:'Residential Roofing',
    shortName:'residential roofing',
    crumbCurrent:'Residential Roofing',
    heroSub:`From single-storey homes to architectural builds — we deliver premium residential metal roofing that looks great and lasts decades.`,
    heroImg:'ColourbondArchitectureShoot_1705180171-Extend-HR_CMYK_Reduced.jpg',
    splitImg:'ColourbondArchitectureShoot_1705180171-Extend-HR_CMYK_Reduced.jpg',
    overviewTitle:'Roofing that protects what matters',
    overviewBody:[`Your roof is the single largest piece of weatherproofing on your home. Done right, it protects your family, your insulation, your ceilings, and your possessions for 30+ years. Done wrong, it costs you over and over.`,`Tintek specialises in residential roofing across the Gold Coast — new builds, re-roofs, replacements, and everything in between.`],
    overviewBullets:['Single-storey & multi-level homes','Tile-to-Colorbond conversions','Architectural & complex roof shapes','Solar-ready installations','Insulation & sarking included','30+ year manufacturer warranty'],
    featuresTitle:`Built for Gold Coast homes`,
    features:[
      {icon:'☀️',title:'Heat-Reflective Colours',desc:`Cool roof technology lowers cavity temps and reduces air-con bills.`},
      {icon:'🌧️',title:'Storm-Rated',desc:`Engineered for cyclone-region wind loading and torrential rain.`},
      {icon:'🌊',title:'Coastal Corrosion-Resistant',desc:`Right-spec materials for properties near the beach so they don't rust out early.`},
      {icon:'🔇',title:'Quiet & Insulated',desc:`Proper sarking and insulation makes a metal roof as quiet as tile.`},
    ],
  },
  {
    slug:'/roofing/commercial-roofing-gold-coast/',
    metaTitle:'Commercial Roofing | Tintek Roofing & Cladding',
    metaDesc:'Expert commercial roofing services in Gold Coast. We specialize in roof repairs, gutter replacement, and Colorbond roofing sheets for businesses.',
    h1:'Commercial Roofing',
    shortName:'commercial roofing',
    crumbCurrent:'Commercial Roofing',
    heroSub:`Offices, retail, schools, warehouses — we deliver commercial roofing projects on time, on budget, and with minimal disruption to your operation.`,
    heroImg:'24033_reduced.webp',
    splitImg:'24033_reduced.webp',
    overviewTitle:'Commercial roofing without the chaos',
    overviewBody:[`Commercial projects are different — there's a building manager, a body corporate, tenants, and a tight schedule. Tintek brings the right team, the right paperwork, and the right project management to keep it all running smoothly.`,`From single-shop awnings to multi-thousand-square-metre warehouse re-roofs, we've handled it.`],
    overviewBullets:['Project management & scheduling','SWMS & site safety documentation','After-hours work where required','Body-corporate friendly','Minimal disruption to tenants','Compliance certificates issued'],
    featuresTitle:`Why commercial clients choose us`,
    features:[
      {icon:'📋',title:'Full Documentation',desc:`SWMS, JSAs, induction-ready, fully insured — paperwork sorted.`},
      {icon:'🌙',title:'After-Hours Available',desc:`Weekend or overnight work for retail and tenanted buildings.`},
      {icon:'👷',title:'Skilled Team',desc:`Licensed roofers and electricians for solar-ready and complex installs.`},
    ],
  },
  {
    slug:'/roofing/industrial-roofing/',
    metaTitle:'Industrial Roofing | Tintek Roofing & Cladding',
    metaDesc:'Expert industrial roofing services in Gold Coast. From maintenance to roof replacements, we deliver durable solutions using Colorbond roofs.',
    h1:'Industrial Roofing',
    shortName:'industrial roofing',
    crumbCurrent:'Industrial Roofing',
    heroSub:`Heavy-duty industrial roofing — warehouses, factories, sheds, and distribution centres. Built for performance and longevity.`,
    heroImg:'Block-2022-8-11-22-206.webp',
    splitImg:'Block-2022-8-11-22-206.webp',
    overviewTitle:'Built for industrial workloads',
    overviewBody:[`Industrial roofs face conditions residential roofs never see — extreme spans, heavy plant equipment loads, chemical exposure, and around-the-clock workloads. They demand engineered systems and tradesmen who know what they're doing.`,`Tintek installs and maintains industrial roofing that's specced right for the job — and built to keep working.`],
    overviewBullets:['Long-span profiles up to 40m+','Heavy-gauge structural sheeting','Chemical-resistant coatings available','Engineered for plant loads','Skylight & vent integration','Re-roofs over operational facilities'],
    featuresTitle:`Industrial-grade specifications`,
    features:[
      {icon:'🏭',title:'Long-Span Specialists',desc:`Continuous-length sheeting for maximum span and minimum joints.`},
      {icon:'⚙️',title:'Plant Load Engineering',desc:`Roofs designed to handle solar arrays, HVAC, and plant equipment loads.`},
      {icon:'🛡️',title:'Specialty Coatings',desc:`Chemical-resistant and high-temperature coating options where required.`},
    ],
  },
];

const SKYLIGHT_PAGES = [
  {
    slug:'/gold-coast-skylights/',
    metaTitle:'Skylights - Tintek Roofing & Cladding',
    metaDesc:'Velux and Solatube skylight installations across the Gold Coast. Bring natural light into any room. Free quotes. Call 0428 219 634.',
    h1:'Gold Coast Skylights',
    shortName:'skylights',
    crumbCurrent:'Skylights',
    crumbs:[],
    heroSub:`Brighten up dark rooms with premium Velux and Solatube skylights. Designed for Australian homes, professionally installed by certified roofing tradesmen.`,
    heroImg:'The-Block-2021-Wk718741-scaled-1.jpg',
    splitImg:'1-2.webp',
    showcase:{tag:'Inspiration',title:'See what natural light can do',sub:'Real installations from kitchens, bathrooms, hallways and living spaces — all transformed with Velux or Solatube.',imgs:['Modern-kitchen-with-skylights.jpg','HGTV-EMHE-kitchen-1-low-res-exp-03-29-2021.jpg','Kitchen-Remodel-with-Solatube-Before-and-After-2-2.jpg','The-Block-2021-Wk718741-scaled-1.jpg','1-2.webp','2-2.webp','Untitled-design-2025-09-06T130256.242.webp']},
    overviewTitle:'Natural light, professionally installed',
    overviewBody:[`A well-placed skylight transforms a dark hallway, bathroom, or living space — flooding it with free, natural daylight all day long. Done right, it's leak-proof, energy-efficient, and adds real value.`,`Tintek is a certified Velux and Solatube installer, with hundreds of skylight installations across the Gold Coast.`],
    overviewBullets:['Velux fixed & opening skylights','Solatube tubular skylights','Bathroom-rated wet area options','Solar-powered ventilating models','Blinds & remote control available','Lifetime leak-free guarantee'],
    featuresTitle:`Why skylights from Tintek`,
    features:[
      {icon:'☀️',title:'Free Daylight',desc:`Up to 3x more natural light than a window of equivalent size.`},
      {icon:'💧',title:'Leak-Free Promise',desc:`Installed by certified roofers, not handymen — flashed properly the first time.`},
      {icon:'🌬️',title:'Optional Ventilation',desc:`Choose opening models that exhaust hot air and bring in fresh airflow.`},
      {icon:'🛡️',title:'10-Year Warranties',desc:`Backed by Velux and Solatube manufacturer warranties.`},
    ]
  },
  {
    slug:'/gold-coast-skylights/velux-skylights/',
    metaTitle:'Velux Skylights - Tintek Roofing & Cladding',
    metaDesc:'Certified Velux skylight installation across the Gold Coast. Fixed, opening, solar-powered models. Free quotes. Call 0428 219 634.',
    h1:'Velux Skylights Gold Coast',
    shortName:'Velux skylights',
    crumbCurrent:'Velux',
    crumbs:[['/gold-coast-skylights/','Skylights']],
    heroSub:`Premium Velux skylights — fixed, manual-opening, and solar-powered models. Certified installation, leak-free guarantee.`,
    heroImg:'1727096657-899267-influencer-justina-blakeney-4945-skylights-kitchen-1022.avif',
    splitImg:'Untitled-design-2025-09-06T130256.242.webp',
    products:{
      tag:'Velux Range',
      title:'The full VELUX skylight range',
      sub:`From manually operated VS skylights to solar-powered VSS units, fixed FS skylights, and curb-mounted FCM/VCM/VCS variants — there's a VELUX for every roof and every room.`,
      items:[
        {img:'vs-cb_column-1.png',title:'VELUX VS',desc:'Manually operated top-hung skylight.',link:'/gold-coast-skylights/velux-skylights/velux-vs/'},
        {img:'VSSS062004AE_1600x1600.webp',title:'VELUX VSS',desc:'Solar-powered opening, no wiring.',link:'/gold-coast-skylights/velux-skylights/velux-vss/'},
        {img:'VSE_955x844.webp',title:'VELUX VSE',desc:'Electric opening with rain sensor.',link:'/gold-coast-skylights/velux-skylights/velux-vse/'},
        {img:'fixed.jpg',title:'VELUX FS',desc:'Fixed deck-mounted skylight.',link:'/gold-coast-skylights/velux-skylights/velux-fs/'},
        {img:'fcm-pitch-940.png',title:'VELUX FCM',desc:'Fixed curb-mount for low-pitch roofs.',link:'/gold-coast-skylights/velux-skylights/velux-fcm/'},
        {img:'vcm-pitch-940-1.jpg',title:'VELUX VCM',desc:'Manual opening curb-mount.',link:'/gold-coast-skylights/velux-skylights/velux-vcm/'},
        {img:'vcs-landscape.png',title:'VELUX VCS',desc:'Solar opening curb-mount.',link:'/gold-coast-skylights/velux-skylights/velux-vcs/'},
        {img:'vs-cb_column-1.png',title:'VELUX GGL/GPL',desc:'Pivot roof window — 180° opening.',link:'/gold-coast-skylights/velux-skylights/velux-ggl-gpl/'},
      ]
    },
    showcase:{
      tag:'Velux Inspiration',
      title:'Real Velux installations',
      imgs:['1727096652-509034-influencer-justina-blakeney-5184-skylights-kitchen-1023-before-8192x5464-1.avif','1727182872-76301-application-venting-3848-skylights-living-room-0621.webp','1727096657-899267-influencer-justina-blakeney-4945-skylights-kitchen-1022.avif','Modern-kitchen-with-skylights.jpg','1-2.webp','2-2.webp']
    },
    overviewTitle:'Velux — the gold standard in skylights',
    overviewBody:[`Velux is the world's leading skylight brand — and for good reason. Engineered in Denmark, built for the harshest climates, and backed by industry-leading warranties.`,`Tintek is a certified Velux installer. We carry the full range and install with proper flashings, sarking, and roof integration.`],
    overviewBullets:['Fixed Velux skylights','Manual-opening Velux','Solar-powered remote-control','Solar-powered blinds','Bathroom-rated options','10-year manufacturer warranty'],
    featuresTitle:`The Velux advantage`,
    features:[
      {icon:'🌞',title:'Best-in-Class Glazing',desc:`Triple-glazed options keep heat out and let light in.`},
      {icon:'📱',title:'Smart Control',desc:`Solar-powered models open, close, and operate blinds via remote or app.`},
      {icon:'💧',title:'Storm-Rated',desc:`Built and tested for cyclonic wind and rain — perfect for Queensland.`},
    ]
  },
  {
    slug:'/gold-coast-skylights/solatube-skylights/',
    metaTitle:'Solatube Skylights - Tintek Roofing & Cladding',
    metaDesc:'Solatube tubular skylights installed across the Gold Coast. Brighten dark rooms without the cost of a traditional skylight. Call 0428 219 634.',
    h1:'Solatube Skylights Gold Coast',
    shortName:'Solatube skylights',
    crumbCurrent:'Solatube',
    crumbs:[['/gold-coast-skylights/','Skylights']],
    heroSub:`Solatube tubular skylights — bring daylight into any dark room without the cost or disruption of a full skylight install.`,
    heroImg:'HGTV-EMHE-kitchen-1-low-res-exp-03-29-2021.jpg',
    splitImg:'Kitchen-Remodel-with-Solatube-Before-and-After-2-2.jpg',
    products:{
      tag:'Solatube Range',
      title:'The Solatube product family',
      sub:'Each Solatube model is engineered for a specific room size and ceiling type — we help you pick the right one.',
      items:[
        {img:'Solatube-Daylighting-System.png',title:'Solatube Daylighting',desc:'The original tubular skylight — for hallways, kitchens & living spaces.',link:'/gold-coast-skylights/solatube-skylights/daylighting-system/'},
        {img:'Solatube-Heavenly-Intelligent.png',title:'Heavenly Intelligent',desc:'Smart skylight with daylight + LED + dimming all in one fixture.',link:'/gold-coast-skylights/solatube-skylights/heavenly-intelligent/'},
        {img:'Solatube-Econotube.png',title:'Solatube Econotube',desc:'Affordable Solatube system — great daylight at a great price.',link:'/gold-coast-skylights/solatube-skylights/solatube-econotube/'},
        {img:'SkyVault-Series2.png',title:'Commercial Solatube',desc:`SkyVault for warehouses, schools, and large commercial spaces.`,link:'/gold-coast-skylights/solatube-skylights/commercial-solatube/'},
        {img:'solar-star-1_1024x1024.jpg',title:'Solatube SolaStar',desc:`Solar-powered roof exhaust fan — cool your home from the roof.`,link:'/gold-coast-skylights/solatube-skylights/solatube-solastar/'},
      ]
    },
    showcase:{
      tag:'Real Installations',
      title:'See Solatube in action',
      imgs:['HGTV-EMHE-kitchen-1-low-res-exp-03-29-2021.jpg','Kitchen-Remodel-with-Solatube-Before-and-After-2-2.jpg','solar-star-technology-inside.jpg']
    },
    overviewTitle:'Daylight in a tube',
    overviewBody:[`Solatubes are tubular skylights — a small dome on the roof captures sunlight, reflects it down a polished tube, and floods a room with natural daylight via a ceiling diffuser.`,`Perfect for hallways, bathrooms, walk-in robes, and any windowless space. Installs in a few hours and costs a fraction of a traditional skylight.`],
    overviewBullets:['10-inch & 14-inch models','Daylight equivalent to a 100W bulb','Installs in 2-3 hours','Optional ventilation kit','Optional electric light kit','Lifetime warranty'],
    featuresTitle:`Why Solatube`,
    features:[
      {icon:'⚡',title:'Quick Install',desc:`Most Solatube installations are completed in a single morning.`},
      {icon:'💰',title:'Affordable',desc:`A fraction of the cost of a traditional skylight, with similar daylight output.`},
      {icon:'🛡️',title:'Lifetime Warranty',desc:`The longest warranty in the skylight industry.`},
    ]
  },
];

const LOCATION_IMAGES = ['42873-love-shack-s-group.webp','250992-Surfers-Paradise.webp','22.webp','23.webp','24.webp','25.webp','26.webp','27.webp','gallery-9ee77e48-1-1.jpg','gallery-3c80b64a-2-min-1.webp','gallery-b54b74e4-4-min-1.webp','gallery-b1d2cb41-17-min.webp','gallery-2a7353e5-23-min.webp','gallery-32892cd8-7-min-1.webp'];
let _locImgIdx = 0;
const nextLocImg = () => LOCATION_IMAGES[(_locImgIdx++) % LOCATION_IMAGES.length];

const VELUX_CRUMBS = [['/gold-coast-skylights/','Skylights'],['/gold-coast-skylights/velux-skylights/','Velux']];
const SOLATUBE_CRUMBS = [['/gold-coast-skylights/','Skylights'],['/gold-coast-skylights/solatube-skylights/','Solatube']];

const VELUX_EXPLAINERS = [
  {img:'multiple_option.png',title:'Multiple Control Options',bullets:['Window handle for operating skylights within easy reach.','Telescopic rod for out-of-reach skylights, 145cm long and extendable up to 285cm.','Short control rod measuring 60cm in length.']},
  {img:'solarblindremoteshot470x470.jpg',title:'Solar-Powered Blockout Blinds Available',bullets:['Blocks outside light completely for full control of brightness.','Fully self-contained design with no external components.','Built-in battery pack enables operation both day and night.','Reduces light by up to 100%.','Cuts heat transfer by around 40%.','Operated via a wireless wall-mounted keypad (included).']},
  {img:'glazing.png',title:'High-Performance Double Glazing',bullets:['Outer layer: 3mm toughened Low-E3 coated Cardinal glass.','Cavity: 9mm sealed Argon gas space for insulation.','Inner layer: 5.36mm clear laminated Cardinal glass with 0.76 PVB interlayer.','NEAT™ coating on the outer pane helps reduce cleaning frequency.','Warm edge technology improves overall energy efficiency.']},
];
const VELUX_BROCHURE = 'https://tintek.com.au/wp-content/uploads/2025/09/velux_main_brochure_2025_australia.pdf';

const VELUX_PRODUCTS_OLD = [
  {
    slug:'/gold-coast-skylights/velux-skylights/fixed/',parent:'velux',crumbs:VELUX_CRUMBS,
    metaTitle:'Velux Fixed Skylights Gold Coast | Tintek Roofing',
    metaDesc:'Velux Fixed Skylights professionally installed across the Gold Coast. Maximum daylight, no opening mechanism, certified installation. Free quotes.',
    h1:'Velux Fixed Skylights',crumbCurrent:'Fixed',
    heroSub:`The simplest, most cost-effective way to flood a room with daylight. Velux Fixed Skylights deliver bright, energy-saving natural light — leak-free, certified installation by Tintek.`,
    heroImg:'ps_1.png',splitImg:'1727096657-899267-influencer-justina-blakeney-4945-skylights-kitchen-1022.avif',
    overviewTitle:'Maximum daylight, minimum hassle',
    overviewBody:[`A Velux Fixed Skylight is a non-opening daylight skylight, perfect when you don't need ventilation but you do need a major boost in natural light. Common in living rooms, hallways, stairwells, walk-in robes and any room where you want a sky view.`,`Triple-glazed glass options keep heat out and the cold in. Engineered for cyclonic wind and rain — designed for Australian conditions, manufactured in Denmark.`],
    overviewBullets:['Triple-glazed glass options','Cyclonic wind & rain rated','Pre-flashed for leak-free install','10-year manufacturer warranty','Range of standard sizes','Energy-efficient daylight'],
    featuresTitle:'Why choose Velux Fixed',
    features:[
      {icon:'☀️',title:'Up to 3× More Light',desc:'A skylight delivers up to 3× the daylight of a vertical window of equivalent size.'},
      {icon:'🛡️',title:'Lifetime Watertight',desc:'Pre-installed flashing kit means a leak-free install — guaranteed.'},
      {icon:'❄️',title:'Energy Efficient',desc:'Low-E triple glazing options keep summer heat out and winter warmth in.'},
      {icon:'📐',title:'Standard Sizes',desc:'Off-the-shelf sizes for fast installation and predictable pricing.'}
    ],
    specs:[['Sizes','Standard 550×780mm to 1340×1400mm'],['Glazing','Triple low-E available'],['Warranty','10 years (manufacturer)'],['Installation','Half-day, certified']],
    showcase:{tag:'Real Installs',title:'Velux Fixed in real homes',imgs:['1727096657-899267-influencer-justina-blakeney-4945-skylights-kitchen-1022.avif','Modern-kitchen-with-skylights.jpg','1727182872-76301-application-venting-3848-skylights-living-room-0621.webp']}
  },
  {
    slug:'/gold-coast-skylights/velux-skylights/manual-opening/',parent:'velux',crumbs:VELUX_CRUMBS,
    metaTitle:'Velux Manual Opening Skylights Gold Coast | Tintek',
    metaDesc:'Velux manual-opening skylights installed across the Gold Coast. Vent steam and stale air with a hand-crank skylight. Certified installation.',
    h1:'Velux Manual Opening Skylights',crumbCurrent:'Manual Opening',
    heroSub:`Open it by hand. Get fresh air, vent steam, kick out stale heat. Velux Manual Opening Skylights are the simple, reliable choice for kitchens, bathrooms and living spaces.`,
    heroImg:'ps_2.png',splitImg:'1727182872-76301-application-venting-3848-skylights-living-room-0621.avif',
    overviewTitle:'Daylight + ventilation, hand-cranked',
    overviewBody:[`Velux Manual Opening Skylights combine all the daylight benefits of a fixed skylight with the ability to open and vent. Perfect for kitchens that need to clear cooking steam, bathrooms that need to dump humidity, and any room that benefits from natural airflow.`,`Operated by a control rod or hand crank — no electricity, no batteries, no maintenance. Pre-flashed for a leak-free install.`],
    overviewBullets:['Manual hand-crank operation','No power required','Vents steam, heat & humidity','Insect screen included','Pre-flashed for watertight install','10-year manufacturer warranty'],
    featuresTitle:'Why choose Manual Opening',
    features:[
      {icon:'💨',title:'Real Ventilation',desc:'Open the skylight to extract steam, smoke, and stale air naturally.'},
      {icon:'🔇',title:'Silent Operation',desc:'No motors, no clicking — just smooth manual operation.'},
      {icon:'💧',title:'Watertight Closed',desc:'Self-sealing gasket means a closed Velux is bulletproof against rain.'},
      {icon:'🪛',title:'Low Maintenance',desc:'No electrical components to fail — built to last decades.'}
    ],
    specs:[['Sizes','550×780mm to 1340×1400mm'],['Operation','Manual control rod / crank'],['Insect screen','Included'],['Warranty','10 years']],
    showcase:{tag:'Real Installs',title:'See Velux Manual Opening in homes',imgs:['1727182872-76301-application-venting-3848-skylights-living-room-0621.avif','Modern-kitchen-with-skylights.jpg','1-2.webp']}
  },
  {
    slug:'/gold-coast-skylights/velux-skylights/solar-opening/',parent:'velux',crumbs:VELUX_CRUMBS,
    metaTitle:'Velux Solar Opening Skylights Gold Coast | Tintek',
    metaDesc:'Velux solar-powered opening skylights — no wiring required. Remote and app controlled. Certified Gold Coast installation by Tintek.',
    h1:'Velux Solar Opening Skylights',crumbCurrent:'Solar Opening',
    heroSub:`Push a button, watch your skylight open. The Velux Solar Opening Skylight runs on a built-in solar panel — no wiring, no electrician, completely self-powered.`,
    heroImg:'ps_3.png',splitImg:'1727096652-509034-influencer-justina-blakeney-5184-skylights-kitchen-1023-before-8192x5464-1.avif',
    overviewTitle:'Smart skylights with no electrician needed',
    overviewBody:[`The Velux Solar Opening Skylight integrates a small solar panel and rechargeable battery into the frame. The result: a fully app-controlled, remote-operated, automatic skylight that needs zero hardwiring.`,`Comes standard with a rain sensor that closes the skylight automatically when it starts raining. Pair with solar-powered blinds for the ultimate hands-free smart skylight.`],
    overviewBullets:['Solar-powered — no wiring','Remote + app control','Automatic rain-close sensor','Compatible with smart blinds','Pre-flashed install','10-year warranty'],
    featuresTitle:'Why choose Solar Opening',
    features:[
      {icon:'☀️',title:'Truly Wireless',desc:`No electrician fees. The skylight runs forever on its own solar panel.`},
      {icon:'🌧️',title:'Rain Sensor',desc:'Auto-closes the moment rain starts. Walk away in peace.'},
      {icon:'📱',title:'App Control',desc:'Open, close, schedule, group with other Velux skylights from your phone.'},
      {icon:'🔋',title:'Battery Backup',desc:'Built-in rechargeable battery so it works on cloudy days too.'}
    ],
    specs:[['Power','Built-in solar panel + battery'],['Control','Remote + Velux app'],['Rain sensor','Standard'],['Warranty','10 years']],
    showcase:{tag:'Real Installs',title:'Velux Solar Opening in real homes',imgs:['1727096652-509034-influencer-justina-blakeney-5184-skylights-kitchen-1023-before-8192x5464-1.avif','1727096657-899267-influencer-justina-blakeney-4945-skylights-kitchen-1022.avif','Modern-kitchen-with-skylights.jpg']}
  },
  {
    slug:'/gold-coast-skylights/velux-skylights/electric-opening/',parent:'velux',crumbs:VELUX_CRUMBS,
    metaTitle:'Velux Electric Opening Skylights Gold Coast | Tintek',
    metaDesc:'Velux electric opening skylights — hardwired with rain sensor. Certified Gold Coast installation. Free quotes from Tintek.',
    h1:'Velux Electric Opening Skylights',crumbCurrent:'Electric Opening',
    heroSub:`Hardwired Velux skylights with motorised opening, rain sensor, and the smoothest operation in the business. Perfect for new builds where mains power is already in.`,
    heroImg:'ps_4.png',splitImg:'1727182872-76301-application-venting-3848-skylights-living-room-0621.webp',
    overviewTitle:'Mains-powered Velux at its smoothest',
    overviewBody:[`The Velux Electric Opening Skylight runs off your home's mains power. Slightly faster operation than the solar model, no battery to maintain, and ideal for new builds where wiring is already being run.`,`Includes the same rain sensor and app/remote controls as the solar version — just hardwired.`],
    overviewBullets:['Hardwired mains power','Faster operation than solar','Rain sensor included','Remote + app control','Compatible with smart blinds','10-year warranty'],
    featuresTitle:'Why choose Electric Opening',
    features:[
      {icon:'⚡',title:'Mains Powered',desc:'No battery degradation — works the same on day 1 and year 20.'},
      {icon:'⏱️',title:'Faster Operation',desc:'Higher torque motor opens and closes faster than solar.'},
      {icon:'🌧️',title:'Rain Sensor',desc:'Auto-closes the second moisture is detected.'},
      {icon:'📱',title:'Smart Integration',desc:`Works with Velux Active home automation, Apple HomeKit, and more.`}
    ],
    specs:[['Power','Hardwired 240V'],['Control','Remote + Velux app + smart home'],['Rain sensor','Standard'],['Warranty','10 years']],
    showcase:{tag:'Real Installs',title:'Velux Electric Opening',imgs:['1727182872-76301-application-venting-3848-skylights-living-room-0621.webp','Modern-kitchen-with-skylights.jpg','Untitled-design-2025-09-06T130256.242.webp']}
  },
  {
    slug:'/gold-coast-skylights/velux-skylights/flat-roof/',parent:'velux',crumbs:VELUX_CRUMBS,
    metaTitle:'Velux Flat Roof Skylights Gold Coast | Tintek',
    metaDesc:'Velux Flat Roof Skylights — purpose-built for flat-roofed homes and extensions. Certified installation across the Gold Coast.',
    h1:'Velux Flat Roof Skylights',crumbCurrent:'Flat Roof',
    heroSub:`A skylight engineered specifically for flat roofs. Velux Flat Roof Skylights bring stunning daylight and a contemporary look to flat-roofed homes, extensions, and garages.`,
    heroImg:'ps_5.png',splitImg:'Modern-kitchen-with-skylights.jpg',
    overviewTitle:'Daylight for flat roofs done right',
    overviewBody:[`Standard skylights need a pitched roof. Flat roofs require a specialised flashing and dome design — exactly what the Velux Flat Roof range delivers.`,`Choose from a flat glass cover for the most modern look or a clear acrylic dome for maximum daylight. Available in fixed, manual-opening, electric and solar variants.`],
    overviewBullets:['Designed for 0–15° flat roofs','Flat glass or domed acrylic options','Fixed, manual, electric & solar variants','Pre-flashed kerb included','Watertight at 0° pitch','10-year warranty'],
    featuresTitle:'Why Flat Roof Velux',
    features:[
      {icon:'📐',title:'Engineered for 0° Pitch',desc:'Specialised flashing/kerb means watertight at zero degree pitch.'},
      {icon:'✨',title:'Modern Aesthetic',desc:'The flat-glass option gives a sharp contemporary look from inside and out.'},
      {icon:'☀️',title:'Maximum Daylight',desc:'Domed versions capture light from every angle for max daylight.'},
      {icon:'🛡️',title:'Cyclonic Rated',desc:'Built to handle Queensland tropical storms.'}
    ],
    specs:[['Pitch range','0–15°'],['Cover options','Flat glass or curved acrylic'],['Variants','Fixed, manual, electric, solar'],['Warranty','10 years']],
    showcase:{tag:'Real Installs',title:'Flat Roof Velux in modern homes',imgs:['Modern-kitchen-with-skylights.jpg','1727096652-509034-influencer-justina-blakeney-5184-skylights-kitchen-1023-before-8192x5464-1.avif','Untitled-design-2025-09-06T130256.242.webp']}
  },
  {
    slug:'/gold-coast-skylights/velux-skylights/sun-tunnel/',parent:'velux',crumbs:VELUX_CRUMBS,
    metaTitle:'Velux Sun Tunnel Skylights Gold Coast | Tintek',
    metaDesc:'Velux Sun Tunnel — the tubular skylight that lights up dark hallways, walk-in robes and bathrooms. Affordable, fast install.',
    h1:'Velux Sun Tunnel Skylights',crumbCurrent:'Sun Tunnel',
    heroSub:`A tubular skylight from Velux. The Sun Tunnel captures daylight on the roof, sends it down a polished tube, and lights up dark interior rooms — at a fraction of the cost of a traditional skylight.`,
    heroImg:'ps_6.png',splitImg:'2-2.webp',
    overviewTitle:'Daylight where you didn\'t think you could get it',
    overviewBody:[`The Velux Sun Tunnel is the budget-friendly answer for windowless interior rooms. Hallways, walk-in wardrobes, ensuites, laundries — anywhere a regular skylight wouldn't fit, a Sun Tunnel lights up.`,`Installs in a single morning. Includes an optional electric light kit so the same fixture provides daylight by day and electric light by night.`],
    overviewBullets:['250mm or 350mm tube diameter','Half-day installation','Optional electric light kit','Optional solar light kit','Lights up dark hallways/robes','10-year warranty'],
    featuresTitle:'Why Sun Tunnel',
    features:[
      {icon:'⚡',title:'Quick Install',desc:'Most Sun Tunnel installs are completed in a single morning.'},
      {icon:'💰',title:'Affordable',desc:'A fraction of the cost of a full Velux skylight, with similar daylight output.'},
      {icon:'💡',title:'Day + Night Lighting',desc:'Optional integrated LED kit lights the room when the sun goes down.'},
      {icon:'🏠',title:'Fits Anywhere',desc:`Flexible tube routes around joists and obstacles in your roof cavity.`}
    ],
    specs:[['Diameters','250mm / 350mm'],['Tube length','Up to 6m'],['Optional','LED light kit, solar light kit'],['Warranty','10 years']],
    showcase:{tag:'Real Installs',title:'Sun Tunnels in real homes',imgs:['Modern-kitchen-with-skylights.jpg','HGTV-EMHE-kitchen-1-low-res-exp-03-29-2021.jpg','Kitchen-Remodel-with-Solatube-Before-and-After-2-2.jpg']}
  },
  {
    slug:'/gold-coast-skylights/velux-skylights/curb-mount/',parent:'velux',crumbs:VELUX_CRUMBS,
    metaTitle:'Velux Curb Mount Skylights Gold Coast | Tintek',
    metaDesc:'Velux Curb Mount Skylights for replacement and retrofit installations. Drop-in replacement for old skylights.',
    h1:'Velux Curb Mount Skylights',crumbCurrent:'Curb Mount',
    heroSub:`Got an old skylight that's leaking, fogging, or just looks dated? Velux Curb Mount Skylights drop straight onto your existing curb — no roof rebuild required.`,
    heroImg:'ps_7.png',splitImg:'1-2.webp',
    overviewTitle:'The smart replacement upgrade',
    overviewBody:[`If your current skylight sits on a raised "curb" or wooden frame, the Velux Curb Mount range is purpose-designed to drop directly onto that existing curb — no roof modifications, no re-flashing the entire roof, just a clean upgrade.`,`Perfect for replacing old polycarbonate domes, leaking acrylic skylights, or skylights that have just reached end-of-life.`],
    overviewBullets:['Drop-in replacement','No roof modification','Available in fixed & opening','Faster install than full retrofit','Lower cost than full re-roof','10-year warranty'],
    featuresTitle:'Why Curb Mount',
    features:[
      {icon:'⚡',title:'Quick Replacement',desc:`Most curb mount replacements are done in 2-4 hours.`},
      {icon:'💰',title:'Lower Cost',desc:'Save vs a full skylight removal & roof re-flash.'},
      {icon:'🏠',title:'Standard Curb Sizes',desc:'Fits most existing skylight curbs — we measure and confirm.'},
      {icon:'🛡️',title:'Modern Sealing',desc:`Premium gaskets and weather-strip — finally fix that leak.`}
    ],
    specs:[['Type','Drop-in replacement'],['Variants','Fixed & opening'],['Curb sizes','Wide range — we measure'],['Warranty','10 years']],
    showcase:{tag:'Real Installs',title:'Velux Curb Mount upgrades',imgs:['Modern-kitchen-with-skylights.jpg','1727182872-76301-application-venting-3848-skylights-living-room-0621.webp','1727096657-899267-influencer-justina-blakeney-4945-skylights-kitchen-1022.avif']}
  },
  {
    slug:'/gold-coast-skylights/velux-skylights/custom/',parent:'velux',crumbs:VELUX_CRUMBS,
    metaTitle:'Custom Velux Skylight Designs Gold Coast | Tintek',
    metaDesc:'Custom Velux skylight configurations for architectural and specialty builds. Multi-light combinations, oversized installs, custom colours.',
    h1:'Custom Velux Skylight Designs',crumbCurrent:'Custom',
    heroSub:`Architectural builds, multi-light combinations, oversized skylights, custom colours and finishes. If you can dream it, Velux can usually build it — and we can install it.`,
    heroImg:'ps_8.png',splitImg:'Modern-kitchen-with-skylights.jpg',
    overviewTitle:'Beyond the standard sizes',
    overviewBody:[`For architectural homes, hospitality spaces, and feature builds, Velux offers custom configurations: multi-skylight combinations, oversized single-pane installations, custom mullions, alternative cladding finishes, and even shaped skylights.`,`Tintek partners with architects and builders on these projects from concept stage. Tell us what you're trying to achieve and we'll show you the options.`],
    overviewBullets:['Multi-light combinations','Oversized & specialty sizes','Custom mullions & framing','Premium finishes','Architectural detailing','Concept-to-install support'],
    featuresTitle:'What we can custom-build',
    features:[
      {icon:'🏛️',title:'Multi-Light Arrays',desc:'Banks of 2, 4, 6+ skylights configured as a single architectural feature.'},
      {icon:'📐',title:'Oversized',desc:`Single-pane Velux skylights well beyond standard sizes for dramatic feature installs.`},
      {icon:'🎨',title:'Custom Finishes',desc:'Anodised, painted, and bespoke frame finishes to match your design.'},
      {icon:'👷',title:'Concept Support',desc:`We collaborate with your architect from drawings through to handover.`}
    ],
    showcase:{tag:'Architectural Projects',title:'Custom Velux configurations',imgs:['Modern-kitchen-with-skylights.jpg','1727096652-509034-influencer-justina-blakeney-5184-skylights-kitchen-1023-before-8192x5464-1.avif','1727096657-899267-influencer-justina-blakeney-4945-skylights-kitchen-1022.avif']}
  },
];

const SOLATUBE_PRODUCTS_OLD = [
  {
    slug:'/gold-coast-skylights/solatube-skylights/daylighting/',parent:'solatube',crumbs:SOLATUBE_CRUMBS,
    metaTitle:'Solatube Daylighting System Gold Coast | Tintek',
    metaDesc:`The original Solatube tubular skylight — perfect for hallways, kitchens, and living spaces across the Gold Coast.`,
    h1:'Solatube Daylighting System',crumbCurrent:'Daylighting',
    heroSub:`The original tubular skylight that started it all. Solatube Daylighting brings free, natural sunlight into rooms a regular skylight just can't reach.`,
    heroImg:'Solatube-Daylighting-System.png',splitImg:'HGTV-EMHE-kitchen-1-low-res-exp-03-29-2021.jpg',
    overviewTitle:'Tubular daylighting at its best',
    overviewBody:[`The Solatube Daylighting System captures sunlight on your roof through a clear acrylic dome, channels it down a polished reflective tube, and floods the room below with natural daylight via a ceiling diffuser.`,`Available in 250mm and 350mm tube diameters. Half-day install. Lifetime warranty.`],
    overviewBullets:['250mm & 350mm tube diameters','Patented Spectralight tube — 99.7% reflective','Half-day installation','Lifetime warranty','Natural daylight equivalent to a 100W bulb','Optional Daylight Dimmer'],
    featuresTitle:`Why Solatube Daylighting`,
    features:[
      {icon:'💡',title:'Bright as Daylight',desc:'A single 350mm Solatube delivers ~7,000 lumens at noon — far brighter than artificial light.'},
      {icon:'⚡',title:'Free Daylight',desc:'Solar-powered. Zero running cost.'},
      {icon:'🛡️',title:'Lifetime Warranty',desc:'The longest warranty in the skylight industry.'},
      {icon:'🏠',title:'Fits Anywhere',desc:'Flexible tube routes around obstacles for installations a regular skylight could never do.'}
    ],
    specs:[['Diameters','250mm (10") and 350mm (14")'],['Reflectivity','99.7% (Spectralight)'],['Tube length','Up to 6m'],['Warranty','Lifetime']],
    showcase:{tag:'Real Installs',title:'Solatube Daylighting in real homes',imgs:['HGTV-EMHE-kitchen-1-low-res-exp-03-29-2021.jpg','Kitchen-Remodel-with-Solatube-Before-and-After-2-2.jpg','solar-star-technology-inside.jpg']}
  },
  {
    slug:'/gold-coast-skylights/solatube-skylights/heavenly-intelligent/',parent:'solatube',crumbs:SOLATUBE_CRUMBS,
    metaTitle:'Solatube Heavenly Intelligent Gold Coast | Tintek',
    metaDesc:`Solatube Heavenly Intelligent — daylight + dimming LED + smart control all in one fixture. Gold Coast certified installation.`,
    h1:'Solatube Heavenly Intelligent',crumbCurrent:'Heavenly Intelligent',
    heroSub:`Solatube's flagship smart skylight. Daylight by day, integrated dimming LED by night, all in a single beautifully integrated ceiling fixture.`,
    heroImg:'Solatube-Heavenly-Intelligent.png',splitImg:'Kitchen-Remodel-with-Solatube-Before-and-After-2-2.jpg',
    overviewTitle:'One fixture, daylight + smart light',
    overviewBody:[`Heavenly Intelligent is Solatube's premium offering: a Solatube Daylighting System with an integrated dimmable LED light AND smart-home connectivity built into the same ceiling diffuser.`,`Daylight floods the room during the day. As the sun sets, the integrated LED ramps up to maintain the ambient light level. App-controllable, dimmable, and works with all major smart-home systems.`],
    overviewBullets:['Daylight + integrated LED','App-controllable smart light','Dimmable 0-100%','Auto day/night transition','Smart-home compatible','Lifetime warranty'],
    featuresTitle:`Why Heavenly Intelligent`,
    features:[
      {icon:'☀️',title:'24/7 Light',desc:`Daylight all day, smart LED all night — same fixture, no compromises.`},
      {icon:'📱',title:'Smart Control',desc:'App-controllable. Pair with Alexa, Google Home, Apple HomeKit.'},
      {icon:'💡',title:'Dimmable',desc:'Fully dimmable LED so the room always feels right.'},
      {icon:'✨',title:'Beautiful Design',desc:'Single integrated ceiling fixture — no ugly side-by-side LED + skylight.'}
    ],
    specs:[['Diameters','250mm or 350mm Solatube'],['LED','Integrated dimmable LED'],['Smart','App + Alexa + Google + HomeKit'],['Warranty','Lifetime + 5yr LED']],
    showcase:{tag:'Real Installs',title:'Heavenly Intelligent in modern kitchens',imgs:['Kitchen-Remodel-with-Solatube-Before-and-After-2-2.jpg','HGTV-EMHE-kitchen-1-low-res-exp-03-29-2021.jpg','solar-star-technology-inside.jpg']}
  },
  {
    slug:'/gold-coast-skylights/solatube-skylights/econotube/',parent:'solatube',crumbs:SOLATUBE_CRUMBS,
    metaTitle:'Solatube Econotube Gold Coast | Tintek',
    metaDesc:`Solatube Econotube — affordable Solatube tubular skylight with no compromise on quality. Gold Coast installation.`,
    h1:'Solatube Econotube',crumbCurrent:'Econotube',
    heroSub:`The smart-budget Solatube. The Econotube delivers genuine Solatube daylight performance at a price point designed to make tubular skylights accessible for every home.`,
    heroImg:'Solatube-Econotube.png',splitImg:'solar-star-technology-inside.jpg',
    overviewTitle:'Real Solatube quality at a smart price',
    overviewBody:[`The Solatube Econotube uses the same patented Spectralight infinity tubing as the premium ranges, with a simplified diffuser, smaller dome, and reduced standard accessories — to deliver an entry-level price without sacrificing the daylight output.`,`Perfect for hallways, walk-in wardrobes, ensuites, and anywhere you want quality daylight without the premium price tag.`],
    overviewBullets:['Same Spectralight infinity tubing','Simplified diffuser','Lower entry price','Half-day install','Lifetime warranty','Available in 250mm or 350mm'],
    featuresTitle:`Why Econotube`,
    features:[
      {icon:'💰',title:'Best Value',desc:'Genuine Solatube tubing at the lowest price point in the range.'},
      {icon:'☀️',title:'Same Daylight',desc:'The 99.7% reflective tubing is identical to premium models.'},
      {icon:'⚡',title:'Quick Install',desc:`Streamlined kit means installs are faster than the premium range.`},
      {icon:'🛡️',title:'Lifetime Warranty',desc:'Full Solatube lifetime warranty.'}
    ],
    specs:[['Diameters','250mm or 350mm'],['Reflectivity','99.7% Spectralight'],['Diffuser','Standard simplified'],['Warranty','Lifetime']],
    showcase:{tag:'Real Installs',title:'Econotube in homes',imgs:['HGTV-EMHE-kitchen-1-low-res-exp-03-29-2021.jpg','solar-star-technology-inside.jpg','Kitchen-Remodel-with-Solatube-Before-and-After-2-2.jpg']}
  },
  {
    slug:'/gold-coast-skylights/solatube-skylights/skyvault/',parent:'solatube',crumbs:SOLATUBE_CRUMBS,
    metaTitle:'Solatube SkyVault Series Gold Coast | Tintek Commercial',
    metaDesc:`Solatube SkyVault Series — heavy-duty commercial tubular daylighting for warehouses, schools and large buildings.`,
    h1:'Solatube SkyVault Series',crumbCurrent:'SkyVault',
    heroSub:`Solatube's commercial-grade tubular daylighting system. Built for warehouses, schools, retail spaces, gymnasiums and any large-volume commercial building.`,
    heroImg:'SkyVault-Series2.png',splitImg:'solar-star-technology-inside.jpg',
    overviewTitle:'Daylight for buildings, not bedrooms',
    overviewBody:[`The Solatube SkyVault Series is Solatube's commercial product line — designed for buildings with very high ceilings, very large floor plates, or both.`,`Used by major retailers, schools, and warehouses globally. Significant energy bill savings via daylight harvesting + 5-Star Green Star credits.`],
    overviewBullets:['Heavy-duty commercial spec','Suits 6m+ ceiling heights','Massive lumen output','Energy-bill reduction','Green Star credits','Engineered for industrial loads'],
    featuresTitle:`Why SkyVault`,
    features:[
      {icon:'🏭',title:'Commercial Grade',desc:`Engineered for warehouses, schools, retail, and gyms.`},
      {icon:'💡',title:'High Lumen Output',desc:'Designed for spaces other skylights can\'t adequately illuminate.'},
      {icon:'💸',title:'Energy Savings',desc:'Significant lighting electricity reduction in commercial settings.'},
      {icon:'🌿',title:'Green Star Credits',desc:'Contributes toward Green Star and NABERS ratings.'}
    ],
    specs:[['Use cases','Warehouses, schools, retail, gyms'],['Ceiling height','Up to 18m'],['Lumens','Highest in the Solatube range'],['Warranty','10 years commercial']],
    showcase:{tag:'Commercial Installs',title:'SkyVault in commercial spaces',imgs:['solar-star-technology-inside.jpg','Kitchen-Remodel-with-Solatube-Before-and-After-2-2.jpg','HGTV-EMHE-kitchen-1-low-res-exp-03-29-2021.jpg']}
  },
];

const VELUX_PRODUCTS = [
  {
    slug:'/gold-coast-skylights/velux-skylights/velux-vs/',parent:'velux',crumbs:VELUX_CRUMBS,
    metaTitle:'Velux VS - Tintek Roofing & Cladding',
    metaDesc:'VELUX VS Manually Opening Skylight — natural light + ventilation. Pre-installed insect screen. 10-year warranty. Gold Coast certified installation.',
    h1:'VELUX VS',crumbCurrent:'Velux VS',
    heroSub:`The VS Manually Opening Skylight offers the comfort and energy savings of free daylight and natural ventilation. The pre-installed Insect Screen adds the benefit of keeping mosquitoes and flies out in summer.`,
    heroImg:'1727096657-899267-influencer-justina-blakeney-4945-skylights-kitchen-1022.avif',
    productImg:'vs-cb_column-1.png',warrantyImg:'Velux-VS-Warranty.webp',brochure:VELUX_BROCHURE,
    productFeatures:['White painted interior wood frame and sash.','Outer aluminium cappings (grey).','Operated by winder handle for within-reach use, or by rod for out-of-reach operation (up to 285cm above head height).','Smooth, low-profile design that sits lower in the roof.','Available in 10 different sizes.','High-performance double glazing as standard, with NEAT™ coating to reduce cleaning frequency.'],
    explainerTitle:'VELUX VS is among Australia’s leading skylight systems, combining premium quality with advanced technology.',
    explainers:VELUX_EXPLAINERS,
    specs:[['Pitch range','15°–90°'],['Sizes','10 standard sizes'],['Operation','Manual winder + rod'],['Insect screen','Pre-installed'],['Glazing','Double, NEAT™'],['Warranty','10 years']],
  },
  {
    slug:'/gold-coast-skylights/velux-skylights/velux-vss/',parent:'velux',crumbs:VELUX_CRUMBS,
    metaTitle:'Velux VSS - Tintek Roofing & Cladding',
    metaDesc:'VELUX VSS solar-powered opening skylight — no wiring, app + remote control, automatic rain sensor.',
    h1:'VELUX VSS Solar Powered Skylight',crumbCurrent:'Velux VSS',
    heroSub:`The VSS Solar Opening Skylight runs entirely on its built-in solar panel — no wiring required. Push-button remote, app control, and an automatic rain sensor that closes the skylight before water hits the floor.`,
    heroImg:'1727096652-509034-influencer-justina-blakeney-5184-skylights-kitchen-1023-before-8192x5464-1.avif',
    productImg:'VSSS062004AE_1600x1600.webp',warrantyImg:'Velux-VS-Warranty.webp',brochure:VELUX_BROCHURE,
    productFeatures:['Solar-powered — no electrician required.','Built-in solar panel + rechargeable battery for day & night use.','Wireless remote control included.','Velux Active app integration for smartphone control.','Automatic rain sensor closes skylight at first drop.','Compatible with Velux solar-powered blinds.','High-performance NEAT™ coated double glazing.'],
    explainerTitle:'VELUX VSS — the smart solar-powered opening skylight.',
    explainers:VELUX_EXPLAINERS,
    specs:[['Power','Built-in solar panel + battery'],['Control','Remote + Velux app'],['Rain sensor','Standard'],['Glazing','Double, NEAT™'],['Warranty','10 years']],
  },
  {
    slug:'/gold-coast-skylights/velux-skylights/velux-vse/',parent:'velux',crumbs:VELUX_CRUMBS,
    metaTitle:'Velux VSE - Tintek Roofing & Cladding',
    metaDesc:'VELUX VSE electric opening skylight — hardwired with rain sensor and smart-home integration.',
    h1:'VELUX VSE',crumbCurrent:'Velux VSE',
    heroSub:`The VSE Electric Opening Skylight is the hardwired choice for new builds. Mains-powered, app and remote-controlled, with rain sensor and smart-home integration.`,
    heroImg:'1727182872-76301-application-venting-3848-skylights-living-room-0621.webp',
    productImg:'VSE_955x844.webp',warrantyImg:'Velux-VS-Warranty.webp',brochure:VELUX_BROCHURE,
    productFeatures:['Hardwired 240V mains power.','Smooth, fast electric operation.','Wireless remote + Velux app control.','Automatic rain sensor.','Smart-home integration (Velux Active, HomeKit).','Insect screen pre-installed.','High-performance double glazing.'],
    explainerTitle:'VELUX VSE — hardwired smart skylights for premium new builds.',
    explainers:VELUX_EXPLAINERS,
    specs:[['Power','240V hardwired'],['Control','Remote, app, smart-home'],['Rain sensor','Standard'],['Glazing','Double, NEAT™'],['Warranty','10 years']],
  },
  {
    slug:'/gold-coast-skylights/velux-skylights/velux-fs/',parent:'velux',crumbs:VELUX_CRUMBS,
    metaTitle:'VELUX FS - Tintek Roofing & Cladding',
    metaDesc:'VELUX FS Fixed Skylight — the simplest way to flood a room with daylight.',
    h1:'VELUX FS – Velux Fixed Skylight',crumbCurrent:'Velux FS',
    heroSub:`The FS Fixed Skylight is engineered for maximum daylight without venting. Perfect for living rooms, hallways, walk-in robes, and any room where you want a sky view.`,
    heroImg:'Modern-kitchen-with-skylights.jpg',
    productImg:'fixed.jpg',warrantyImg:'Velux-VS-Warranty-1-e1748416135589.png',brochure:VELUX_BROCHURE,
    productFeatures:['White painted interior wood frame and sash.','Outer aluminium cappings (grey).','Smooth, low-profile design.','Available in 10 different sizes.','High-performance double glazing as standard.','NEAT™ coating reduces cleaning frequency.','Pre-flashed kit for a watertight install.'],
    explainerTitle:'VELUX FS — the simplest way to bring stunning daylight into your home.',
    explainers:VELUX_EXPLAINERS,
    specs:[['Pitch range','15°–90°'],['Sizes','10 standard sizes'],['Type','Fixed (non-opening)'],['Glazing','Double, NEAT™'],['Warranty','10 years']],
  },
  {
    slug:'/gold-coast-skylights/velux-skylights/velux-fcm/',parent:'velux',crumbs:VELUX_CRUMBS,
    metaTitle:'VELUX FCM - Tintek Roofing & Cladding',
    metaDesc:'VELUX FCM Fixed Curb-Mounted Skylight — ideal for low-pitch roofs and replacements.',
    h1:'VELUX FCM – Flat Roof Skylight',crumbCurrent:'Velux FCM',
    heroSub:`The FCM Fixed Curb-Mounted Skylight is engineered for low-pitch roofs (down to 0°) and is the perfect drop-in replacement for old polycarbonate domes.`,
    heroImg:'Modern-kitchen-with-skylights.jpg',
    productImg:'fcm-pitch-940.png',warrantyImg:'VELUX-FCM-Ten-Year-Warranty-e1748415011323.webp',brochure:VELUX_BROCHURE,
    productFeatures:['Designed for 0°–60° roof pitch.','Drop-in replacement for old curb-mounted skylights.','Watertight at low pitch.','Low-E coated double glazing.','Available in 10 sizes.','10-year manufacturer warranty.'],
    explainerTitle:'VELUX FCM — perfect for low-pitch roofs and skylight replacements.',
    explainers:VELUX_EXPLAINERS,
    specs:[['Pitch range','0°–60°'],['Sizes','10 standard sizes'],['Type','Fixed curb-mount'],['Glazing','Double, Low-E'],['Warranty','10 years']],
  },
  {
    slug:'/gold-coast-skylights/velux-skylights/velux-vcm/',parent:'velux',crumbs:VELUX_CRUMBS,
    metaTitle:'VELUX VCM - Tintek Roofing & Cladding',
    metaDesc:'VELUX VCM Manual Opening Curb-Mounted Skylight — daylight + ventilation for low-pitch roofs.',
    h1:'VELUX VCM',crumbCurrent:'Velux VCM',
    heroSub:`The VCM Manual Opening Curb-Mounted Skylight combines all the daylight benefits of a fixed skylight with the ability to vent steam, heat, and humidity — designed for low-pitch roofs.`,
    heroImg:'1727182872-76301-application-venting-3848-skylights-living-room-0621.webp',
    productImg:'vcm-pitch-940-1.jpg',warrantyImg:'Velux-VS-Warranty-e1748415619821.webp',brochure:VELUX_BROCHURE,
    productFeatures:['Manual hand-crank operation.','Designed for low-pitch (0°–60°) curb-mounted installations.','Insect screen pre-installed.','Low-E coated double glazing.','10 standard sizes.','10-year manufacturer warranty.'],
    explainerTitle:'VELUX VCM — manual venting curb-mount for low-pitch roofs.',
    explainers:VELUX_EXPLAINERS,
    specs:[['Pitch range','0°–60°'],['Sizes','10 standard sizes'],['Operation','Manual winder + rod'],['Glazing','Double, Low-E'],['Warranty','10 years']],
  },
  {
    slug:'/gold-coast-skylights/velux-skylights/velux-vcs/',parent:'velux',crumbs:VELUX_CRUMBS,
    metaTitle:'VELUX VCS - Tintek Roofing & Cladding',
    metaDesc:'VELUX VCS Solar-Powered Opening Curb-Mounted Skylight — no wiring, rain sensor, app control.',
    h1:'VELUX VCS – Solar Skylight for Flat Roofs',crumbCurrent:'Velux VCS',
    heroSub:`The VCS Solar-Powered Opening Curb-Mounted Skylight delivers wireless, app-controlled venting on low-pitch roofs.`,
    heroImg:'1727096652-509034-influencer-justina-blakeney-5184-skylights-kitchen-1023-before-8192x5464-1.avif',
    productImg:'vcs-landscape.png',warrantyImg:'Velux-VS-Warranty-1-e1748416135589.png',brochure:VELUX_BROCHURE,
    productFeatures:['Solar-powered — no electrician needed.','Designed for 0°–60° roof pitch.','Wireless remote + Velux app control.','Automatic rain sensor.','Insect screen pre-installed.','10-year manufacturer warranty.'],
    explainerTitle:'VELUX VCS — solar-powered venting for low-pitch roofs.',
    explainers:VELUX_EXPLAINERS,
    specs:[['Pitch range','0°–60°'],['Power','Solar panel + battery'],['Control','Remote + app'],['Rain sensor','Standard'],['Warranty','10 years']],
  },
  {
    slug:'/gold-coast-skylights/velux-skylights/velux-ggl-gpl/',parent:'velux',crumbs:VELUX_CRUMBS,
    metaTitle:'VELUX GGL & GPL - Tintek Roofing & Cladding',
    metaDesc:'VELUX GGL & GPL Pivot Roof Windows — architectural roof windows with full pivot opening.',
    h1:'VELUX GGL & GPL – Centre-Pivot and Dual Action Roof Windows',crumbCurrent:'Velux GGL/GPL',
    heroSub:`Velux roof windows pivot a full 180° for easy cleaning and maximum airflow. The GGL is centre-pivot, the GPL is top-hung. Both deliver dramatic architectural daylight.`,
    heroImg:'1727096657-899267-influencer-justina-blakeney-4945-skylights-kitchen-1022.avif',
    productImg:'vs-cb_column-1.png',warrantyImg:'Velux-VS-Warranty.webp',brochure:VELUX_BROCHURE,
    productFeatures:['Centre-pivot (GGL) or top-hung (GPL) opening.','Full 180° pivot for easy cleaning.','Manual or solar-powered options.','Pre-installed insect screen.','High-performance NEAT™ double glazing.','10-year manufacturer warranty.'],
    explainerTitle:'VELUX GGL & GPL — the architectural pivot roof windows.',
    explainers:VELUX_EXPLAINERS,
    specs:[['Pitch range','15°–90°'],['Operation','Pivot (180°)'],['Variants','GGL centre-pivot, GPL top-hung'],['Glazing','Double, NEAT™'],['Warranty','10 years']],
  },
];

const SOLATUBE_PRODUCTS = [
  {
    slug:'/gold-coast-skylights/solatube-skylights/daylighting-system/',parent:'solatube',crumbs:SOLATUBE_CRUMBS,
    metaTitle:'Daylighting System - Tintek Roofing & Cladding',
    metaDesc:'The original Solatube tubular skylight — perfect for hallways, kitchens, and living spaces.',
    h1:'Daylighting System',crumbCurrent:'Daylighting System',
    heroSub:`The original tubular skylight that started it all. Solatube Daylighting brings free, natural sunlight into rooms a regular skylight just can't reach.`,
    heroImg:'HGTV-EMHE-kitchen-1-low-res-exp-03-29-2021.jpg',
    productImg:'Solatube-Daylighting-System.png',
    productFeatures:['Patented Spectralight Infinity tubing — 99.7% reflective.','250mm and 350mm tube diameters.','Flexible tube routes around obstacles.','Half-day installation.','Optional Daylight Dimmer.','Lifetime manufacturer warranty.'],
    explainerTitle:`Solatube Daylighting — free, natural daylight for rooms a regular skylight can't reach.`,
    explainers:[
      {img:'wired-outline-804-sun-hover-rays.png',title:'Bright as Daylight',bullets:['A single 350mm Solatube delivers ~7,000 lumens at noon.','Far brighter than artificial light.','Solar-powered — zero running cost.']},
      {img:'wired-outline-457-shield-security-hover-pinch.png',title:'Lifetime Warranty',bullets:['The longest warranty in the skylight industry.','Premium components engineered to last.','Backed by Solatube’s global service network.']},
      {img:'wired-outline-2272-podium-hover-pinch.png',title:'Award-Winning Design',bullets:['Used in over 1.5 million installations worldwide.','Featured on Channel 9 The Block & HGTV.','Industry-leading product engineering.']},
    ],
    specs:[['Diameters','250mm and 350mm'],['Reflectivity','99.7% Spectralight'],['Tube length','Up to 6m'],['Installation','Half-day'],['Warranty','Lifetime']],
  },
  {
    slug:'/gold-coast-skylights/solatube-skylights/heavenly-intelligent/',parent:'solatube',crumbs:SOLATUBE_CRUMBS,
    metaTitle:'Heavenly Intelligent - Tintek Roofing & Cladding',
    metaDesc:'Solatube Heavenly Intelligent — daylight + integrated dimmable LED + smart-home control all in one fixture.',
    h1:'Solatube Heavenly Intelligent',crumbCurrent:'Heavenly Intelligent',
    heroSub:`Solatube’s flagship smart skylight. Daylight by day, integrated dimming LED by night, all in a single beautifully integrated ceiling fixture.`,
    heroImg:'Kitchen-Remodel-with-Solatube-Before-and-After-2-2.jpg',
    productImg:'Solatube-Heavenly-Intelligent.png',
    productFeatures:['Solatube Daylighting + integrated dimmable LED.','App, remote, and smart-home control.','Auto day/night light transition.','Compatible with Alexa, Google Home, Apple HomeKit.','Available in 250mm and 350mm.','Lifetime warranty + 5-year LED warranty.'],
    explainerTitle:'Solatube Heavenly Intelligent — 24/7 light from a single beautiful fixture.',
    explainers:[
      {img:'wired-outline-804-sun-hover-rays.png',title:'24/7 Light',bullets:['Daylight all day, smart LED all night.','Same fixture, no compromises.','Auto day/night transition built in.']},
      {img:'wired-outline-20-love-heart-hover-heartbeat.png',title:'Smart Control',bullets:['App-controllable from your phone.','Pair with Alexa, Google Home, HomeKit.','Fully dimmable LED for any mood.']},
      {img:'wired-outline-2272-podium-hover-pinch.png',title:'Premium Build',bullets:['Premium Solatube tubing + diffuser.','Single integrated ceiling fixture.','No ugly side-by-side LED + skylight.']},
    ],
    specs:[['Diameters','250mm or 350mm'],['LED','Integrated dimmable'],['Smart','App + Alexa + Google + HomeKit'],['Warranty','Lifetime + 5yr LED']],
  },
  {
    slug:'/gold-coast-skylights/solatube-skylights/solatube-econotube/',parent:'solatube',crumbs:SOLATUBE_CRUMBS,
    metaTitle:'Solatube Econotube - Tintek Roofing & Cladding',
    metaDesc:'Solatube Econotube — affordable Solatube tubular skylight with the same patented tubing.',
    h1:'Solatube Econotube',crumbCurrent:'Econotube',
    heroSub:`The smart-budget Solatube. Genuine Solatube quality with a streamlined kit and price point designed to make tubular daylighting accessible for every home.`,
    heroImg:'HGTV-EMHE-kitchen-1-low-res-exp-03-29-2021.jpg',
    productImg:'Solatube-Econotube.png',
    productFeatures:['Same Spectralight Infinity tubing as premium models.','Simplified diffuser — lower price point.','Available in 250mm and 350mm.','Half-day installation.','Lifetime manufacturer warranty.','Perfect for hallways, robes, ensuites.'],
    explainerTitle:'Solatube Econotube — real Solatube quality at a smart price.',
    explainers:[
      {img:'wired-outline-434-prize-padge-ribbon-hover-pinch.png',title:'Best Value',bullets:['Genuine Solatube tubing at the lowest price.','No compromise on daylight output.','Half-day installation.']},
      {img:'wired-outline-804-sun-hover-rays.png',title:'Same Daylight',bullets:['99.7% reflective Spectralight tubing.','Identical to premium models.','Bright natural daylight all day.']},
      {img:'wired-outline-457-shield-security-hover-pinch.png',title:'Lifetime Warranty',bullets:['Full Solatube lifetime warranty.','Premium tubing engineered to last.','Backed by Tintek’s install warranty.']},
    ],
    specs:[['Diameters','250mm or 350mm'],['Reflectivity','99.7% Spectralight'],['Diffuser','Simplified'],['Warranty','Lifetime']],
  },
  {
    slug:'/gold-coast-skylights/solatube-skylights/commercial-solatube/',parent:'solatube',crumbs:SOLATUBE_CRUMBS,
    metaTitle:'Commercial Solatube - Tintek Roofing & Cladding',
    metaDesc:'Solatube SkyVault Series for commercial buildings — warehouses, schools, retail.',
    h1:'Commercial Solatube',crumbCurrent:'Commercial Solatube',
    heroSub:`Solatube’s commercial-grade tubular daylighting. Engineered for warehouses, schools, retail spaces, gymnasiums and any large-volume commercial building — with massive lumen output and energy savings.`,
    heroImg:'van-den-Haak-distribution-center-the-Netherlands-resized.jpg',
    productImg:'SkyVault-Series2.png',
    productFeatures:['Heavy-duty commercial spec.','Suits 6m+ ceiling heights, up to 18m.','Massive lumen output — highest in the Solatube range.','Significant lighting electricity reduction.','Contributes to Green Star and NABERS ratings.','Engineered for industrial loads.'],
    explainerTitle:'Commercial Solatube — daylight for warehouses, schools, gyms and retail.',
    explainers:[
      {img:'wired-outline-2272-podium-hover-pinch.png',title:'Commercial Grade',bullets:['Engineered for warehouses, schools, retail.','Heavy-duty commercial components.','Suitable for ceilings up to 18m.']},
      {img:'wired-outline-804-sun-hover-rays.png',title:'High Lumen Output',bullets:['Highest output in the Solatube range.','Replaces hundreds of light fittings.','Bright daylight all day, every day.']},
      {img:'wired-outline-401-leaves-eco-hover-spin.png',title:'Energy Savings',bullets:['Significant lighting electricity reduction.','Contributes to Green Star credits.','Lower running costs from day one.']},
    ],
    specs:[['Use cases','Warehouses, schools, retail'],['Ceiling height','Up to 18m'],['Lumens','Highest in the range'],['Warranty','10 years commercial']],
  },
  {
    slug:'/gold-coast-skylights/solatube-skylights/solatube-solastar/',parent:'solatube',crumbs:SOLATUBE_CRUMBS,
    metaTitle:'Solatube Solastar - Tintek Roofing & Cladding',
    metaDesc:'Solatube SolaStar — solar-powered roof exhaust fan that cools your roof cavity and lowers cooling bills.',
    h1:'Solatube Solar Star – Solar Roof Ventilation',crumbCurrent:'SolaStar',
    heroSub:`The SolaStar is a solar-powered roof exhaust fan that pulls hot, humid air out of your roof cavity — dropping cavity temps, reducing your air-con bills, and protecting your roof structure.`,
    heroImg:'solar-star-technology-inside.jpg',
    productImg:'solar-star-1_1024x1024.jpg',
    productFeatures:['100% solar-powered — no wiring, no running cost.','Brushless DC motor — silent operation.','Pulls hot, humid air from your roof cavity.','Cuts air-conditioning costs.','Prevents moisture damage and mould.','25-year housing warranty + 5-year motor warranty.'],
    explainerTitle:'Solatube SolaStar — cool your home from the roof down.',
    explainers:[
      {img:'wired-outline-442-thermometer-hover-changing.png',title:'Drops Cavity Temps',bullets:['Removes trapped hot air from your roof cavity.','Drops cavity temps by up to 25°C.','Makes your home noticeably cooler.']},
      {img:'wired-outline-450-solar-panel-hover-pinch.png',title:'100% Solar Powered',bullets:['Built-in solar panel — no electrician needed.','Zero running cost forever.','Operates whenever the sun is shining.']},
      {img:'wired-outline-447-water-drop-hover-split.png',title:'Stops Mould & Damp',bullets:['Removes humid air before it condenses.','Protects roof timbers from rot.','Prevents mould growth in the cavity.']},
    ],
    specs:[['Power','Solar panel (built-in)'],['Motor','Brushless DC — silent'],['Capacity','Suits homes up to 200m²'],['Warranty','25yr housing / 5yr motor']],
  },
];

const LOCATIONS = [
  {slug:'/locations/gold-coast-roofing-services/',suburb:'Gold Coast',
   title:'Gold Coast Roofing Services - Tintek Roofing & Cladding',
   h1:'Trusted Roofing Maintenance & Repairs on the Gold Coast',
   intro1:`The Gold Coast's mix of coastal humidity, intense UV, and tropical storms is brutal on roofs. Tintek installs roofing systems specifically engineered for this climate — and we live and work here too.`,
   intro2:`From Coomera to Coolangatta, our local team has roofed thousands of Gold Coast homes. Free quotes, premium Colorbond, and a finish that lasts.`},
  {slug:'/locations/tweed-heads/',suburb:'Tweed Heads',
   title:'Tweed Heads - Tintek Roofing & Cladding',
   h1:'We Restore & Repair Roofs in Tweed Heads',
   intro1:`Tweed Heads sits right on the Queensland-NSW border, and the salt-laden coastal air demands corrosion-resistant roofing materials.`,
   intro2:`Tintek services Tweed Heads, Tweed City, and the surrounding Tweed Coast — same-day callouts available for emergencies.`},
  {slug:'/locations/burleigh/',suburb:'Burleigh',
   title:'Roofing in Burleigh - Tintek Roofing & Cladding',
   h1:'We Service and Repair Roofs in Burleigh',
   intro1:`Burleigh's tightly-packed coastal homes face constant salt spray and intense summer sun. Premium marine-grade Colorbond is the right choice for most properties here.`,
   intro2:`We've completed re-roofs throughout Burleigh Heads, Burleigh Waters, and Miami — usually with quotes turned around in 48 hours.`},
  {slug:'/locations/palm-beach/',suburb:'Palm Beach',
   title:'Roofing in Palm Beach - Tintek Roofing & Cladding',
   h1:'We Handle Roof Maintenance & Repairs in Palm Beach',
   intro1:`Palm Beach's coastal lifestyle demands roofing that handles salt, sun, and storm — without sacrificing the look. Colorbond's coastal range is built exactly for this.`,
   intro2:`Tintek roofs homes from Palm Beach down to Currumbin and Tugun. Free quotes, local crew, premium materials.`},
  {slug:'/locations/roofing-murwillumbah/',suburb:'Murwillumbah',
   title:'Roofing in Murwillumbah - Tintek Roofing & Cladding',
   h1:'We Provide Residential & Commercial Roofing Services in Murwillumbah',
   intro1:`Set in the Tweed Valley, Murwillumbah homes range from heritage Queenslanders to modern acreage builds — and they all need roofing that handles heavy rain and the occasional flood event.`,
   intro2:`Tintek services Murwillumbah and the wider Tweed Valley with full re-roofing, repairs, and heritage restoration work.`},
  {slug:'/locations/cabarita-beach/',suburb:'Cabarita Beach',
   title:'Roofing in Cabarita Beach - Tintek Roofing & Cladding',
   h1:'We Service and Maintain Roofs in Cabarita Beach',
   intro1:`Cabarita Beach is one of the Tweed Coast's most exposed suburbs — homes here face direct ocean spray and demand the absolute best in corrosion-resistant roofing.`,
   intro2:`We use marine-grade Colorbond Coastal materials on Cabarita projects so your roof actually lasts in this environment.`},
  {slug:'/locations/nerang/',suburb:'Nerang',
   title:'Roofing in Nerang - Tintek Roofing & Cladding',
   h1:'We Offer Roof Repairs and Maintenance in Nerang',
   intro1:`Nerang sits inland from the coast, and its mix of established homes, new estates, and acreage properties keeps our team busy with everything from re-roofs to heritage restorations.`,
   intro2:`Tintek services Nerang, Highland Park, and Carrara — all within our standard same-week quote turnaround.`},
  {slug:'/locations/mudgeeraba/',suburb:'Mudgeeraba',
   title:'Roofing in Mudgeeraba - Tintek Roofing & Cladding',
   h1:'We Maintain and Repair Roofs in Mudgeeraba',
   intro1:`Mudgeeraba's mix of bushland and acreage living means many properties are in bushfire-prone areas — and need BAL-rated roofing materials and ember-protected gutters.`,
   intro2:`Tintek installs bushfire-rated roofing systems and gutter guard for Mudgeeraba homeowners — fully compliant and properly documented.`},
  {slug:'/locations/roofing-pottsville/',suburb:'Pottsville',
   title:'Roofing in Pottsville - Tintek Roofing & Cladding',
   h1:'We Conduct Roof Inspections & Repairs in Pottsville',
   intro1:`Pottsville's quiet coastal vibe means a lot of holiday homes and rentals — and roofs that don't get the attention they need until something goes wrong.`,
   intro2:`We service Pottsville with full re-roofing, repairs, and inspection services. Pre-rental property reports a specialty.`},
  {slug:'/locations/kingscliff/',suburb:'Kingscliff',
   title:'Kingscliff - Tintek Roofing & Cladding',
   h1:'We Handle Roofing Installation & Maintenance in Kingscliff',
   intro1:`Kingscliff's beachfront and near-coastal homes face the toughest conditions on the NSW Tweed Coast — but with the right materials, your roof can outlast 30 years here.`,
   intro2:`We've roofed everything from Kingscliff beachfront luxury homes to standard family residences. Marine-grade Colorbond standard.`},
  {slug:'/locations/banora-point/',suburb:'Banora Point',
   title:'Banora Point - Tintek Roofing & Cladding',
   h1:'We Offer Exceptional Roofing Solutions in Banora Point',
   intro1:`Banora Point's elevated suburbs offer beautiful views — and exposure to the elements. Quality Colorbond installation makes all the difference.`,
   intro2:`Tintek services Banora Point, Tweed Heads South, and surrounds — local team, free quotes, premium materials.`},
  {slug:'/locations/robina/',suburb:'Robina',
   title:'Robina - Tintek Roofing & Cladding',
   h1:'We Deliver Quality Roofing Services in Robina',
   intro1:`Robina's well-established residential streets and modern estates have a wide mix of roof types — and many original tile roofs are now hitting the end of their life.`,
   intro2:`Tile-to-Colorbond conversions are our specialty in Robina. Lighter, cooler, and a fresh modern look.`},
];

const ALL_SERVICES = [...SERVICE_PAGES];
const ALL_ROOFING = [...ROOFING_TYPE_PAGES];

// =============================================================
// STATIC PAGES (services index, locations index, etc.)
// =============================================================

function buildServicesIndex() {
  const p = {
    slug:'/services/',
    metaTitle:'Services - Tintek Roofing & Cladding',
    metaDesc:'Full roofing service menu — emergency repairs, gutter guard, gutters, inspections, ventilation, skylights & more. Free quotes. Call 0428 219 634.',
    h1:'Gold Coast Roofing Services',
    heroSub:`From emergency repairs to full re-roofs — Tintek delivers every roofing service the Gold Coast needs, all under one local roof.`,
    heroImg:'PRINT__DSC8213_reduced.jpg',
    crumbs:[],
    crumbCurrent:'Services',
  };
  const r = root(p.slug);
  const cards = ALL_SERVICES.concat([{slug:'/gold-coast-skylights/',shortName:'Skylights',h1:'Skylights',heroSub:'Velux & Solatube skylight installation.'}]).map(s => `
    <a href="${r.replace(/\/$/,'')}${s.slug}" class="rel-card fade">
      <h4>${esc(s.h1 || s.shortName)}</h4>
      <p>${esc((s.heroSub||'').slice(0,120))}</p>
      <span class="sarrow">Learn More <span>→</span></span>
    </a>`).join('');
  p.bodyHTML = [
    innerHero(p),
    trustStrip(),
    `<section class="sec"><div class="ctr">
      <div class="sec-head"><div class="divider"><span class="sec-tag">Services</span></div>
        <h2 class="sec-t fade">Everything Your Roof Needs</h2>
        <p class="sec-sub fade">A complete roofing menu — handled by one experienced local team.</p>
      </div>
      <div class="rel-g">${cards}</div>
    </div></section>`,
    whyMini(),
    urgency(p),
    reviewsSection(),
    quoteForm(p),
    partners(p),
    areasSection(p),
    footer(p),
  ].join('');
  return p;
}

function buildRoofingIndex() {
  const p = {
    slug:'/roofing/',
    metaTitle:'Roofer Gold Coast | Tintek Roofing & Cladding',
    metaDesc:'Trusted roofer in Gold Coast providing services like roof leak repairs, roof restorations, and roof maintenance.',
    h1:'Roofing Services Gold Coast',
    heroSub:`From new builds to heritage restorations — premium Colorbond metal roofing for residential, commercial, and industrial properties.`,
    heroImg:'gallery-9ee77e48-1-1.jpg',
    crumbs:[],
    crumbCurrent:'Roofing',
  };
  const r = root(p.slug);
  const cards = ALL_ROOFING.concat([{slug:'/roofing/re-roofing-roof-replacements/', h1:'Re-Roofing & Replacements', heroSub:'Replace your existing roof with premium Colorbond.'}]).map(s => `
    <a href="${r.replace(/\/$/,'')}${s.slug}" class="rel-card fade">
      <h4>${esc(s.h1)}</h4>
      <p>${esc((s.heroSub||'').slice(0,120))}</p>
      <span class="sarrow">Learn More <span>→</span></span>
    </a>`).join('');
  p.bodyHTML = [
    innerHero(p),
    trustStrip(),
    `<section class="sec"><div class="ctr">
      <div class="sec-head"><div class="divider"><span class="sec-tag">Roofing Types</span></div>
        <h2 class="sec-t fade">Find Your Roofing Project</h2>
        <p class="sec-sub fade">Whatever you're building or replacing — we have a system specced for it.</p>
      </div>
      <div class="rel-g">${cards}</div>
    </div></section>`,
    whyMini(),
    processSection(p),
    gallery(p),
    urgency(p),
    reviewsSection(),
    quoteForm(p),
    partners(p),
    areasSection(p),
    footer(p),
  ].join('');
  return p;
}

function buildLocationsIndex() {
  const p = {
    slug:'/locations/',
    metaTitle:'Locations - Tintek Roofing & Cladding',
    metaDesc:'Tintek services the Gold Coast, Tweed Heads, Brisbane and Northern NSW — find your local suburb here. Call 0428 219 634.',
    h1:'Our Locations',
    heroSub:`Locally based, with a team that travels right across the Gold Coast, Tweed Heads, Brisbane and Northern NSW. Find your suburb below.`,
    heroImg:'PRINT__DSC8213_reduced.jpg',
    crumbs:[],
    crumbCurrent:'Service Areas',
  };
  const r = root(p.slug);
  const cards = LOCATIONS.map(l => `
    <a href="${r.replace(/\/$/,'')}${l.slug}" class="rel-card fade">
      <h4>${esc(l.suburb)}</h4>
      <p>Roofing services in ${esc(l.suburb)} and surrounding suburbs.</p>
      <span class="sarrow">View Area <span>→</span></span>
    </a>`).join('');
  p.bodyHTML = [
    innerHero(p),
    trustStrip(),
    `<section class="sec"><div class="ctr">
      <div class="sec-head"><div class="divider"><span class="sec-tag">Locations</span></div>
        <h2 class="sec-t fade">Find Your Local Area</h2>
        <p class="sec-sub fade">Click your suburb below for area-specific information, recent jobs, and a quick quote.</p>
      </div>
      <div class="rel-g">${cards}</div>
    </div></section>`,
    urgency(p),
    reviewsSection(),
    quoteForm(p),
    areasSection(p),
    footer(p),
  ].join('');
  return p;
}

function buildAbout() {
  const p = {
    slug:'/about/',
    metaTitle:'Roofing Gold Coast QLD | Tintek Roofing & Cladding',
    metaDesc:'Professional roofing solutions in Gold Coast QLD. Specializing in Colorbond roofing, roof repairs, and complete roof restorations.',
    h1:'About Us',
    heroSub:`Family-run, locally owned, and built on a reputation for quality work, honest pricing, and exceptional customer service.`,
    heroImg:'HOUSE2-12_0.webp',
    crumbs:[],
    crumbCurrent:'About',
  };
  p.bodyHTML = [
    innerHero(p),
    trustStrip(),
    splitSection({tag:'Our Story',title:'A decade of doing it right',body:[
      `Tintek Roofing & Cladding was built on a simple idea: do the job properly, charge a fair price, and look after the customer like they're family.`,
      `Over a decade later, we're still doing exactly that — across the Gold Coast, Tweed Heads, Brisbane and Northern NSW. Founded and run by Jacob, our small local team has installed thousands of premium Colorbond roofs and built a 4.8-star Google reputation along the way.`
    ],bullets:['Family-run, locally owned','Over a decade in business','QBCC licensed & fully insured','4.8★ on Google with 20+ reviews','Master Builder accredited','Approved Velux & Solatube installers'],img:'Untitled-design-88.jpg'},p),
    splitSection({tag:'Our Promise',title:`No shortcuts. No surprises.`,flip:true,body:[
      `Every roof we install is one we'd be proud to put on our own home. We use premium Colorbond materials, certified flashings, and proper sarking — even on jobs where nobody would ever see what's underneath.`,
      `Combined with a fixed-price quote up front, that means no nasty surprises during the job and a roof that lasts decades after we're gone.`
    ],bullets:['Fixed-price quotes','Premium Colorbond materials','Certified flashings & sarking','Workmanship warranty included'],img:'Untitled-design-89.jpg'},p),
    whyMini(),
    processSection(p),
    urgency(p),
    reviewsSection(),
    quoteForm(p),
    partners(p),
    areasSection(p),
    footer(p),
  ].join('');
  return p;
}

function buildContact() {
  const p = {
    slug:'/contact/',
    metaTitle:'Contact Us | Tintek Roofing & Cladding',
    metaDesc:'Get in touch with Tintek Roofing & Cladding for expert roofing and cladding solutions in Gold Coast. Call, email, or visit us today!',
    h1:'Contact',
    heroSub:`Ready to chat about your roofing project? Call us, email us, or fill out the quote form below — we'll get back within 24 hours.`,
    heroImg:'PRINT__DSC8213_reduced.jpg',
    crumbs:[],
    crumbCurrent:'Contact',
  };
  p.bodyHTML = [
    innerHero(p),
    `<section class="sec"><div class="ctr">
      <div class="contact-grid">
        <div class="cc-card fade"><div class="cc-ic">📞</div><h3>Phone</h3><p>Call directly during business hours.</p><a href="tel:0428219634" class="cc-v">0428 219 634</a></div>
        <div class="cc-card fade"><div class="cc-ic">✉</div><h3>Email</h3><p>Reply within 24 hours, often sooner.</p><a href="mailto:admin@tintek.com.au" class="cc-v">admin@tintek.com.au</a></div>
        <div class="cc-card fade"><div class="cc-ic">📍</div><h3>Location</h3><p>Servicing Gold Coast, Tweed & beyond.</p><span class="cc-v">Gold Coast, QLD</span></div>
        <div class="cc-card fade"><div class="cc-ic">🕐</div><h3>Hours</h3><p>Mon–Fri 7am–5pm. Saturday by appointment.</p><span class="cc-v">Emergency callouts after-hours</span></div>
      </div>
    </div></section>`,
    quoteForm(p),
    urgency(p),
    reviewsSection(),
    partners(p),
    areasSection(p),
    footer(p),
  ].join('');
  return p;
}

function buildFAQ() {
  const faqs = [
    {q:'How long does a typical re-roof take?',a:'Most residential re-roofs are completed in 3–5 working days, depending on roof size, complexity, and weather. We give you a firm timeline before we start.'},
    {q:'Do you handle insurance claims?',a:'Yes — we work with insurance assessors regularly. We provide detailed photo reports, scopes of work, and itemised quotes that meet insurer requirements.'},
    {q:'What warranty do you offer?',a:'You get the manufacturer warranty on materials (Colorbond is 30+ years), plus our workmanship warranty. We stand behind every job.'},
    {q:'Are you licensed and insured?',a:'Yes — fully QBCC licensed and comprehensively insured for public liability and workers comp.'},
    {q:'How much does a new roof cost?',a:'Roof costs vary widely with size, profile, colour, and complexity. We provide free, fixed-price quotes — no surprises after the job starts.'},
    {q:'Can you replace a tile roof with Colorbond?',a:'Absolutely — tile-to-Colorbond conversions are one of our specialties. The new roof is much lighter, cooler in summer, and looks stunning.'},
    {q:'Do you do small repairs?',a:`Yes — we don't have a minimum job size. Single-leak repairs, broken tiles, gutter cleaning — all welcome.`},
    {q:'How quickly can you get to an emergency?',a:'For genuine emergencies (active leaks, storm damage), we aim for same-day. Call early and we\'ll do everything we can.'},
    {q:'Do you service Tweed and Northern NSW?',a:'Yes — we service the entire Gold Coast, Tweed Heads, Murwillumbah, Kingscliff, Cabarita, Pottsville, and beyond.'},
    {q:'Do you do solar-ready roofs?',a:'Every new metal roof we install is solar-ready. We can also coordinate with your solar installer.'},
  ];
  const p = {
    slug:'/faq/',
    metaTitle:'Companies for Roofing | Tintek Roofing & Cladding',
    metaDesc:'Looking for reliable companies for roofing in Gold Coast? Tintek offers expert services. Check out our FAQ here.',
    h1:'FAQ',
    heroSub:`Everything you wanted to know about your roofing project — and a few things you probably didn't.`,
    heroImg:'PRINT__DSC8213_reduced.jpg',
    crumbs:[],
    crumbCurrent:'FAQ',
    schema:{"@context":"https://schema.org","@type":"FAQPage","mainEntity":faqs.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))}
  };
  p.bodyHTML = [
    innerHero(p),
    trustStrip(),
    faqSection(faqs),
    urgency(p),
    reviewsSection(),
    quoteForm(p),
    areasSection(p),
    footer(p),
  ].join('');
  return p;
}

function buildBlog() {
  const posts = [
    {title:'Tile vs Metal Roofing: Which Is Right for Your Gold Coast Home?',excerpt:'Tile and metal each have pros and cons. Here\'s when to choose each — and why Colorbond is winning the popularity contest.',date:'May 2026',img:'gallery-9ee77e48-1-1.jpg'},
    {title:'Bushfire-Rated Roofing: What BAL Means for Your Property',excerpt:'If your home is in a bushfire-prone area, your roof needs to meet specific BAL ratings. Here\'s a homeowner\'s guide.',date:'April 2026',img:'gallery-3c80b64a-2-min-1.webp'},
    {title:'How to Spot Roof Damage After a Gold Coast Storm',excerpt:'Five signs your roof took a hit in the last storm — and what to do next.',date:'March 2026',img:'4-1.webp'},
    {title:`A Homeowner's Guide to Colorbond Colours`,excerpt:'Surfmist, Monument, Basalt, Woodland Grey... here\'s how to pick the right Colorbond colour for your home.',date:'February 2026',img:'gallery-b1d2cb41-17-min.webp'},
  ];
  const p = {
    slug:'/blog/',
    metaTitle:'Blog - Tintek Roofing & Cladding',
    metaDesc:`Roofing tips, advice, and how-tos from Gold Coast metal roofing specialist Tintek Roofing & Cladding.`,
    h1:'Blog',
    heroSub:`Honest advice from working roofers — colours, materials, costs, common mistakes, and seasonal tips for Gold Coast and Tweed homes.`,
    heroImg:'PRINT__DSC8213_reduced.jpg',
    crumbs:[],
    crumbCurrent:'Blog',
  };
  const r = root(p.slug);
  p.bodyHTML = [
    innerHero(p),
    `<section class="sec"><div class="ctr">
      <div class="blog-g">
        ${posts.map(post => `
          <article class="blog-card fade">
            <div class="blog-img"><img src="${r}images/${post.img}" alt=""></div>
            <div class="blog-body">
              <span class="blog-date">${esc(post.date)}</span>
              <h3>${esc(post.title)}</h3>
              <p>${esc(post.excerpt)}</p>
              <a href="#" class="sarrow">Read More <span>→</span></a>
            </div>
          </article>`).join('')}
      </div>
    </div></section>`,
    urgency(p),
    quoteForm(p),
    footer(p),
  ].join('');
  return p;
}

// =============================================================
// BUILD ALL
// =============================================================
const allPages = [
  ...SERVICE_PAGES.map(buildServicePage),
  ...ROOFING_TYPE_PAGES.map(buildRoofingTypePage),
  ...SKYLIGHT_PAGES.map(buildSkylightPage),
  ...VELUX_PRODUCTS.map(buildProductPage),
  ...SOLATUBE_PRODUCTS.map(buildProductPage),
  ...LOCATIONS.map(l => buildLocationPage({...l, heroImg: l.heroImg || nextLocImg(), splitImg: l.splitImg || nextLocImg()})),
  buildServicesIndex(),
  buildRoofingIndex(),
  buildLocationsIndex(),
  buildAbout(),
  buildContact(),
  buildFAQ(),
  buildBlog(),
];

allPages.forEach(p => {
  const dir = '.' + p.slug;
  fs.mkdirSync(dir, {recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'), layout(p));
  console.log('✓', p.slug);
});

// === Sitemap ===
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://tintek.com.au/</loc><priority>1.0</priority></url>
${allPages.map(p => `  <url><loc>https://tintek.com.au${p.slug}</loc><priority>0.8</priority></url>`).join('\n')}
</urlset>`;
fs.writeFileSync('sitemap.xml', sitemap);

// === robots.txt ===
fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\nSitemap: https://tintek.com.au/sitemap.xml\n`);

console.log(`\nBuilt ${allPages.length} pages + sitemap.xml + robots.txt`);
