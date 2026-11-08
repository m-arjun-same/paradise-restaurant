/* Paradise Restaurant — ordering app (own code) */
const IMG = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;
const DISHES = [
  { id:'chicken', name:'Chicken Dum Biryani', price:335, biryani:true,
    img:IMG('1631515243349-e0cb75fb8d3a'),
    desc:'Layered basmati with tender chicken, saffron and mint — sealed and dum-cooked, served with raita & mirchi ka salan.',
    callouts:[
      {label:'Chicken', x:50, y:44, lx:50, ly:6},
      {label:'Saffron rice', x:66, y:62, lx:90, ly:78},
      {label:'Mint', x:56, y:36, lx:88, ly:14},
      {label:'Fried onion', x:38, y:60, lx:8, ly:80},
      {label:'Whole spices', x:42, y:48, lx:6, ly:22},
    ]},
  { id:'mutton', name:'Mutton Dum Biryani', price:369, biryani:true,
    img:IMG('1589302168068-964664d93dc0'),
    desc:'Tender mutton folded through saffron basmati with ghee and whole spices — the heavyweight of the Paradise menu.',
    callouts:[
      {label:'Mutton', x:58, y:40, lx:90, ly:12},
      {label:'Basmati', x:44, y:58, lx:8, ly:82},
      {label:'Saffron', x:62, y:56, lx:92, ly:70},
      {label:'Mint', x:40, y:40, lx:8, ly:16},
      {label:'Ghee', x:50, y:66, lx:50, ly:95},
    ]},
  { id:'special', name:'Special Biryani', price:860, biryani:true,
    img:IMG('1626777552726-4a6b54c97e46'),
    desc:'The rare combo — chicken + lamb with saffron, raita & salan. A full spread that serves two, Paradise style.',
    callouts:[
      {label:'Chicken + Lamb', x:50, y:72, lx:50, ly:97},
      {label:'Basmati', x:55, y:42, lx:90, ly:20},
      {label:'Saffron', x:45, y:50, lx:10, ly:24},
      {label:'Raita', x:78, y:58, lx:95, ly:62},
      {label:'Salan', x:72, y:24, lx:88, ly:4},
    ]},
  { id:'veg', name:'Veg Dum Biryani', price:224, biryani:true,
    img:IMG('1642821373181-696a54913e93'),
    desc:'Fresh vegetables layered with basmati and saffron in a clay handi — served with raita & mirchi ka salan.',
    callouts:[
      {label:'Vegetables', x:44, y:56, lx:8, ly:80},
      {label:'Basmati', x:56, y:44, lx:90, ly:16},
      {label:'Saffron', x:60, y:60, lx:92, ly:76},
      {label:'Mint', x:50, y:38, lx:48, ly:5},
    ]},
  { id:'kebab', name:'Chicken Tikka Kebab', price:400, biryani:false,
    img:IMG('1599487488170-d11ec9c172f0'),
    desc:'8 pieces marinated in yoghurt and chilli, kissed by tandoor charcoal smoke. Charred edges, juicy centre.',
    callouts:[
      {label:'Chicken tikka', x:50, y:52, lx:50, ly:95},
      {label:'Yoghurt marinade', x:36, y:44, lx:6, ly:18},
      {label:'Chilli', x:64, y:44, lx:94, ly:18},
      {label:'Charcoal smoke', x:56, y:64, lx:92, ly:82},
      {label:'Garlic', x:30, y:60, lx:6, ly:84},
    ]},
  { id:'egg', name:'Egg Biryani', price:224, biryani:true,
    img:IMG('1563379091339-03b21ab4a4f8'),
    desc:'Golden egg over saffron basmati from the brass handi — simple, fragrant, and unmistakably Paradise. With raita & salan.',
    callouts:[
      {label:'Egg', x:52, y:42, lx:88, ly:12},
      {label:'Basmati', x:44, y:60, lx:8, ly:82},
      {label:'Saffron', x:62, y:54, lx:94, ly:66},
      {label:'Mint', x:40, y:38, lx:8, ly:14},
    ]},
];
const byId = (id) => DISHES.find(d => d.id === id);
const fmt = (n) => '₹' + n.toLocaleString('en-IN');

/* ---------- Signature stage ---------- */
let activeId = 'chicken', rolling = false;
const sigTilt = document.getElementById('sigPlateTilt');
const sigPlate = document.getElementById('sigPlate');
const sigImg = document.getElementById('sigImg');
const sigLines = document.getElementById('sigLines');
const sigCallouts = document.getElementById('sigCallouts');

