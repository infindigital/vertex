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

  /* ---- Hero slider: Prev/Next + dots cycle the text slides over the video ---- */
  var heroVideo = document.getElementById('heroVideo');
  var prev = document.getElementById('heroPrev');
  var next = document.getElementById('heroNext');
  var heroStage = document.getElementById('heroSlides');
  var dotsWrap = document.getElementById('heroDots');
  if (heroStage) {
    var slides = Array.prototype.slice.call(heroStage.querySelectorAll('.hero-slide'));
    if (slides.length > 1) {
      var idx = Math.max(0, slides.findIndex(function (s) { return s.classList.contains('is-active'); }));
      var dots = [];
      if (dotsWrap) {
        slides.forEach(function (_, i) {
          var b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
          b.addEventListener('click', function () { go(i); restart(); });
          dotsWrap.appendChild(b);
          dots.push(b);
        });
      }
      var timer = null;
      var hero = heroStage.closest('.hero');
      var curVideo = '';
      function go(n) {
        idx = (n + slides.length) % slides.length;
        slides.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
        dots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
        var s = slides[idx];
        // Swap the shared background video to this slide's clip (load on demand)
        if (heroVideo && s.dataset.video && s.dataset.video !== curVideo) {
          curVideo = s.dataset.video;
          if (s.dataset.poster) heroVideo.poster = s.dataset.poster;
          heroVideo.src = s.dataset.video;
          var pr = heroVideo.play(); if (pr && pr.catch) pr.catch(function () {});
        }
        // Light theme (beige-card slide) hides the dark overlay and flips controls
        if (hero) hero.classList.toggle('hero--light', s.dataset.theme === 'light');
      }
      function restart() { if (timer) clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 6000); }
      if (prev) prev.addEventListener('click', function () { go(idx - 1); restart(); });
      if (next) next.addEventListener('click', function () { go(idx + 1); restart(); });
      if (hero) {
        hero.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
        hero.addEventListener('mouseleave', restart);
      }
      go(idx);
      restart();
    }
  }
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
