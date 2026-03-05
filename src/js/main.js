import { loadHeaderFooter } from "./utils.mjs";
import productList from "./productList.mjs";
import loadAlerts from "./alerts.mjs";

// Load header and footer
loadHeaderFooter();

// Load alerts from alerts.json
loadAlerts();

// Load product listing (example category: tents)
productList(".product-list", "tents");