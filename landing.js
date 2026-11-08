/* Paradise — landing page behaviour */
'use strict';

/* marquee */
(function () {
  const phrases = 'WORLD\'S FAVOURITE BIRYANI ✦ SINCE 1953 ✦ DUM PUKHT ✦ SECUNDERABAD ✦ ';
  const t = document.getElementById('mqTrack');
  if (t) t.textContent = (phrases.repeat(4)) + (phrases.repeat(4));
})();

/* signature dishes strip -> order stage with dish preselected */
(function () {
  const grid = document.getElementById('sigGrid');
  if (!grid) return;
  ['chicken', 'mutton', 'special', 'veg', 'egg', 'kebab'].forEach((id, i) => {
    const p = productById(id);
    const a = document.createElement('a');
    a.className = 'sig-card rv';
    a.href = 'order.html?dish=' + id;
    a.innerHTML =
      '<img src="' + p.img + '" alt="' + p.name + ', top-down plate">' +
      '<h3>' + p.name + '</h3><p>' + p.tag + '</p>' +
      '<span class="sig-price">' + inr(p.price) + '</span>';
    a.style.transitionDelay = (i * 0.05) + 's';
    grid.appendChild(a);
  });
})();

/* sticky mobile cart bar */
function syncSticky() {
  const bar = document.getElementById('stickyBar');
  if (!bar) return;
  const n = PCart.count();
  document.getElementById('stickyCount').textContent = n + (n === 1 ? ' item' : ' items');
  document.getElementById('stickyTotal').textContent = inr(PCart.subtotal());
  bar.classList.toggle('show', n > 0);
}
document.addEventListener('DOMContentLoaded', syncSticky);
window.addEventListener('storage', (e) => { if (e.key === PCart.KEY) { PCart._items = null; syncSticky(); PCart.syncBadges(); } });

initReveal();
