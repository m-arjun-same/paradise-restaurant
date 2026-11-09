/* Paradise — INSIDE THE HANDI (order.html).
   Switch signature: the lid lifts, steam puffs, the plate rolls 360°
   underneath and lands as the new dish. Layer tags, not callouts.
   Catalog + cart from cart.js (shared localStorage `paradise_cart`). */
'use strict';

const LAYERS = {
  chicken: [
    { name: 'Saffron Rice', sub: 'the golden crown', x: 71, y: 30, side: 'r', ly: 20, c: '#f5a301' },
    { name: 'Dum Chicken', sub: 'the heart of the handi', x: 50, y: 48, side: 'r', ly: 46, c: '#a83c12' },
    { name: 'Raita & Salan', sub: 'served alongside', x: 70, y: 72, side: 'r', ly: 78, c: '#f7ead2' },
    { name: 'Fried Onion', sub: 'golden birista crunch', x: 31, y: 36, side: 'l', ly: 30, c: '#c97b2f' },
    { name: 'Fresh Mint', sub: 'hand-torn leaves', x: 28, y: 60, side: 'l', ly: 62, c: '#5f8f4e' },
  ],
  mutton: [
    { name: 'Saffron Rice', sub: 'the golden crown', x: 72, y: 29, side: 'r', ly: 19, c: '#f5a301' },
    { name: 'Tender Mutton', sub: 'dum-soft, on the bone', x: 64, y: 47, side: 'r', ly: 45, c: '#8a3b1e' },
    { name: 'Pure Ghee', sub: 'drizzled over the top', x: 56, y: 71, side: 'r', ly: 78, c: '#f3d98b' },
    { name: 'Fried Onion', sub: 'golden birista crunch', x: 40, y: 33, side: 'l', ly: 28, c: '#c97b2f' },
    { name: 'Whole Spices', sub: 'cinnamon & cardamom', x: 34, y: 58, side: 'l', ly: 60, c: '#d92b1f' },
  ],
  special: [
    { name: 'Saffron Rice', sub: 'the golden crown', x: 73, y: 28, side: 'r', ly: 20, c: '#f5a301' },
    { name: 'Tender Mutton', sub: 'dum-soft, on the bone', x: 65, y: 60, side: 'r', ly: 56, c: '#8a3b1e' },
    { name: 'Raita & Salan', sub: 'served alongside', x: 72, y: 78, side: 'r', ly: 82, c: '#f7ead2' },
    { name: 'Dum Chicken', sub: 'the second heart', x: 40, y: 40, side: 'l', ly: 34, c: '#a83c12' },
    { name: 'Star Anise & Bay', sub: 'whole spices', x: 28, y: 64, side: 'l', ly: 68, c: '#d92b1f' },
  ],
  veg: [
    { name: 'Saffron Rice', sub: 'the golden crown', x: 76, y: 38, side: 'r', ly: 24, c: '#f5a301' },
    { name: 'Cauliflower', sub: 'dum-roasted florets', x: 52, y: 44, side: 'r', ly: 50, c: '#e3cf9f' },
    { name: 'Green Beans', sub: 'garden fresh', x: 52, y: 68, side: 'r', ly: 78, c: '#5f8f4e' },
    { name: 'Carrot', sub: 'sweet batons', x: 22, y: 42, side: 'l', ly: 36, c: '#ff6b1a' },
    { name: 'Garden Peas', sub: 'scattered through', x: 34, y: 28, side: 'l', ly: 60, c: '#7fb069' },
  ],
  egg: [
    { name: 'Masala Egg', sub: 'golden, spice-coated', x: 52, y: 28, side: 'r', ly: 18, c: '#e8c93e' },
    { name: 'Saffron Rice', sub: 'the golden crown', x: 75, y: 70, side: 'r', ly: 52, c: '#f5a301' },
    { name: 'Bay Leaf', sub: 'whole spice', x: 82, y: 52, side: 'r', ly: 80, c: '#5f8f4e' },
    { name: 'Fresh Mint', sub: 'hand-torn leaves', x: 34, y: 30, side: 'l', ly: 24, c: '#5f8f4e' },
    { name: 'Fried Onion', sub: 'golden birista crunch', x: 30, y: 60, side: 'l', ly: 58, c: '#c97b2f' },
  ],
  kebab: [
    { name: 'Chicken Tikka', sub: 'boneless, char-grilled', x: 58, y: 46, side: 'r', ly: 32, c: '#a83c12' },
    { name: 'Onion Rings', sub: 'crisp & raw', x: 80, y: 40, side: 'r', ly: 60, c: '#f7ead2' },
    { name: 'Lemon Wedge', sub: 'a squeeze to finish', x: 66, y: 70, side: 'r', ly: 84, c: '#e8c93e' },
    { name: 'Chilli Marinade', sub: 'yoghurt & spice', x: 30, y: 30, side: 'l', ly: 22, c: '#d92b1f' },
    { name: 'Charcoal Grill', sub: 'smoky charred edges', x: 22, y: 52, side: 'l', ly: 56, c: '#8a3b1e' },
  ],
};
const PER = { chicken: 'per plate', mutton: 'per plate', special: 'serves two', veg: 'per plate', egg: 'per plate', kebab: '8 pieces' };
const HINT = {
  chicken: 'Sealed & slow-cooked on dum · served with raita & mirchi ka salan',
  mutton: 'Sealed & slow-cooked on dum · served with raita & mirchi ka salan',
  special: 'The grand handi — chicken & lamb together · serves 2',
  veg: 'Garden vegetables on dum · served with raita & mirchi ka salan',
  egg: 'Sealed & slow-cooked on dum · served with raita & mirchi ka salan',
  kebab: 'No handi for this one — straight off the charcoal tandoor',
};
const DISH_IDS = ['chicken', 'mutton', 'special', 'veg', 'egg', 'kebab'];
const DISHES = DISH_IDS.map((id) => {
  const p = productById(id);
  return { id, name: p.name, price: p.price, img: p.img, tag: p.tag, desc: p.desc, biryani: p.biryani, layer: p.layer, per: PER[id], hint: HINT[id], layers: LAYERS[id] };
});
const byId = (id) => DISHES.find((d) => d.id === id);

