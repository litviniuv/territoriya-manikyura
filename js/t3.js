/* variant 3: the lifted card tilts and catches light under a fine pointer; ring on press */
(function () {
  var card = document.querySelector('.lift__card');
  if (!card) return;
  var fine = window.matchMedia('(pointer: fine)').matches, still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (fine && !still) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((0.5 - y) * 8).toFixed(2) + 'deg');
      card.style.setProperty('--sx', Math.round(x * 100) + '%');
    });
    card.addEventListener('pointerleave', function () { card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); card.style.removeProperty('--sx'); });
  }
  card.addEventListener('pointerdown', function () { card.classList.remove('ring'); void card.offsetWidth; card.classList.add('ring'); });
})();
