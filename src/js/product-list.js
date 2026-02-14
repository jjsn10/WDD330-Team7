import { getParam, loadHeaderFooter } from "./utils.mjs";
import productList from "./productList.mjs";

const category = getParam("category");
//console.log("Line 5: category: ", category);

productList(".product-list", category);

loadHeaderFooter();