let activeId = 'chicken';
let pendingQty = 1;
let switching = false;
const params = new URLSearchParams(location.search);
if (params.get('dish') && byId(params.get('dish'))) activeId = params.get('dish');

const $ = (s) => document.querySelector(s);
const railEl = $('#dishRail'), plateWrap = $('#plateWrap'), plateTilt = $('#plateTilt'),
  plateRoll = $('#plateRoll'), plateImg = $('#plateImg'), plateLid = $('#plateLid'),
  plateHint = $('#plateHint'), calloutsEl = $('#callouts'), linesEl = $('#calloutLines'),
  infoTag = $('#infoTag'), infoName = $('#infoName'), infoDesc = $('#infoDesc'),
  infoPrice = $('#infoPrice'), infoPer = $('#infoPer'),
  qtyVal = $('#qtyVal'), addBtn = $('#addBtn'), addBtnPrice = $('#addBtnPrice'),
  navHandi = $('#navHandi'), drawer = $('#drawer'), scrim = $('#scrim'),
  drawerItems = $('#drawerItems'), drawerEmpty = $('#drawerEmpty'),
  orderBar = $('#orderBar'), orderBarCount = $('#orderBarCount'), orderBarTotal = $('#orderBarTotal');

const steam = makeSteam($('#plateSteam'), { rate: 0.3, alpha: 0.11, rise: 1 });
plateImg.src = byId(activeId).img;
DISHES.forEach((d) => { const i = new Image(); i.src = d.img; });

/* ---------------- dish rail ---------------- */
DISHES.forEach((d, i) => {
  const b = document.createElement('button');
  b.className = 'dish-tab' + (d.id === activeId ? ' active' : '');
  b.dataset.id = d.id;
  b.style.setProperty('--lc', d.layer);
  b.innerHTML = '<i></i><img src="' + d.img + '" alt="">' +
    '<span><span class="dt-name">' + d.name + '</span><span class="dt-price">' + inr(d.price) + '</span></span>' +
    '<span class="dt-num">0' + (i + 1) + '</span>';
  b.addEventListener('click', () => switchDish(d.id));
  railEl.appendChild(b);
});

