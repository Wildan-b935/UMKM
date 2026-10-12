// Ganti nomor ini dengan nomor WhatsApp bisnis, format 62 tanpa tanda +.
const WHATSAPP_NUMBER = "6281234567890";

const products = [
 {id:1,name:"Keripik Singkong",price:15000,category:"Gurih",tag:"Terlaris",rating:"4.8",reviews:120,description:"Renyah, gurih, cocok untuk teman santai.",image:"https://images.unsplash.com/photo-1621939514649-280e2aa8c2b9?auto=format&fit=crop&w=700&q=85"},
 {id:2,name:"Pisang Crispy",price:15000,category:"Manis",tag:"Favorit",rating:"4.7",reviews:96,description:"Camilan manis dengan tekstur renyah.",image:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=85"},
 {id:3,name:"Keripik Ubi",price:12000,category:"Gurih",tag:"Pilihan Lokal",rating:"4.6",reviews:76,description:"Rasa khas ubi dalam setiap gigitan.",image:"https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=85"},
 {id:4,name:"Stik Singkong",price:10000,category:"Gurih",tag:"Ekonomis",rating:"4.5",reviews:85,description:"Ringan, renyah, teman belajar yang pas.",image:"https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=700&q=85"},
 {id:5,name:"Keripik Campur",price:18000,category:"Paket",tag:"Premium",rating:"4.9",reviews:42,description:"Perpaduan camilan untuk dinikmati bersama.",image:"https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=700&q=85"},
 {id:6,name:"Keripik Tempe",price:16000,category:"Gurih",tag:"Baru",rating:"4.7",reviews:31,description:"Kriuk gurih dengan cita rasa rumahan.",image:"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85"},
 {id:7,name:"Paket Keluarga",price:45000,category:"Paket",tag:"Hemat",rating:"4.9",reviews:28,description:"Pilihan camilan untuk momen bersama.",image:"https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=85"},
 {id:8,name:"Paket Oleh-Oleh",price:70000,category:"Paket",tag:"Spesial",rating:"4.8",reviews:19,description:"Pilihan praktis untuk buah tangan.",image:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=700&q=85"}
];

const $ = id => document.getElementById(id);
let cart = [];
let favorites = new Set();
let category = "Semua";
let showAll = false;
let toastTimer;

function rupiah(n){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n)}
function safeText(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

function visibleProducts(){
 const query=$("searchInput").value.trim().toLowerCase();
 let list=products.filter(p=>(category==="Semua"||p.category===category)&&p.name.toLowerCase().includes(query));
 const sort=$("sortSelect").value;
 if(sort==="low")list.sort((a,b)=>a.price-b.price);
 if(sort==="high")list.sort((a,b)=>b.price-a.price);
 if(sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name,"id"));
 return showAll?list:list.slice(0,6);
}
function renderProducts(){
 const list=visibleProducts();
 $("productTotal").textContent=`${list.length} produk ditampilkan`;
 $("emptyMessage").hidden=list.length>0;
 $("productGrid").innerHTML=list.map(p=>`
 <article class="product-card">
  <div class="product-image">
   <img src="${p.image}" alt="${safeText(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/700x450/F7F3E9/123C30?text=SukaRasa'">
   <span class="product-badge">${safeText(p.tag)}</span>
   <button class="favorite-button ${favorites.has(p.id)?"active":""}" data-fav="${p.id}" aria-label="Favorit ${safeText(p.name)}">${favorites.has(p.id)?"♥":"♡"}</button>
  </div>
  <div class="product-info"><h3>${safeText(p.name)}</h3><p class="product-description">${safeText(p.description)}</p>
   <div class="rating">★ ${p.rating} <span>(${p.reviews} ulasan contoh)</span></div>
   <div class="product-bottom"><strong class="product-price">${rupiah(p.price)}</strong><button class="add-button" data-add="${p.id}">＋ Keranjang</button></div>
  </div>
 </article>`).join("");
 $("showAllButton").textContent=showAll?"Tampilkan Lebih Sedikit ↑":"Lihat Semua Produk ↓";
}
function toast(message){
 clearTimeout(toastTimer);$("toast").textContent=message;$("toast").classList.add("show");
 toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2600);
}
function quantity(){return cart.reduce((s,i)=>s+i.qty,0)}
function total(){return cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0)}
function renderCart(){
 $("cartCount").textContent=quantity();$("cartTotal").textContent=rupiah(total());
 if(!cart.length){$("cartItems").innerHTML='<p class="cart-empty">🛒 Keranjang masih kosong.<br>Pilih camilan favorit Anda terlebih dahulu.</p>';return}
 $("cartItems").innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-item"><img src="${p.image}" alt="${safeText(p.name)}"><div class="cart-detail"><strong>${safeText(p.name)}</strong><small>${rupiah(p.price*i.qty)}</small><div class="quantity"><button data-qty="${p.id}" data-delta="-1" aria-label="Kurangi">−</button><span>${i.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Tambah">+</button><button class="remove-button" data-remove="${p.id}">Hapus</button></div></div></div>`}).join("");
}
function openCart(){$("cartDrawer").classList.add("open");$("overlay").classList.add("show");$("cartDrawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeCart(){$("cartDrawer").classList.remove("open");$("overlay").classList.remove("show");$("cartDrawer").setAttribute("aria-hidden","true");document.body.style.overflow=""}
function openModal(title,text){$("modalTitle").textContent=title;$("modalText").textContent=text;$("infoModal").classList.add("show")}
function closeModal(){$("infoModal").classList.remove("show")}

$("productGrid").addEventListener("click",e=>{
 const add=e.target.closest("[data-add]"),fav=e.target.closest("[data-fav]");
 if(add){const id=Number(add.dataset.add),item=cart.find(i=>i.id===id);item?item.qty++:cart.push({id,qty:1});renderCart();toast("Produk ditambahkan ke keranjang.");}
 if(fav){const id=Number(fav.dataset.fav);favorites.has(id)?favorites.delete(id):favorites.add(id);$("wishlistCount").textContent=favorites.size;renderProducts();toast(favorites.has(id)?"Ditambahkan ke favorit.":"Dihapus dari favorit.");}
});
$("cartItems").addEventListener("click",e=>{
 const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");
 if(q){const item=cart.find(i=>i.id===Number(q.dataset.qty));if(item){item.qty+=Number(q.dataset.delta);if(item.qty<=0)cart=cart.filter(i=>i.id!==item.id)}}
 if(r)cart=cart.filter(i=>i.id!==Number(r.dataset.remove));
 renderCart();
});
$("cartButton").addEventListener("click",openCart);$("closeCart").addEventListener("click",closeCart);$("overlay").addEventListener("click",closeCart);
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();closeModal()}});
$("searchInput").addEventListener("input",renderProducts);$("searchButton").addEventListener("click",()=>{renderProducts();$("produk").scrollIntoView({behavior:"smooth"})});
$("sortSelect").addEventListener("change",renderProducts);
$("categoryTabs").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;category=b.dataset.category;$("categoryTabs").querySelectorAll("button").forEach(x=>x.classList.toggle("active",x===b));showAll=false;renderProducts()});
$("showAllButton").addEventListener("click",()=>{showAll=!showAll;renderProducts()});
document.querySelectorAll("[data-footer-category]").forEach(a=>a.addEventListener("click",()=>{category=a.dataset.footerCategory;$("categoryTabs").querySelectorAll("button").forEach(b=>b.classList.toggle("active",b.dataset.category===category));showAll=true;renderProducts()}));
$("menuToggle").addEventListener("click",()=>{const open=$("navMenu").classList.toggle("show");$("menuToggle").textContent=open?"✕":"☰";$("menuToggle").setAttribute("aria-expanded",String(open))});
$("navMenu").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{$("navMenu").classList.remove("show");$("menuToggle").textContent="☰"}));
function waUrl(message){return `https:https://wa.me/6285641842260?text=${encodeURIComponent(message)}`}
function contactWA(message){if(!/^\d{10,15}$/.test(WHATSAPP_NUMBER)||WHATSAPP_NUMBER==="6285641842260"){openModal("Atur nomor WhatsApp","Ganti WHATSAPP_NUMBER di file script.js dengan nomor bisnis Anda sebelum menerima pesanan.");return}window.open(waUrl(message),"_blank","noopener,noreferrer")}
$("checkoutButton").addEventListener("click",()=>{if(!cart.length){toast("Keranjang masih kosong.");return}const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `- ${p.name} x${i.qty}: ${rupiah(p.price*i.qty)}`});contactWA(["Halo SukaRasa, saya ingin memesan:","",...lines,"",`Subtotal: ${rupiah(total())}`,"Mohon konfirmasi ketersediaan dan ongkir. Terima kasih."].join("\n"))});
$("chatButton").addEventListener("click",()=>contactWA("Halo SukaRasa, saya ingin bertanya tentang produk."));
$("footerWhatsApp").addEventListener("click",e=>{if(WHATSAPP_NUMBER==="6285641842260"){e.preventDefault();openModal("Atur nomor WhatsApp","Ubah nomor contoh di script.js dan tautan WhatsApp di index.html sebelum dipublikasikan.")}else{e.currentTarget.href=waUrl("Halo SukaRasa, saya ingin bertanya tentang produk.")}});
$("accountButton").addEventListener("click",()=>openModal("Pusat Informasi Pelanggan","Selamat datang di SukaRasa. Untuk saat ini, akun pelanggan belum menggunakan sistem login. Pemesanan dapat dimulai dari katalog dan dikonfirmasi melalui WhatsApp."));
$("wishlistButton").addEventListener("click",()=>{if(!favorites.size){openModal("Produk Favorit","Tekan ikon hati pada kartu produk untuk menyimpan favorit selama halaman ini terbuka.");return}category="Semua";showAll=true;renderProducts();$("produk").scrollIntoView({behavior:"smooth"});toast(`${favorites.size} produk tersimpan sebagai favorit.`)});
$("closeModal").addEventListener("click",closeModal);$("modalOk").addEventListener("click",closeModal);
$("newsletterForm").addEventListener("submit",e=>{e.preventDefault();$("newsletterNote").textContent="Terima kasih! Formulir contoh berhasil diperiksa. Belum ada email yang disimpan atau dikirim.";e.target.reset()});
$("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
