/* Paradise — shop page */
'use strict';

const grid = document.getElementById('shopGrid');
const emptyEl = document.getElementById('shopEmpty');
let activeCat = 'all';
let query = '';

function cardFor(p) {
  const card = document.createElement('article');
  card.className = 'pcard';
  const visual = p.img
    ? '<img src="' + p.img + '" alt="' + p.name + ', top-down plate">'
    : '<span class="pcard-initial">' + p.name.charAt(0) + '</span>';
  const foot = p.price != null
    ? '<span class="pcard-price">' + inr(p.price) + '</span><button class="add-small">Add to order</button>'
    : '<span class="pcard-noprice">In store only</span>';
  card.innerHTML =
    '<div class="pcard-img">' + visual + '<span class="pcard-tag">' + p.tag + '</span></div>' +
    '<div class="pcard-body"><h3>' + p.name + '</h3><p>' + p.desc + '</p>' +
    '<div class="pcard-foot">' + foot + '</div></div>';
  if (p.price != null) {
    card.querySelector('.add-small').addEventListener('click', (e) => {
      PCart.add(p.id, 1);
      const imgEl = card.querySelector('.pcard-img img') || card.querySelector('.pcard-img');
      const target = document.getElementById('navCart');
      flyToCart(imgEl.getBoundingClientRect(), p.img, target);
      syncSticky();
      e.preventDefault();
    });
  }
  /* plates link through to the stage for the 6 hero dishes */
  if (p.img && ['chicken', 'mutton', 'special', 'veg', 'egg', 'kebab'].includes(p.id)) {
    const imgWrap = card.querySelector('.pcard-img');
    imgWrap.style.cursor = 'pointer';
    imgWrap.title = 'Open on the ordering stage';
    imgWrap.addEventListener('click', () => { location.href = 'order.html?dish=' + p.id; });
  }
  return card;
}

function render() {
  grid.innerHTML = '';
  const list = PRODUCTS.filter((p) =>
    (activeCat === 'all' || p.cat === activeCat) &&
    p.name.toLowerCase().includes(query));
  list.forEach((p) => grid.appendChild(cardFor(p)));
  emptyEl.style.display = list.length ? 'none' : 'block';
}
document.getElementById('chips').addEventListener('click', (e) => {
  const b = e.target.closest('.chip');
  if (!b) return;
  document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === b));
  activeCat = b.dataset.cat;
  render();
});
document.getElementById('search').addEventListener('input', (e) => {
  query = e.target.value.trim().toLowerCase();
  render();
});

function syncSticky() {
  const bar = document.getElementById('stickyBar');
  const n = PCart.count();
  document.getElementById('stickyCount').textContent = n + (n === 1 ? ' item' : ' items');
  document.getElementById('stickyTotal').textContent = inr(PCart.subtotal());
  bar.classList.toggle('show', n > 0);
}
window.addEventListener('storage', (e) => { if (e.key === PCart.KEY) { PCart._items = null; syncSticky(); PCart.syncBadges(); } });
document.addEventListener('DOMContentLoaded', syncSticky);

render();
syncSticky();