/* ---------------- layer tags ---------------- */
function renderTags(dish) {
  calloutsEl.innerHTML = '';
  linesEl.innerHTML = '';
  const mobile = window.innerWidth <= 860;
  dish.layers.forEach((c, i) => {
    const lx = c.side === 'r' ? (mobile ? 78 : 90) : (mobile ? 24 : 10);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', c.x); line.setAttribute('y1', c.y);
    line.setAttribute('x2', lx); line.setAttribute('y2', c.ly);
    line.style.transition = 'stroke-dashoffset .55s ease ' + (0.1 + i * 0.08) + 's';
    linesEl.appendChild(line);
    const wrap = document.createElement('div');
    wrap.className = 'callout';
    wrap.innerHTML =
      '<span class="callout-dot" style="left:' + c.x + '%;top:' + c.y + '%;background:' + c.c + ';box-shadow:0 0 0 3px ' + c.c + '44,0 0 14px ' + c.c + '"></span>' +
      '<span class="layer-tag ' + c.side + '" style="left:' + lx + '%;top:' + c.ly + '%;transform:translate(' + (c.side === 'r' ? '-4%' : '-96%') + ',-50%);border-' + (c.side === 'r' ? 'left' : 'right') + '-color:' + c.c + '">' +
      '<span class="lt-name">' + c.name + '</span><span class="lt-sub">' + c.sub + '</span></span>';
    wrap.style.transition = 'opacity .45s ease ' + (0.04 + i * 0.08) + 's';
    calloutsEl.appendChild(wrap);
  });
  requestAnimationFrame(() => requestAnimationFrame(() => {
    calloutsEl.querySelectorAll('.callout').forEach((el) => el.classList.add('show'));
    linesEl.querySelectorAll('line').forEach((el) => { el.style.strokeDashoffset = '0'; });
  }));
}
function hideTags() {
  calloutsEl.querySelectorAll('.callout').forEach((el) => { el.style.transition = 'opacity .16s ease'; el.classList.remove('show'); });
  linesEl.querySelectorAll('line').forEach((el) => { el.style.transition = 'stroke-dashoffset .16s ease'; el.style.strokeDashoffset = '100'; });
}

/* ---------------- info ---------------- */
function renderInfo(dish) {
  infoTag.textContent = dish.tag;
  infoName.textContent = dish.name;
  infoDesc.textContent = dish.desc;
  infoPer.textContent = dish.per;
  plateHint.textContent = dish.hint;
  syncPending();
}
function syncPending() {
  const d = byId(activeId);
  qtyVal.textContent = pendingQty;
  infoPrice.textContent = d.price;
  addBtnPrice.textContent = '· ' + inr(d.price * pendingQty);
}
$('#qtyMinus').addEventListener('click', () => { pendingQty = Math.max(1, pendingQty - 1); syncPending(); });
$('#qtyPlus').addEventListener('click', () => { pendingQty = Math.min(20, pendingQty + 1); syncPending(); });

/* ---------------- THE SWITCH: lid lifts, steam puffs, plate rolls ---------------- */
function switchDish(id) {
  if (id === activeId || switching) return;
  switching = true;
  const dish = byId(id);
  activeId = id;
  railEl.querySelectorAll('.dish-tab').forEach((el) => el.classList.toggle('active', el.dataset.id === id));
  const activeBtn = railEl.querySelector('.dish-tab.active');
  if (activeBtn && window.innerWidth <= 860) activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  hideTags();
  renderInfo(dish);

  const swap = () => { plateImg.src = dish.img; plateImg.alt = dish.name + ', top-down'; };
  if (window.gsap && !REDUCED) {
    const tl = gsap.timeline({ onComplete: () => { switching = false; } });
    tl.to(plateLid, { yPercent: -118, xPercent: 16, rotation: 9, opacity: 0, duration: 0.5, ease: 'power2.in' })
      .add(() => steam.burst(22))
      .to(plateRoll, { rotation: '+=360', scale: 1.045, duration: 0.95, ease: 'power2.inOut',
          onStart: () => setTimeout(swap, 430) }, '-=0.12')
      .to(plateRoll, { scale: 1, duration: 0.25, ease: 'power1.out' })
      .add(() => renderTags(dish), '-=0.35')
      .to(plateLid, { yPercent: -46, xPercent: 34, rotation: 14, opacity: 0.55, duration: 0.55, ease: 'power2.out' }, '-=0.15');
    setTimeout(() => { switching = false; }, 2600); /* safety */
  } else {
    swap();
    plateLid.style.transform = 'translate(34%,-46%) rotate(14deg)';
    plateLid.style.opacity = '0.55';
    renderTags(dish);
    switching = false;
  }
}
/* initial state: lid resting ajar beside the rim, tags on */
if (window.gsap && !REDUCED) gsap.set(plateLid, { yPercent: -46, xPercent: 34, rotation: 14, opacity: 0.55 });
else { plateLid.style.transform = 'translate(34%,-46%) rotate(14deg)'; plateLid.style.opacity = '0.55'; }

