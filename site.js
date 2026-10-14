/* Kumi — comportamenti della home (italiano e inglese).
   1. «La tua città»: scegli una delle 43 città e la cartolina mostra un luogo
      vero di lì (citta.js), con un esempio di invito.
   2. «Avvisami»: la frase con lo spazio vuoto apre l'email già scritta.
   3. Il biglietto in apertura si rimpicciolisce un poco mentre si scorre.
   4. Le parti di ogni sezione entrano a scaglioni quando arrivano a schermo.
   5. Le frecce della fila di schermate. */
(function () {
  'use strict';
  var EN = document.documentElement.lang === 'en';
  var ROOT = EN ? '../' : '';
  var CITTA = window.KUMI_CITTA || [];
  var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function trova(nome) {
    for (var i = 0; i < CITTA.length; i++) if (CITTA[i].c === nome) return CITTA[i];
    return null;
  }
  function salva(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function leggi(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* ——— 1. La tua città ——— */
  var img = document.getElementById('city-img');
  var credit = document.getElementById('city-credit');
  var place = document.getElementById('city-place');
  var line = document.getElementById('city-line');
  var select = document.getElementById('city-select');
  var tabs = document.querySelectorAll('.tabs button[data-city]');
  var next = document.getElementById('city-next');
  var askCity = document.getElementById('ask-city');
  var corrente = 'Napoli';

  var GIORNI = EN ? { dom: 'Sunday', sab: 'Saturday' } : { dom: 'domenica', sab: 'sabato' };
  function frase(c) {
    var g = GIORNI[c.d];
    var ora = EN ? c.h.replace(/^(\d+):(\d+)$/, function (_, h, m) {
      h = +h; return (h > 12 ? h - 12 : h) + (m === '00' ? '' : ':' + m) + (h >= 12 ? 'pm' : 'am');
    }) : c.h;
    return EN
      ? 'An invitation in ' + c.c + ' could look like this: ' + g + ' at ' + ora + ', ' + c.p + ' of ' + c.t + ' places left. Kumi is in 43 Italian cities, each with its own museums and events.'
      : 'Così potrebbe essere un invito a ' + c.c + ': ' + g + ' alle ' + ora + ', restano ' + c.p + ' posti su ' + c.t + '. Kumi c\'è in 43 città, ognuna con i suoi musei e i suoi eventi.';
  }

  function mostra(nome, subito) {
    var c = trova(nome);
    if (!c || !img) return;
    corrente = nome;
    var nomeLuogo = EN ? c.ne : c.n;
    function scrivi() {
      img.src = ROOT + c.img;
      img.alt = nomeLuogo + ', ' + c.c;
      place.textContent = nomeLuogo;
      line.textContent = frase(c);
      credit.innerHTML = '';
      credit.appendChild(document.createTextNode(EN ? 'Photo: ' : 'Foto: '));
      var a = document.createElement('a');
      a.href = c.s; a.textContent = c.a;
      credit.appendChild(a);
      credit.appendChild(document.createTextNode(', ' + c.l));
    }
    if (subito || calmo) scrivi();
    else {
      img.classList.add('swap');
      var pre = new Image();
      pre.onload = pre.onerror = function () {
        setTimeout(function () { scrivi(); requestAnimationFrame(function () { img.classList.remove('swap'); }); }, 160);
      };
      pre.src = ROOT + c.img;
    }
    var inTab = false;
    tabs.forEach(function (b) {
      var on = b.getAttribute('data-city') === nome;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on) inTab = true;
    });
    if (select) {
      select.value = inTab ? '' : nome;
      select.classList.toggle('on', !inTab);
    }
    if (askCity && !askCity.dataset.touched) askCity.value = nome;
  }

  if (select && CITTA.length) {
    var principali = ['Napoli', 'Milano', 'Roma'];
    var lista = document.getElementById('citta-elenco');
    CITTA.forEach(function (c) {
      if (principali.indexOf(c.c) < 0) {
        var o = document.createElement('option');
        o.value = c.c; o.textContent = c.c; select.appendChild(o);
      }
      if (lista) { var d = document.createElement('option'); d.value = c.c; lista.appendChild(d); }
    });
    tabs.forEach(function (b) {
      b.addEventListener('click', function () { mostra(b.getAttribute('data-city')); salva('kumi-citta', corrente); });
    });
    select.addEventListener('change', function () {
      if (select.value) { mostra(select.value); salva('kumi-citta', corrente); }
    });
    if (next) next.addEventListener('click', function () {
      var altre = CITTA.filter(function (c) { return c.c !== corrente; });
      mostra(altre[Math.floor(Math.random() * altre.length)].c);
    });
    var ricordata = leggi('kumi-citta');
    mostra(trova(ricordata) ? ricordata : 'Napoli', true);
  }

  /* ——— 2. Avvisami ——— */
  var ask = document.getElementById('ask');
  if (askCity) askCity.addEventListener('input', function () { askCity.dataset.touched = '1'; });
  if (ask) ask.addEventListener('submit', function (e) {
    e.preventDefault();
    var citta = (askCity && askCity.value.trim()) || '';
    var oggetto = EN ? 'Let me know when Kumi is out' : 'Avvisami quando esce Kumi';
    var testo = EN
      ? 'Hi! Please write to me when Kumi is out.' + (citta ? ' I live in ' + citta + '.' : '')
      : 'Ciao! Scrivetemi quando esce Kumi.' + (citta ? ' Sono di ' + citta + '.' : '');
    location.href = 'mailto:info@kumiapp.space?subject=' + encodeURIComponent(oggetto) + '&body=' + encodeURIComponent(testo);
  });

  /* ——— 3. Il biglietto che si rimpicciolisce ——— */
  var hero = document.querySelector('.hero');
  var hold = document.querySelector('.ticket-hold');
  var photo = document.querySelector('.hero__photo');
  if (hero && hold && !calmo) {
    var attesa = false;
    function passo() {
      attesa = false;
      var corsa = hero.offsetHeight - window.innerHeight;
      var p = corsa > 0 ? Math.min(1, Math.max(0, window.scrollY / corsa)) : 0;
      hold.style.transform = 'translateY(' + (-3 * p) + 'vh) scale(' + (1 - 0.1 * p) + ')';
      if (photo) photo.style.opacity = String(1 - 0.45 * p);
    }
    window.addEventListener('scroll', function () { if (!attesa) { attesa = true; requestAnimationFrame(passo); } }, { passive: true });
    passo();
  }

  /* ——— 4. Entrate a scaglioni ——— */
  var blocchi = document.querySelectorAll('[data-in]');
  blocchi.forEach(function (b) {
    Array.prototype.forEach.call(b.children, function (f, i) { f.style.setProperty('--i', i); });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) { if (v.isIntersecting) { v.target.classList.add('in'); io.unobserve(v.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    blocchi.forEach(function (b) { io.observe(b); });
  } else blocchi.forEach(function (b) { b.classList.add('in'); });

  /* ——— 5. Frecce della fila di schermate ——— */
  var row = document.querySelector('.screens');
  var nav = document.querySelector('.shots-nav');
  if (row && nav) {
    var prev = nav.querySelector('[data-dir="-1"]');
    var succ = nav.querySelector('[data-dir="1"]');
    function aggiorna() {
      prev.disabled = row.scrollLeft <= 2;
      succ.disabled = row.scrollLeft >= row.scrollWidth - row.clientWidth - 2;
    }
    nav.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var primo = row.querySelector('.screen');
      var gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      row.scrollBy({ left: (+b.getAttribute('data-dir')) * (primo.getBoundingClientRect().width + gap), behavior: calmo ? 'auto' : 'smooth' });
    });
    row.addEventListener('scroll', aggiorna, { passive: true });
    window.addEventListener('resize', aggiorna);
    aggiorna();
  }
})();
