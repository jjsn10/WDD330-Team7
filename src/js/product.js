// product.js (or any page entry)
import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import productDetails from "./productDetails.mjs"; // keep your imports as needed

(async function init() {
  await loadHeaderFooter();

  // update badge now that header is in DOM
  updateCartCount();

  // your other init code...
  const productId = (new URLSearchParams(window.location.search)).get("product");
  if (productId) {
    await productDetails(productId);
  }
})();