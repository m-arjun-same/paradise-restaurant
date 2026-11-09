/* Paradise — YOUR HANDI (cart.html).
   Line items are layer bands; the big handi fills with the same
   layers. Checkout plays the sealing: lid down, dough ring,
   SEALED stamp with the receipt number. */
'use strict';

let mode = 'pickup';
const linesEl = document.getElementById('cartLines');
const emptyEl = document.getElementById('cartEmptyPage');
const potEl = document.getElementById('bhPot');
const wrapEl = document.getElementById('bhWrap');

function layerHeight(item, totalQty, usable) {
  return Math.max(24, Math.round(usable * (item.qty / Math.max(totalQty, 4)) * 0.94));
}

function render() {
  const items = PCart.items();
  const n = PCart.count(), sub = PCart.subtotal();
  const grand = sub + (mode === 'delivery' && n > 0 ? 40 : 0);
  emptyEl.style.display = n ? 'none' : 'block';
  document.getElementById('totSubtotal').textContent = inr(sub);
  document.getElementById('totGrand').textContent = inr(grand);
  document.getElementById('bhTotal').textContent = inr(grand);
  document.getElementById('deliveryRow').hidden = !(mode === 'delivery' && n > 0);
  document.getElementById('placeOrder').disabled = n === 0;
  document.getElementById('bhCap').textContent = n === 0
    ? '0 layers · still hungry'
    : items.length + (items.length === 1 ? ' layer' : ' layers') + ' · ' + n + (n === 1 ? ' plate' : ' plates') + ' in the pot';

  /* ---- big handi fill ---- */
  potEl.querySelectorAll('.bh-layer').forEach((el) => el.remove());
  const empty = document.getElementById('bhEmpty');
  if (empty) empty.style.display = n ? 'none' : 'flex';
  if (n) {
    const totalQty = items.reduce((s, i) => s + i.qty, 0);
    const usable = potEl.clientHeight - 10 || 290;
    [...items].reverse().forEach((item) => {
      const p = productById(item.id);
      if (!p) return;
      const band = document.createElement('div');
      band.className = 'bh-layer';
      band.style.height = layerHeight(item, totalQty, usable) + 'px';
      band.style.background = p.layer;
      band.innerHTML = '<span>' + p.name + '</span><small>×' + item.qty + (item.spice ? ' · ' + item.spice : '') + '</small>';
      potEl.appendChild(band);
    });
  }

  /* ---- line items as layer bands ---- */
  linesEl.innerHTML = '';
  items.forEach((item) => {
    const p = productById(item.id);
    if (!p) return;
    const row = document.createElement('div');
    row.className = 'cline';
    const thumb = p.img
      ? '<img src="' + p.img + '" alt="">'
      : '<span class="cline-disc" style="background:' + p.layer + '">' + p.name.charAt(0) + '</span>';
    const spice = p.biryani
      ? '<select class="spice" data-act="spice" aria-label="Spice level">' +
        ['Mild', 'Medium', 'Hot'].map((s) => '<option value="' + s + '"' + (item.spice === s ? ' selected' : '') + '>' + s + '</option>').join('') + '</select>'
      : '';
    row.innerHTML = '<i style="background:' + p.layer + '"></i>' + thumb +
      '<div><div class="cline-top"><span class="cline-name">' + p.name + '</span>' +
      '<span class="cline-price">' + inr(p.price * item.qty) + '</span></div>' +
      '<div class="cline-controls"><span class="stepper">' +
      '<button data-act="minus" aria-label="Less">−</button><span>' + item.qty + '</span><button data-act="plus" aria-label="More">+</button></span>' +
      spice + '<button class="remove-btn" data-act="remove">Remove layer</button></div></div>';
    row.querySelector('[data-act="minus"]').addEventListener('click', () => { PCart.setQty(item, item.qty - 1); render(); });
    row.querySelector('[data-act="plus"]').addEventListener('click', () => { PCart.setQty(item, item.qty + 1); render(); });
    row.querySelector('[data-act="remove"]').addEventListener('click', () => { PCart.remove(item); render(); });
    const sel = row.querySelector('[data-act="spice"]');
    if (sel) sel.addEventListener('change', () => { PCart.setSpice(item, sel.value); render(); });
    linesEl.appendChild(row);
  });
  PCart.syncBadges();
}

