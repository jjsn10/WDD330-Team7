import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs";
import { findProductById } from "./productData.mjs";
import { productDetails } from "./productDetails.mjs";

  const productId = getParam("product");
  
  async function init() {
  await productDetails(productId);
  console.log(await findProductById(productId));
}

init();
