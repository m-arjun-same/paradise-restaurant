/* Paradise — single-screen ordering stage (own code) */
'use strict';

/* ---------------- data (from PARADISE-DATA.md only) ---------------- */
const DISHES = [
  {
    id: 'chicken', name: 'Chicken Dum Biryani', price: 335, img: 'assets/chicken-biryani.jpg',
    tag: 'Serves 1 · The Original', per: 'per plate', biryani: true,
    desc: 'Chicken and basmati rice cooked in layers, flavoured with saffron. Served with raita and mirchi ka salan.',
    hint: 'Sealed & slow-cooked on dum · served with raita & mirchi ka salan',
    callouts: [
      { name: 'Fresh Mint', sub: 'hand-torn leaves', x: 75, y: 23, side: 'r', ly: 13 },
      { name: 'Dum Chicken', sub: 'sealed & slow-cooked', x: 50, y: 46, side: 'r', ly: 40 },
      { name: 'Saffron Basmati', sub: 'layered long-grain rice', x: 71, y: 71, side: 'r', ly: 76 },
      { name: 'Crispy Fried Onion', sub: 'golden birista', x: 31, y: 37, side: 'l', ly: 31 },
      { name: 'Whole Spices', sub: 'cardamom & clove', x: 22, y: 56, side: 'l', ly: 60 },
    ],
  },
  {
    id: 'mutton', name: 'Mutton Dum Biryani', price: 369, img: 'assets/mutton-biryani.jpg',
    tag: 'Serves 1 · Dum Pukht', per: 'per plate', biryani: true,
    desc: 'Tender mutton layered with basmati and saffron, sealed and slow-cooked on dum. Served with raita and mirchi ka salan.',
    hint: 'Sealed & slow-cooked on dum · served with raita & mirchi ka salan',
    callouts: [
      { name: 'Fresh Mint', sub: 'hand-torn leaves', x: 77, y: 24, side: 'r', ly: 15 },
      { name: 'Tender Mutton', sub: 'on the bone, dum-soft', x: 68, y: 45, side: 'r', ly: 43 },
      { name: 'Pure Ghee', sub: 'drizzled over the top', x: 57, y: 70, side: 'r', ly: 77 },
      { name: 'Crispy Fried Onion', sub: 'golden birista', x: 56, y: 27, side: 'l', ly: 22 },
      { name: 'Whole Spices', sub: 'cinnamon & cardamom', x: 48, y: 51, side: 'l', ly: 57 },
    ],
  },
  {
    id: 'special', name: 'Special Biryani', price: 860, img: 'assets/special-biryani.jpg',
    tag: 'Serves 2 · For Sharing', per: 'serves two', biryani: true,
    desc: 'A rare combination of chicken and lamb with saffron, layered over basmati. Served with raita and mirchi ka salan.',
    hint: 'The grand plate — chicken & lamb together · serves 2',
    callouts: [
      { name: 'Fresh Mint', sub: 'hand-torn leaves', x: 41, y: 17, side: 'l', ly: 12 },
      { name: 'Dum Chicken', sub: 'sealed & slow-cooked', x: 44, y: 40, side: 'l', ly: 36 },
      { name: 'Star Anise & Bay', sub: 'whole spices', x: 26, y: 64, side: 'l', ly: 70 },
      { name: 'Saffron Basmati', sub: 'layered long-grain rice', x: 74, y: 28, side: 'r', ly: 22 },
      { name: 'Tender Mutton', sub: 'on the bone, dum-soft', x: 66, y: 62, side: 'r', ly: 58 },
    ],
  },
  {
    id: 'veg', name: 'Veg Dum Biryani', price: 224, img: 'assets/veg-biryani.jpg',
    tag: 'Serves 1 · Vegetarian', per: 'per plate', biryani: true,
    desc: 'Fresh vegetables layered with basmati and saffron, sealed and slow-cooked on dum. Served with raita and mirchi ka salan.',
    hint: 'Garden vegetables on dum · served with raita & mirchi ka salan',
    callouts: [
      { name: 'Cauliflower', sub: 'dum-roasted florets', x: 50, y: 40, side: 'r', ly: 26 },
      { name: 'Saffron Basmati', sub: 'layered long-grain rice', x: 78, y: 40, side: 'r', ly: 52 },
      { name: 'Green Beans', sub: 'garden fresh', x: 49, y: 68, side: 'r', ly: 77 },
      { name: 'Carrot', sub: 'sweet batons', x: 18, y: 40, side: 'l', ly: 34 },
      { name: 'Garden Peas', sub: 'scattered through', x: 33, y: 31, side: 'l', ly: 60 },
    ],
  },
  {
    id: 'egg', name: 'Egg Biryani', price: 224, img: 'assets/egg-biryani.jpg',
    tag: 'Serves 1', per: 'per plate', biryani: true,
    desc: 'Masala egg layered with basmati and saffron, sealed and slow-cooked on dum. Served with raita and mirchi ka salan.',
    hint: 'Sealed & slow-cooked on dum · served with raita & mirchi ka salan',
    callouts: [
      { name: 'Masala Egg', sub: 'golden, spice-coated', x: 50, y: 27, side: 'r', ly: 18 },
      { name: 'Bay Leaf', sub: 'whole spice', x: 85, y: 57, side: 'r', ly: 48 },
      { name: 'Saffron Basmati', sub: 'layered long-grain rice', x: 76, y: 72, side: 'r', ly: 76 },
      { name: 'Fresh Mint', sub: 'hand-torn leaves', x: 35, y: 28, side: 'l', ly: 22 },
      { name: 'Crispy Fried Onion', sub: 'golden birista', x: 30, y: 62, side: 'l', ly: 57 },
    ],
  },
  {
    id: 'kebab', name: 'Chicken Tikka Kebab', price: 400, img: 'assets/tikka-kebab.jpg',
    tag: '8 Pieces · Tandoor', per: '8 pieces', biryani: false,
    desc: 'Boneless chicken in a yoghurt and chilli marinade, char-grilled over charcoal — smoky, with a whisper of garlic.',
    hint: 'From the tandoor · char-grilled over charcoal',
    callouts: [
      { name: 'Chicken Tikka', sub: 'boneless, char-grilled', x: 59, y: 47, side: 'r', ly: 34 },
      { name: 'Onion Rings', sub: 'crisp & raw', x: 82, y: 41, side: 'r', ly: 62 },
      { name: 'Lemon Wedge', sub: 'a squeeze to finish', x: 68, y: 69, side: 'r', ly: 85 },
      { name: 'Chilli Marinade', sub: 'yoghurt & spice', x: 31, y: 29, side: 'l', ly: 22 },
      { name: 'Charcoal Grill', sub: 'smoky charred edges', x: 20, y: 50, side: 'l', ly: 54 },
    ],
  },
];
const byId = (id) => DISHES.find((d) => d.id === id);
const inr = (n) => '₹' + n.toLocaleString('en-IN');

