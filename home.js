/* Paradise — landing: break-the-seal, layer peels, strata rows. */
'use strict';

const HERO_DISHES = ['chicken', 'mutton', 'special', 'veg', 'egg', 'kebab'];

/* ---------------- signature strata rows ---------------- */
(function () {
  const list = document.getElementById('strataList');
  if (!list) return;
  HERO_DISHES.forEach((id, i) => {
    const p = productById(id);
    if (!p) return;
    const a = document.createElement('a');
    a.className = 'strata-row';
    a.href = 'order.html?dish=' + id;
    a.style.setProperty('--lc', p.layer);
    a.innerHTML =
      '<span class="strata-plate"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy"></span>' +
      '<span><span class="strata-name">' + p.name + '</span>' +
      '<span class="strata-tag">Stratum 0' + (i + 1) + ' · ' + p.tag + '</span>' +
      '<span class="strata-cta">Open inside the handi →</span></span>' +
      '<span class="ticket-price"><small>₹</small>' + p.price + '</span>';
    list.appendChild(a);
  });
})();

/* ---------------- sticky bar ---------------- */
function syncSticky() {
  const bar = document.getElementById('stickyBar');
  if (!bar) return;
  const n = PCart.count();
  document.getElementById('stickyCount').textContent = n + (n === 1 ? ' item' : ' items');
  document.getElementById('stickyTotal').textContent = inr(PCart.subtotal());
  bar.classList.toggle('show', n > 0);
}
document.addEventListener('DOMContentLoaded', syncSticky);
window.addEventListener('storage', (e) => { if (e.key === PCart.KEY) { PCart._items = null; syncSticky(); } });

/* ---------------- hero quick-add ---------------- */
document.getElementById('heroAdd').addEventListener('click', function () {
  PCart.add('chicken', 1);
  const img = document.querySelector('.handi-food img');
  const meter = document.querySelector('[data-handi-meter]');
  flyToCart(img.getBoundingClientRect(), 'assets/chicken-biryani.jpg', meter, syncSticky);
  syncSticky();
});

/* ---------------- break the seal ---------------- */
const hero = document.getElementById('heroSeal');
const lid = document.getElementById('handiLid');
const stage = document.getElementById('handiStage');
const steam = makeSteam(document.getElementById('heroSteam'), { rate: 0.06, alpha: 0.05, rise: 0.7 });
let broken = false;

function breakSeal(silent) {
  if (broken) return;
  broken = true;
  document.getElementById('breakBtn').disabled = true;

  const finish = () => {
    hero.classList.add('open');
    steam.setRate(0.34); steam.setAlpha(0.13); /* continuous steam off the open dish */
    steam.burst(silent ? 8 : 34);
  };

  if (window.gsap && !REDUCED) {
    const tl = gsap.timeline({ onComplete: finish });
    tl.to('#sealCrack', { strokeDashoffset: 0, duration: silent ? 0.1 : 0.38, ease: 'power2.in' })
      .add(() => spawnCrumbs(stage, silent ? 5 : 16))
      .to('#sealLeft', { x: -64, y: 12, rotation: -11, opacity: 0, duration: 0.7, ease: 'power2.out' }, '<')
      .to('#sealRight', { x: 64, y: 12, rotation: 11, opacity: 0, duration: 0.7, ease: 'power2.out' }, '<')
      .to('#sealCrack', { opacity: 0, duration: 0.4 }, '<+0.15')
      .to(lid, { xPercent: 54, yPercent: -40, rotation: 26, duration: silent ? 0.2 : 0.95, ease: 'power3.inOut' }, '-=0.25');
  } else {
    document.getElementById('sealLeft').style.opacity = '0.2';
    document.getElementById('sealRight').style.opacity = '0.2';
    document.getElementById('sealCrack').style.strokeDashoffset = '0';
    lid.style.transform = 'translate(54%,-40%) rotate(26deg)';
    finish();
  }
}
document.getElementById('breakBtn').addEventListener('click', () => breakSeal(false));
lid.addEventListener('click', () => breakSeal(false));
/* drag across the seal also cracks it */
let dragging = false;
stage.addEventListener('pointerdown', () => { dragging = true; });
window.addEventListener('pointerup', () => { dragging = false; });
stage.addEventListener('pointermove', (e) => { if (dragging && e.movementX !== 0) breakSeal(false); });
/* if the visitor scrolls past without breaking, open it quietly for the way back */
new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (!en.isIntersecting && window.scrollY > 300) breakSeal(true); });
}, { threshold: 0 }).observe(hero);

/* ---------------- layer peels: steam puff per scene ---------------- */
if (window.gsap && window.ScrollTrigger && !REDUCED) {
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('.layer-scene').forEach((scene) => {
    ScrollTrigger.create({
      trigger: scene, start: 'top 55%',
      onEnter: () => { scene.classList.remove('puffing'); void scene.offsetWidth; scene.classList.add('puffing'); },
      onEnterBack: () => { scene.classList.remove('puffing'); void scene.offsetWidth; scene.classList.add('puffing'); },
    });
    const inner = scene.querySelector('.layer-inner');
    if (inner) gsap.fromTo(inner, { y: 56 }, { y: 0, ease: 'none',
      scrollTrigger: { trigger: scene, start: 'top bottom', end: 'top 18%', scrub: true } });
    const idx = scene.querySelector('.layer-idx');
    if (idx) gsap.fromTo(idx, { y: 70 }, { y: -30, ease: 'none',
      scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}
