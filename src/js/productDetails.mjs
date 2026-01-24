import { findProductById } from "./productData.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs"; 

export async function productDetails(productId) {
  //const productId = getParam("product");
  let product = await findProductById(productId);
  
  // add listener to Add to Cart button
  document
    .getElementById("addToCart")
    .addEventListener("click", addToCartHandler);
  
  renderProductDetails(product);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await findProductById(e.currentTarget.dataset.id);
  addProductToCart(product);
}

function addProductToCart(product) {
  let cartItems = getLocalStorage("so-cart") || [];

  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
}

function renderProductDetails(product) {
  if (product) {
    document.getElementById("productName").textContent = product.Name;
    document.getElementById("productNameWithoutBrand").textContent = `${product.NameWithoutBrand}`;
    document.getElementById("productImage").src = product.Image;
    document.getElementById("productFinalPrice").textContent = `${product.FinalPrice}`;
    document.getElementById("productColorName").textContent = product.Colors.ColorName;
    document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
    document.getElementById('addToCart').dataset.id = product.Id;
  }
};