/* ---------------- idle tilt / parallax (steam does the rest) ---------------- */
if (!REDUCED) {
  let mx = 0, my = 0, tx = 0, ty = 0, lastMove = 0;
  plateWrap.addEventListener('mousemove', (e) => {
    const r = plateWrap.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    lastMove = performance.now();
  });
  plateWrap.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
  (function tick(t) {
    if (performance.now() - lastMove > 2600) { tx *= 0.96; ty *= 0.96; }
    mx += (tx - mx) * 0.055; my += (ty - my) * 0.055;
    const breathe = Math.sin(t / 3400) * 1.1;
    plateTilt.style.transform = 'rotateX(' + (-my * 5 + breathe) + 'deg) rotateY(' + (mx * 5) + 'deg)';
    requestAnimationFrame(tick);
  })(performance.now());
}

/* ---------------- drawer ---------------- */
function renderCart() {
  const items = PCart.items();
  const n = PCart.count(), sub = PCart.subtotal();
  drawerEmpty.style.display = n ? 'none' : 'block';
  orderBarCount.textContent = n + (n === 1 ? ' item' : ' items');
  orderBarTotal.textContent = inr(sub);
  $('#totSubtotal').textContent = inr(sub);
  $('#totGrand').textContent = inr(sub);
  orderBar.classList.toggle('show', n > 0);
  const goBtn = $('#goCartBtn');
  if (goBtn) goBtn.style.opacity = n ? '1' : '.45';
  const mh = $('#drawerMiniHandi');
  if (mh) mh.innerHTML = miniHandiHTML(96);

  drawerItems.innerHTML = '';
  items.forEach((item) => {
    const p = productById(item.id);
    if (!p) return;
    const row = document.createElement('div');
    row.className = 'ci';
    const spiceHtml = p.biryani
      ? '<select class="ci-spice" data-act="spice" aria-label="Spice level">' +
        ['Mild', 'Medium', 'Hot'].map((s) => '<option value="' + s + '"' + (item.spice === s ? ' selected' : '') + '>' + s + '</option>').join('') + '</select>'
      : '';
    const thumb = p.img
      ? '<img class="ci-img" src="' + p.img + '" alt="">'
      : '<span class="ci-disc" style="background:' + p.layer + '">' + p.name.charAt(0) + '</span>';
    row.innerHTML = thumb +
      '<div class="ci-body"><div class="ci-top"><span class="ci-name">' + p.name + '</span>' +
      '<span class="ci-price">' + inr(p.price * item.qty) + '</span></div>' +
      '<div class="ci-controls"><span class="ci-stepper">' +
      '<button data-act="minus" aria-label="Less">−</button><span>' + item.qty + '</span><button data-act="plus" aria-label="More">+</button></span>' +
      spiceHtml + '<button class="ci-remove" data-act="remove">Remove</button></div></div>';
    row.querySelector('[data-act="minus"]').addEventListener('click', () => { PCart.setQty(item, item.qty - 1); renderCart(); });
    row.querySelector('[data-act="plus"]').addEventListener('click', () => { PCart.setQty(item, item.qty + 1); renderCart(); });
    row.querySelector('[data-act="remove"]').addEventListener('click', () => { PCart.remove(item); renderCart(); });
    const sel = row.querySelector('[data-act="spice"]');
    if (sel) sel.addEventListener('change', () => { PCart.setSpice(item, sel.value); renderCart(); });
    drawerItems.appendChild(row);
  });
  PCart.syncBadges();
}

addBtn.addEventListener('click', () => {
  PCart.add(activeId, pendingQty);
  flyToCart(plateImg.getBoundingClientRect(), plateImg.getAttribute('src'), navHandi);
  steam.burst(10);
  renderCart();
});

function openDrawer() { renderCart(); drawer.classList.add('open'); scrim.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeDrawer() { drawer.classList.remove('open'); scrim.classList.remove('open'); document.body.style.overflow = ''; }
navHandi.addEventListener('click', (e) => { e.preventDefault(); openDrawer(); });
$('#openDrawer').addEventListener('click', openDrawer);
orderBar.addEventListener('click', openDrawer);
$('#drawerClose').addEventListener('click', closeDrawer);
scrim.addEventListener('click', closeDrawer);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

let wasMobile = window.innerWidth <= 860;
window.addEventListener('resize', () => {
  const m = window.innerWidth <= 860;
  if (m !== wasMobile) { wasMobile = m; if (!switching) renderTags(byId(activeId)); }
});
window.addEventListener('storage', (e) => { if (e.key === PCart.KEY) { PCart._items = null; renderCart(); } });

/* ---------------- init ---------------- */
renderInfo(byId(activeId));
renderTags(byId(activeId));
renderCart();
if (window.innerWidth <= 860) {
  const b = railEl.querySelector('.dish-tab.active');
  if (b) b.scrollIntoView({ inline: 'center', block: 'nearest' });
}
