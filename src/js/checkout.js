import { loadHeaderFooter } from "./utils.mjs";
import checkoutProcess from "./checkoutProcess.mjs";

loadHeaderFooter();
checkoutProcess.init("so-cart", "#order-summary");

document.querySelector("#zip").addEventListener("blur", () => {
  checkoutProcess.calculateOrdertotal(checkoutProcess);
});

//checkoutProcess.calculateOrdertotal();
document.forms["checkout-form"].addEventListener("submit", (e) => {
  e.preventDefault();

  //add validation here
  const form = e.target;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  // e.target would contain our form in this case
  checkoutProcess.checkout(e.target);
});
