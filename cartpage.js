/* Paradise — cart page */
'use strict';

let mode = 'pickup';
const linesEl = document.getElementById('cartLines');
const emptyEl = document.getElementById('cartEmptyPage');

function render() {
  const items = PCart.items();
  const n = PCart.count(), sub = PCart.subtotal();
  const grand = sub + (mode === 'delivery' && n > 0 ? 40 : 0);
  emptyEl.style.display = n ? 'none' : 'block';
  document.getElementById('totSubtotal').textContent = inr(sub);
  document.getElementById('totGrand').textContent = inr(grand);
  document.getElementById('deliveryRow').hidden = !(mode === 'delivery' && n > 0);
  document.getElementById('placeOrder').disabled = n === 0;

  linesEl.innerHTML = '';
  items.forEach((item) => {
    const p = productById(item.id);
    if (!p) return;
    const row = document.createElement('div');
    row.className = 'cline';
    const thumb = p.img
      ? '<img src="' + p.img + '" alt="">'
      : '<span class="cline-disc">' + p.name.charAt(0) + '</span>';
    const spice = p.biryani
      ? '<select class="spice" data-act="spice" aria-label="Spice level">' +
        ['Mild', 'Medium', 'Hot'].map((s) => '<option value="' + s + '"' + (item.spice === s ? ' selected' : '') + '>' + s + '</option>').join('') +
        '</select>'
      : '';
    row.innerHTML =
      thumb +
      '<div class="cline-body"><div class="cline-top"><span class="cline-name">' + p.name + '</span>' +
      '<span class="cline-price">' + inr(p.price * item.qty) + '</span></div>' +
      '<div class="cline-controls"><span class="stepper">' +
      '<button data-act="minus" aria-label="Less">−</button><span>' + item.qty + '</span><button data-act="plus" aria-label="More">+</button></span>' +
      spice +
      '<button class="remove-btn" data-act="remove">Remove</button></div></div>';
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

document.getElementById('placeOrder').addEventListener('click', () => {
  if (PCart.count() === 0) return;
  const nameEl = document.getElementById('custName');
  const addrEl = document.getElementById('custAddress');
  if (!nameEl.value.trim()) {
    nameEl.focus(); nameEl.style.borderColor = 'var(--red)';
    setTimeout(() => { nameEl.style.borderColor = ''; }, 1600);
    return;
  }
  if (mode === 'delivery' && !addrEl.value.trim()) {
    addrEl.focus(); addrEl.style.borderColor = 'var(--red)';
    setTimeout(() => { addrEl.style.borderColor = ''; }, 1600);
    return;
  }
  const items = PCart.items().slice();
  const sub = PCart.subtotal();
  const total = sub + (mode === 'delivery' ? 40 : 0);
  const now = new Date();
  const when = new Date(now.getTime() + (mode === 'pickup' ? 45 : 60) * 60000);
  document.getElementById('cReceipt').textContent = 'PRD-' + now.getTime().toString(36).toUpperCase().slice(-6);
  document.getElementById('cWhenLabel').textContent = mode === 'pickup' ? 'Pickup time' : 'Delivery by';
  document.getElementById('cWhen').textContent = when.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  document.getElementById('cMode').textContent = mode === 'pickup' ? 'Pickup · Secunderabad' : 'Delivery';
  document.getElementById('cName').textContent = nameEl.value.trim();
  document.getElementById('cTotal').textContent = inr(total);
  document.getElementById('cItems').innerHTML = items.map((i) => {
    const p = productById(i.id);
    return i.qty + ' × ' + p.name + (i.spice ? ' (' + i.spice + ')' : '') + ' — ' + inr(p.price * i.qty);
  }).join('<br>') + (mode === 'delivery' ? '<br>Delivery — ₹40' : '');

  PCart.clear();
  document.getElementById('cartMain').hidden = true;
  document.getElementById('confirmMain').hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('storage', (e) => { if (e.key === PCart.KEY) { PCart._items = null; render(); } });

render();
