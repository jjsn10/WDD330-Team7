import { getParam, loadHeaderFooter } from "./utils.mjs";
import productList from "./productList.mjs";

const category = getParam("category");
//console.log("Line 5: category: ", category);
const query = getParam("q");

productList(".product-list", category, query);

loadHeaderFooter();