function renderCallouts(dish){
  sigLines.innerHTML = dish.callouts.map(c =>
    `<line x1="${c.x}" y1="${c.y}" x2="${c.lx}" y2="${c.ly}" pathLength="100"/><circle cx="${c.x}" cy="${c.y}" r="1.8"/>`).join('');
  sigCallouts.innerHTML = dish.callouts.map((c,i) =>
    `<span class="callout" style="left:${c.lx}%;top:${c.ly}%;animation-delay:${.25 + i*.13}s">${c.label}</span>`).join('');
  sigLines.querySelectorAll('line').forEach((l,i)=> l.style.animationDelay = (i*.13)+'s');
  sigLines.querySelectorAll('circle').forEach((c,i)=> c.style.animationDelay = (i*.13)+'s');
}
function setSigInfo(dish){
  document.getElementById('sigName').textContent = dish.name;
  document.getElementById('sigDesc').textContent = dish.desc;
  document.getElementById('sigPrice').textContent = fmt(dish.price);
  document.querySelectorAll('.sig-tab').forEach(t => t.classList.toggle('active', t.dataset.id === dish.id));
}
function showDish(id, animate=true){
  const dish = byId(id); if(!dish || (id === activeId && animate && rolling)) return;
  activeId = id;
  if(!animate){ sigImg.src = dish.img; sigImg.alt = dish.name; setSigInfo(dish); renderCallouts(dish); sigTilt.classList.add('labels-in'); sigPlate.classList.add('idle'); return; }
  rolling = true;
  sigTilt.classList.remove('labels-in');
  sigPlate.classList.remove('idle');
  sigTilt.classList.remove('rolling'); void sigTilt.offsetWidth;
  sigTilt.classList.add('rolling');           /* 360° lazy-Susan: rotate + tilt + scale, NO fade */
  setTimeout(() => { sigImg.src = dish.img; sigImg.alt = dish.name; setSigInfo(dish); renderCallouts(dish); }, 400);
  setTimeout(() => { sigTilt.classList.add('labels-in'); }, 620);
  setTimeout(() => { sigTilt.classList.remove('rolling'); sigPlate.classList.add('idle'); rolling = false; }, 900);
}
const tabsWrap = document.getElementById('sigTabs');
tabsWrap.innerHTML = DISHES.map(d => `<button class="sig-tab" data-id="${d.id}">${d.name.replace(' Biryani','').replace('Chicken Tikka ','')}</button>`).join('');
tabsWrap.addEventListener('click', e => { const b = e.target.closest('.sig-tab'); if(b) showDish(b.dataset.id); });
sigPlate.addEventListener('mouseenter', () => { if(!rolling){ sigPlate.classList.remove('idle'); sigPlate.style.animation='spin 5s linear infinite'; }});
sigPlate.addEventListener('mouseleave', () => { sigPlate.style.animation=''; if(!rolling) sigPlate.classList.add('idle'); });
showDish('chicken', false);
document.getElementById('sigAdd').addEventListener('click', e => addToCart(activeId, sigImg, e.currentTarget));

/* ---------- Menu grid ---------- */
document.getElementById('menuGrid').innerHTML = DISHES.map(d => `
  <article class="dish-card">
    <div class="plate"><img loading="lazy" src="${d.img}" alt="${d.name} — top-down plate"></div>
    <h3>${d.name}</h3><p>${d.desc}</p>
    <div class="dish-foot"><span class="dish-price">${fmt(d.price)}</span>
    <button class="add-btn" data-add="${d.id}">Add +</button></div>
  </article>`).join('');
document.getElementById('menuGrid').addEventListener('click', e => {
  const b = e.target.closest('[data-add]'); if(!b) return;
  const img = b.closest('.dish-card').querySelector('img');
  addToCart(b.dataset.add, img, b);
});

/* ---------- Cart ---------- */
let cart = {}; /* id -> {qty, spice} */
let mode = 'pickup';
const drawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('cartOverlay');
function openCart(){ drawer.classList.add('open'); overlay.classList.add('open'); drawer.setAttribute('aria-hidden','false'); }
function closeCart(){ drawer.classList.remove('open'); overlay.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); }
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
document.getElementById('stickyBar').addEventListener('click', openCart);

const modePickup = document.getElementById('modePickup'), modeDelivery = document.getElementById('modeDelivery');
function setMode(m){ mode = m;
  modePickup.classList.toggle('active', m==='pickup');
  modeDelivery.classList.toggle('active', m==='delivery');
  document.getElementById('coAddress').classList.toggle('hidden', m==='pickup');
  document.getElementById('coAddress').required = (m==='delivery');
}
modePickup.addEventListener('click', () => setMode('pickup'));
modeDelivery.addEventListener('click', () => setMode('delivery'));

function cartCount(){ return Object.values(cart).reduce((s,i)=>s+i.qty,0); }
function cartTotal(){ return Object.entries(cart).reduce((s,[id,i])=>s + byId(id).price*i.qty, 0); }

