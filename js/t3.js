/* variant 3: light entrance is pure CSS; a fine pointer nudges the photo */
(function () {
  var doc = document.documentElement;
  var fine = window.matchMedia('(pointer: fine)').matches, still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || still) return;
  var tick = 0, ex = 0, ey = 0;
  window.addEventListener('pointermove', function (e) {
    ex = e.clientX / window.innerWidth - 0.5; ey = e.clientY / window.innerHeight - 0.5;
    if (!tick) tick = requestAnimationFrame(function () {
      tick = 0;
      doc.style.setProperty('--mx', (-ex * 18).toFixed(1) + 'px');
      doc.style.setProperty('--my', (-ey * 12).toFixed(1) + 'px');
    });
  }, { passive: true });
})();
