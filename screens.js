// Fila delle schermate: le frecce scorrono di una schermata alla volta e si
// spengono agli estremi. Lo scorrimento vero lo fa il CSS (scroll-snap).
(function () {
  var row = document.querySelector('.screens');
  var nav = document.querySelector('.shots-nav');
  if (!row || !nav) return;
  var prev = nav.querySelector('[data-dir="-1"]');
  var next = nav.querySelector('[data-dir="1"]');

  function step() {
    var first = row.querySelector('.screen');
    if (!first) return row.clientWidth;
    var gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    return first.getBoundingClientRect().width + gap;
  }

  function update() {
    var max = row.scrollWidth - row.clientWidth - 2;
    prev.disabled = row.scrollLeft <= 2;
    next.disabled = row.scrollLeft >= max;
  }

  // Durante lo scorrimento animato i clic si sommano alla meta gia' fissata
  // (con scrollBy il secondo clic annullava il primo).
  var target = null, idle;
  nav.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b || b.disabled) return;
    var max = row.scrollWidth - row.clientWidth;
    var base = target === null ? row.scrollLeft : target;
    target = Math.max(0, Math.min(max, base + step() * Number(b.getAttribute('data-dir'))));
    row.scrollTo({ left: target, behavior: 'smooth' });
  });
  row.addEventListener('scroll', function () {
    update();
    clearTimeout(idle);
    idle = setTimeout(function () { target = null; }, 180);
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
