// Patch the home page index.html so its nav, dropdowns, drawer, footer
// and area-tags link to the real pages we just generated.
const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// ---- NAV main items (Services / Roofing pages exist as index pages) ----
h = h.replace(
  /<li><a href="#services">Services <span class="chev">▼<\/span><\/a>\s*<div class="dropdown">[\s\S]*?<\/div>\s*<\/li>/,
`<li><a href="services/">Services <span class="chev">▼</span></a>
        <div class="dropdown">
          <a href="services/emergency-roof-repairs-gold-coast/">Emergency Roof Repairs</a>
          <a href="services/gutter-guard-gold-coast/">Gutter Guard</a>
          <a href="services/gutters-downpipes-gold-coast/">Gutters and Downpipes</a>
          <a href="roofing/re-roofing-roof-replacements/">Re-Roofing & Replacements</a>
          <a href="services/roof-inspection-gold-coast/">Roof Inspections</a>
          <a href="services/roof-ventilation-gold-coast/">Roof Ventilation</a>
          <a href="services/roof-repairs-gold-coast/">Roof Repairs</a>
        </div>
      </li>`);

h = h.replace(
  /<li><a href="#roofing">Roofing <span class="chev">▼<\/span><\/a>\s*<div class="dropdown">[\s\S]*?<\/div>\s*<\/li>/,
`<li><a href="roofing/">Roofing <span class="chev">▼</span></a>
        <div class="dropdown">
          <a href="roofing/new-roofing-gold-coast/">New Roofing</a>
          <a href="roofing/re-roofing-roof-replacements/">Re-Roofing & Replacements</a>
          <a href="roofing/heritage-roofing/">Heritage Roofing</a>
          <a href="roofing/residential-roofing/">Residential Roofing</a>
          <a href="roofing/commercial-roofing-gold-coast/">Commercial Roofing</a>
          <a href="roofing/industrial-roofing/">Industrial Roofing</a>
        </div>
      </li>`);

h = h.replace(
  /<li><a href="#">Skylights <span class="chev">▼<\/span><\/a>\s*<div class="dropdown">[\s\S]*?<\/div>\s*<\/li>/,
`<li><a href="gold-coast-skylights/">Skylights <span class="chev">▼</span></a>
        <div class="dropdown">
          <a href="gold-coast-skylights/velux-skylights/">Velux Skylights</a>
          <a href="gold-coast-skylights/solatube-skylights/">Solatube Skylights</a>
        </div>
      </li>`);

// ---- Other top nav items ----
h = h.replace(/<li><a href="#areas">Service Areas<\/a><\/li>/, `<li><a href="locations/">Service Areas</a></li>`);
h = h.replace(/<li><a href="#about">About<\/a><\/li>/, `<li><a href="about/">About</a></li>`);
h = h.replace(/<li><a href="#quote-form">Contact<\/a><\/li>/, `<li><a href="contact/">Contact</a></li>`);

// ---- Logo + topbar service-area placeholder ----
h = h.replace(/<a href="#" class="logo">/g, `<a href="./" class="logo">`);
h = h.replace(/<a href="#">Servicing the Gold Coast/, `<a href="locations/">Servicing the Gold Coast`);

// ---- Mobile drawer ----
h = h.replace(
  /<div class="mdrawer" id="mdrawer">[\s\S]*?<\/div>\s*<\/div>/,
`<div class="mdrawer" id="mdrawer">
  <ul class="mdrawer-list">
    <li><a href="services/">Services</a></li>
    <li><a href="services/emergency-roof-repairs-gold-coast/" class="sublink">Emergency Roof Repairs</a></li>
    <li><a href="services/gutter-guard-gold-coast/" class="sublink">Gutter Guard</a></li>
    <li><a href="services/gutters-downpipes-gold-coast/" class="sublink">Gutters & Downpipes</a></li>
    <li><a href="services/roof-inspection-gold-coast/" class="sublink">Roof Inspections</a></li>
    <li><a href="services/roof-ventilation-gold-coast/" class="sublink">Roof Ventilation</a></li>
    <li><a href="services/roof-repairs-gold-coast/" class="sublink">Roof Repairs</a></li>
    <li><a href="roofing/">Roofing</a></li>
    <li><a href="roofing/new-roofing-gold-coast/" class="sublink">New Roofing</a></li>
    <li><a href="roofing/re-roofing-roof-replacements/" class="sublink">Re-Roofing & Replacements</a></li>
    <li><a href="roofing/heritage-roofing/" class="sublink">Heritage Roofing</a></li>
    <li><a href="roofing/residential-roofing/" class="sublink">Residential Roofing</a></li>
    <li><a href="roofing/commercial-roofing-gold-coast/" class="sublink">Commercial Roofing</a></li>
    <li><a href="roofing/industrial-roofing/" class="sublink">Industrial Roofing</a></li>
    <li><a href="gold-coast-skylights/">Skylights</a></li>
    <li><a href="locations/">Service Areas</a></li>
    <li><a href="about/">About</a></li>
    <li><a href="faq/">FAQ</a></li>
    <li><a href="contact/">Contact</a></li>
  </ul>
  <div class="mdrawer-cta">
    <a href="tel:0428219634" class="mc-call">📞 0428 219 634</a>
    <a href="contact/#quote-form" class="mc-quote">Get a Free Quote →</a>
  </div>
</div>`);

