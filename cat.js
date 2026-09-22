/* La gattina di Kumi, disegnata in vettoriale e animata: entra camminando,
   si siede, respira, sbatte le palpebre, muove coda e orecchie, segue il
   cursore (o lo scorrimento) con la testa e ogni tanto si lecca la zampa.
   Tutto qui dentro: niente librerie, niente immagini. */
(function () {
  'use strict';

  var FUR = '#EFCF93', FUR2 = '#E2B876', LINE = '#B5843F', INNER = '#F3B8A6',
      EYE = '#5A1A1B', NOSE = '#E98A84', RED = '#A71D31', GOLD = '#E6BD63',
      CREAM = '#FBEBC4', PINK = '#E88C93', LASH = '#3B1A12';

  /* Un tratto di contorno comune a tutti i pezzi. */
  var S = ' stroke="' + LINE + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';

  /* --- La gattina seduta (di tre quarti, guarda verso destra) ------------- */
  function sitter() {
    return '' +
    '<g id="kc-sit" opacity="0">' +
      /* coda: parte da dietro e si arriccia davanti, ruota attorno alla base */
      '<g id="kc-tail" style="transform-origin:172px 370px">' +
        '<path d="M172,370 C210,412 312,410 306,352" fill="none" stroke="' + LINE + '" stroke-width="26" stroke-linecap="round"/>' +
        '<path d="M172,370 C210,412 312,410 306,352" fill="none" stroke="' + FUR + '" stroke-width="20" stroke-linecap="round"/>' +
      '</g>' +
      /* corpo a goccia: posteriore a sinistra, petto a destra (il respiro lo scala) */
      '<g id="kc-body" style="transform-origin:215px 380px">' +
        '<path d="M206,170 C166,226 96,262 100,326 C102,364 132,382 168,382 L282,382 C292,382 298,372 296,360 C294,300 290,240 262,172 Z" fill="' + FUR + '"' + S + '/>' +
        /* coscia posteriore */
        '<circle cx="150" cy="318" r="60" fill="#EAC384"' + S + '/>' +
        '<ellipse cx="150" cy="318" rx="58" ry="58" fill="#EAC384"/>' +
        '<ellipse cx="258" cy="292" rx="24" ry="60" fill="' + CREAM + '" opacity=".55"/>' +
        /* zampa anteriore lontana */
        '<rect x="216" y="296" width="26" height="80" rx="13" fill="' + FUR2 + '"' + S + '/>' +
        '<ellipse cx="228" cy="374" rx="16" ry="9" fill="' + FUR2 + '"' + S + '/>' +
        '<path d="M220,374 v5 M228,376 v5 M236,374 v5" stroke="' + LINE + '" stroke-width="2" fill="none"/>' +
      '</g>' +
      /* collarino e ciondolo */
      '<path d="M194,200 Q238,220 284,198 L286,212 Q238,234 192,214 Z" fill="' + RED + '" stroke="#7E1424" stroke-width="2"/>' +
      '<circle cx="258" cy="214" r="4" fill="' + GOLD + '"/>' +
      '<g transform="translate(258,236)">' +
        '<path d="M0,11 C-15,-2 -10,-15 0,-9 C10,-15 15,-2 0,11 Z" fill="' + RED + '" stroke="' + GOLD + '" stroke-width="2.5"/>' +
        '<text x="0" y="2.5" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="7" fill="#fff">Kumi</text>' +
      '</g>' +
      /* testa: ruota attorno al collo */
      '<g id="kc-head" style="transform-origin:238px 196px">' +
        '<g id="kc-ear-l" style="transform-origin:206px 82px">' +
          '<path d="M180,96 L146,12 L240,64 Z" fill="' + FUR + '"' + S + '/>' +
          '<path d="M188,88 L162,36 L226,68 Z" fill="' + INNER + '"/>' +
        '</g>' +
        '<g id="kc-ear-r" style="transform-origin:290px 80px">' +
          '<path d="M258,66 L306,0 L322,92 Z" fill="' + FUR + '"' + S + '/>' +
          '<path d="M266,70 L302,22 L312,84 Z" fill="' + INNER + '"/>' +
        '</g>' +
        /* muso: contorno unico (cerchio + guance) e poi il riempimento senza cuciture */
        '<g' + S + ' fill="' + FUR + '">' +
          '<circle cx="236" cy="126" r="68"/>' +
          '<ellipse cx="186" cy="158" rx="32" ry="26"/>' +
          '<ellipse cx="286" cy="160" rx="28" ry="24"/>' +
          '<path d="M160,150 l-16,6 l17,6 l-16,10 l20,2"/>' +
        '</g>' +
        '<g fill="' + FUR + '">' +
          '<circle cx="236" cy="126" r="68"/>' +
          '<ellipse cx="186" cy="158" rx="32" ry="26"/>' +
          '<ellipse cx="286" cy="160" rx="28" ry="24"/>' +
          '<path d="M160,150 l-16,6 l17,6 l-16,10 l20,2 l-4,-24 Z"/>' +
        '</g>' +
        '<ellipse cx="198" cy="170" rx="13" ry="7" fill="' + PINK + '" opacity=".3"/>' +
        '<ellipse cx="288" cy="170" rx="12" ry="6" fill="' + PINK + '" opacity=".3"/>' +
        /* sopracciglia */
        '<path d="M194,102 q16,-10 34,-3" fill="none" stroke="' + LINE + '" stroke-width="3"/>' +
        '<path d="M262,95 q16,-10 34,-3" fill="none" stroke="' + LINE + '" stroke-width="3"/>' +
        /* occhi: tutta iride marrone come nel disegno; le luci si spostano con lo sguardo */
        '<g id="kc-eyes">' +
          '<ellipse cx="214" cy="134" rx="19" ry="22" fill="' + EYE + '"/>' +
          '<ellipse cx="278" cy="126" rx="19" ry="22" fill="' + EYE + '"/>' +
          '<g id="kc-glint">' +
            '<circle cx="207" cy="124" r="6.5" fill="#fff"/><circle cx="222" cy="143" r="3" fill="#fff"/>' +
            '<circle cx="271" cy="116" r="6.5" fill="#fff"/><circle cx="286" cy="135" r="3" fill="#fff"/>' +
          '</g>' +
          '<ellipse id="kc-lid-l" cx="214" cy="134" rx="20" ry="23" fill="' + FUR + '" style="transform-origin:214px 111px"/>' +
          '<ellipse id="kc-lid-r" cx="278" cy="126" rx="20" ry="23" fill="' + FUR + '" style="transform-origin:278px 103px"/>' +
          '<path d="M196,116 q18,-16 36,-4" fill="none" stroke="' + LASH + '" stroke-width="3"/>' +
          '<path d="M260,108 q18,-16 36,-4" fill="none" stroke="' + LASH + '" stroke-width="3"/>' +
          '<path d="M294,108 l8,-8 M297,115 l9,-3 M197,117 l-8,-7 M195,123 l-9,-2" stroke="' + LASH + '" stroke-width="2.5" fill="none"/>' +
        '</g>' +
        /* naso, bocca, lingua, baffi */
        '<path d="M243,156 q7,-5 14,0 q-2,8 -7,10 q-5,-2 -7,-10 Z" fill="' + NOSE + '"/>' +
        '<path d="M250,166 q-6,9 -14,4 M250,166 q6,9 14,4" fill="none" stroke="' + LINE + '" stroke-width="2.2"/>' +
        '<ellipse id="kc-tongue" cx="250" cy="176" rx="5" ry="6" fill="' + PINK + '" opacity="0"/>' +
        '<g stroke="#fff" stroke-width="1.6" opacity=".85" fill="none">' +
          '<path d="M226,164 L170,160 M226,169 L174,182 M226,159 L172,140"/>' +
          '<path d="M274,160 L330,152 M274,165 L328,176 M274,155 L326,136"/>' +
        '</g>' +
      '</g>' +
      /* zampa anteriore vicina, davanti a tutto: spalla → gomito → zampa (si lecca questa) */
      '<g id="kc-upper" style="transform-origin:262px 270px">' +
        '<rect x="249" y="266" width="26" height="64" rx="13" fill="' + FUR + '"' + S + '/>' +
        '<g id="kc-lower" style="transform-origin:262px 326px">' +
          '<rect x="250" y="322" width="24" height="52" rx="12" fill="' + FUR + '"' + S + '/>' +
          '<ellipse cx="262" cy="373" rx="17" ry="9" fill="' + FUR + '"' + S + '/>' +
          '<path d="M253,373 v5 M262,375 v5 M271,373 v5" stroke="' + LINE + '" stroke-width="2" fill="none"/>' +
        '</g>' +
      '</g>' +
    '</g>';
  }

  /* --- La gattina che cammina (di profilo, verso destra) ------------------ */
  function walker() {
    function leg(id, x, shade) {
      return '<g id="' + id + '" style="transform-origin:' + (x + 11) + 'px 296px">' +
        '<rect x="' + x + '" y="290" width="22" height="70" rx="11" fill="' + (shade ? FUR2 : FUR) + '"' + S + '/>' +
        '<ellipse cx="' + (x + 12) + '" cy="356" rx="14" ry="8" fill="' + (shade ? FUR2 : FUR) + '"' + S + '/>' +
      '</g>';
    }
    return '' +
    '<g id="kc-walk" opacity="0">' +
      '<g id="kc-wtail" style="transform-origin:112px 262px">' +
        '<path d="M112,262 C60,250 52,180 96,166" fill="none" stroke="' + LINE + '" stroke-width="24" stroke-linecap="round"/>' +
        '<path d="M112,262 C60,250 52,180 96,166" fill="none" stroke="' + FUR + '" stroke-width="18" stroke-linecap="round"/>' +
      '</g>' +
      leg('kc-l1', 150, true) + leg('kc-l3', 246, true) +
      '<g id="kc-wbody">' +
        '<ellipse cx="200" cy="268" rx="92" ry="50" fill="' + FUR + '"' + S + '/>' +
        '<ellipse cx="205" cy="290" rx="60" ry="20" fill="' + CREAM + '" opacity=".5"/>' +
      '</g>' +
      leg('kc-l2', 172, false) + leg('kc-l4', 266, false) +
      '<g id="kc-whead" style="transform-origin:262px 232px">' +
        '<path d="M252,178 L232,110 L294,156 Z" fill="' + FUR + '"' + S + '/>' +
        '<path d="M258,172 L244,128 L284,158 Z" fill="' + INNER + '"/>' +
        '<path d="M300,164 L328,100 L342,178 Z" fill="' + FUR + '"' + S + '/>' +
        '<path d="M306,164 L326,124 L334,174 Z" fill="' + INNER + '"/>' +
        '<circle cx="296" cy="206" r="54" fill="' + FUR + '"' + S + '/>' +
        '<path d="M246,228 Q296,252 346,226 L346,240 Q296,264 244,242 Z" fill="' + RED + '" stroke="#7E1424" stroke-width="2"/>' +
        '<g transform="translate(300,258)"><path d="M0,9 C-12,-1 -8,-12 0,-7 C8,-12 12,-1 0,9 Z" fill="' + RED + '" stroke="' + GOLD + '" stroke-width="2"/></g>' +
        '<ellipse cx="284" cy="204" rx="12" ry="14" fill="' + EYE + '"/><circle cx="280" cy="198" r="4" fill="#fff"/>' +
        '<ellipse cx="326" cy="204" rx="10" ry="13" fill="' + EYE + '"/><circle cx="323" cy="198" r="3.5" fill="#fff"/>' +
        '<path d="M336,220 q5,-3 10,0 q-2,6 -5,7 q-3,-1 -5,-7 Z" fill="' + NOSE + '"/>' +
        '<path d="M341,228 q-4,7 -10,3" fill="none" stroke="' + LINE + '" stroke-width="2"/>' +
        '<g stroke="#fff" stroke-width="1.5" opacity=".85" fill="none"><path d="M318,224 l-30,-2 M318,229 l-28,8 M346,222 l24,-6 M346,227 l26,4"/></g>' +
        '<path d="M330,190 l6,-6 M334,196 l7,-3" stroke="' + LASH + '" stroke-width="2.2" fill="none"/>' +
      '</g>' +
    '</g>';
  }

  function build(stage) {
    stage.innerHTML =
      '<svg viewBox="0 0 400 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="La gattina di Kumi">' +
        '<ellipse id="kc-shadow" cx="215" cy="386" rx="120" ry="12" fill="#000" opacity=".08"/>' +
        walker() + sitter() +
      '</svg>';
    var svg = stage.firstChild;
    var $ = function (id) { return svg.querySelector('#' + id); };
    var el = {
      sit: $('kc-sit'), walk: $('kc-walk'), shadow: $('kc-shadow'),
      tail: $('kc-tail'), body: $('kc-body'), upper: $('kc-upper'), lower: $('kc-lower'),
      head: $('kc-head'), earL: $('kc-ear-l'), earR: $('kc-ear-r'), glint: $('kc-glint'),
      lidL: $('kc-lid-l'), lidR: $('kc-lid-r'), tongue: $('kc-tongue'),
      wtail: $('kc-wtail'), wbody: $('kc-wbody'), whead: $('kc-whead'),
      legs: [$('kc-l1'), $('kc-l2'), $('kc-l3'), $('kc-l4')]
    };
    return { svg: svg, el: el };
  }

  /* --- Regia ---------------------------------------------------------------- */
  var stage = document.querySelector('.cat-stage');
  if (!stage) return;
  var rig = build(stage), el = rig.el;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var t0 = performance.now();
  var phase = 'wait';           /* wait → walk → sit */
  var walkStart = 0, sitStart = 0;
  var blink = 0, blinkNext = 2600 + Math.random() * 2400, blinkDouble = false;
  var earKick = 0, earNext = 3000 + Math.random() * 5000, earSide = 0;
  var lick = -1, lickNext = 9000 + Math.random() * 5000;
  var look = { x: 0, y: 0 }, target = { x: 0, y: 0 };
  var scrollGlance = 0, lastScroll = window.scrollY;

  function ease(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /* Il cursore: la testa lo segue quando è vicino alla gattina. */
  window.addEventListener('pointermove', function (e) {
    var r = stage.getBoundingClientRect();
    var cx = r.left + r.width * .6, cy = r.top + r.height * .35;
    target.x = clamp((e.clientX - cx) / 260, -1, 1);
    target.y = clamp((e.clientY - cy) / 220, -1, 1);
  }, { passive: true });
  /* Lo scorrimento: sbircia su o giù nella direzione in cui scorri. */
  window.addEventListener('scroll', function () {
    var dy = window.scrollY - lastScroll; lastScroll = window.scrollY;
    scrollGlance = clamp(scrollGlance + dy / 80, -1, 1);
  }, { passive: true });

  /* Entra in scena quando la sezione arriva sullo schermo. */
  var started = false;
  function start() {
    if (started) return; started = true;
    phase = reduce ? 'sit' : 'walk';
    walkStart = sitStart = performance.now();
    if (reduce) { el.sit.setAttribute('opacity', 1); }
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) start(); });
    }, { threshold: .35 }).observe(stage);
  } else start();

  function frame(now) {
    var t = (now - t0) / 1000;

    if (phase === 'walk') {
      var w = (now - walkStart) / 1000, dur = 3.6;
      var p = clamp(w / dur, 0, 1);
      if (location.hash === '#walk') { p = .55; }
      var x = -420 + ease(p) * 420;            /* da fuori a sinistra fino al centro */
      var cyc = w * 7;                          /* passo */
      var bob = Math.abs(Math.sin(cyc)) * 4;
      el.walk.setAttribute('opacity', 1);
      el.walk.style.transform = 'translate(' + x + 'px,' + (-bob) + 'px)';
      var sw = Math.sin(cyc) * 24 * (p < .97 ? 1 : 0);
      el.legs[0].style.transform = 'rotate(' + (-sw) + 'deg)';
      el.legs[1].style.transform = 'rotate(' + (sw) + 'deg)';
      el.legs[2].style.transform = 'rotate(' + (sw) + 'deg)';
      el.legs[3].style.transform = 'rotate(' + (-sw) + 'deg)';
      el.wtail.style.transform = 'rotate(' + (Math.sin(cyc * .5) * 10) + 'deg)';
      el.whead.style.transform = 'rotate(' + (Math.sin(cyc) * 2) + 'deg) translateY(' + (bob * .4) + 'px)';
      el.shadow.setAttribute('cx', 200 + x);
      if (p >= 1) { phase = 'sit'; sitStart = now; }
      requestAnimationFrame(frame); return;
    }

    if (phase === 'sit') {
      var s = (now - sitStart) / 1000;
      /* si siede: la camminatrice sfuma, la seduta compare con un piccolo rimbalzo */
      var k = clamp(s / .45, 0, 1);
      el.walk.setAttribute('opacity', 1 - k);
      el.sit.setAttribute('opacity', k);
      el.shadow.setAttribute('cx', 215);
      var squash = 1 + Math.sin(clamp(s / .6, 0, 1) * Math.PI) * .06;

      /* respiro */
      var breath = 1 + Math.sin(t * 1.9) * .012;
      el.body.style.transform = 'scale(' + (1 / squash) + ',' + (breath * squash) + ')';

      /* coda */
      el.tail.style.transform = 'rotate(' + (Math.sin(t * 1.3) * 6) + 'deg)';

      /* sguardo: cursore + scorrimento, con inerzia */
      scrollGlance *= .94;
      look.x += (target.x - look.x) * .06;
      look.y += (target.y + scrollGlance * .8 - look.y) * .06;
      var idle = Math.sin(t * .5) * 1.5;
      var headRot = look.x * 6 + idle, headX = look.x * 6, headY = look.y * 5;

      /* si lecca la zampa */
      var upper = 0, lower = 0, tongue = 0;
      if (lick < 0 && s > 4 && now - t0 > lickNext) { lick = now; lickNext = now - t0 + 12000 + Math.random() * 7000; }
      if (location.hash === '#lick') { lick = now - 1500; }
      if (lick >= 0) {
        var L = (now - lick) / 1000, D = 3.4;
        if (L > D) lick = -1;
        else {
          var up = clamp(L / .6, 0, 1), down = clamp((L - (D - .6)) / .6, 0, 1);
          var amt = ease(up) * (1 - ease(down));
          upper = -140 * amt; lower = -72 * amt;          /* la zampa sale verso il muso */
          headRot += 14 * amt; headX += 4 * amt; headY += 8 * amt;
          var lk = L - .7;
          if (lk > 0 && lk < 2.1) tongue = Math.max(0, Math.sin(lk * Math.PI * 3));
        }
      }
      el.upper.style.transform = 'rotate(' + upper + 'deg)';
      el.lower.style.transform = 'rotate(' + lower + 'deg)';
      el.tongue.setAttribute('opacity', tongue * .95);
      el.tongue.setAttribute('ry', 3 + tongue * 4);
      el.head.style.transform = 'translate(' + headX + 'px,' + headY + 'px) rotate(' + headRot + 'deg)';
      el.glint.style.transform = 'translate(' + (look.x * -3) + 'px,' + (look.y * -2.5) + 'px)';

      /* battito di ciglia (a volte doppio) */
      if (now - t0 > blinkNext && blink === 0) { blink = now; }
      var lid = 0;
      if (blink) {
        var b = (now - blink) / 1000;
        if (b < .13) lid = b / .13; else if (b < .24) lid = 1 - (b - .13) / .11;
        else if (blinkDouble && b < .30) lid = 0; else if (blinkDouble && b < .42) lid = (b - .30) / .12;
        else if (blinkDouble && b < .52) lid = 1 - (b - .42) / .10;
        else { blink = 0; blinkDouble = Math.random() < .25; blinkNext = now - t0 + 2400 + Math.random() * 2800; }
      }
      el.lidL.style.transform = 'scaleY(' + lid + ')';
      el.lidR.style.transform = 'scaleY(' + lid + ')';

      /* orecchie: uno scatto ogni tanto */
      if (now - t0 > earNext && earKick === 0) { earKick = now; earSide = Math.random() < .5 ? 0 : 1; }
      var ek = 0;
      if (earKick) {
        var e = (now - earKick) / 1000;
        if (e < .5) ek = Math.sin(e / .5 * Math.PI * 2) * (1 - e / .5);
        else { earKick = 0; earNext = now - t0 + 3000 + Math.random() * 6000; }
      }
      el.earL.style.transform = 'rotate(' + (earSide === 0 ? ek * -9 : 0) + 'deg)';
      el.earR.style.transform = 'rotate(' + (earSide === 1 ? ek * 9 : 0) + 'deg)';
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
