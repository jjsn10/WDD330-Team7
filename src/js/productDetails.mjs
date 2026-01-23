import { findProductById } from "./productData.mjs";


export function productDetails(productId) {
  //const productId = getParam("product");
  const product = findProductById(productId);
  if (product) {
    document.getElementById("productName").textContent = product.Name;
    document.getElementById("productNameWithoutBrand").textContent = `${product.NameWithoutBrand}`;
    document.getElementById("productImage").src = product.Image;
    document.getElementById("productFinalPrice").textContent = `${product.FinalPrice}`;
    document.getElementById("productColorName").textContent = product.color;
    document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
  }
}