import { loadHeaderFooter } from "./utils.mjs";
import productList from "./productList.mjs";
import loadAlerts from "./alerts.mjs";

// Load header and footer
loadHeaderFooter();

// Load alerts from alerts.json
loadAlerts();

// Only run productList if the element exists
const list = document.querySelector(".product-list");

if (list) {
  productList(".product-list", "tents");
}