/* ---------------- state ---------------- */
let activeId = 'chicken';
let pendingQty = 1;
let mode = 'pickup';
const cart = new Map(); // key: dishId|spice -> {dishId, qty, spice}
let switching = false;

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
  totSubtotal = $('#totSubtotal'), totGrand = $('#totGrand'), deliveryRow = $('#deliveryRow'),
  orderBar = $('#orderBar'), orderBarCount = $('#orderBarCount'), orderBarTotal = $('#orderBarTotal');

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

/* ---------------- fly to cart ---------------- */
function flyToCart() {
  const from = plateImg.getBoundingClientRect();
  const to = cartBtn.getBoundingClientRect();
  const size = Math.min(from.width, 190);
  const clone = document.createElement('img');
  clone.src = plateImg.src;
  clone.className = 'fly-clone';
  clone.style.left = (from.left + from.width / 2 - size / 2) + 'px';
  clone.style.top = (from.top + from.height / 2 - size / 2) + 'px';
  clone.style.width = size + 'px';
  clone.style.height = size + 'px';
  document.body.appendChild(clone);
  const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
  const dy = (to.top + to.height / 2) - (from.top + from.height / 2);
  const anim = clone.animate([
    { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
    { transform: 'translate(' + dx * 0.5 + 'px,' + (dy * 0.5 - 130) + 'px) scale(.48) rotate(160deg)', opacity: 1, offset: 0.55 },
    { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.07) rotate(330deg)', opacity: 0.85 },
  ], { duration: 780, easing: 'cubic-bezier(.5,.05,.3,1)' });
  anim.onfinish = () => {
    clone.remove();
    cartBtn.classList.remove('pop'); void cartBtn.offsetWidth; cartBtn.classList.add('pop');
  };
}

/* ---------------- cart ---------------- */
function cartCountTotal() { let n = 0; cart.forEach((i) => { n += i.qty; }); return n; }
function cartSubtotal() { let s = 0; cart.forEach((i) => { s += byId(i.dishId).price * i.qty; }); return s; }

function renderCart() {
  const n = cartCountTotal(), sub = cartSubtotal();
  const grand = sub + (mode === 'delivery' && n > 0 ? 40 : 0);
  cartCount.textContent = n;
  cartEmpty.style.display = n ? 'none' : 'block';
  orderBarCount.textContent = n + (n === 1 ? ' item' : ' items');
  orderBarTotal.textContent = inr(grand);
  totSubtotal.textContent = inr(sub);
  totGrand.textContent = inr(grand);
  deliveryRow.hidden = !(mode === 'delivery' && n > 0);
  $('#checkoutBtn').disabled = n === 0;

  cartItemsEl.innerHTML = '';
  cart.forEach((item, key) => {
    const d = byId(item.dishId);
    const row = document.createElement('div');
    row.className = 'ci';
    let spiceHtml = '';
    if (d.biryani) {
      spiceHtml = '<select class="ci-spice" data-act="spice" aria-label="Spice level">' +
        ['Mild', 'Medium', 'Hot'].map((s) =>
          '<option value="' + s + '"' + (item.spice === s ? ' selected' : '') + '>' + s + '</option>').join('') +
        '</select>';
    }
    row.innerHTML =
      '<img class="ci-img" src="' + d.img + '" alt="">' +
      '<div class="ci-body"><div class="ci-top"><span class="ci-name">' + d.name + '</span>' +
      '<span class="ci-price">' + inr(d.price * item.qty) + '</span></div>' +
      '<div class="ci-controls"><span class="ci-stepper">' +
      '<button data-act="minus" aria-label="Less">−</button><span>' + item.qty + '</span><button data-act="plus" aria-label="More">+</button></span>' +
      spiceHtml +
      '<button class="ci-remove" data-act="remove">Remove</button></div></div>';
    row.querySelector('[data-act="minus"]').addEventListener('click', () => {
      item.qty -= 1; if (item.qty <= 0) cart.delete(key); renderCart();
    });
    row.querySelector('[data-act="plus"]').addEventListener('click', () => { item.qty = Math.min(20, item.qty + 1); renderCart(); });
    row.querySelector('[data-act="remove"]').addEventListener('click', () => { cart.delete(key); renderCart(); });
    const sel = row.querySelector('[data-act="spice"]');
    if (sel) sel.addEventListener('change', () => {
      const nk = item.dishId + '|' + sel.value;
      const existing = cart.get(nk);
      cart.delete(key);
      if (existing && existing !== item) existing.qty = Math.min(20, existing.qty + item.qty);
      else cart.set(nk, { dishId: item.dishId, qty: item.qty, spice: sel.value });
      renderCart();
    });
    cartItemsEl.appendChild(row);
  });
}

addBtn.addEventListener('click', () => {
  const d = byId(activeId);
  const key = d.id + '|' + (d.biryani ? 'Medium' : '-');
  const existing = cart.get(key);
  if (existing) existing.qty = Math.min(20, existing.qty + pendingQty);
  else cart.set(key, { dishId: d.id, qty: pendingQty, spice: d.biryani ? 'Medium' : null });
  flyToCart();
  renderCart();
});

/* ---------------- cart open/close + mode ---------------- */
function openCart() {
  $('#cartView').hidden = false;
  $('#confirmView').hidden = true;
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

function setMode(m) {
  mode = m;
  $('#modePickup').classList.toggle('active', m === 'pickup');
  $('#modeDelivery').classList.toggle('active', m === 'delivery');
  $('#addressField').hidden = m !== 'delivery';
  renderCart();
}
$('#modePickup').addEventListener('click', () => setMode('pickup'));
$('#modeDelivery').addEventListener('click', () => setMode('delivery'));

/* ---------------- checkout ---------------- */
$('#checkoutBtn').addEventListener('click', () => {
  if (cartCountTotal() === 0) return;
  if (mode === 'delivery' && !$('#custAddress').value.trim()) {
    $('#custAddress').focus();
    $('#custAddress').style.borderColor = 'var(--red)';
    setTimeout(() => { $('#custAddress').style.borderColor = ''; }, 1600);
    return;
  }
  const now = new Date();
  const when = new Date(now.getTime() + (mode === 'pickup' ? 45 : 60) * 60000);
  const receipt = 'PRD-' + now.getTime().toString(36).toUpperCase().slice(-6);
  $('#confirmReceipt').textContent = receipt;
  $('#confirmWhenLabel').textContent = mode === 'pickup' ? 'Pickup time' : 'Delivery by';
  $('#confirmWhen').textContent = when.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  $('#confirmMode').textContent = mode === 'pickup' ? 'Pickup · Secunderabad' : 'Delivery';
  $('#confirmTotal').textContent = inr(cartSubtotal() + (mode === 'delivery' ? 40 : 0));
  const lines = [];
  cart.forEach((i) => {
    const d = byId(i.dishId);
    lines.push(i.qty + ' × ' + d.name + (i.spice ? ' (' + i.spice + ')' : '') + ' — ' + inr(d.price * i.qty));
  });
  $('#confirmItems').innerHTML = lines.join('<br>');
  cart.clear(); renderCart();
  $('#cartView').hidden = true;
  $('#confirmView').hidden = false;
});
$('#confirmDone').addEventListener('click', closeCart);

/* re-render callouts if the viewport crosses the mobile breakpoint */
let wasMobile = window.innerWidth <= 860;
window.addEventListener('resize', () => {
  const m = window.innerWidth <= 860;
  if (m !== wasMobile) { wasMobile = m; if (!switching) renderCallouts(byId(activeId)); }
});

/* ---------------- init ---------------- */
renderInfo(byId(activeId));
renderCallouts(byId(activeId));
renderCart();

/* loader: hide on ready, hard failsafe at 7s */
function hideLoader() { $('#loader').classList.add('done'); }
if (document.readyState !== 'loading') setTimeout(hideLoader, 350);
else document.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 350));
setTimeout(hideLoader, 7000);
