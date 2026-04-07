import { getParam, loadHeaderFooter } from "./utils.mjs";
import { findProductById } from "./externalServices.mjs";
import productList from "./productList.mjs";

const category = getParam("category");
//console.log("Line 5: category: ", category);
const query = getParam("q");

productList(".product-list", category, query);

loadHeaderFooter();

// Quick View
const quickViewModal = document.getElementById("quick-view-modal");

function closeQuickView() {
  quickViewModal.classList.remove("modal--visible");
}

document.getElementById("qv-modal-close").addEventListener("click", closeQuickView);
quickViewModal.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeQuickView();
});

document.querySelector(".products").addEventListener("click", async (e) => {
  const btn = e.target.closest(".quick-view-btn");
  if (!btn) return;

  const product = await findProductById(btn.dataset.id);

  const priceHTML = product.SuggestedRetailPrice > product.FinalPrice
    ? `<p class="product-card__price"><span class="original-price">$${product.SuggestedRetailPrice}</span> <span class="sale-price">$${product.FinalPrice}</span></p>`
    : `<p class="product-card__price">$${product.FinalPrice}</p>`;

  document.getElementById("qv-modal-content").innerHTML = `
    <img
      srcset="${product.Images.PrimaryMedium} 160w, ${product.Images.PrimaryLarge} 320w, ${product.Images.PrimaryExtraLarge} 600w"
      sizes="(max-width: 480px) 160px, 320px"
      src="${product.Images.PrimaryLarge}"
      alt="${product.Name}"
      class="qv-modal-image" />
    <h3 class="card__brand">${product.Brand.Name}</h3>
    <h2 id="qv-product-name">${product.Name}</h2>
    ${priceHTML}
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="qv-modal-description">${product.DescriptionHtmlSimple}</p>
    <a href="../product_pages/index.html?product=${product.Id}" class="modal-register-btn">View Full Details</a>
  `;

  quickViewModal.classList.add("modal--visible");
});
