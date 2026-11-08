/* Paradise — order stage (order.html). Own code.
   Catalog + cart come from cart.js (shared localStorage `paradise_cart`). */
'use strict';

/* ---------------- stage data: hero dishes + their callouts ---------------- */
const CALLOUTS = {
  chicken: [
    { name: 'Fresh Mint', sub: 'hand-torn leaves', x: 75, y: 23, side: 'r', ly: 13 },
    { name: 'Dum Chicken', sub: 'sealed & slow-cooked', x: 50, y: 46, side: 'r', ly: 40 },
    { name: 'Saffron Basmati', sub: 'layered long-grain rice', x: 71, y: 71, side: 'r', ly: 76 },
    { name: 'Crispy Fried Onion', sub: 'golden birista', x: 31, y: 37, side: 'l', ly: 31 },
    { name: 'Whole Spices', sub: 'cardamom & clove', x: 22, y: 56, side: 'l', ly: 60 },
  ],
  mutton: [
    { name: 'Fresh Mint', sub: 'hand-torn leaves', x: 77, y: 24, side: 'r', ly: 15 },
    { name: 'Tender Mutton', sub: 'on the bone, dum-soft', x: 68, y: 45, side: 'r', ly: 43 },
    { name: 'Pure Ghee', sub: 'drizzled over the top', x: 57, y: 70, side: 'r', ly: 77 },
    { name: 'Crispy Fried Onion', sub: 'golden birista', x: 56, y: 27, side: 'l', ly: 22 },
    { name: 'Whole Spices', sub: 'cinnamon & cardamom', x: 48, y: 51, side: 'l', ly: 57 },
  ],
  special: [
    { name: 'Fresh Mint', sub: 'hand-torn leaves', x: 41, y: 17, side: 'l', ly: 12 },
    { name: 'Dum Chicken', sub: 'sealed & slow-cooked', x: 44, y: 40, side: 'l', ly: 36 },
    { name: 'Star Anise & Bay', sub: 'whole spices', x: 26, y: 64, side: 'l', ly: 70 },
    { name: 'Saffron Basmati', sub: 'layered long-grain rice', x: 74, y: 28, side: 'r', ly: 22 },
    { name: 'Tender Mutton', sub: 'on the bone, dum-soft', x: 66, y: 62, side: 'r', ly: 58 },
  ],
  veg: [
    { name: 'Cauliflower', sub: 'dum-roasted florets', x: 50, y: 40, side: 'r', ly: 26 },
    { name: 'Saffron Basmati', sub: 'layered long-grain rice', x: 78, y: 40, side: 'r', ly: 52 },
    { name: 'Green Beans', sub: 'garden fresh', x: 49, y: 68, side: 'r', ly: 77 },
    { name: 'Carrot', sub: 'sweet batons', x: 18, y: 40, side: 'l', ly: 34 },
    { name: 'Garden Peas', sub: 'scattered through', x: 33, y: 31, side: 'l', ly: 60 },
  ],
  egg: [
    { name: 'Masala Egg', sub: 'golden, spice-coated', x: 50, y: 27, side: 'r', ly: 18 },
    { name: 'Bay Leaf', sub: 'whole spice', x: 85, y: 57, side: 'r', ly: 48 },
    { name: 'Saffron Basmati', sub: 'layered long-grain rice', x: 76, y: 72, side: 'r', ly: 76 },
    { name: 'Fresh Mint', sub: 'hand-torn leaves', x: 35, y: 28, side: 'l', ly: 22 },
    { name: 'Crispy Fried Onion', sub: 'golden birista', x: 30, y: 62, side: 'l', ly: 57 },
  ],
  kebab: [
    { name: 'Chicken Tikka', sub: 'boneless, char-grilled', x: 59, y: 47, side: 'r', ly: 34 },
    { name: 'Onion Rings', sub: 'crisp & raw', x: 82, y: 41, side: 'r', ly: 62 },
    { name: 'Lemon Wedge', sub: 'a squeeze to finish', x: 68, y: 69, side: 'r', ly: 85 },
    { name: 'Chilli Marinade', sub: 'yoghurt & spice', x: 31, y: 29, side: 'l', ly: 22 },
    { name: 'Charcoal Grill', sub: 'smoky charred edges', x: 20, y: 50, side: 'l', ly: 54 },
  ],
};
const PER = { chicken: 'per plate', mutton: 'per plate', special: 'serves two', veg: 'per plate', egg: 'per plate', kebab: '8 pieces' };
const HINT = {
  chicken: 'Sealed & slow-cooked on dum · served with raita & mirchi ka salan',
  mutton: 'Sealed & slow-cooked on dum · served with raita & mirchi ka salan',
  special: 'The grand plate — chicken & lamb together · serves 2',
  veg: 'Garden vegetables on dum · served with raita & mirchi ka salan',
  egg: 'Sealed & slow-cooked on dum · served with raita & mirchi ka salan',
  kebab: 'From the tandoor · char-grilled over charcoal',
};
const DISHES = ['chicken', 'mutton', 'special', 'veg', 'egg', 'kebab'].map((id) => {
  const p = productById(id);
  return { id, name: p.name, price: p.price, img: p.img, tag: p.tag, desc: p.desc, biryani: p.biryani, per: PER[id], hint: HINT[id], callouts: CALLOUTS[id] };
});
const byId = (id) => DISHES.find((d) => d.id === id);

