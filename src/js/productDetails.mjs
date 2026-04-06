import { findProductById } from "./externalServices.mjs";
import { alertMessage, setLocalStorage, getLocalStorage, updateCartCount, animateCart } from "./utils.mjs";

let product = {};

export default async function productDetails(productId) {
   //console.log("Line 7: productId: ", productId); 
   product = await findProductById(productId);
   //console.log("Line 9: product details: ", product); 

  // add listener to Add to Cart button
  //console.log("Line 20: ", document.getElementById("addToCart"));
  renderProductDetails();

  document.getElementById("addToCart").addEventListener("click", addToCart);

}
function addToCart(){
  let cartItems = getLocalStorage("so-cart") || [];

  const existingItem = cartItems.find(item => item.Id === product.Id);
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }

  setLocalStorage("so-cart", cartItems);
  updateCartCount();
  animateCart();
  alertMessage(`${product.Name} was added to your cart.`, false);
}
function renderProductDetails() {
    document.getElementById("productName").textContent = product.Name;
    document.getElementById("productNameWithoutBrand").textContent = product.NameWithoutBrand;
    const img = document.getElementById("productImage");
    img.srcset = `${product.Images.PrimarySmall} 80w, ${product.Images.PrimaryMedium} 160w, ${product.Images.PrimaryLarge} 320w, ${product.Images.PrimaryExtraLarge} 600w`;
    img.sizes = "(max-width: 480px) 80px, (max-width: 768px) 320px, 600px";
    img.src = product.Images.PrimaryLarge;
    img.alt = product.Name;

    const priceEl = document.getElementById("productFinalPrice");
    if (product.SuggestedRetailPrice && product.SuggestedRetailPrice > product.FinalPrice) {
        const percent = Math.round(
          ((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100
        );
        const savings = (product.SuggestedRetailPrice - product.FinalPrice).toFixed(2);
        priceEl.innerHTML = `<span class="original-price">$${product.SuggestedRetailPrice}</span> <span class="sale-price">$${product.FinalPrice}</span>`;
        const badge = document.createElement("span");
        badge.className = "product-detail__discount-badge";
        badge.textContent = `${percent}% OFF — Save $${savings}`;
        priceEl.insertAdjacentElement("afterend", badge);
    } else {
        priceEl.textContent = `$${product.FinalPrice}`;
    }

    document.getElementById("productColorName").textContent = product.Colors[0].ColorName;
    document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
    document.getElementById("addToCart").dataset.id = product.Id;
}