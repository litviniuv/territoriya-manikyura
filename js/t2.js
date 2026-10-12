/* variant 2: the slogan dissolves with blur over the first scroll; a thin bar shows that scroll */
(function () {
  var slog = document.querySelector('[data-melt]'), doc = document.documentElement;
  if (!slog) return;
  var inner = slog.querySelector('.in'), still = window.matchMedia('(prefers-reduced-motion: reduce)'), tick = 0;
  function run() {
    tick = 0;
    var h = Math.max(1, slog.offsetHeight), p = Math.min(1, Math.max(0, window.pageYOffset / h));
    doc.style.setProperty('--p', p.toFixed(3));
    if (still.matches) { inner.style.opacity = ''; inner.style.filter = ''; inner.style.transform = ''; return; }
    inner.style.opacity = (1 - p * 1.1).toFixed(3);
    inner.style.filter = p > 0.01 ? 'blur(' + (p * 14).toFixed(1) + 'px)' : '';
    inner.style.transform = 'translateY(' + (-p * 50).toFixed(1) + 'px)';
  }
  window.addEventListener('scroll', function () { if (!tick) tick = requestAnimationFrame(run); }, { passive: true });
  window.addEventListener('resize', run);
  run();
})();
