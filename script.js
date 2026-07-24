/* ==========================================================================
   LAS MANOS EN LA MASA — script.js
   Estructura:
   1. Datos (productos y galería)
   2. Utilidades
   3. Loader
   4. Navbar (scroll + menú mobile)
   5. Render de productos
   6. Render de galería + Lightbox
   7. Carrito (estado, render, persistencia en LocalStorage)
   8. Pedido por WhatsApp
   9. Animaciones al hacer scroll (Intersection Observer)
   10. Botón volver arriba
   ========================================================================== */

(function () {
  "use strict";

  const WHATSAPP_NUMBER = "59894973188"; // Número real del negocio

  /* ------------------------------------------------------------------
     1. DATOS — Editá acá el menú y las fotos de la galería.
     Los precios son un ejemplo y deben reemplazarse por los reales.
     ------------------------------------------------------------------ */
  const PRODUCTS = [
    {
      id: "ravioles-ricota",
      name: "Ravioles de ricota y verdura",
      description: "Masa fina rellena de ricota cremosa y espinaca fresca.",
      price: 320,
      icon: "ravioli"
    },
    {
      id: "sorrentinos-jyq",
      name: "Sorrentinos de jamón y queso",
      description: "Clásicos y generosos, ideales con salsa fileto o crema.",
      price: 340,
      icon: "sorrentino"
    },
    {
      id: "sorrentinos-calabaza",
      name: "Sorrentinos de calabaza y nuez",
      description: "Un toque dulce y otoñal con nuez tostada.",
      price: 350,
      icon: "sorrentino"
    },
    {
      id: "noquis-papa",
      name: "Ñoquis de papa",
      description: "Suaves y livianos, la receta de siempre.",
      price: 260,
      icon: "noquis"
    },
    {
      id: "tallarines",
      name: "Tallarines caseros",
      description: "Cortados a mano, textura perfecta para cualquier salsa.",
      price: 280,
      icon: "tallarines"
    },
    {
      id: "canelones-verdura",
      name: "Canelones de verdura",
      description: "Relleno abundante de acelga, listos para hornear.",
      price: 330,
      icon: "canelones"
    }
  ];

  const GALLERY = [
    { id: "g1", caption: "Armando los ravioles", icon: "ravioli" },
    { id: "g2", caption: "Estirando la masa", icon: "masa" },
    { id: "g3", caption: "Relleno fresco del día", icon: "relleno" },
    { id: "g4", caption: "Sorrentinos recién cortados", icon: "sorrentino" },
    { id: "g5", caption: "Ñoquis uno a uno", icon: "noquis" },
    { id: "g6", caption: "Listos para congelar", icon: "cajas" },
    { id: "g7", caption: "Harina y manos a la obra", icon: "manos" },
    { id: "g8", caption: "El obrador de Punta del Diablo", icon: "obrador" }
  ];

  /* Ilustraciones SVG reutilizables por tipo de pasta (paleta de marca) */
  const ICONS = {
    ravioli: `<svg viewBox="0 0 120 120"><rect x="20" y="20" width="80" height="80" rx="14" fill="none" stroke="var(--color-ink)" stroke-width="4"/><circle cx="60" cy="60" r="10" fill="var(--color-ink)"/><path d="M20 20 20 100M100 20 100 100M20 20 100 20M20 100 100 100" stroke="var(--color-ink)" stroke-width="0"/></svg>`,
    sorrentino: `<svg viewBox="0 0 120 120"><path d="M60 22 C90 22 100 50 100 60 C100 90 78 100 60 100 C42 100 20 90 20 60 C20 50 30 22 60 22Z" fill="none" stroke="var(--color-ink)" stroke-width="4"/><circle cx="60" cy="62" r="8" fill="var(--color-ink)"/></svg>`,
    noquis: `<svg viewBox="0 0 120 120"><ellipse cx="40" cy="50" rx="16" ry="12" fill="none" stroke="var(--color-ink)" stroke-width="4"/><ellipse cx="72" cy="42" rx="16" ry="12" fill="none" stroke="var(--color-ink)" stroke-width="4"/><ellipse cx="55" cy="76" rx="16" ry="12" fill="none" stroke="var(--color-ink)" stroke-width="4"/><ellipse cx="88" cy="74" rx="14" ry="11" fill="none" stroke="var(--color-ink)" stroke-width="4"/></svg>`,
    tallarines: `<svg viewBox="0 0 120 120"><path d="M20 30 C40 30 30 55 50 55 S60 30 80 30" fill="none" stroke="var(--color-ink)" stroke-width="4" stroke-linecap="round"/><path d="M20 55 C40 55 30 80 50 80 S60 55 80 55" fill="none" stroke="var(--color-ink)" stroke-width="4" stroke-linecap="round"/><path d="M20 80 C40 80 30 100 50 100 S60 80 80 80" fill="none" stroke="var(--color-ink)" stroke-width="4" stroke-linecap="round"/></svg>`,
    canelones: `<svg viewBox="0 0 120 120"><rect x="25" y="35" width="70" height="20" rx="10" fill="none" stroke="var(--color-ink)" stroke-width="4"/><rect x="25" y="65" width="70" height="20" rx="10" fill="none" stroke="var(--color-ink)" stroke-width="4"/></svg>`,
    masa: `<svg viewBox="0 0 120 120"><ellipse cx="60" cy="60" rx="42" ry="28" fill="none" stroke="var(--color-ink)" stroke-width="4"/><path d="M30 60h60M40 46h40M40 74h40" stroke="var(--color-ink)" stroke-width="3" stroke-linecap="round"/></svg>`,
    relleno: `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="34" fill="none" stroke="var(--color-ink)" stroke-width="4"/><path d="M45 55c4-8 12-8 15 0m0 0c3-8 11-8 15 0" fill="none" stroke="var(--color-ink)" stroke-width="3" stroke-linecap="round"/></svg>`,
    cajas: `<svg viewBox="0 0 120 120"><rect x="24" y="40" width="72" height="52" rx="6" fill="none" stroke="var(--color-ink)" stroke-width="4"/><path d="M24 58h72M60 40v52" stroke="var(--color-ink)" stroke-width="3"/></svg>`,
    manos: `<svg viewBox="0 0 120 120"><path d="M30 80 C40 60 60 60 70 80" fill="none" stroke="var(--color-ink)" stroke-width="4" stroke-linecap="round"/><path d="M50 80 C60 60 80 60 90 80" fill="none" stroke="var(--color-ink)" stroke-width="4" stroke-linecap="round"/></svg>`,
    obrador: `<svg viewBox="0 0 120 120"><rect x="24" y="30" width="72" height="60" rx="10" fill="none" stroke="var(--color-ink)" stroke-width="4"/><path d="M24 55h72" stroke="var(--color-ink)" stroke-width="3"/></svg>`
  };

  /* ------------------------------------------------------------------
     2. UTILIDADES
     ------------------------------------------------------------------ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function formatPrice(value) {
    return "$" + value.toLocaleString("es-UY");
  }

  /* ------------------------------------------------------------------
     3. LOADER — se oculta cuando la página termina de cargar
     ------------------------------------------------------------------ */
  window.addEventListener("load", () => {
    const loader = $("#loader");
    setTimeout(() => loader.classList.add("is-hidden"), 350);
  });

  /* ------------------------------------------------------------------
     4. NAVBAR — fondo al hacer scroll + menú mobile
     ------------------------------------------------------------------ */
  const navbar = $("#navbar");
  function onScroll() {
    if (window.scrollY > 40) navbar.classList.add("is-scrolled");
    else navbar.classList.remove("is-scrolled");

    // Botón volver arriba
    const backToTop = $("#backToTop");
    if (window.scrollY > 700) backToTop.classList.add("is-visible");
    else backToTop.classList.remove("is-visible");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burgerBtn = $("#burgerBtn");
  const mobileMenu = $("#mobileMenu");
  burgerBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    burgerBtn.setAttribute("aria-expanded", String(isOpen));
    burgerBtn.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });
  $$("#mobileMenu a").forEach((link) =>
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      burgerBtn.setAttribute("aria-expanded", "false");
    })
  );

  /* ------------------------------------------------------------------
     5. RENDER DE PRODUCTOS
     ------------------------------------------------------------------ */
  const productGrid = $("#productGrid");

  function renderProducts() {
    productGrid.innerHTML = PRODUCTS.map((p) => `
      <article class="product-card reveal" data-id="${p.id}">
        <div class="product-card__media">${ICONS[p.icon]}</div>
        <div class="product-card__body">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div class="product-card__footer">
            <span class="product-card__price">${formatPrice(p.price)}</span>
            <div class="qty">
              <button type="button" class="qty__minus" aria-label="Restar unidad de ${p.name}">−</button>
              <span class="qty__value" data-qty="${p.id}">1</span>
              <button type="button" class="qty__plus" aria-label="Sumar unidad de ${p.name}">+</button>
            </div>
          </div>
          <button type="button" class="product-card__add" data-add="${p.id}">
            <span>Agregar al carrito</span>
          </button>
        </div>
      </article>
    `).join("");

    // Listeners de cantidad y agregado
    $$(".product-card", productGrid).forEach((card) => {
      const id = card.dataset.id;
      let qty = 1;
      const qtyLabel = $(".qty__value", card);
      const minus = $(".qty__minus", card);
      const plus = $(".qty__plus", card);
      const addBtn = $(".product-card__add", card);

      minus.addEventListener("click", () => {
        qty = Math.max(1, qty - 1);
        qtyLabel.textContent = qty;
      });
      plus.addEventListener("click", () => {
        qty = Math.min(20, qty + 1);
        qtyLabel.textContent = qty;
      });
      addBtn.addEventListener("click", () => {
        addToCart(id, qty);
        card.classList.add("is-bumped");
        addBtn.classList.add("is-added");
        setTimeout(() => card.classList.remove("is-bumped"), 350);
        setTimeout(() => addBtn.classList.remove("is-added"), 1100);
        showToast(`${qty} × ${PRODUCTS.find((p) => p.id === id).name} agregado`);
        qty = 1;
        qtyLabel.textContent = qty;
      });
    });

    observeReveals();
  }

  /* ------------------------------------------------------------------
     6. RENDER DE GALERÍA + LIGHTBOX
     ------------------------------------------------------------------ */
  const galleryGrid = $("#galleryGrid");

  function renderGallery() {
    galleryGrid.innerHTML = GALLERY.map((g, i) => `
      <button type="button" class="gallery__item reveal" data-index="${i}" aria-label="Ampliar: ${g.caption}">
        ${ICONS[g.icon]}
        <span class="gallery__caption">${g.caption}</span>
      </button>
    `).join("");

    $$(".gallery__item", galleryGrid).forEach((item) =>
      item.addEventListener("click", () => openLightbox(Number(item.dataset.index)))
    );

    observeReveals();
  }

  const lightbox = $("#lightbox");
  const lightboxStage = $("#lightboxStage");
  let currentImageIndex = 0;

  function openLightbox(index) {
    currentImageIndex = index;
    renderLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  function renderLightbox() {
    const item = GALLERY[currentImageIndex];
    lightboxStage.innerHTML = ICONS[item.icon];
  }
  $("#lightboxClose").addEventListener("click", closeLightbox);
  $("#lightboxPrev").addEventListener("click", () => {
    currentImageIndex = (currentImageIndex - 1 + GALLERY.length) % GALLERY.length;
    renderLightbox();
  });
  $("#lightboxNext").addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % GALLERY.length;
    renderLightbox();
  });
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") $("#lightboxPrev").click();
    if (e.key === "ArrowRight") $("#lightboxNext").click();
  });

  /* ------------------------------------------------------------------
     7. CARRITO — estado en memoria + persistencia en LocalStorage
     ------------------------------------------------------------------ */
  const CART_KEY = "lmelm_cart"; // Las Manos En La Masa
  let cart = loadCart();

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }
  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      /* almacenamiento no disponible: el carrito sigue funcionando en memoria */
    }
  }

  function addToCart(productId, qty) {
    cart[productId] = (cart[productId] || 0) + qty;
    saveCart();
    renderCart();
  }
  function removeFromCart(productId) {
    delete cart[productId];
    saveCart();
    renderCart();
  }

  const cartBar = $("#cartBar");
  const cartPanel = $("#cartPanel");
  const cartItemsEl = $("#cartItems");
  const cartEmptyEl = $("#cartEmpty");
  const cartCountEl = $("#cartCount");
  const cartTotalEl = $("#cartTotal");
  const cartFooterTotalEl = $("#cartFooterTotal");

  function renderCart() {
    const entries = Object.entries(cart);
    const totalItems = entries.reduce((sum, [, qty]) => sum + qty, 0);
    const totalPrice = entries.reduce((sum, [id, qty]) => {
      const product = PRODUCTS.find((p) => p.id === id);
      return sum + (product ? product.price * qty : 0);
    }, 0);

    cartCountEl.textContent = totalItems;
    cartTotalEl.textContent = formatPrice(totalPrice);
    cartFooterTotalEl.textContent = formatPrice(totalPrice);

    if (entries.length === 0) {
      cartItemsEl.innerHTML = "";
      cartEmptyEl.style.display = "block";
      return;
    }
    cartEmptyEl.style.display = "none";

    cartItemsEl.innerHTML = entries.map(([id, qty]) => {
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) return "";
      return `
        <li class="cart__item">
          <span class="cart__item-name">${product.name}<span class="cart__item-sub"> · ${qty} × ${formatPrice(product.price)}</span></span>
          <button type="button" class="cart__item-remove" data-remove="${id}" aria-label="Quitar ${product.name} del carrito">&times;</button>
        </li>
      `;
    }).join("");

    $$("[data-remove]", cartItemsEl).forEach((btn) =>
      btn.addEventListener("click", () => removeFromCart(btn.dataset.remove))
    );
  }

  cartBar.addEventListener("click", () => {
    const isOpen = cartPanel.classList.toggle("is-open");
    cartBar.setAttribute("aria-expanded", String(isOpen));
  });
  $("#cartClose").addEventListener("click", () => {
    cartPanel.classList.remove("is-open");
    cartBar.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("click", (e) => {
    if (!$(".cart").contains(e.target)) cartPanel.classList.remove("is-open");
  });

  /* ------------------------------------------------------------------
     8. PEDIDO POR WHATSAPP — arma el mensaje y abre WhatsApp
     ------------------------------------------------------------------ */
  $("#checkoutBtn").addEventListener("click", () => {
    const entries = Object.entries(cart);
    if (entries.length === 0) {
      showToast("Agregá al menos un producto para hacer el pedido");
      return;
    }

    let total = 0;
    const lineItems = entries.map(([id, qty]) => {
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) return "";
      total += product.price * qty;
      return `• ${qty} ${product.name}`;
    }).filter(Boolean);

    const message = [
      "Hola! Quisiera realizar el siguiente pedido:",
      "",
      ...lineItems,
      "",
      `Total: ${formatPrice(total)}`,
      "",
      "Muchas gracias."
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  });

  /* ------------------------------------------------------------------
     9. TOAST de confirmación
     ------------------------------------------------------------------ */
  let toastTimer = null;
  function showToast(text) {
    const toast = $("#toast");
    toast.textContent = text;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  /* ------------------------------------------------------------------
     10. ANIMACIONES AL HACER SCROLL — Intersection Observer
     ------------------------------------------------------------------ */
  let revealObserver = null;
  function observeReveals() {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
    }
    $$(".reveal:not(.is-visible)").forEach((el) => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------
     11. BOTÓN VOLVER ARRIBA
     ------------------------------------------------------------------ */
  $("#backToTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ------------------------------------------------------------------
     INIT
     ------------------------------------------------------------------ */
  $("#year").textContent = new Date().getFullYear();
  renderProducts();
  renderGallery();
  renderCart();
  observeReveals();
})();