/* ---------------- state ---------------- */
let activeId = 'chicken';
let pendingQty = 1;
let switching = false;
const params = new URLSearchParams(location.search);
if (params.get('dish') && byId(params.get('dish'))) activeId = params.get('dish');

/* ---------------- els ---------------- */
const $ = (s) => document.querySelector(s);
const dishListEl = $('#dishList'), plateWrap = $('#plateWrap'), plateTilt = $('#plateTilt'),
  plateRoll = $('#plateRoll'), plateImg = $('#plateImg'), plateHint = $('#plateHint'),
  calloutsEl = $('#callouts'), linesEl = $('#calloutLines'),
  infoTag = $('#infoTag'), infoName = $('#infoName'), infoDesc = $('#infoDesc'),
  infoPrice = $('#infoPrice'), infoPer = $('#infoPer'),
  qtyVal = $('#qtyVal'), addBtn = $('#addBtn'), addBtnPrice = $('#addBtnPrice'),
  cartBtn = $('#cartBtn'), cartCount = $('#cartCount'),
  cartEl = $('#cart'), scrim = $('#scrim'),
  cartItemsEl = $('#cartItems'), cartEmpty = $('#cartEmpty'),
  totSubtotal = $('#totSubtotal'), totGrand = $('#totGrand'),
  orderBar = $('#orderBar'), orderBarCount = $('#orderBarCount'), orderBarTotal = $('#orderBarTotal');

/* set initial plate before first paint of JS-driven content */
plateImg.src = byId(activeId).img;

/* preload all plates so switches never wait on network */
DISHES.forEach((d) => { const i = new Image(); i.src = d.img; });

/* ---------------- dish list ---------------- */
DISHES.forEach((d, i) => {
  const b = document.createElement('button');
  b.className = 'dish-item' + (d.id === activeId ? ' active' : '');
  b.dataset.id = d.id;
  b.innerHTML =
    '<img class="dish-thumb" src="' + d.img + '" alt="">' +
    '<span class="dish-item-text"><span class="dish-item-name">' + d.name + '</span>' +
    '<span class="dish-item-price">' + inr(d.price) + '</span></span>' +
    '<span class="dish-item-num">0' + (i + 1) + '</span>';
  b.addEventListener('click', () => switchDish(d.id));
  dishListEl.appendChild(b);
});

