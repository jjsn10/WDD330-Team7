import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

export default function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const element = document.querySelector(".product-list"); // where list should render
  const cartActions = document.querySelector(".cart-actions");

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    if (element) element.innerHTML = "<li>Your cart is empty.</li>";
    if (cartActions) {
      cartActions.style.display = "none";
    }
    return;
  }

  if (cartActions) {
    cartActions.style.display = "block";
  }

  if (element) {
    element.innerHTML = cartItems.map((item, index) => cartItemTemplate(item, index)).join("");
  }

  // handle remove clicks using event delegation
  if (element) {
    element.onclick = (event) => {
      const removeButton = event.target.closest(".remove-from-cart");
      if (!removeButton) {
        return;
      }

      const indexToRemove = Number(removeButton.dataset.index);
      if (Number.isNaN(indexToRemove)) {
        return;
      }

      const updatedCart = [...cartItems];
      updatedCart.splice(indexToRemove, 1);
      setLocalStorage("so-cart", updatedCart);

      // update header badge now that cart changed
      updateCartCount();

      // re-render cart contents
      renderCartContents();
    };
  }
}

function cartItemTemplate(item, index) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="cart-card__remove remove-from-cart" data-index="${index}" type="button">Remove</button>
</li>`;

  return newItem;
}