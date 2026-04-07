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

    const firstColor = product.Colors[0];
    document.getElementById("productColorName").textContent = firstColor.ColorName;
    renderColorSwatches(product.Colors);
    document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
    document.getElementById("addToCart").dataset.id = product.Id;
}

function renderColorSwatches(colors) {
    const container = document.getElementById("productColors");
    if (!container || colors.length <= 1) return;

    container.innerHTML = "";
    colors.forEach((color, index) => {
        const btn = document.createElement("button");
        btn.className = "color-swatch" + (index === 0 ? " color-swatch--selected" : "");
        btn.dataset.colorName = color.ColorName;
        btn.dataset.colorPreview = color.ColorPreviewImageSrc || "";
        btn.title = color.ColorName;
        btn.setAttribute("aria-label", color.ColorName);

        if (color.ColorChipImageSrc) {
            const img = document.createElement("img");
            img.src = color.ColorChipImageSrc;
            img.alt = color.ColorName;
            btn.appendChild(img);
        } else {
            btn.textContent = color.ColorName;
        }

        btn.addEventListener("click", () => selectColor(btn, color));
        container.appendChild(btn);
    });
}

function selectColor(btn, color) {
    document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("color-swatch--selected"));
    btn.classList.add("color-swatch--selected");
    document.getElementById("productColorName").textContent = color.ColorName;

    if (color.ColorPreviewImageSrc) {
        const img = document.getElementById("productImage");
        img.src = color.ColorPreviewImageSrc;
        img.srcset = "";
    }
    product.selectedColor = color;
}