/* ---------------- callouts ---------------- */
function renderCallouts(dish) {
  calloutsEl.innerHTML = '';
  linesEl.innerHTML = '';
  const mobile = window.innerWidth <= 860;
  dish.callouts.forEach((c, i) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const lx = c.side === 'r' ? (mobile ? 77 : 89) : (mobile ? 25 : 11);
    line.setAttribute('x1', c.x); line.setAttribute('y1', c.y);
    line.setAttribute('x2', lx); line.setAttribute('y2', c.ly);
    line.style.transition = 'stroke-dashoffset .55s ease ' + (0.12 + i * 0.09) + 's';
    linesEl.appendChild(line);

    const wrap = document.createElement('div');
    wrap.className = 'callout';
    wrap.innerHTML =
      '<span class="callout-dot" style="left:' + c.x + '%;top:' + c.y + '%"></span>' +
      '<span class="callout-tag ' + (c.side === 'r' ? 'right' : 'left') + '" style="left:' + lx + '%;top:' + c.ly + '%">' +
      '<span class="callout-name">' + c.name + '</span>' +
      '<span class="callout-sub">' + c.sub + '</span></span>';
    wrap.style.transition = 'opacity .45s ease ' + (0.05 + i * 0.09) + 's';
    calloutsEl.appendChild(wrap);
  });
  requestAnimationFrame(() => requestAnimationFrame(() => {
    calloutsEl.querySelectorAll('.callout').forEach((el) => el.classList.add('show'));
    linesEl.querySelectorAll('line').forEach((el) => { el.style.strokeDashoffset = '0'; });
  }));
}
function hideCallouts() {
  calloutsEl.querySelectorAll('.callout').forEach((el) => { el.style.transition = 'opacity .18s ease'; el.classList.remove('show'); });
  linesEl.querySelectorAll('line').forEach((el) => { el.style.transition = 'stroke-dashoffset .18s ease'; el.style.strokeDashoffset = '100'; });
}

/* ---------------- dish info ---------------- */
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
  infoPrice.textContent = inr(d.price);
  addBtnPrice.textContent = inr(d.price * pendingQty);
}
$('#qtyMinus').addEventListener('click', () => { pendingQty = Math.max(1, pendingQty - 1); syncPending(); });
$('#qtyPlus').addEventListener('click', () => { pendingQty = Math.min(20, pendingQty + 1); syncPending(); });

/* ---------------- lazy Susan switch ---------------- */
function switchDish(id) {
  if (id === activeId || switching) return;
  switching = true;
  const dish = byId(id);
  activeId = id;
  dishListEl.querySelectorAll('.dish-item').forEach((el) => el.classList.toggle('active', el.dataset.id === id));
  const activeBtn = dishListEl.querySelector('.dish-item.active');
  if (activeBtn && window.innerWidth <= 860) activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

  hideCallouts();
  renderInfo(dish);

  const anim = plateRoll.animate([
    { transform: 'rotate(0deg) scale(1)' },
    { transform: 'rotate(185deg) scale(1.045)', offset: 0.52 },
    { transform: 'rotate(360deg) scale(1)' },
  ], { duration: 950, easing: 'cubic-bezier(.65,.02,.23,1)' });

  setTimeout(() => {
    plateImg.src = dish.img;
    plateImg.alt = dish.name + ', top-down on a dark stoneware plate';
  }, 500);
  setTimeout(() => renderCallouts(dish), 640);
  anim.onfinish = () => { switching = false; };
  setTimeout(() => { switching = false; }, 1100); /* safety */
}

/* ---------------- idle motion: breathing tilt + mouse parallax + slow spin ---------------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let mx = 0, my = 0, tx = 0, ty = 0, spin = 0, lastMove = 0;
if (!reduceMotion) {
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
    spin += 0.016; /* ~1deg/s lazy rotation */
    const breathe = Math.sin(t / 3400) * 1.1;
    plateTilt.style.transform =
      'rotateX(' + (-my * 5 + breathe) + 'deg) rotateY(' + (mx * 5) + 'deg) rotate(' + spin + 'deg)';
    requestAnimationFrame(tick);
  })(performance.now());
}