function setMode(m) {
  mode = m;
  document.getElementById('modePickup').classList.toggle('active', m === 'pickup');
  document.getElementById('modeDelivery').classList.toggle('active', m === 'delivery');
  document.getElementById('deliveryFields').hidden = m !== 'delivery';
  render();
}
document.getElementById('modePickup').addEventListener('click', () => setMode('pickup'));
document.getElementById('modeDelivery').addEventListener('click', () => setMode('delivery'));

/* ---- fill the sealing-animation pot with the order's layers ---- */
function fillSealPot(items) {
  const body = document.getElementById('sealAnimBody');
  body.innerHTML = '';
  body.style.display = 'flex';
  body.style.flexDirection = 'column';
  body.style.justifyContent = 'flex-end';
  body.style.overflow = 'hidden';
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  [...items].reverse().forEach((item) => {
    const p = productById(item.id);
    if (!p) return;
    const band = document.createElement('div');
    band.style.height = Math.max(16, Math.round(118 * (item.qty / Math.max(totalQty, 4)) * 0.94)) + 'px';
    band.style.background = p.layer;
    body.appendChild(band);
  });
}

document.getElementById('placeOrder').addEventListener('click', () => {
  if (PCart.count() === 0) return;
  const nameEl = document.getElementById('custName');
  const addrEl = document.getElementById('custAddress');
  if (!nameEl.value.trim()) { nameEl.classList.add('err'); nameEl.focus(); setTimeout(() => nameEl.classList.remove('err'), 1600); return; }
  if (mode === 'delivery' && !addrEl.value.trim()) { addrEl.classList.add('err'); addrEl.focus(); setTimeout(() => addrEl.classList.remove('err'), 1600); return; }

  const items = PCart.items().slice();
  const sub = PCart.subtotal();
  const total = sub + (mode === 'delivery' ? 40 : 0);
  const now = new Date();
  const receipt = 'PRD-' + now.getTime().toString(36).toUpperCase().slice(-6);
  const when = new Date(now.getTime() + (mode === 'pickup' ? 45 : 60) * 60000);

  document.getElementById('cReceipt').textContent = receipt;
  document.getElementById('receiptStamp').textContent = 'SEALED · ' + receipt;
  document.getElementById('cWhenLabel').textContent = mode === 'pickup' ? 'Pickup time' : 'Delivery by';
  document.getElementById('cWhen').textContent = when.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  document.getElementById('cMode').textContent = mode === 'pickup' ? 'Pickup · Secunderabad' : 'Delivery';
  document.getElementById('cName').textContent = nameEl.value.trim();
  document.getElementById('cTotal').textContent = inr(total);
  document.getElementById('cItems').innerHTML = items.map((i) => {
    const p = productById(i.id);
    return i.qty + ' × ' + p.name + (i.spice ? ' (' + i.spice + ')' : '') + ' — ' + inr(p.price * i.qty);
  }).join('<br>') + (mode === 'delivery' ? '<br>Delivery — ₹40' : '');

  /* ---- THE SEALING ---- */
  wrapEl.classList.add('sealed');
  fillSealPot(items);
  const overlay = document.getElementById('sealOverlay');
  overlay.classList.add('playing');
  const done = () => {
    overlay.classList.remove('playing');
    PCart.clear();
    document.getElementById('cartMain').hidden = true;
    document.getElementById('confirmMain').hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    render();
  };
  if (window.gsap && !REDUCED) {
    const lidEl = document.getElementById('sealAnimLid');
    const ringEl = document.getElementById('sealAnimRing');
    gsap.set(lidEl, { y: 0, opacity: 1 });
    gsap.set(ringEl, { opacity: 0, scaleX: 0.55 });
    const tl = gsap.timeline({ onComplete: () => setTimeout(done, 420) });
    tl.to(lidEl, { y: 106, duration: 0.85, ease: 'power3.in' })
      .to(ringEl, { opacity: 1, scaleX: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.08')
      .fromTo('#receiptStamp', { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.001 }, 0); /* stamp lives on receipt; revealed after */
  } else {
    setTimeout(done, 650);
  }
});

window.addEventListener('storage', (e) => { if (e.key === PCart.KEY) { PCart._items = null; render(); } });
render();
