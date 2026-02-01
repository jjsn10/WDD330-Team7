import { getData } from "./productData.mjs";
import { renderList } from "./utils.mjs";

function productCardTemplate(product) {
    return `
    <li class="product-card">
        <a href="product_pages/index.html?product=${product.Id}">
        <img src="${product.Image}" alt="Image of ${product.Name}"
        />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.Name}</h2>
        <p class="product-card__price">Price: $${product.FinalPrice}</a></p>
    </li>
    `;
}

export default async function productList(selector, category) {
    //console.log("selector: ", selector);
    //console.log("category: ", category);
    const el = document.getElementById(selector);
    const products = await getData(category);
    renderList(productCardTemplate,products,el);
    //console.log("productList", getData());
    //console.log("productList", await getData());
}



