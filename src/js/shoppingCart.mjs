import { getLocalStorage, renderList } from "./utils.mjs";

export default function renderCartContents() {
    const cartItems = getLocalStorage("so-cart") || [];
    const element = document.querySelector(".product-list");
    const cartFooter = document.querySelector("#cart-footer");
    const cartTotal = document.querySelector("#cart-total");

    element.innerHTML = "";

    if (!cartItems.length) {
      if (cartFooter) {
        cartFooter.classList.add("hide");
      }
      return;
    }

    renderList(cartItemTemplate, cartItems, element);

    const total = cartItems.reduce((sum, item) => sum + Number(item.FinalPrice || 0), 0);
    if (cartTotal) {
      cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    if (cartFooter) {
      cartFooter.classList.remove("hide");
    }
}
function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images?.PrimaryMedium || item.Images?.PrimaryLarge || item.Image || ''}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ''}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}
