/* Paradise — shared product catalog + cart (localStorage `paradise_cart`)
   Used by index.html, shop.html, order.html, cart.html.
   All facts/prices from data/PARADISE-DATA.md only. price:null = not sold online here. */
'use strict';

const PRODUCTS = [
  { id: 'chicken', name: 'Chicken Dum Biryani', price: 335, img: 'assets/chicken-biryani.jpg', cat: 'biryani', layer: '#e9a13b', biryani: true, tag: 'Serves 1 · The Original',
    desc: 'Chicken and basmati rice cooked in layers, flavoured with saffron. Served with raita and mirchi ka salan.' },
  { id: 'mutton', name: 'Mutton Dum Biryani', price: 369, img: 'assets/mutton-biryani.jpg', cat: 'biryani', layer: '#8a3b1e', biryani: true, tag: 'Serves 1 · Dum Pukht',
    desc: 'Tender mutton layered with basmati and saffron, sealed and slow-cooked on dum. Served with raita and mirchi ka salan.' },
  { id: 'special', name: 'Special Biryani', price: 860, img: 'assets/special-biryani.jpg', cat: 'biryani', layer: '#c2571f', biryani: true, tag: 'Serves 2 · For Sharing',
    desc: 'A rare combination of chicken and lamb with saffron, layered over basmati. Served with raita and mirchi ka salan.' },
  { id: 'veg', name: 'Veg Dum Biryani', price: 224, img: 'assets/veg-biryani.jpg', cat: 'biryani', layer: '#5f8f4e', biryani: true, tag: 'Serves 1 · Vegetarian',
    desc: 'Fresh vegetables layered with basmati and saffron, sealed and slow-cooked on dum. Served with raita and mirchi ka salan.' },
  { id: 'egg', name: 'Egg Biryani', price: 224, img: 'assets/egg-biryani.jpg', cat: 'biryani', layer: '#e8c93e', biryani: true, tag: 'Serves 1',
    desc: 'Masala egg layered with basmati and saffron, sealed and slow-cooked on dum. Served with raita and mirchi ka salan.' },
  { id: 'kebab', name: 'Chicken Tikka Kebab', price: 400, img: 'assets/tikka-kebab.jpg', cat: 'kebabs', layer: '#a83c12', biryani: false, tag: '8 Pieces · Tandoor',
    desc: 'Boneless chicken in a yoghurt and chilli marinade, char-grilled over charcoal — smoky, with a whisper of garlic.' },
  { id: 'tikka-half', name: 'Chicken Tikka Kebab (Half)', price: 185, img: 'assets/tikka-kebab.jpg', cat: 'kebabs', layer: '#a83c12', biryani: false, tag: 'Half Portion · Tandoor',
    desc: 'A half portion of the charcoal-grilled tikka kebab.' },
  { id: 'garlic-kebab', name: 'Chicken Garlic Kebab', price: 400, img: null, cat: 'kebabs', layer: '#b3502a', biryani: false, tag: 'Tandoor',
    desc: 'Boneless chicken kebab with a hint of garlic, finished in the tandoor.' },
  { id: 'platter', name: 'Spl. Kebab Platter', price: 460, img: null, cat: 'kebabs', layer: '#93350f', biryani: false, tag: 'For Sharing',
    desc: 'An assortment of succulent kebabs from the tandoor.' },
  { id: 'kalmi', name: 'Chicken Kalmi Kebab', price: null, img: null, cat: 'kebabs', layer: '#b3502a', biryani: false, tag: 'Tandoor',
    desc: 'A Paradise tandoor classic — available in store.' },
  { id: 'dal-fry', name: 'Dal Fry', price: null, img: null, cat: 'mains', layer: '#caa06a', biryani: false, tag: 'Mains',
    desc: 'Yellow dal, tempered and served hot.' },
  { id: 'butter-chicken', name: 'Butter Chicken', price: null, img: null, cat: 'mains', layer: '#b3502a', biryani: false, tag: 'Mains',
    desc: 'Chicken in a rich, buttery gravy.' },
  { id: 'naan', name: 'Naan / Roti', price: null, img: null, cat: 'mains', layer: '#e3cf9f', biryani: false, tag: 'Breads',
    desc: 'Fresh breads from the tandoor.' },
  { id: 'haleem', name: 'Haleem', price: null, img: null, cat: 'mains', layer: '#7a4a21', biryani: false, tag: 'Seasonal',
    desc: 'Slow-cooked and pounded the traditional way — seasonal only.' },
  { id: 'double-ka-meetha', name: 'Double ka Meetha', price: null, img: null, cat: 'desserts', layer: '#caa06a', biryani: false, tag: 'Dessert',
    desc: 'The Hyderabadi bread pudding classic.' },
  { id: 'qubani', name: 'Qubani ka Meetha', price: null, img: null, cat: 'desserts', layer: '#d98a2b', biryani: false, tag: 'Dessert',
    desc: 'Stewed apricots, a Hyderabadi favourite.' },
];
const productById = (id) => PRODUCTS.find((p) => p.id === id) || null;
const inr = (n) => '₹' + n.toLocaleString('en-IN');

