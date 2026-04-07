import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";
import { jwtDecode } from "jwt-decode";

const WISHLIST_KEY = "so-wishlist";

function getCurrentUserId() {
  const token = getLocalStorage("so_token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) return null;
    return decoded.sub || decoded.id || decoded.email || null;
  } catch {
    return null;
  }
}

function getWishlistKey() {
  const userId = getCurrentUserId();
  return userId ? `${WISHLIST_KEY}-${userId}` : WISHLIST_KEY;
}

export function getWishlist() {
  return getLocalStorage(getWishlistKey()) || [];
}

function saveWishlist(items) {
  setLocalStorage(getWishlistKey(), items);
}

export function isInWishlist(productId) {
  return getWishlist().some((item) => item.Id === productId);
}

export function addToWishlist(product) {
  const items = getWishlist();
  if (!items.some((item) => item.Id === product.Id)) {
    items.push({ ...product });
    saveWishlist(items);
  }
}

export function removeFromWishlist(productId) {
  const items = getWishlist().filter((item) => item.Id !== productId);
  saveWishlist(items);
}

export function toggleWishlist(product) {
  if (isInWishlist(product.Id)) {
    removeFromWishlist(product.Id);
    return false;
  } else {
    addToWishlist(product);
    return true;
  }
}

export function moveToCart(productId) {
  const items = getWishlist();
  const item = items.find((i) => i.Id === productId);
  if (!item) return;

  let cartItems = getLocalStorage("so-cart") || [];
  const existing = cartItems.find((c) => c.Id === productId);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cartItems.push({ ...item, quantity: 1 });
  }
  setLocalStorage("so-cart", cartItems);
  removeFromWishlist(productId);
}

export function updateWishlistButton(btn, productId) {
  const saved = isInWishlist(productId);
  btn.classList.toggle("wishlist-btn--saved", saved);
  btn.setAttribute("aria-pressed", String(saved));
  btn.textContent = saved ? "♥ Saved to Wish List" : "♡ Add to Wish List";
}

export function renderWishlistContents() {
  const element = document.querySelector(".wishlist-list");
  if (!element) return;

  const items = getWishlist();

  if (items.length === 0) {
    element.innerHTML = "<li class='wishlist-empty'>Your wish list is empty.</li>";
    return;
  }

  element.innerHTML = items.map((item) => wishlistItemTemplate(item)).join("");

  element.onclick = (event) => {
    const removeBtn = event.target.closest(".wishlist-card__remove");
    const moveBtn = event.target.closest(".wishlist-card__move-to-cart");

    if (removeBtn) {
      removeFromWishlist(removeBtn.dataset.id);
      renderWishlistContents();
      alertMessage("Item removed from wish list.", false);
    }

    if (moveBtn) {
      const productName = moveBtn.dataset.name;
      moveToCart(moveBtn.dataset.id);
      renderWishlistContents();
      updateCartCountFromWishlist();
      alertMessage(`${productName} moved to your cart.`, false);
    }
  };
}

function updateCartCountFromWishlist() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    cartCount.textContent = cartItems.length;
  }
}

function wishlistItemTemplate(item) {
  return `<li class="wishlist-card divider">
  <a href="/product_pages/index.html?product=${item.Id}" class="wishlist-card__image">
    <img src="${item.Images.PrimaryMedium}" alt="${item.Name}" />
  </a>
  <a href="/product_pages/index.html?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="wishlist-card__color">${item.Colors[0].ColorName}</p>
  <p class="wishlist-card__price">$${item.FinalPrice}</p>
  <div class="wishlist-card__actions">
    <button class="wishlist-card__move-to-cart" data-id="${item.Id}" data-name="${item.Name}" type="button">Move to Cart</button>
    <button class="wishlist-card__remove" data-id="${item.Id}" type="button">Remove</button>
  </div>
</li>`;
}
