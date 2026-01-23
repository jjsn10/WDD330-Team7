import { findProductById } from "./productData.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

let product = {};

function addProductToCart(product) {
  let cartItems = getLocalStorage("so-cart") || [];

  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
}

function addToCart() {
  addProductToCart(product);
}

function renderProductDetails() {
  document.getElementById("productName").innerHTML = product.Brand.Name;
  document.getElementById("productNameWithoutBrand").innerHTML = product.NameWithoutBrand;
  document.getElementById("productImage").src = product.Image;
  document.getElementById("productImage").alt = product.Name;
  document.getElementById("productFinalPrice").innerHTML = `$${product.FinalPrice}`;
  document.getElementById("productColorName").innerHTML = product.Colors[0].ColorName;
  document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
  document.getElementById("addToCart").dataset.id = product.Id;
}

export default async function productDetails(productId) {
  product = await findProductById(productId);
  renderProductDetails();
  document.getElementById("addToCart").addEventListener("click", addToCart);
}