const PCart = {
  KEY: 'paradise_cart',
  _items: null,
  load() {
    if (this._items) return this._items;
    try {
      const raw = JSON.parse(localStorage.getItem(this.KEY) || '[]');
      this._items = Array.isArray(raw) ? raw.filter((i) => productById(i.id)) : [];
    } catch (e) { this._items = []; }
    return this._items;
  },
  save() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this._items)); } catch (e) {}
    this.syncBadges();
  },
  items() { return this.load(); },
  add(id, qty, spice) {
    const p = productById(id);
    if (!p || p.price == null) return;
    const sp = p.biryani ? (spice || 'Medium') : null;
    const found = this.load().find((i) => i.id === id && i.spice === sp);
    if (found) found.qty = Math.min(20, found.qty + (qty || 1));
    else this._items.push({ id, qty: Math.min(20, qty || 1), spice: sp });
    this.save();
  },
  setQty(item, qty) {
    if (qty <= 0) this._items = this.load().filter((i) => i !== item);
    else item.qty = Math.min(20, qty);
    this.save();
  },
  setSpice(item, spice) {
    const dup = this.load().find((i) => i !== item && i.id === item.id && i.spice === spice);
    if (dup) { dup.qty = Math.min(20, dup.qty + item.qty); this._items = this._items.filter((i) => i !== item); }
    else item.spice = spice;
    this.save();
  },
  remove(item) { this._items = this.load().filter((i) => i !== item); this.save(); },
  clear() { this._items = []; this.save(); },
  count() { return this.load().reduce((n, i) => n + i.qty, 0); },
  subtotal() { return this.load().reduce((s, i) => s + (productById(i.id).price || 0) * i.qty, 0); },
  syncBadges() {
    const n = this.count();
    document.querySelectorAll('[data-cart-count]').forEach((el) => { el.textContent = n; });
    const pct = n === 0 ? 0 : Math.min(88, 16 + n * 13);
    document.querySelectorAll('[data-handi-fill]').forEach((el) => { el.style.height = pct + '%'; });
    document.querySelectorAll('[data-handi-meter]').forEach((el) => { el.classList.toggle('has-items', n > 0); });
  },
};

/* Fly-to-cart: clone an image (or a gold disc fallback) arcing into a target element. */
function flyToCart(fromRect, imgSrc, targetEl, done) {
  if (!targetEl || !fromRect) { if (done) done(); return; }
  const to = targetEl.getBoundingClientRect();
  const size = Math.max(44, Math.min(fromRect.width, 170));
  let clone;
  if (imgSrc) {
    clone = document.createElement('img');
    clone.src = imgSrc;
    clone.style.objectFit = 'cover';
    clone.style.borderRadius = '50%';
  } else {
    clone = document.createElement('div');
    clone.textContent = 'P';
    clone.style.cssText += 'display:flex;align-items:center;justify-content:center;font-family:Anton,Archivo,sans-serif;color:#120b06;background:radial-gradient(circle at 35% 30%,#ffc95e,#f5a301);border-radius:50%;';
    clone.style.fontSize = (size * 0.4) + 'px';
  }
  clone.style.cssText += 'position:fixed;z-index:200;pointer-events:none;left:' +
    (fromRect.left + fromRect.width / 2 - size / 2) + 'px;top:' +
    (fromRect.top + fromRect.height / 2 - size / 2) + 'px;width:' + size + 'px;height:' + size +
    'px;box-shadow:0 18px 40px rgba(0,0,0,.5);';
  document.body.appendChild(clone);
  const dx = (to.left + to.width / 2) - (fromRect.left + fromRect.width / 2);
  const dy = (to.top + to.height / 2) - (fromRect.top + fromRect.height / 2);
  const anim = clone.animate([
    { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
    { transform: 'translate(' + dx * 0.5 + 'px,' + (dy * 0.5 - 120) + 'px) scale(.48) rotate(160deg)', opacity: 1, offset: 0.55 },
    { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.07) rotate(330deg)', opacity: 0.85 },
  ], { duration: 760, easing: 'cubic-bezier(.5,.05,.3,1)' });
  anim.onfinish = () => {
    clone.remove();
    targetEl.classList.remove('pop'); void targetEl.offsetWidth; targetEl.classList.add('pop');
    if (done) done();
  };
}

/* Reveal-on-scroll for .rv elements */
function initReveal() {
  const els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window) || !els.length) { els.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach((e) => io.observe(e));
}

document.addEventListener('DOMContentLoaded', () => PCart.syncBadges());