/* ---------------- cart drawer (shared cart, simple: items + Go to Cart) ---------------- */
function renderCart() {
  const items = PCart.items();
  const n = PCart.count(), sub = PCart.subtotal();
  cartCount.textContent = n;
  cartEmpty.style.display = n ? 'none' : 'block';
  orderBarCount.textContent = n + (n === 1 ? ' item' : ' items');
  orderBarTotal.textContent = inr(sub);
  totSubtotal.textContent = inr(sub);
  totGrand.textContent = inr(sub);
  const goBtn = $('#goCartBtn');
  if (goBtn) goBtn.style.opacity = n ? '1' : '.45';

  cartItemsEl.innerHTML = '';
  items.forEach((item) => {
    const p = productById(item.id);
    if (!p) return;
    const row = document.createElement('div');
    row.className = 'ci';
    let spiceHtml = '';
    if (p.biryani) {
      spiceHtml = '<select class="ci-spice" data-act="spice" aria-label="Spice level">' +
        ['Mild', 'Medium', 'Hot'].map((s) =>
          '<option value="' + s + '"' + (item.spice === s ? ' selected' : '') + '>' + s + '</option>').join('') +
        '</select>';
    }
    const thumb = p.img
      ? '<img class="ci-img" src="' + p.img + '" alt="">'
      : '<span class="ci-img" style="display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-weight:700;color:#d9a441;border:1px dashed rgba(217,164,65,.4)">P</span>';
    row.innerHTML =
      thumb +
      '<div class="ci-body"><div class="ci-top"><span class="ci-name">' + p.name + '</span>' +
      '<span class="ci-price">' + inr(p.price * item.qty) + '</span></div>' +
      '<div class="ci-controls"><span class="ci-stepper">' +
      '<button data-act="minus" aria-label="Less">−</button><span>' + item.qty + '</span><button data-act="plus" aria-label="More">+</button></span>' +
      spiceHtml +
      '<button class="ci-remove" data-act="remove">Remove</button></div></div>';
    row.querySelector('[data-act="minus"]').addEventListener('click', () => { PCart.setQty(item, item.qty - 1); renderCart(); });
    row.querySelector('[data-act="plus"]').addEventListener('click', () => { PCart.setQty(item, item.qty + 1); renderCart(); });
    row.querySelector('[data-act="remove"]').addEventListener('click', () => { PCart.remove(item); renderCart(); });
    const sel = row.querySelector('[data-act="spice"]');
    if (sel) sel.addEventListener('change', () => { PCart.setSpice(item, sel.value); renderCart(); });
    cartItemsEl.appendChild(row);
  });
}

addBtn.addEventListener('click', () => {
  PCart.add(activeId, pendingQty);
  flyToCart(plateImg.getBoundingClientRect(), plateImg.getAttribute('src'), cartBtn);
  renderCart();
});

/* ---------------- cart open/close ---------------- */
function openCart() {
  renderCart();
  cartEl.classList.add('open'); scrim.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartEl.classList.remove('open'); scrim.classList.remove('open');
  document.body.style.overflow = '';
}
cartBtn.addEventListener('click', openCart);
orderBar.addEventListener('click', openCart);
$('#cartClose').addEventListener('click', closeCart);
scrim.addEventListener('click', closeCart);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });

/* re-render callouts if the viewport crosses the mobile breakpoint */
let wasMobile = window.innerWidth <= 860;
window.addEventListener('resize', () => {
  const m = window.innerWidth <= 860;
  if (m !== wasMobile) { wasMobile = m; if (!switching) renderCallouts(byId(activeId)); }
});

/* keep badges in sync if the cart changes in another tab/page */
window.addEventListener('storage', (e) => { if (e.key === PCart.KEY) { PCart._items = null; renderCart(); } });

/* ---------------- init ---------------- */
renderInfo(byId(activeId));
renderCallouts(byId(activeId));
renderCart();
if (window.innerWidth <= 860) {
  const activeBtn = dishListEl.querySelector('.dish-item.active');
  if (activeBtn) activeBtn.scrollIntoView({ inline: 'center', block: 'nearest' });
}

/* loader: hide on ready, hard failsafe at 7s */
function hideLoader() { $('#loader').classList.add('done'); }
if (document.readyState !== 'loading') setTimeout(hideLoader, 350);
else document.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 350));
setTimeout(hideLoader, 7000);
