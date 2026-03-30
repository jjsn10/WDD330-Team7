import { getProductsByCategory } from "./externalServices.mjs";
import { renderList, qs, setLocalStorage, formatCategory } from "./utils.mjs";

function productCardTemplate(product) {

  let discountBadge = "";
  let priceHTML = `<p class="product-card__price">Price: $${product.FinalPrice}</p>`;

  // Check if the product is discounted
  if (product.SuggestedRetailPrice > product.FinalPrice) {

    const discountPercent = Math.round(
      ((product.SuggestedRetailPrice - product.FinalPrice) /
      product.SuggestedRetailPrice) * 100
    );

    discountBadge = `<span class="discount-badge">${discountPercent}% OFF</span>`;

    priceHTML = `
      <p class="product-card__price">
        <span class="original-price">$${product.SuggestedRetailPrice}</span>
        <span class="sale-price">$${product.FinalPrice}</span>
      </p>
    `;
  }

  return `
    <li class="product-card">
      ${discountBadge}
      <a href="../product_pages/index.html?product=${product.Id}">
        <img
          srcset="${product.Images.PrimarySmall} 80w, ${product.Images.PrimaryMedium} 160w, ${product.Images.PrimaryLarge} 320w"
          sizes="(max-width: 480px) 160px, 320px"
          src="${product.Images.PrimaryLarge}"
          alt="Image of ${product.Name}" />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.Name}</h2>
        ${priceHTML}
      </a>
      <button class="quick-view-btn" data-id="${product.Id}">Quick View</button>
    </li>
  `;
}

export default async function productList(selector, category) {
  const el = qs(selector);
  const products = await getProductsByCategory(category);
  renderList(productCardTemplate, products, el);

  setLocalStorage("so-category", category);

  const breadcrumb = document.getElementById("breadcrumb");
  if (breadcrumb && category) {
    breadcrumb.textContent = `${formatCategory(category)} -> (${products.length} items)`;
  }
}