function renderCart(){
  const wrap = document.getElementById('cartItems');
  const ids = Object.keys(cart);
  document.getElementById('cartEmpty').style.display = ids.length ? 'none' : 'block';
  wrap.innerHTML = ids.map(id => { const d = byId(id), it = cart[id]; return `
    <div class="ci">
      <img src="${d.img}" alt="${d.name}">
      <div><h5>${d.name}</h5><span class="ci-price">${fmt(d.price)}</span>
        <span class="stepper"><button data-dec="${id}">−</button><b>${it.qty}</b><button data-inc="${id}">+</button></span>
        ${d.biryani ? `<label class="spice">Spice<select data-spice="${id}">
          ${['Mild','Medium','Hot'].map(s=>`<option ${s===it.spice?'selected':''}>${s}</option>`).join('')}</select></label>` : ''}
      </div>
      <div class="ci-right"><div class="ci-total">${fmt(d.price*it.qty)}</div>
      <button class="ci-remove" data-remove="${id}">remove</button></div>
    </div>`; }).join('');
  document.getElementById('cartTotal').textContent = fmt(cartTotal());
  document.getElementById('cartCount').textContent = cartCount();
  const n = cartCount();
  document.getElementById('stickyInfo').textContent = n ? `${n} item${n>1?'s':''} · ${fmt(cartTotal())}` : 'Your cart is empty';
}
const itemsWrap = document.getElementById('cartItems');
itemsWrap.addEventListener('click', e => {
  const inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]'), rem = e.target.closest('[data-remove]');
  if(inc) cart[inc.dataset.inc].qty++;
  if(dec){ const id = dec.dataset.dec; cart[id].qty--; if(cart[id].qty<=0) delete cart[id]; }
  if(rem) delete cart[rem.dataset.remove];
  if(inc||dec||rem) renderCart();
});
itemsWrap.addEventListener('change', e => {
  const s = e.target.closest('[data-spice]'); if(s) cart[s.dataset.spice].spice = s.value;
});

/* Fly-to-cart: same image shrinks + arcs into the cart icon, count pops */
function flyToCart(sourceImg, done){
  const cartBtn = document.getElementById('cartBtn');
  const a = sourceImg.getBoundingClientRect(), b = cartBtn.getBoundingClientRect();
  const ghost = sourceImg.cloneNode();
  ghost.className = 'fly-img';
  Object.assign(ghost.style, { left:a.left+'px', top:a.top+'px', width:a.width+'px', height:a.height+'px' });
  document.body.appendChild(ghost);
  const dx = (b.left + b.width/2) - (a.left + a.width/2);
  const dy = (b.top + b.height/2) - (a.top + a.height/2);
  const arc = Math.min(-110, dy * .35 - 60);
  const anim = ghost.animate([
    { transform:'translate(0,0) scale(1)', opacity:1 },
    { transform:`translate(${dx*.45}px, ${dy*.45 + arc}px) scale(.48)`, opacity:1, offset:.55 },
    { transform:`translate(${dx}px, ${dy}px) scale(.07)`, opacity:.85 },
  ], { duration:780, easing:'cubic-bezier(.3,.7,.3,1)' });
  anim.onfinish = () => { ghost.remove();
    const cc = document.getElementById('cartCount');
    cc.classList.remove('pop'); void cc.offsetWidth; cc.classList.add('pop');
    if(done) done();
  };
}
function addToCart(id, sourceImg){
  if(!cart[id]) cart[id] = { qty:0, spice:'Medium' };
  cart[id].qty++;
  if(sourceImg) flyToCart(sourceImg, renderCart); else renderCart();
  renderCart();
}

/* Checkout */
document.getElementById('checkoutForm').addEventListener('submit', e => {
  e.preventDefault();
  if(!cartCount()){ alert('Your cart is empty — add a dish first.'); return; }
  const name = document.getElementById('coName').value.trim();
  if(!name) return;
  const receipt = 'PRD-' + Date.now().toString(36).toUpperCase().slice(-6) + '-' + Math.floor(100 + Math.random()*900);
  const when = new Date(Date.now() + 45*60000);
  const timeStr = when.toLocaleTimeString('en-IN', { hour:'numeric', minute:'2-digit', hour12:true });
  document.getElementById('cfReceipt').textContent = receipt;
  document.getElementById('cfWhen').textContent = (mode === 'pickup' ? 'Ready for pickup' : 'Arriving') + ' by ' + timeStr + ' · Secunderabad flagship';
  document.getElementById('cfTotal').textContent = fmt(cartTotal());
  document.getElementById('checkoutForm').classList.add('hidden');
  document.getElementById('confirmBox').classList.remove('hidden');
  cart = {}; renderCart();
  document.getElementById('cartCount').textContent = '0';
});
document.getElementById('cfDone').addEventListener('click', () => {
  document.getElementById('confirmBox').classList.add('hidden');
  document.getElementById('checkoutForm').classList.remove('hidden');
  closeCart();
});

/* Scroll reveal for signature stage */
const io = new IntersectionObserver(es => es.forEach(en => {
  if(en.isIntersecting){ sigTilt.classList.add('labels-in'); io.disconnect(); }
}), { threshold:.35 });
io.observe(sigTilt);
renderCart();
