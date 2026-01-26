import { findProductById } from "./productData.mjs";
import { setLocalStorage, getLocalStorage } from "./utils.mjs";


function addToCart(product){
  let cartItems = getLocalStorage("so-cart") || [];

  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
}

export async function productDetails(productId) {

  const product = await findProductById(productId);

  // add listener to Add to Cart button
  document
    .getElementById("addToCart")
    .addEventListener("click", addToCart(product));

  if (product) {
    document.getElementById("productName").textContent = product.Name;
    document.getElementById("productNameWithoutBrand").textContent = product.NameWithoutBrand;
    document.getElementById("productImage").src = product.Image;
    document.getElementById("productFinalPrice").textContent = `$${product.FinalPrice}`;
    document.getElementById("productColorName").textContent = product.Colors[0].ColorName;
    document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;

    const addBtn = document.getElementById("addToCart");
    if (addBtn) addBtn.dataset.id = product.Id;

  }
  return product;
}