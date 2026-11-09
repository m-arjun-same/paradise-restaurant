/* Paradise — THE SEALED HANDI shared engine.
   Canvas steam, handi-meter sync, loader failsafe, stamp helpers.
   Own code. No CDN. */
'use strict';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- canvas steam ----------------
   Wisps rise from the base of the canvas, sway, grow and fade.
   Colours: mostly white, some warm gold. burst(n) = a dum puff. */
function makeSteam(canvas, opts) {
  opts = opts || {};
  const ctx = canvas.getContext('2d');
  let rate = opts.rate != null ? opts.rate : 0.55;      /* spawn probability per frame */
  let baseAlpha = opts.alpha != null ? opts.alpha : 0.16;
  const rise = opts.rise != null ? opts.rise : 1;
  let W = 0, H = 0, parts = [], running = true, raf = 0;

  function size() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = Math.max(40, r.width); H = Math.max(40, r.height);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  window.addEventListener('resize', size);

  function spawn(boost) {
    const gold = Math.random() < 0.3;
    parts.push({
      x: W * (0.18 + Math.random() * 0.64),
      y: H * (0.92 + Math.random() * 0.08),
      r: (boost ? 14 : 9) + Math.random() * (boost ? 26 : 15),
      vy: (0.55 + Math.random() * 0.8) * rise * (boost ? 1.5 : 1),
      vx: (Math.random() - 0.5) * 0.22,
      sway: Math.random() * Math.PI * 2,
      swayAmp: 6 + Math.random() * 13,
      life: 0,
      max: 130 + Math.random() * 130,
      a: baseAlpha * (0.7 + Math.random() * 0.6) * (boost ? 1.35 : 1),
      gold: gold,
    });
    if (parts.length > 240) parts.splice(0, parts.length - 240);
  }

  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    if (!REDUCED && Math.random() < rate) spawn(false);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life++;
      p.sway += 0.016;
      p.y -= p.vy;
      p.x += p.vx + Math.sin(p.sway) * 0.32;
      p.r += 0.24;
      const t = p.life / p.max;
      if (t >= 1 || p.y < -p.r) { parts.splice(i, 1); continue; }
      const fade = t < 0.18 ? t / 0.18 : 1 - (t - 0.18) / 0.82;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      const col = p.gold ? '245,178,64' : '255,246,230';
      g.addColorStop(0, 'rgba(' + col + ',' + (p.a * fade).toFixed(3) + ')');
      g.addColorStop(0.6, 'rgba(' + col + ',' + (p.a * fade * 0.45).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(' + col + ',0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }
  if (!REDUCED) raf = requestAnimationFrame(frame);
  else { for (let i = 0; i < 10; i++) { spawn(false); parts[i].life = 60 + i * 14; } ctx.clearRect(0,0,W,H);
    parts.forEach((p) => { const g = ctx.createRadialGradient(p.x, p.y + 60, 0, p.x, p.y + 60, p.r * 2);
      g.addColorStop(0, 'rgba(255,246,230,.10)'); g.addColorStop(1, 'rgba(255,246,230,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y + 60, p.r * 2, 0, Math.PI * 2); ctx.fill(); }); }

  return {
    burst(n) { if (REDUCED) return; for (let i = 0; i < (n || 26); i++) setTimeout(() => spawn(true), i * 24); },
    setRate(v) { rate = v; },
    setAlpha(v) { baseAlpha = v; },
    stop() { running = false; cancelAnimationFrame(raf); },
    start() { if (!running && !REDUCED) { running = true; raf = requestAnimationFrame(frame); } },
  };
}

/* ---------------- crumbs (seal break debris) ---------------- */
function spawnCrumbs(host, n) {
  if (REDUCED || !host) return;
  const r = host.getBoundingClientRect();
  for (let i = 0; i < (n || 14); i++) {
    const c = document.createElement('span');
    c.className = 'crumb';
    const sz = 4 + Math.random() * 7;
    c.style.width = c.style.height = sz + 'px';
    c.style.left = (r.width * (0.12 + Math.random() * 0.76)) + 'px';
    c.style.top = (r.height * 0.06 + Math.random() * 10) + 'px';
    host.appendChild(c);
    const dx = (Math.random() - 0.5) * 130;
    const dy = 60 + Math.random() * 130;
    c.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(' + (Math.random() * 320 - 160) + 'deg)', opacity: 0 },
    ], { duration: 750 + Math.random() * 550, easing: 'cubic-bezier(.3,.6,.4,1)' }).onfinish = () => c.remove();
  }
}

/* ---------------- loader failsafe ---------------- */
(function () {
  function hide() {
    const l = document.getElementById('loader');
    if (l) { l.classList.add('done'); setTimeout(() => l.remove(), 650); }
  }
  if (document.readyState === 'complete') setTimeout(hide, 250);
  else window.addEventListener('load', () => setTimeout(hide, 250));
  setTimeout(hide, 2500); /* hard failsafe */
})();

/* ---------------- rotating stamp rotors ---------------- */
document.querySelectorAll('[data-rotor]').forEach((el, i) => {
  const id = 'circp' + i;
  el.innerHTML =
    '<svg viewBox="0 0 120 120" aria-hidden="true"><defs>' +
    '<path id="' + id + '" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0"/></defs>' +
    '<circle cx="60" cy="60" r="58" fill="none" stroke="rgba(245,163,1,.35)" stroke-width="1.5" stroke-dasharray="4 5"/>' +
    '<text textLength="294" lengthAdjust="spacing"><textPath href="#' + id + '">WORLD&#8217;S FAVOURITE BIRYANI &#8226; SINCE 1953 &#8226; </textPath></text>' +
    '<text x="60" y="76" text-anchor="middle" class="rotor-p" style="font-size:44px">P</text></svg>';
});

/* ---------------- mini handi-fill (drawer / summaries) ----------------
   One .mh-layer band per cart line, coloured by the product's layer
   colour, stacked from the bottom of the pot. */
function miniHandiHTML(maxH) {
  const items = typeof PCart !== 'undefined' ? PCart.items() : [];
  const cap = maxH || 104;
  let html = '<div class="mh-title"><span>YOUR HANDI</span><span>' + (typeof PCart !== 'undefined' ? PCart.count() : 0) + ' in the pot</span></div>' +
    '<div class="mh-lid"></div><div class="mh-pot" style="height:' + cap + 'px">';
  if (!items.length) {
    html += '<span class="mh-empty">Empty pot — add a layer</span>';
  } else {
    const totalQty = items.reduce((n, i) => n + i.qty, 0);
    const usable = cap - 8;
    [...items].reverse().forEach((item) => {
      const p = productById(item.id);
      if (!p) return;
      const h = Math.max(17, Math.round(usable * (item.qty / Math.max(totalQty, 3)) * 0.92));
      html += '<div class="mh-layer" style="height:' + h + 'px;background:' + p.layer + '">' +
        '<span>' + p.name.replace(' Dum Biryani', '').replace(' Biryani', ' Biryani') + ' ×' + item.qty + '</span></div>';
    });
  }
  return html + '</div>';
}
function renderMiniHandis() {
  document.querySelectorAll('[data-mini-handi]').forEach((el) => { el.innerHTML = miniHandiHTML(el.dataset.miniHandi ? parseInt(el.dataset.miniHandi, 10) : 104); });
}

/* ---------------- handi meter: initial paint ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof PCart !== 'undefined') PCart.syncBadges();
});
window.addEventListener('storage', (e) => {
  if (typeof PCart !== 'undefined' && e.key === PCart.KEY) { PCart._items = null; PCart.syncBadges(); }
});
