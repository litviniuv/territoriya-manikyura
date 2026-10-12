/* variant 2: the set of four frames swaps as the sticky hero scrolls */
(function () {
  var hero = document.querySelector('.hero2');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var imgs = hero.querySelectorAll('.drop__img'), caps = hero.querySelectorAll('.drop__cap span'), cur = 0, tick = 0;
  function setTo(s) {
    if (s === cur) return; cur = s;
    Array.prototype.forEach.call(imgs, function (im) { im.classList.toggle('on', +im.getAttribute('data-set') === s); });
    Array.prototype.forEach.call(caps, function (c) { c.classList.toggle('on', +c.getAttribute('data-set') === s); });
  }
  function onScroll() {
    tick = 0;
    var r = hero.getBoundingClientRect(), span = Math.max(1, hero.offsetHeight - window.innerHeight);
    var prog = Math.min(1, Math.max(0, -r.top / span));
    setTo(prog > 0.45 ? 1 : 0);
  }
  window.addEventListener('scroll', function () { if (!tick) tick = requestAnimationFrame(onScroll); }, { passive: true });
  /* first drop on load */
  Array.prototype.forEach.call(imgs, function (im) { if (im.classList.contains('on')) { im.classList.remove('on'); requestAnimationFrame(function () { requestAnimationFrame(function () { im.classList.add('on'); }); }); } });
})();