// ---- Service cards on homepage: each <a href="#" class="scard"> → relevant page ----
const scardLinks = [
  'services/gutters-downpipes-gold-coast/',
  'services/roof-ventilation-gold-coast/',
  'gold-coast-skylights/',
  'services/roof-inspection-gold-coast/',
  'services/emergency-roof-repairs-gold-coast/',
  'services/gutter-guard-gold-coast/',
  'services/roof-repairs-gold-coast/',
  'roofing/re-roofing-roof-replacements/',
];
let scardIdx = 0;
h = h.replace(/<a href="#" class="scard fade">/g, () => `<a href="${scardLinks[scardIdx++] || '#'}" class="scard fade">`);

// ---- Areas section: convert spans to links ----
const suburbMap = {
  'Gold Coast': 'locations/gold-coast-roofing-services/',
  'Tweed Heads': 'locations/tweed-heads/',
  'Burleigh': 'locations/burleigh/',
  'Palm Beach': 'locations/palm-beach/',
  'Murwillumbah': 'locations/roofing-murwillumbah/',
  'Cabarita Beach': 'locations/cabarita-beach/',
  'Nerang': 'locations/nerang/',
  'Mudgeeraba': 'locations/mudgeeraba/',
  'Pottsville': 'locations/roofing-pottsville/',
  'Kingscliff': 'locations/kingscliff/',
  'Banora Point': 'locations/banora-point/',
  'Robina': 'locations/robina/',
};
h = h.replace(/<span class="atag">([^<]+)<\/span>/g, (m, name) => {
  return suburbMap[name]
    ? `<a href="${suburbMap[name]}" class="atag">${name}</a>`
    : `<span class="atag">${name}</span>`;
});

// ---- Footer service links ----
h = h.replace(
  /<div><h4>Services<\/h4><ul class="foot-l">[\s\S]*?<\/ul><\/div>/,
`<div><h4>Services</h4><ul class="foot-l">
          <li><a href="roofing/new-roofing-gold-coast/">New Roofing</a></li>
          <li><a href="roofing/re-roofing-roof-replacements/">Re-Roofing & Replacements</a></li>
          <li><a href="roofing/heritage-roofing/">Heritage Roofing</a></li>
          <li><a href="roofing/residential-roofing/">Residential Roofing</a></li>
          <li><a href="roofing/commercial-roofing-gold-coast/">Commercial Roofing</a></li>
          <li><a href="roofing/industrial-roofing/">Industrial Roofing</a></li>
        </ul></div>`);

// ---- Footer Quick Links ----
h = h.replace(
  /<div><h4>Quick Links<\/h4><ul class="foot-l">[\s\S]*?<\/ul><\/div>/,
`<div><h4>Quick Links</h4><ul class="foot-l">
          <li><a href="./">Home</a></li>
          <li><a href="about/">About</a></li>
          <li><a href="services/">Services</a></li>
          <li><a href="faq/">FAQ</a></li>
          <li><a href="contact/">Contact</a></li>
        </ul></div>`);

// ---- Footer brand logo ----
h = h.replace(/<a href="#" class="logo"><img src="images\/Asset-1\.png"/, `<a href="./" class="logo"><img src="images/Asset-1.png"`);

// ---- Sticky bar already points to #quote-form (works on home) ----
// ---- Hero CTAs go to #quote-form (works on home) ----

fs.writeFileSync('index.html', h);
console.log('✓ Patched home page links');
console.log('Remaining # links (anchors expected on-page):',
  (h.match(/href="#[a-z\-]+"/g) || []).join(', '));
