// ======= بيانات المنتجات =======
const PRODUCTS = [
  { id: 1, name: 'سماطي كلاسيك - اسود', price: 120, desc: 'قماش مريح، متوفر من S لـ XL', img: 'https://via.placeholder.com/600x600?text=Black+Smaati' },
  { id: 2, name: 'سماطي رياضي - رمادي', price: 140, desc: 'مثالي للرياضة و الراحة', img: 'https://via.placeholder.com/600x600?text=Grey+Smaati' },
  { id: 3, name: 'سماطي مودرن - كحلي', price: 160, desc: 'ستايل عصري وقصّة حديثة', img: 'https://via.placeholder.com/600x600?text=Navy+Smaati' }
];

// الرقم ديال Whatsapp
const WH_NUMBER = '+212600000000';

// ======= منطق العرض و السلة =======
const productsEl = document.getElementById('products');
const cart = {};

function formatMAD(n) {
  return n.toLocaleString('en-US') + ' د.م';
}

function renderProducts(list) {
  productsEl.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <div class="body">
        <h4 style="margin:0">${p.name}</h4>
        <div class="muted">${p.desc}</div>
        <div class="price">${formatMAD(p.price)}</div>
        <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
          <select id="size-${p.id}"><option>م</option><option>S</option><option>M</option><option>L</option><option>XL</option></select>
          <button class="btn" onclick="addToCart(${p.id})">ضيف للسلة</button>
        </div>
      </div>
    `;
    productsEl.appendChild(card);
  });
}

function addToCart(id) {
  const prod = PRODUCTS.find(x => x.id === id);
  const size = document.getElementById('size-' + id).value || '';
  const key = id + '|' + size;
  if (!cart[key]) cart[key] = { ...prod, qty: 0, size };
  cart[key].qty++;
  updateCartUI();
  openCart();
}

function updateCartUI() {
  const itemsEl = document.getElementById('cart-items');
  itemsEl.innerHTML = '';
  let total = 0,
    count = 0;
  Object.values(cart).forEach(item => {
    count += item.qty;
    total += item.qty * item.price;
    const d = document.createElement('div');
    d.className = 'cart-item';
    d.innerHTML = `
      <img src="${item.img}" />
      <div style="flex:1;text-align:right">
        <div style="font-weight:700">${item.name}</div>
        <div class="muted">القياس: ${item.size}</div>
        <div class="muted">${item.qty} × ${formatMAD(item.price)}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button class="btn" onclick="changeQty('${encodeURIComponent(item.name)}','${item.size}',1)">+</button>
        <button class="btn" style="background:#ef4444" onclick="changeQty('${encodeURIComponent(item.name)}','${item.size}',-1)">-</button>
      </div>
    `;
    itemsEl.appendChild(d);
  });
  document.getElementById('cart-total').innerText = formatMAD(total);
  const badge = document.getElementById('cart-count');
  if (count > 0) {
    badge.style.display = 'inline-block';
    badge.innerText = count;
  } else badge.style.display = 'none';
}

function changeQty(encodedName, size, delta) {
  const name = decodeURIComponent(encodedName);
  const key = Object.keys(cart).find(k => cart[k].name === name && cart[k].size === size);
  if (!key) return;
  cart[key].qty += delta;
  if (cart[key].qty <= 0) delete cart[key];
  updateCartUI();
}

// ======= البحث =======
document.getElementById('search').addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  renderProducts(PRODUCTS.filter(p => (p.name + ' ' + p.desc).toLowerCase().includes(q)));
});

// ======= Drawer =======
const drawer = document.getElementById('drawer');
document.getElementById('open-cart').addEventListener('click', openCart);
document.getElementById('close-cart').addEventListener('click', closeCart);

function openCart() {
  drawer.classList.add('open');
  updateCartUI();
}
function closeCart() {
  drawer.classList.remove('open');
}

// ======= Checkout via Whatsapp =======
document.getElementById('checkout-wa').addEventListener('click', () => {
  const lines = [];
  let total = 0;
  Object.values(cart).forEach(it => {
    lines.push(`${it.qty} x ${it.name} (قياس:${it.size}) = ${it.qty * it.price} د.م`);
    total += it.qty * it.price;
  });
  if (lines.length === 0) {
    alert('السلة خاوية! ضيف شي حاجة أولاً.');
    return;
  }
  lines.push('----------------');
  lines.push('المجموع: ' + total + ' د.م');
  const msg = encodeURIComponent('السلام عليكم، بغيت نطلب هاد المنتوجات:\n' + lines.join('\n'));
  const url = `https://wa.me/${WH_NUMBER.replace(/\+/g, '')}?text=${msg}`;
  window.open(url, '_blank');
});

// ======= init =======
renderProducts(PRODUCTS);
