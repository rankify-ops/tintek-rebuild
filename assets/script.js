// =====================================================
// Tintek site — shared front-end script
// Quote form uses FormSubmit.co (no signup, no API key)
// Change FORM_EMAIL once and every page submits there.
// =====================================================

// === CONFIG ===
// Where quote requests get emailed to.
// First submission triggers an activation email — click the link in it
// and every future submission arrives instantly.
var FORM_EMAIL = 'tflood@rankify.com.au';

// =============================================================

// Nav scroll state
var nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// Fade-in observer
var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (x) {
    if (x.isIntersecting) {
      x.target.classList.add('vis');
      io.unobserve(x.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade').forEach(function (el) { io.observe(el); });

// Mobile drawer
var mobTog = document.getElementById('mobTog');
var mdrawer = document.getElementById('mdrawer');
function toggleDrawer(open) {
  if (!mdrawer || !mobTog) return;
  var isOpen = open === undefined ? !mdrawer.classList.contains('open') : open;
  mdrawer.classList.toggle('open', isOpen);
  mobTog.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
if (mobTog && mdrawer) {
  mobTog.addEventListener('click', function () { toggleDrawer(); });
  mdrawer.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { toggleDrawer(false); });
  });
}

// =====================================================
// Quote Wizard
// =====================================================
var cs = 1, fd = {};
var labels = {
  s1: { new: 'New Roofing', reroof: 'Re-Roofing', repair: 'Repairs', other: 'Other' },
  s2: { residential: 'Residential', commercial: 'Commercial', industrial: 'Industrial', heritage: 'Heritage' },
  s3: { emergency: 'Emergency (ASAP)', month: 'Within a month', '3months': 'Within 3 months', planning: 'Just planning' }
};

function sel(b) {
  b.closest('.og').querySelectorAll('.ob').forEach(function (x) { x.classList.remove('sel'); });
  b.classList.add('sel');
  fd['s' + b.closest('.fslide').dataset.s] = b.dataset.v;
}
function nxt() {
  if (cs >= 4) return;
  if (cs <= 3 && !document.querySelector('.fslide[data-s="' + cs + '"] .ob.sel')) {
    var hint = document.querySelector('.fslide.active .fhint');
    if (!hint) {
      hint = document.createElement('p');
      hint.className = 'fhint';
      hint.style.cssText = 'color:#dc2626;font-size:.82rem;margin-top:10px;font-weight:600';
      hint.textContent = '↑ Please pick an option to continue';
      document.querySelector('.fslide.active .fnav').before(hint);
    }
    return;
  }
  cs++; upd();
}
function prv() { if (cs <= 1) return; cs--; upd(); }
function upd() {
  document.querySelectorAll('.fslide').forEach(function (s) { s.classList.remove('active'); });
  document.querySelector('.fslide[data-s="' + cs + '"]').classList.add('active');
  document.querySelectorAll('.fstep').forEach(function (s, i) {
    s.classList.remove('active', 'done');
    if (i + 1 === cs) s.classList.add('active');
    if (i + 1 < cs) s.classList.add('done');
  });
}

// Validation helpers
function validEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }
function validPhone(s) { return s.replace(/[^\d]/g, '').length >= 8; }

function showFieldError(id, msg) {
  var el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#dc2626';
  var existing = el.parentElement.querySelector('.field-err');
  if (existing) existing.remove();
  if (msg) {
    var err = document.createElement('p');
    err.className = 'field-err';
    err.style.cssText = 'color:#dc2626;font-size:.78rem;margin:-4px 0 8px;font-weight:500';
    err.textContent = msg;
    el.after(err);
  }
}
function clearFieldErrors() {
  document.querySelectorAll('.field-err').forEach(function (n) { n.remove(); });
  ['fn', 'fp', 'fe', 'fs'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.style.borderColor = '';
  });
}

