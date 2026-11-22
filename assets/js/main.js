/* Vertex Line Solutions — static rebuild interactions */
(function () {
  'use strict';

  /* ---- Mobile drawer ---- */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  var backdrop = document.getElementById('drawerBackdrop');
  var drawerClose = document.getElementById('drawerClose');

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (burger) burger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  document.querySelectorAll('.drawer [data-close]').forEach(function (a) {
    a.addEventListener('click', closeDrawer);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ---- Back to top ---- */
  var toTop = document.getElementById('toTop');
  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 500) toTop.classList.add('show');
    else toTop.classList.remove('show');
  }, { passive: true });
  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Hero video controls: Prev/Next step through the footage ---- */
  var heroVideo = document.getElementById('heroVideo');
  var prev = document.getElementById('heroPrev');
  var next = document.getElementById('heroNext');
  function seek(delta) {
    if (!heroVideo) return;
    var d = heroVideo.duration || 0;
    if (!d || !isFinite(d)) { heroVideo.currentTime = 0; return; }
    var t = heroVideo.currentTime + delta;
    if (t < 0) t += d;
    if (t > d) t -= d;
    heroVideo.currentTime = t;
    var pr = heroVideo.play(); if (pr && pr.catch) pr.catch(function () {});
  }
  if (prev) prev.addEventListener('click', function () { seek(-5); });
  if (next) next.addEventListener('click', function () { seek(5); });
  // Ensure autoplay kicks in on browsers that need a nudge
  if (heroVideo) {
    var kick = function () { var p = heroVideo.play(); if (p && p.catch) p.catch(function () {}); };
    heroVideo.addEventListener('canplay', kick, { once: true });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) kick(); });
  }

  /* ---- Marquee: duplicate content so the loop is seamless at any width ---- */
  var track = document.getElementById('marqueeTrack');
  if (track) {
    // already has two copies in markup; ensure enough width on very wide screens
    var copies = track.children.length;
    while (track.scrollWidth < window.innerWidth * 2 && copies < 6) {
      track.appendChild(track.children[0].cloneNode(true));
      copies++;
    }
  }

  /* ---- Contact form (front-end only) ---- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('cname').value.trim();
      var email = document.getElementById('cemail').value.trim();
      var msg = document.getElementById('cmsg').value.trim();
      if (!name || !email || !msg) {
        note.hidden = false;
        note.classList.remove('ok');
        note.style.color = '#d9534f';
        note.textContent = 'Please fill in your name, email and message.';
        return;
      }
      note.hidden = false;
      note.classList.add('ok');
      note.style.color = '';
      note.textContent = 'Thank you, ' + name + '! Your message has been noted.';
      form.reset();
    });
  }

  /* ---- Smooth-scroll offset for sticky header on in-page anchors ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var header = document.querySelector('.site-header');
      var offset = (header ? header.offsetHeight : 0) + 10;
      var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();
