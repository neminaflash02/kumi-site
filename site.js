/* Kumi — comportamenti della home (italiano e inglese).
   1. «La tua città»: scegli una delle 43 città e la cartolina mostra un luogo
      vero di lì (citta.js), con un esempio di invito.
   2. Lista d'attesa: email, città e provenienza finiscono su Supabase
      (slice BL e BP); se non
      va, si offre l'email già scritta.
   3. Il biglietto in apertura si rimpicciolisce un poco mentre si scorre,
      e «Entra in lista d'attesa» strappa il tagliando, che cade.
   4. Le parti di ogni sezione entrano a scaglioni quando arrivano a schermo;
      lo scontrino si stampa riga per riga.
   5. Le frecce della fila di schermate.
   6. «Prova l'affinità»: scegli gli interessi, la scheda trova la più affine. */
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
  var wCity = document.getElementById('w-city');
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
    scrivi();
    if (!subito && !calmo && img.animate) {
      // sfuma dentro la nuova foto; la foto resta sempre visibile anche se
      // l'animazione non parte
      var anima = function () { img.animate([{ opacity: .25, transform: 'scale(1.04)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.16,1,.3,1)' }); };
      if (img.complete) anima(); else img.addEventListener('load', anima, { once: true });
    }
    if (window.KUMI_AFFINITA) window.KUMI_AFFINITA(nome);
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
    if (wCity && !wCity.dataset.touched) wCity.value = nome;
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
    // «Un'altra città» gira come una slot: i nomi scorrono veloci, rallentano
    // e si fermano su una città a caso; poi arrivano la foto e il luogo.
    var gira = false;
    if (next) next.addEventListener('click', function () {
      if (gira) return;
      var altre = CITTA.filter(function (c) { return c.c !== corrente; });
      var meta = altre[Math.floor(Math.random() * altre.length)].c;
      if (calmo) { mostra(meta); salva('kumi-citta', meta); return; }
      gira = true; next.disabled = true;
      place.classList.add('spin');
      var giri = 14, n = 0;
      (function tick() {
        n++;
        var nome = n < giri ? CITTA[Math.floor(Math.random() * CITTA.length)].c : meta;
        place.textContent = nome;
        if (place.animate) place.animate([{ transform: 'translateY(-60%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: Math.min(220, 50 + n * 12), easing: 'ease-out' });
        if (n < giri) { setTimeout(tick, 45 + n * n * 1.6); return; }
        setTimeout(function () {
          place.classList.remove('spin');
          mostra(meta); salva('kumi-citta', meta);
          gira = false; next.disabled = false;
        }, 380);
      })();
    });
    var ricordata = leggi('kumi-citta');
    mostra(trova(ricordata) ? ricordata : 'Napoli', true);
  }

  /* ——— 2. Lista d'attesa ——— */
  // Le pagine senza «La tua città» (la /ig) suggeriscono comunque le 43 città.
  var elenco = document.getElementById('citta-elenco');
  if (!select && elenco) CITTA.forEach(function (c) {
    var o = document.createElement('option'); o.value = c.c; elenco.appendChild(o);
  });
  var SB_URL = 'https://gqwgikwqajhbbgfnnray.supabase.co';
  var SB_KEY = 'sb_publishable_g7c9PSF_FIIAhaMMud69aQ_erQvR6Xo';  // pubblica: la tabella accetta solo nuove righe
  // Da dove arriva (slice BP): ?da=reddit nel link vince, poi la pagina
  // (la /ig dice «instagram»), altrimenti «sito».
  var DA = (function () {
    var m = /[?&]da=([a-z0-9_-]{1,30})(?:&|$)/i.exec(location.search);
    return m ? m[1].toLowerCase() : (document.body.getAttribute('data-source') || 'sito');
  })();
  var form = document.getElementById('wait-form');
  var wEmail = document.getElementById('w-email');
  var wMsg = document.getElementById('w-msg');
  if (wCity) wCity.addEventListener('input', function () { wCity.dataset.touched = '1'; });
  function mailto(citta) {
    var oggetto = EN ? 'Let me know when Kumi is out' : 'Avvisami quando esce Kumi';
    var testo = (EN ? 'Hi! Please write to me when Kumi is out.' : 'Ciao! Scrivetemi quando esce Kumi.') + (citta ? (EN ? ' I live in ' : ' Sono di ') + citta + '.' : '');
    return 'mailto:info@kumiapp.space?subject=' + encodeURIComponent(oggetto) + '&body=' + encodeURIComponent(testo);
  }
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = wEmail.value.trim();
    var citta = (wCity && wCity.value.trim()) || '';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      wEmail.setAttribute('aria-invalid', 'true');
      wMsg.textContent = EN ? 'Check your email address: something is missing.' : 'Controlla l\'email: manca qualcosa.';
      wEmail.focus();
      return;
    }
    wEmail.removeAttribute('aria-invalid');
    var tasto = form.querySelector('button');
    tasto.disabled = true;
    wMsg.textContent = EN ? 'Saving…' : 'Un attimo…';
    fetch(SB_URL + '/rest/v1/site_waitlist', {
      method: 'POST',
      headers: { apikey: SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ email: email, city: citta || null, lang: EN ? 'en' : 'it', source: DA })
    }).then(function (r) {
      if (r.ok || r.status === 409) {
        form.classList.add('done');
        wMsg.textContent = r.status === 409
          ? (EN ? 'You were already on the list. See you at launch!' : 'Eri già in lista. Ci sentiamo all\'uscita!')
          : (EN ? 'Done! We\'ll write to you the day Kumi is out.' : 'Fatto! Ti scriviamo il giorno in cui esce Kumi.');
        tasto.textContent = EN ? 'You\'re on the list' : 'Sei in lista';
        return;
      }
      throw new Error(r.status);
    }).catch(function () {
      tasto.disabled = false;
      wMsg.innerHTML = '';
      wMsg.appendChild(document.createTextNode(EN ? 'It didn\'t go through. ' : 'Non è andata. '));
      var a = document.createElement('a');
      a.href = mailto(citta); a.textContent = EN ? 'Send us an email instead' : 'Mandaci un\'email';
      wMsg.appendChild(a);
    });
  });

  /* il tagliando del biglietto si strappa e porta alla lista */
  var strappa = document.getElementById('strappa');
  if (strappa && !calmo) strappa.addEventListener('click', function (e) {
    var stub = strappa.closest('.ticket__stub');
    var dove = document.getElementById('lista');
    if (!stub || !dove) return;
    e.preventDefault();
    if (stub.classList.contains('torn')) { dove.scrollIntoView({ behavior: 'smooth' }); return; }
    stub.classList.add('torn');                       // si stacca e cade (home.css)
    var biglietto = stub.closest('.ticket');
    setTimeout(function () { biglietto.classList.add('strappato'); }, 420);
    setTimeout(function () {
      dove.scrollIntoView({ behavior: 'smooth' });
      setTimeout(function () { if (wEmail) wEmail.focus({ preventScroll: true }); }, 800);
    }, 1250);
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
  var slip = document.getElementById('slip');
  if (slip) Array.prototype.forEach.call(slip.querySelectorAll('h3, li, .end'), function (r, i) { r.style.setProperty('--r', i); });
  var blocchi = document.querySelectorAll('[data-in], #slip');
  blocchi.forEach(function (b) {
    Array.prototype.forEach.call(b.children, function (f, i) { f.style.setProperty('--i', i); });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) { if (v.isIntersecting) { v.target.classList.add('in'); io.unobserve(v.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    blocchi.forEach(function (b) {
      // Un blocco senza riquadro proprio (display: contents, come «Prova
      // l'affinità» da telefono) non viene mai visto dall'osservatore e
      // resterebbe invisibile: per quelli si guarda la sezione intorno.
      if (getComputedStyle(b).display === 'contents') {
        var sez = b.closest('section') || b.parentElement;
        var io2 = new IntersectionObserver(function (v) {
          if (v[0].isIntersecting) { b.classList.add('in'); io2.disconnect(); }
        }, { rootMargin: '0px 0px -12% 0px' });
        io2.observe(sez);
      } else io.observe(b);
    });
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

  /* ——— 6. Prova l'affinità ——— */
  var chips = document.querySelectorAll('.chips button');
  if (chips.length) {
    var IT_EN = { arte: 'art', musica: 'music', yoga: 'yoga', viaggi: 'travel', cucina: 'cooking', libri: 'books', cinema: 'cinema', vino: 'wine', ballo: 'dancing', natura: 'nature', musei: 'museums', concerti: 'concerts' };
    // Tre amiche d'esempio: nomi inventati, come i profili della demo.
    var AMICHE = [
      { n: 'Valentina', e: 29, i: ['arte', 'musei', 'cinema', 'vino', 'libri', 'viaggi'] },
      { n: 'Chiara', e: 31, i: ['yoga', 'natura', 'cucina', 'viaggi', 'libri', 'musica'] },
      { n: 'Marta', e: 26, i: ['concerti', 'musica', 'ballo', 'vino', 'cinema', 'cucina'] }
    ];
    // Cosa proporre in chat per ogni interesse in comune
    var PIANI = EN ? {
      arte: 'an exhibition', musica: 'a concert', yoga: 'a yoga class in the park', viaggi: 'a day trip', cucina: 'a cooking class',
      libri: 'a book club', cinema: 'an open-air film', vino: 'a wine tasting', ballo: 'a dance night', natura: 'a walk', musei: 'a guided museum tour', concerti: 'a concert'
    } : {
      arte: 'una mostra', musica: 'un concerto', yoga: 'yoga al parco', viaggi: 'una gita fuori porta', cucina: 'un corso di cucina',
      libri: 'un club del libro', cinema: 'un film all\'aperto', vino: 'una degustazione', ballo: 'una serata di ballo', natura: 'una passeggiata', musei: 'una visita guidata al museo', concerti: 'un concerto'
    };
    // «anche tu ami …»
    var AMI = EN ? {
      arte: 'art', musica: 'music', yoga: 'yoga', viaggi: 'travelling', cucina: 'cooking', libri: 'reading',
      cinema: 'films', vino: 'wine', ballo: 'dancing', natura: 'nature', musei: 'museums', concerti: 'live music'
    } : {
      arte: "l'arte", musica: 'la musica', yoga: 'lo yoga', viaggi: 'viaggiare', cucina: 'cucinare', libri: 'leggere',
      cinema: 'un film all\'aperto', vino: 'il vino', ballo: 'ballare', natura: 'la natura', musei: 'i musei', concerti: 'i concerti'
    };
    var scelti = [];
    var cittaGioco = corrente;
    var nome = document.getElementById('m-name'), luogo = document.getElementById('m-city'), viso = document.getElementById('m-face');
    var pct = document.getElementById('m-pct'), barra = document.getElementById('m-bar'), comune = document.getElementById('m-common');
    var chat = document.getElementById('m-chat'), d1 = document.getElementById('m-say1'), d2 = document.getElementById('m-say2');
    var mostrato = 0, ultima = '', persona = '';
    var timbro = document.getElementById('m-stamp');
    function etichetta(k) { return EN ? IT_EN[k] : k; }
    function conta(da, a) {
      if (calmo) { pct.textContent = a; return; }
      var t0 = performance.now();
      (function giro(t) {
        var p = Math.min(1, (t - t0) / 550);
        pct.textContent = Math.round(da + (a - da) * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(giro);
      })(t0);
    }
    function aggiorna() {
      luogo.textContent = cittaGioco;
      if (!scelti.length) {
        conta(mostrato, 0); mostrato = 0;
        if (timbro) timbro.classList.remove('on');
        barra.style.transform = 'scaleX(0)';
        comune.textContent = EN ? 'Pick at least one interest to see your affinity.' : 'Scegli almeno un interesse per vedere la tua affinità.';
        chat.classList.add('off');
        return;
      }
      var meglio = AMICHE[0], inComune = [];
      AMICHE.forEach(function (a) {
        var c = scelti.filter(function (k) { return a.i.indexOf(k) >= 0; });
        if (c.length > inComune.length) { meglio = a; inComune = c; }
      });
      var valore = inComune.length ? Math.min(98, 52 + inComune.length * 12 + Math.round(inComune.length / scelti.length * 10)) : 23 + scelti.length * 3;
      nome.textContent = meglio.n + ', ' + meglio.e;
      viso.textContent = meglio.n.charAt(0);
      if (persona && persona !== meglio.n && !calmo && viso.animate) {
        // cambia l'amica più affine: il viso si gira come una carta
        viso.animate([{ transform: 'rotateY(90deg) scale(.9)' }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
      }
      persona = meglio.n;
      if (timbro) {
        var acceso = inComune.length >= 2;
        if (acceso && !timbro.classList.contains('on')) { timbro.classList.remove('on'); void timbro.offsetWidth; }
        timbro.classList.toggle('on', acceso);
      }
      conta(mostrato, valore); mostrato = valore;
      barra.style.transform = 'scaleX(' + valore / 100 + ')';
      comune.innerHTML = '';
      if (inComune.length) {
        comune.appendChild(document.createTextNode(EN ? 'You both like ' : 'Avete in comune '));
        inComune.forEach(function (k, i) {
          if (i) comune.appendChild(document.createTextNode(i === inComune.length - 1 ? (EN ? ' and ' : ' e ') : ', '));
          var b = document.createElement('b'); b.textContent = etichetta(k); comune.appendChild(b);
        });
        comune.appendChild(document.createTextNode('.'));
        var k = inComune[inComune.length - 1];
        d1.textContent = EN ? 'Hi ' + meglio.n + '! I saw you love ' + AMI[k] + ' too.' : 'Ciao ' + meglio.n + '! Ho visto che anche tu ami ' + AMI[k] + '.';
        d2.textContent = EN ? 'Yes! There\'s ' + PIANI[k] + ' in ' + cittaGioco + ' on Saturday, shall we go together?' : 'Sì! Sabato a ' + cittaGioco + ' c\'è ' + PIANI[k] + ', ci andiamo insieme?';
        chat.classList.remove('off');
        if (ultima !== meglio.n + k) { chat.classList.remove('pop'); void chat.offsetWidth; chat.classList.add('pop'); ultima = meglio.n + k; }
      } else {
        comune.textContent = EN ? 'No interests in common yet: try another one.' : 'Ancora nessun interesse in comune: provane un altro.';
        chat.classList.add('off');
      }
    }
    chips.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-int'), on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on) scelti.push(k); else scelti = scelti.filter(function (x) { return x !== k; });
        if (on && !calmo && b.animate) b.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'cubic-bezier(.3,1.4,.5,1)' });
        aggiorna();
      });
    });
    window.KUMI_AFFINITA = function (c) { cittaGioco = c; aggiorna(); };
    // Si parte con «Arte» già scelta: la scheda e la chat si vedono subito,
    // la sezione è piena e si capisce che gli altri interessi si toccano.
    var primo = document.querySelector('.chips button[data-int="arte"]');
    if (primo) { primo.setAttribute('aria-pressed', 'true'); scelti.push('arte'); }
    aggiorna();
  }

  /* ——— 7. Premium: i tre piani (prezzi scelti il 13 ott, gli stessi di App Store) ——— */
  var piani = document.querySelectorAll('.plans button');
  if (piani.length) {
    var PIANI_P = EN ? [
      ['€2.99', 'a week'], ['€4.99', "a month, that's €1.15 a week"], ['€11.99', "every 3 months, that's €0.92 a week"]
    ] : [
      ['2,99 €', 'a settimana'], ['4,99 €', 'al mese, cioè 1,15 € a settimana'], ['11,99 €', 'ogni 3 mesi, cioè 0,92 € a settimana']
    ];
    var prezzo = document.getElementById('p-price'), nota = document.getElementById('p-note');
    piani.forEach(function (b) {
      b.addEventListener('click', function () {
        piani.forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
        var v = PIANI_P[+b.getAttribute('data-plan')];
        prezzo.textContent = v[0]; nota.textContent = v[1];
        if (!calmo && prezzo.animate) prezzo.animate([{ transform: 'translateY(8px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.16,1,.3,1)' });
      });
    });
  }

  /* ——— 8. Un po' più di vita ——— */

  // Lo scontrino si spunta: ogni riga prende il suo segno quando ci arrivi.
  var righe = document.querySelectorAll('.slip li');
  if (righe.length) {
    // Si guarda a ogni scorrimento (sono poche righe): così anche scorrendo in
    // fretta, o saltando con un link, tutte quelle già passate sono spuntate.
    var fatte = 0, aspetto = false;
    var controlla = function () {
      aspetto = false;
      var linea = window.innerHeight * 0.6;
      while (fatte < righe.length && righe[fatte].getBoundingClientRect().top < linea) {
        righe[fatte].classList.add('fatto'); fatte++;
      }
      if (fatte >= righe.length) window.removeEventListener('scroll', suScroll);
    };
    var suScroll = function () { if (!aspetto) { aspetto = true; requestAnimationFrame(controlla); } };
    window.addEventListener('scroll', suScroll, { passive: true });
    controlla();
  }
  var mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Il biglietto e la tessera Premium si inclinano appena verso il mouse.
  function inclina(zona, el, gradi) {
    if (!zona || !el || calmo || !mouse) return;
    var attesa = false, ex = 0, ey = 0;
    zona.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      ex = Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1));
      ey = Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height * 2 - 1));
      if (attesa) return;
      attesa = true;
      requestAnimationFrame(function () {
        attesa = false;
        el.classList.add('tilting');
        el.style.setProperty('--ry', (ex * gradi).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-ey * gradi).toFixed(2) + 'deg');
      });
    });
    zona.addEventListener('pointerleave', function () {
      el.classList.remove('tilting');
      el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg');
    });
  }
  inclina(document.querySelector('.hero__stage'), document.querySelector('.ticket'), 4);
  inclina(document.querySelector('.card-pass'), document.querySelector('.card'), 6);

  // Premium: la pillola oro scivola sotto il piano scelto.
  var gruppo = document.querySelector('.plans');
  if (gruppo) {
    var pillola = document.createElement('span');
    pillola.className = 'plans__pill'; pillola.setAttribute('aria-hidden', 'true');
    gruppo.appendChild(pillola); gruppo.classList.add('has-pill');
    var sposta = function () {
      var b = gruppo.querySelector('[aria-checked="true"]');
      if (!b) return;
      pillola.style.width = b.offsetWidth + 'px';
      pillola.style.transform = 'translateX(' + b.offsetLeft + 'px)';
    };
    gruppo.addEventListener('click', function () { requestAnimationFrame(sposta); });
    window.addEventListener('resize', sposta);
    sposta();
  }

  // Le schermate dell'app si trascinano anche col mouse.
  if (row && mouse) {
    var sx = null, sl = 0, mosso = false;
    row.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      sx = e.clientX; sl = row.scrollLeft; mosso = false;
    });
    window.addEventListener('pointermove', function (e) {
      if (sx === null) return;
      var d = e.clientX - sx;
      if (Math.abs(d) > 4) { mosso = true; row.classList.add('drag'); }
      if (mosso) row.scrollLeft = sl - d;
    });
    window.addEventListener('pointerup', function () {
      if (sx === null) return;
      sx = null;
      if (mosso) {
        // si riaggancia alla schermata più vicina
        var primo = row.querySelector('.screen');
        var passo = primo.getBoundingClientRect().width + (parseFloat(getComputedStyle(row).columnGap) || 0);
        var meta = Math.round(row.scrollLeft / passo) * passo;
        row.classList.remove('drag');
        row.scrollTo({ left: meta, behavior: calmo ? 'auto' : 'smooth' });
      }
    });
  }
})();
