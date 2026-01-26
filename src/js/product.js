import { getParam } from "./utils.mjs";
//import { findProductById } from "./productData.mjs";
import { productDetails } from "./productDetails.mjs";

/*function addProductToCart(product) {
  let cartItems = getLocalStorage("so-cart") || [];

  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
}*/
// add to cart button event handler
/*async function addToCartHandler(e) {
  const product = await findProductById(e.currentTarget.dataset.id);
  //console.log("Line 17: Adding to cart:", product);
  addProductToCart(product);
}*/

// add listener to Add to Cart button
/*document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);*/

const productId = getParam("product");
(async () => await productDetails(productId))();
//console.log(productId);
/*(async () => {
  const product = await productDetails(productId);
  console.log("Line 31: ",product);
})();*/
/*console.log("Line 29: ",productDetails(productId));
console.log(findProductById(productId));*/
