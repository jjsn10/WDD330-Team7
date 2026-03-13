import { findProductById } from "./externalServices.mjs";
import { alertMessage, setLocalStorage, getLocalStorage, updateCartCount } from "./utils.mjs";

let product = {};

export default async function productDetails(productId) {
  // load the product
  product = await findProductById(productId);

  renderProductDetails();

  // attach add-to-cart listener
  const addBtn = document.getElementById("addToCart");
  if (addBtn) {
    addBtn.addEventListener("click", addToCart);
  }
}

function addToCart() {
  // read current cart (key used in your project)
  let cartItems = getLocalStorage("so-cart") || [];

  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  // add selected product
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);

  // update header badge right away
  updateCartCount();

  alertMessage(`${product.Name} was added to your cart.`, false);
}

function renderProductDetails() {
  if (!product) return;

  const nameEl = document.getElementById("productName");
  if (nameEl) nameEl.textContent = product.Name;

  const nameNoBrandEl = document.getElementById("productNameWithoutBrand");
  if (nameNoBrandEl) nameNoBrandEl.textContent = product.NameWithoutBrand;

  const imageEl = document.getElementById("productImage");
  if (imageEl) imageEl.src = product.Images.PrimaryLarge;

  const priceEl = document.getElementById("productFinalPrice");
  if (priceEl) priceEl.textContent = `$${product.FinalPrice}`;

  const colorEl = document.getElementById("productColorName");
  if (colorEl && product.Colors && product.Colors[0]) {
    colorEl.textContent = product.Colors[0].ColorName;
  }

  const descEl = document.getElementById("productDescriptionHtmlSimple");
  if (descEl) descEl.innerHTML = product.DescriptionHtmlSimple || "";

  const addBtn = document.getElementById("addToCart");
  if (addBtn) addBtn.dataset.id = product.Id;
}

// optional discount rendering (if present in your original file)
if (typeof product !== "undefined") {
  // discount logic will run per product in renderProductDetails() if desired
}