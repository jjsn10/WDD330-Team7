import { findProductById } from "./productData.mjs";
import { setLocalStorage, getLocalStorage } from "./utils.mjs";

let product = {};

export default async function productDetails(productId) {

   product = await findProductById(productId);

  // add listener to Add to Cart button
  //console.log("Line 20: ", document.getElementById("addToCart"));
  renderProductDetails();

  document.getElementById("addToCart").addEventListener("click", addToCart);

}

function addToCart(){
  let cartItems = getLocalStorage("so-cart") || [];

  if (!cartItems) {
    cartItems = [];
  }
  //console.log("Line 11: click on addToCart button");
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
}

function renderProductDetails() {
    document.getElementById("productName").textContent = product.Name;
    document.getElementById("productNameWithoutBrand").textContent = product.NameWithoutBrand;
    document.getElementById("productImage").src = product.Image;
    document.getElementById("productFinalPrice").textContent = `$${product.FinalPrice}`;
    document.getElementById("productColorName").textContent = product.Colors[0].ColorName;
    document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
    document.getElementById("addToCart").dataset.id = product.Id;
}