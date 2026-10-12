/* Территория маникюра · demo core */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  doc.classList.add('has-js');

  /* sticky bar height -> CSS var used by scroll-padding and the menu sheet */
  var bar = document.querySelector('[data-bar]');
  function barH() { return bar ? bar.getBoundingClientRect().height : 0; }
  function syncBar() { doc.style.setProperty('--bar', Math.round(barH()) + 'px'); }
  syncBar();
  window.addEventListener('resize', syncBar);
  if (window.ResizeObserver && bar) new ResizeObserver(syncBar).observe(bar);

  /* scrolling helpers */
  function hardScroll(y) {
    doc.style.scrollBehavior = 'auto';
    try { window.scrollTo({ top: y, left: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, y); }
    if (Math.abs(window.pageYOffset - y) > 1) { doc.scrollTop = y; document.body.scrollTop = y; }
  }
  function freeBehavior() {
    requestAnimationFrame(function () { requestAnimationFrame(function () { doc.style.scrollBehavior = ''; }); });
  }
  function gap() { return window.innerWidth >= 960 ? 32 : 16; }
  function targetY(sec) {
    var h = sec.querySelector('h2') || sec, y = 0, el = h;
    while (el) { y += el.offsetTop; el = el.offsetParent; }
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return Math.max(0, Math.min(max, y - barH() - gap()));
  }
  function land(id, keepY) {
    var sec = document.getElementById(id);
    if (!sec) return;
    history.replaceState(null, '', '#' + id);
    requestAnimationFrame(function () {
      if (keepY !== null && Math.abs(window.pageYOffset - keepY) > 2) hardScroll(keepY);
      var y = targetY(sec);
      if (reduce.matches) hardScroll(y); else window.scrollTo({ top: y, left: 0, behavior: 'smooth' });
      var h = sec.querySelector('h2') || sec;
      h.setAttribute('tabindex', '-1');
      h.focus({ preventScroll: true });
    });
  }

  /* mobile sheet */
  var toggle = document.querySelector('[data-sheet-toggle]');
  var sheet = document.getElementById('sheet');
  var opened = false, keep = 0;
  function freeze() {
    keep = window.pageYOffset;
    doc.style.scrollBehavior = 'auto';
    doc.classList.add('sheet-open');
    var b = document.body.style;
    b.position = 'fixed'; b.top = (-keep) + 'px'; b.left = '0'; b.right = '0'; b.width = '100%';
  }
  function thaw() {
    doc.style.scrollBehavior = 'auto';
    var b = document.body.style;
    b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = '';
    doc.classList.remove('sheet-open');
    hardScroll(keep);
    freeBehavior();
  }
  function openSheet() {
    opened = true; sheet.hidden = false; freeze();
    toggle.setAttribute('aria-expanded', 'true'); toggle.setAttribute('aria-label', 'Закрыть меню');
    requestAnimationFrame(function () { sheet.classList.add('is-shown'); });
  }
  function closeSheet(focusBack) {
    if (!opened) return;
    opened = false; sheet.classList.remove('is-shown'); sheet.hidden = true;
    toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Открыть меню');
    thaw();
    if (focusBack) toggle.focus({ preventScroll: true });
  }
  if (toggle && sheet) {
    toggle.addEventListener('click', function () { opened ? closeSheet(false) : openSheet(); });
    sheet.addEventListener('click', function (e) {
      var a = e.target.closest('a'); if (!a) return;
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) === '#' && href.length > 1) { e.preventDefault(); closeSheet(false); land(href.slice(1), keep); }
      else closeSheet(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && opened) closeSheet(true); });
    window.matchMedia('(min-width: 960px)').addEventListener('change', function (m) { if (m.matches) closeSheet(false); });
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-anchors] a[href^="#"]'), function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      if (id && document.getElementById(id)) { e.preventDefault(); land(id, null); }
    });
  });

  /* entrance on scroll: groups are observed as a whole */
  var marks = Array.prototype.slice.call(document.querySelectorAll('[data-in]'));
  function show(el) { el.classList.add('is-in'); }
  if (reduce.matches || !('IntersectionObserver' in window)) { marks.forEach(show); }
  else {
    doc.classList.add('anim');
    var watched = new Map();
    var io = new IntersectionObserver(function (list) {
      list.forEach(function (en) {
        if (!en.isIntersecting) return;
        (watched.get(en.target) || []).forEach(show);
        io.unobserve(en.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
    marks.forEach(function (el) {
      var host = el.closest('[data-group]') || el;
      if (!watched.has(host)) { watched.set(host, []); io.observe(host); }
      watched.get(host).push(el);
    });
    var check = function () {
      var vh = window.innerHeight;
      marks.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        var r = (el.closest('[data-group]') || el).getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) show(el);
      });
    };
    ['scroll', 'resize', 'load', 'hashchange'].forEach(function (t) { window.addEventListener(t, check, { passive: true }); });
    setTimeout(check, 500); setTimeout(function () { marks.forEach(show); }, 3500);
  }

  /* map only on request */
  var map = document.querySelector('[data-map]');
  if (map) {
    var btn = map.querySelector('button');
    btn.hidden = false;
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = map.getAttribute('data-map'); f.title = map.getAttribute('data-map-title');
      f.loading = 'lazy'; f.allowFullscreen = true; f.referrerPolicy = 'no-referrer-when-downgrade';
      map.innerHTML = ''; map.appendChild(f); map.classList.add('is-live');
    });
  }
})();
