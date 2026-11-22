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

  /* ---- Hero slider nav (single slide — subtle feedback) ---- */
  var hero = document.querySelector('.hero');
  var prev = document.getElementById('heroPrev');
  var next = document.getElementById('heroNext');
  function pulse() {
    if (!hero) return;
    hero.style.transition = 'opacity .35s ease';
    hero.style.opacity = '.6';
    setTimeout(function () { hero.style.opacity = '1'; }, 350);
  }
  if (prev) prev.addEventListener('click', pulse);
  if (next) next.addEventListener('click', pulse);

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
