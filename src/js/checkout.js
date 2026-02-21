import { loadHeaderFooter } from "./utils.mjs";
import checkoutProcess from "./checkoutProcess.mjs";

loadHeaderFooter();
checkoutProcess.init("so-cart", "#order-summary");

document.querySelector("#zip").addEventListener("blur", () => {
  checkoutProcess.calculateOrdertotal(checkoutProcess);
});

//checkoutProcess.calculateOrdertotal();