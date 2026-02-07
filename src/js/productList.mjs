import { getData } from "./productData.mjs";
import { renderList,qs } from "./utils.mjs";

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
    //console.log("Line 18 selector: ", selector);
    //console.log("Line 19 category: ", category);
    //const el = document.getElementById(selector);
    const el = qs(selector);
    //console.log("Line 21 el: ", el);
    const products = await getData(category);
    renderList(productCardTemplate,products,el);
    //console.log("productList", getData());
    //console.log("productList", await getData());
}



