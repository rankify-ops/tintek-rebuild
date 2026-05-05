// === CONFIG ===
// Form recipient — change this to whoever should receive quote requests.
// Uses FormSubmit.co — no signup needed. The first submission triggers an activation email
// to this address; click the link to confirm and all future submissions arrive automatically.
var FORM_EMAIL = 'admin@tintek.com.au';

// Nav scroll state
window.addEventListener('scroll',function(){document.getElementById('nav').classList.toggle('scrolled',scrollY>20)});

// Fade-in observer
var io=new IntersectionObserver(function(entries){entries.forEach(function(x){if(x.isIntersecting){x.target.classList.add('vis');io.unobserve(x.target)}})},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.fade').forEach(function(el){io.observe(el)});

// Mobile drawer
var mobTog=document.getElementById('mobTog'),mdrawer=document.getElementById('mdrawer');
function toggleDrawer(open){var isOpen=open===undefined?!mdrawer.classList.contains('open'):open;mdrawer.classList.toggle('open',isOpen);mobTog.classList.toggle('open',isOpen);document.body.style.overflow=isOpen?'hidden':''}
mobTog.addEventListener('click',function(){toggleDrawer()});
mdrawer.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){toggleDrawer(false)})});

// Quote wizard
var cs=1,fd={};
var labels={
  s1:{new:'New Roofing',reroof:'Re-Roofing',repair:'Repairs',other:'Other'},
  s2:{residential:'Residential',commercial:'Commercial',industrial:'Industrial',heritage:'Heritage'},
  s3:{emergency:'Emergency',month:'Within a month','3months':'Within 3 months',planning:'Just planning'}
};
function sel(b){b.closest('.og').querySelectorAll('.ob').forEach(function(x){x.classList.remove('sel')});b.classList.add('sel');fd['s'+b.closest('.fslide').dataset.s]=b.dataset.v}
function nxt(){if(cs>=4)return;if(cs<=3&&!document.querySelector('.fslide[data-s="'+cs+'"] .ob.sel'))return;cs++;upd()}
function prv(){if(cs<=1)return;cs--;upd()}
function upd(){document.querySelectorAll('.fslide').forEach(function(s){s.classList.remove('active')});document.querySelector('.fslide[data-s="'+cs+'"]').classList.add('active');document.querySelectorAll('.fstep').forEach(function(s,i){s.classList.remove('active','done');if(i+1===cs)s.classList.add('active');if(i+1<cs)s.classList.add('done')})}

function sub(ev){
  var n=document.getElementById('fn').value.trim(),p=document.getElementById('fp').value.trim(),
      e=document.getElementById('fe').value.trim(),s=document.getElementById('fs').value.trim();
  if(!n||!p||!e||!s){alert('Please fill in all fields');return}
  var btn=(ev&&ev.target)||document.querySelector('.fslide.active .fn');btn.disabled=true;btn.textContent='Sending…';

  var payload={
    _subject:'New Quote Request from '+n+' ('+s+')',
    _template:'table',
    _captcha:'false',
    Name:n,Phone:p,Email:e,Suburb:s,
    'Project Type':labels.s1[fd.s1]||fd.s1||'',
    'Property Type':labels.s2[fd.s2]||fd.s2||'',
    'Urgency':labels.s3[fd.s3]||fd.s3||'',
    'Submitted From':'tintek.com.au homepage quote form'
  };

  fetch('https://formsubmit.co/ajax/'+encodeURIComponent(FORM_EMAIL),{
    method:'POST',
    headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify(payload)
  }).then(function(r){return r.json()}).then(function(d){
    fd.name=n;fd.phone=p;fd.email=e;fd.suburb=s;
    cs=5;
    document.querySelectorAll('.fslide').forEach(function(s){s.classList.remove('active')});
    document.querySelector('.fslide[data-s="5"]').classList.add('active');
    document.querySelectorAll('.fstep').forEach(function(s){s.classList.remove('active');s.classList.add('done')});
  }).catch(function(err){
    btn.disabled=false;btn.textContent='Request My Quote →';
    alert('Sorry — something went wrong. Please call us on 0428 219 634 or email admin@tintek.com.au.');
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(ev){var h=a.getAttribute('href');if(h.length<2)return;var t=document.querySelector(h);if(t){ev.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}})});