function sub(ev) {
  if (ev && ev.preventDefault) ev.preventDefault();
  clearFieldErrors();

  var n = (document.getElementById('fn') || {}).value || '';
  var p = (document.getElementById('fp') || {}).value || '';
  var e = (document.getElementById('fe') || {}).value || '';
  var s = (document.getElementById('fs') || {}).value || '';
  n = n.trim(); p = p.trim(); e = e.trim(); s = s.trim();

  // Honeypot — hidden field bots fill in
  var hp = document.getElementById('fhp');
  if (hp && hp.value) { return; } // silently drop spam

  // Validation
  var ok = true;
  if (!n) { showFieldError('fn', 'Please enter your name'); ok = false; }
  if (!p || !validPhone(p)) { showFieldError('fp', 'Please enter a valid phone number'); ok = false; }
  if (!e || !validEmail(e)) { showFieldError('fe', 'Please enter a valid email'); ok = false; }
  if (!s) { showFieldError('fs', 'Please enter your suburb'); ok = false; }
  if (!ok) return;

  var btn = (ev && ev.target) || document.querySelector('.fslide.active .fn');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

  // Build the email body. FormSubmit's _template:'basic' renders each field
  // labelled and styled. Other templates (table/box/none) silently drop fields
  // when sent via the AJAX/JSON endpoint, so 'basic' is what we use.
  var projectType = labels.s1[fd.s1] || fd.s1 || 'Not specified';
  var propertyType = labels.s2[fd.s2] || fd.s2 || 'Not specified';
  var urgency = labels.s3[fd.s3] || fd.s3 || 'Not specified';

  // If the form is on a product page, the wrapper has data-product set.
  // We prepend that to the message so the inbox shows which product the
  // customer was actually looking at when they submitted.
  var productCtx = '';
  var qformEl = document.getElementById('quote-form');
  if (qformEl && qformEl.dataset && qformEl.dataset.product) {
    productCtx = qformEl.dataset.product;
  }

  // Inline all wizard data into the `message` field — FormSubmit reliably
  // renders name/email/phone/message via the AJAX endpoint, but custom fields
  // get silently dropped, so we pack everything into message.
  var lines = [];
  if (productCtx) {
    lines.push('*** PRODUCT QUOTE: ' + productCtx + ' ***');
    lines.push('Customer: ' + n + ' (' + s + ')');
  } else {
    lines.push('*** NEW QUOTE REQUEST from ' + n + ' (' + s + ') ***');
  }
  lines.push('');
  if (productCtx) lines.push('Product: ' + productCtx);
  lines.push('Project Type: ' + projectType);
  lines.push('Property Type: ' + propertyType);
  lines.push('Urgency: ' + urgency);
  lines.push('Suburb: ' + s);
  lines.push('');
  lines.push('--- Submission details ---');
  lines.push('Page: ' + location.pathname + location.search);
  lines.push('Submitted: ' + new Date().toLocaleString('en-AU', { timeZone: 'Australia/Brisbane' }) + ' AEST');
  lines.push('');
  lines.push('Reply directly to this customer at: ' + e);
  var msg = lines.join('\n');

  // ⚠️ Stick to exactly these fields. FormSubmit's free tier silently breaks
  // body rendering if you add any underscored config (_subject, _captcha, _replyto)
  // to a JSON/AJAX submission. Keep it bare.
  var payload = {
    _template: 'basic',
    name: n,
    email: e,
    phone: p,
    message: msg
  };

  fetch('https://formsubmit.co/ajax/' + encodeURIComponent(FORM_EMAIL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (d) {
      if (d && (d.success === true || d.success === 'true')) {
        cs = 5;
        document.querySelectorAll('.fslide').forEach(function (sl) { sl.classList.remove('active'); });
        document.querySelector('.fslide[data-s="5"]').classList.add('active');
        document.querySelectorAll('.fstep').forEach(function (sl) { sl.classList.remove('active'); sl.classList.add('done'); });
        if (typeof gtag === 'function') gtag('event', 'generate_lead', { value: 1, currency: 'AUD' });
        if (window.dataLayer) window.dataLayer.push({ event: 'quote_form_submitted', suburb: s });
      } else {
        throw new Error((d && d.message) || 'Unknown response');
      }
    })
    .catch(function (err) {
      if (btn) { btn.disabled = false; btn.textContent = 'Request My Quote →'; }
      var msg = 'Sorry — we could not send your enquiry. Please call us on 0428 219 634 or email admin@tintek.com.au.';
      var box = document.querySelector('.fslide.active');
      if (box) {
        var existing = box.querySelector('.form-err-msg');
        if (existing) existing.remove();
        var err2 = document.createElement('p');
        err2.className = 'form-err-msg';
        err2.style.cssText = 'background:#fef2f2;border:1px solid #fecaca;color:#991b1b;padding:12px 14px;border-radius:8px;font-size:.85rem;margin-top:14px;line-height:1.5';
        err2.textContent = msg;
        box.appendChild(err2);
      } else {
        alert(msg);
      }
      console.error('Quote form error:', err);
    });
}

// =====================================================
// Simple Product Form (used on product pages — no wizard)
// =====================================================
function subSimple(ev) {
  if (ev && ev.preventDefault) ev.preventDefault();
  clearFieldErrors();

  var n = (document.getElementById('fn') || {}).value || '';
  var p = (document.getElementById('fp') || {}).value || '';
  var e = (document.getElementById('fe') || {}).value || '';
  var s = (document.getElementById('fs') || {}).value || '';
  var notes = (document.getElementById('fnotes') || {}).value || '';
  n = n.trim(); p = p.trim(); e = e.trim(); s = s.trim(); notes = notes.trim();

  // Honeypot
  var hp = document.getElementById('fhp');
  if (hp && hp.value) return;

  // Validation
  var ok = true;
  if (!n) { showFieldError('fn', 'Please enter your name'); ok = false; }
  if (!p || !validPhone(p)) { showFieldError('fp', 'Please enter a valid phone number'); ok = false; }
  if (!e || !validEmail(e)) { showFieldError('fe', 'Please enter a valid email'); ok = false; }
  if (!s) { showFieldError('fs', 'Please enter your suburb'); ok = false; }
  if (!ok) return;

  var btn = (ev && ev.target) || document.querySelector('.psimple .fn');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

  // Read product context from form
  var qformEl = document.getElementById('quote-form');
  var product = (qformEl && qformEl.dataset && qformEl.dataset.product) || 'Product enquiry';

  var lines = [
    '*** PRODUCT QUOTE: ' + product + ' ***',
    'Customer: ' + n + ' (' + s + ')',
    '',
    'Product: ' + product,
    'Suburb: ' + s
  ];
  if (notes) {
    lines.push('');
    lines.push('Customer notes:');
    lines.push(notes);
  }
  lines.push('');
  lines.push('--- Submission details ---');
  lines.push('Page: ' + location.pathname + location.search);
  lines.push('Submitted: ' + new Date().toLocaleString('en-AU', { timeZone: 'Australia/Brisbane' }) + ' AEST');
  lines.push('');
  lines.push('Reply directly to this customer at: ' + e);

  var payload = {
    _template: 'basic',
    name: n,
    email: e,
    phone: p,
    message: lines.join('\n')
  };

  fetch('https://formsubmit.co/ajax/' + encodeURIComponent(FORM_EMAIL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (d) {
      if (d && (d.success === true || d.success === 'true')) {
        var formBox = document.querySelector('.psimple');
        var success = document.querySelector('.psimple-success');
        if (formBox) formBox.style.display = 'none';
        if (success) success.style.display = 'block';
        if (typeof gtag === 'function') gtag('event', 'generate_lead', { value: 1, currency: 'AUD', product: product });
        if (window.dataLayer) window.dataLayer.push({ event: 'product_quote_submitted', product: product, suburb: s });
      } else {
        throw new Error((d && d.message) || 'Unknown response');
      }
    })
    .catch(function (err) {
      if (btn) { btn.disabled = false; btn.textContent = 'Request My Quote →'; }
      var msg = 'Sorry — we could not send your enquiry. Please call us on 0428 219 634 or email admin@tintek.com.au.';
      var box = document.querySelector('.psimple');
      if (box) {
        var existing = box.querySelector('.form-err-msg');
        if (existing) existing.remove();
        var err2 = document.createElement('p');
        err2.className = 'form-err-msg';
        err2.style.cssText = 'background:#fef2f2;border:1px solid #fecaca;color:#991b1b;padding:12px 14px;border-radius:8px;font-size:.85rem;margin-top:14px;line-height:1.5';
        err2.textContent = msg;
        box.appendChild(err2);
      }
      console.error('Product quote error:', err);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (ev) {
    var h = a.getAttribute('href');
    if (h.length < 2) return;
    var t = document.querySelector(h);
    if (t) {
      ev.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
