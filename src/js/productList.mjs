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

export default async function productList(selector, category, query) {
  const el = qs(selector);
  let items;

  if (query) {
    const categories = ["tents", "sleeping-bags", "backpacks", "hammocks"];
    const results = await Promise.all(
      categories.map(cat => getProductsByCategory(cat))
    );
    const all = results.flat();
    const q = query.toLowerCase();
    items = all.filter(item =>
      item.Name?.toLowerCase().includes(q) ||
      item.Brand?.Name?.toLowerCase().includes(q) ||
      item.NameWithoutBrand?.toLowerCase().includes(q)
    );
    const heading = document.querySelector(".products h2");
    heading.textContent = `Results for "${query}"`;
  } else {
    items = await getProductsByCategory(category);
  }

  if (items.length === 0) {
    el.innerHTML = "<li>No products found.</li>";
  } else {
    renderList(productCardTemplate, items, el);
  }

  if (category) {
    setLocalStorage("so-category", category);
  }

  const breadcrumb = document.getElementById("breadcrumb");
  if (breadcrumb) {
    if (category) {
      breadcrumb.textContent = `${formatCategory(category)} -> (${items.length} items)`;
    } else if (query) {
      breadcrumb.textContent = `Search: "${query}" (${items.length} items)`;
    }
  }
}
  



