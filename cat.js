/* La gattina di Kumi, animata a strati: è l'illustrazione originale
   ritagliata in pezzi (site/assets/cat/*.webp, generati da
   tools/cat_layers.py) mossi con trasformazioni CSS. Respira, sbatte le
   palpebre, muove la punta della coda e le orecchie, segue il cursore (o lo
   scorrimento) con la testa e ogni tanto si lecca la zampa. */
(function () {
  'use strict';

  var W = 539, H = 964;                       /* la tela dei ritagli */
  var FUR = '#EBC887';                        /* colore delle palpebre (pelo) */

  /* Perni delle articolazioni, in pixel dell'illustrazione. */
  var P = {
    tail: [462, 915], neck: [300, 455], earL: [140, 240], earR: [352, 140],
    shoulder: [362, 600], elbow: [367, 760], body: [270, 964]
  };
  function origin(p) { return (p[0] / W * 100) + '% ' + (p[1] / H * 100) + '%'; }
  function pct(v, tot) { return (v / tot * 100) + '%'; }

  var stage = document.querySelector('.cat-stage');
  if (!stage) return;
  var base = stage.getAttribute('data-assets') || 'assets/cat/';

  function layer(name, pivot) {
    var img = document.createElement('img');
    img.src = base + name + '.webp'; img.alt = ''; img.draggable = false;
    img.className = 'kc-layer kc-' + name;
    if (pivot) img.style.transformOrigin = origin(pivot);
    return img;
  }
  /* Le palpebre: un ovale color pelo che scende sull'occhio. Stanno dentro la
     testa, così girano con lei. */
  function lid(box) {
    var d = document.createElement('div');
    d.className = 'kc-lid';
    d.style.left = pct(box[0], W); d.style.top = pct(box[1], H);
    d.style.width = pct(box[2] - box[0], W); d.style.height = pct(box[3] - box[1], H);
    d.style.background = FUR;
    return d;
  }

  var tail = layer('tail', P.tail), body = layer('body', P.body);
  var headWrap = document.createElement('div'); headWrap.className = 'kc-head-wrap';
  headWrap.style.transformOrigin = origin(P.neck);
  var head = layer('head'), earL = layer('ear_l', P.earL), earR = layer('ear_r', P.earR);
  var lidL = lid([160, 268, 280, 372]), lidR = lid([330, 190, 432, 302]);
  var tongue = document.createElement('div'); tongue.className = 'kc-tongue';
  tongue.style.left = pct(328, W); tongue.style.top = pct(350, H);
  tongue.style.width = pct(18, W); tongue.style.height = pct(20, H);
  headWrap.appendChild(head); headWrap.appendChild(earL); headWrap.appendChild(earR);
  headWrap.appendChild(lidL); headWrap.appendChild(lidR); headWrap.appendChild(tongue);
  var upper = layer('upper', P.shoulder), lower = layer('lower', P.elbow);
  var arm = document.createElement('div'); arm.className = 'kc-arm'; arm.style.transformOrigin = origin(P.shoulder);
  arm.appendChild(upper); arm.appendChild(lower);

  stage.innerHTML = '';
  [tail, body, headWrap, arm].forEach(function (n) { stage.appendChild(n); });

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var t0 = performance.now();
  var blink = 0, blinkNext = 2400 + Math.random() * 2600, blinkDouble = false;
  var earKick = 0, earNext = 3000 + Math.random() * 5000, earSide = 0;
  var lick = -1, lickNext = 8000 + Math.random() * 6000;
  var look = { x: 0, y: 0 }, target = { x: 0, y: 0 };
  var glance = 0, lastScroll = window.scrollY;
  var awake = false;

  function ease(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  window.addEventListener('pointermove', function (e) {
    var r = stage.getBoundingClientRect();
    var cx = r.left + r.width * .55, cy = r.top + r.height * .3;
    target.x = clamp((e.clientX - cx) / 300, -1, 1);
    target.y = clamp((e.clientY - cy) / 260, -1, 1);
  }, { passive: true });
  window.addEventListener('scroll', function () {
    var dy = window.scrollY - lastScroll; lastScroll = window.scrollY;
    glance = clamp(glance + dy / 90, -1, 1);
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && !awake) { awake = true; earKick = performance.now(); blink = performance.now(); } });
    }, { threshold: .3 }).observe(stage);
  } else awake = true;

  if (reduce) return;   /* chi preferisce meno movimento la vede ferma */

  function frame(now) {
    var t = (now - t0) / 1000;

    /* respiro e coda */
    body.style.transform = 'scale(' + (1 + Math.sin(t * 1.8) * .004) + ',' + (1 + Math.sin(t * 1.8) * .012) + ')';
    tail.style.transform = 'rotate(' + (Math.sin(t * 1.4) * 7) + 'deg)';

    /* sguardo: cursore + scorrimento, con inerzia */
    glance *= .94;
    look.x += (target.x - look.x) * .06;
    look.y += (target.y + glance * .7 - look.y) * .06;
    var headRot = look.x * 4 + Math.sin(t * .45) * 1.2;
    var headX = look.x * 6, headY = look.y * 5;

    /* si lecca la zampa: la zampa sale al muso e la testa scende a incontrarla */
    var upRot = 0, lowRot = 0, lowScale = 1, tng = 0;
    if (location.hash === '#lick') lick = now - 1500;
    if (lick < 0 && awake && now - t0 > lickNext) { lick = now; lickNext = now - t0 + 12000 + Math.random() * 7000; }
    if (lick >= 0) {
      var L = (now - lick) / 1000, D = 3.6;
      if (L > D) lick = -1;
      else {
        var up = clamp(L / .7, 0, 1), down = clamp((L - (D - .7)) / .7, 0, 1);
        var a = ease(up) * (1 - ease(down));
        upRot = -38 * a; lowRot = -148 * a; lowScale = 1 + .38 * a;
        headRot += 14 * a; headX += 8 * a; headY += 58 * a;
        var lk = L - .8;
        if (lk > 0 && lk < 2.0) { tng = Math.max(0, Math.sin(lk * Math.PI * 3)); headY += Math.sin(lk * Math.PI * 3) * 3; }
      }
    }
    arm.style.transform = 'rotate(' + upRot + 'deg)';
    lower.style.transform = 'rotate(' + lowRot + 'deg) scaleY(' + lowScale + ')';
    tongue.style.opacity = tng * .95;
    tongue.style.transform = 'translateY(' + (tng * 6) + 'px) scale(' + (.4 + tng * .6) + ')';
    headWrap.style.transform = 'translate(' + headX + 'px,' + headY + 'px) rotate(' + headRot + 'deg)';

    /* battito di ciglia, a volte doppio */
    if (awake && now - t0 > blinkNext && blink === 0) blink = now;
    var lidV = 0;
    if (blink) {
      var b = (now - blink) / 1000;
      if (b < .12) lidV = b / .12; else if (b < .24) lidV = 1 - (b - .12) / .12;
      else if (blinkDouble && b < .30) lidV = 0; else if (blinkDouble && b < .42) lidV = (b - .30) / .12;
      else if (blinkDouble && b < .54) lidV = 1 - (b - .42) / .12;
      else { blink = 0; blinkDouble = Math.random() < .25; blinkNext = now - t0 + 2400 + Math.random() * 3000; }
    }
    lidL.style.transform = 'scaleY(' + lidV + ')';
    lidR.style.transform = 'scaleY(' + lidV + ')';

    /* orecchie: uno scatto ogni tanto */
    if (awake && now - t0 > earNext && earKick === 0) { earKick = now; earSide = Math.random() < .5 ? 0 : 1; }
    var ek = 0;
    if (earKick) {
      var e = (now - earKick) / 1000;
      if (e < .5) ek = Math.sin(e / .5 * Math.PI * 2) * (1 - e / .5);
      else { earKick = 0; earNext = now - t0 + 3000 + Math.random() * 6000; }
    }
    earL.style.transform = 'rotate(' + (earSide === 0 ? ek * 7 : 0) + 'deg)';
    earR.style.transform = 'rotate(' + (earSide === 1 ? ek * -7 : 0) + 'deg)';

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
