import { findProductById } from "./externalServices.mjs";
import { alertMessage, setLocalStorage, getLocalStorage } from "./utils.mjs";

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

  if (!cartItems) {
    cartItems = [];
  }
  //console.log("Line 11: click on addToCart button");
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
  alertMessage(`${product.Name} was added to your cart.`, false);
}

function renderProductDetails() {
    document.getElementById("productName").textContent = product.Name;
    document.getElementById("productNameWithoutBrand").textContent = product.NameWithoutBrand;
    document.getElementById("productImage").src = product.Images.PrimaryLarge;
    document.getElementById("productFinalPrice").textContent = `$${product.FinalPrice}`;
    document.getElementById("productColorName").textContent = product.Colors[0].ColorName;
    document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
    document.getElementById("addToCart").dataset.id = product.Id;
}

if (product.SuggestedRetailPrice && product.SuggestedRetailPrice > product.FinalPrice) {

  const discount = product.SuggestedRetailPrice - product.FinalPrice;

  const percent = Math.round(
    (discount / product.SuggestedRetailPrice) * 100
  );

  const discountElement = document.createElement("p");
  discountElement.className = "product-card__discount";
  discountElement.textContent = `${percent}% OFF`;

  document
    .getElementById("productFinalPrice")
    .insertAdjacentElement("afterend", discountElement);
}