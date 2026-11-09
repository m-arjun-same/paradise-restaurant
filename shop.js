/* Paradise — THE LAYER TABLE (shop.html).
   Strata rows grouped by category; each row peels open (accordion).
   Rail = ticket tabs that jump to a group; search filters rows. */
'use strict';

const CATS = [
  { id: 'biryani', name: 'Biryani', note: 'Out of the handi' },
  { id: 'kebabs', name: 'Kebabs', note: 'Off the charcoal' },
  { id: 'mains', name: 'Mains & Breads', note: 'From the kitchen' },
  { id: 'desserts', name: 'Desserts', note: 'The sweet layer' },
];
const HERO = ['chicken', 'mutton', 'special', 'veg', 'egg', 'kebab'];
const main = document.getElementById('shopMain');
const emptyEl = document.getElementById('shopEmpty');
let query = '';

function rowFor(p) {
  const row = document.createElement('div');
  row.className = 'srow';
  row.dataset.name = p.name.toLowerCase();
  row.style.setProperty('--lc', p.layer);
  const priceHtml = p.price != null
    ? '<span class="ticket-price"><small>₹</small>' + p.price + '</span>'
    : '<span class="store-stamp">In store only</span>';
  const visual = p.img
    ? '<img class="srow-plate" src="' + p.img + '" alt="' + p.name + '" loading="lazy">'
    : '<span class="srow-disc" style="background:' + p.layer + '">' + p.name.charAt(0) + '</span>';
  const actions = p.price != null
    ? '<button class="btn btn-flame srow-add">Add to handi</button>' +
      (HERO.includes(p.id) ? '<a class="btn btn-ghost" href="order.html?dish=' + p.id + '">Inside the handi</a>' : '')
    : '<span class="store-stamp">Served in store — no online price</span>';
  row.innerHTML =
    '<button class="srow-head" aria-expanded="false"><i></i>' +
    '<span><span class="srow-name">' + p.name + '</span><span class="srow-tag">' + p.tag + '</span></span>' +
    priceHtml + '<span class="srow-toggle" aria-hidden="true">+</span></button>' +
    '<div class="srow-body"><div class="srow-body-in">' + visual +
    '<div><p class="srow-desc">' + p.desc + '</p><div class="srow-actions">' + actions + '</div></div>' +
    '</div></div>';

  const head = row.querySelector('.srow-head');
  const body = row.querySelector('.srow-body');
  head.addEventListener('click', () => {
    const open = row.classList.toggle('open');
    head.setAttribute('aria-expanded', open);
    body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
  });
  const add = row.querySelector('.srow-add');
  if (add) add.addEventListener('click', () => {
    PCart.add(p.id, 1);
    const src = row.querySelector('.srow-plate') || row.querySelector('.srow-head');
    flyToCart(src.getBoundingClientRect(), p.img, document.querySelector('[data-handi-meter]'));
    syncSticky();
  });
  return row;
}

CATS.forEach((cat) => {
  const group = document.createElement('section');
  group.className = 'cat-group';
  group.id = 'cat-' + cat.id;
  group.dataset.cat = cat.id;
  group.innerHTML = '<div class="cat-group-head"><h2>' + cat.name + '</h2><span>' + cat.note + '</span></div>';
  PRODUCTS.filter((p) => p.cat === cat.id).forEach((p) => group.appendChild(rowFor(p)));
  main.insertBefore(group, emptyEl);
});

/* open the first biryani by default so the peel is visible */
const firstRow = main.querySelector('.srow');
if (firstRow) {
  firstRow.classList.add('open');
  const b = firstRow.querySelector('.srow-body');
  requestAnimationFrame(() => { b.style.maxHeight = b.scrollHeight + 'px'; });
  firstRow.querySelector('.srow-head').setAttribute('aria-expanded', 'true');
}

/* ---------------- rail: ticket tabs ---------------- */
const tabs = document.querySelectorAll('.cat-tab');
tabs.forEach((tab) => tab.addEventListener('click', () => {
  tabs.forEach((t) => t.classList.toggle('active', t === tab));
  const cat = tab.dataset.cat;
  if (cat === 'all') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  const g = document.getElementById('cat-' + cat);
  if (g) g.scrollIntoView({ behavior: 'smooth', block: 'start' });
}));
if (window.ScrollTrigger && window.gsap) {
  gsap.registerPlugin(ScrollTrigger);
  CATS.forEach((cat) => {
    ScrollTrigger.create({
      trigger: '#cat-' + cat.id, start: 'top 45%', end: 'bottom 45%',
      onToggle: (self) => { if (self.isActive) tabs.forEach((t) => t.classList.toggle('active', t.dataset.cat === cat.id)); },
    });
  });
}

/* ---------------- search ---------------- */
document.getElementById('search').addEventListener('input', (e) => {
  query = e.target.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll('.srow').forEach((row) => {
    const show = !query || row.dataset.name.includes(query);
    row.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  document.querySelectorAll('.cat-group').forEach((g) => {
    const any = Array.from(g.querySelectorAll('.srow')).some((r) => r.style.display !== 'none');
    g.style.display = any ? '' : 'none';
  });
  emptyEl.style.display = visible ? 'none' : 'block';
});

/* ---------------- sticky bar ---------------- */
function syncSticky() {
  const bar = document.getElementById('stickyBar');
  const n = PCart.count();
  document.getElementById('stickyCount').textContent = n + (n === 1 ? ' item' : ' items');
  document.getElementById('stickyTotal').textContent = inr(PCart.subtotal());
  bar.classList.toggle('show', n > 0);
}
window.addEventListener('storage', (e) => { if (e.key === PCart.KEY) { PCart._items = null; syncSticky(); PCart.syncBadges(); } });
syncSticky();
