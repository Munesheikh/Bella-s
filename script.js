const cart = [];

function addToCart(name, price){
  const item = cart.find(x => x.name === name);
  if(item) item.qty++;
  else cart.push({name, price, qty:1});
  renderCart();
  toggleCart(true);
}

function changeQty(name, delta){
  const item = cart.find(x => x.name === name);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){
    const index = cart.indexOf(item);
    cart.splice(index, 1);
  }
  renderCart();
}

function renderCart(){
  const box = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const countEl = document.getElementById("cartCount");

  if(cart.length === 0){
    box.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    totalEl.textContent = "Rs. 0";
    countEl.textContent = "0";
    return;
  }

  let total = 0;
  let count = 0;

  box.innerHTML = cart.map(item => {
    const line = item.price * item.qty;
    total += line;
    count += item.qty;
    return `
      <div class="cart-row">
        <div><strong>${item.name}</strong><br>Rs. ${item.price.toLocaleString()}</div>
        <div class="qty-controls">
          <button onclick="changeQty('${item.name.replaceAll("'","\\'")}',-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${item.name.replaceAll("'","\\'")}',1)">+</button>
        </div>
        <strong>Rs. ${line.toLocaleString()}</strong>
      </div>`;
  }).join("");

  totalEl.textContent = `Rs. ${total.toLocaleString()}`;
  countEl.textContent = count;
}

function toggleCart(open){
  document.getElementById("cartDrawer").classList.toggle("open", open);
  document.getElementById("cartBackdrop").classList.toggle("open", open);
}

function scrollToOrder(){
  document.getElementById("order-box").scrollIntoView({behavior:"smooth", block:"center"});
}

function sendWhatsApp(){
  if(cart.length === 0){
    alert("Please add at least one item to your order first.");
    toggleCart(true);
    return;
  }
  const lines = cart.map(item => `• ${item.name} x${item.qty} — Rs. ${(item.price*item.qty).toLocaleString()}`);
  const total = cart.reduce((sum,item)=>sum + item.price*item.qty, 0);
  const message = `Assalam-o-Alaikum Bella's!%0A%0AI would like to place an order:%0A${lines.join("%0A")}%0A%0ATotal: Rs. ${total.toLocaleString()}%0A%0AThank you!`;
  // Replace 923XXXXXXXXX with Bella's real WhatsApp number before delivery.
  const phone = "923XXXXXXXXX";
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
}

function filterMenu(category, button){
  document.querySelectorAll(".menu-tabs button").forEach(b=>b.classList.remove("active"));
  button.classList.add("active");
  document.querySelectorAll(".menu-item").forEach(item=>{
    item.style.display = (category === "all" || item.dataset.cat === category) ? "flex" : "none";
  });
}

const navbar = document.getElementById("navbar");
window.addEventListener("scroll", ()=>{
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
},{threshold:.12});

document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", ()=>{
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>navLinks.classList.remove("open")));

renderCart();
