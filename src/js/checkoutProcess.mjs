import { alertMessage, getLocalStorage, qs } from "./utils.mjs";
import { checkout } from "./externalServices.mjs";

function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

function packageItems(items) {
// convert the list of products from localStorage to the simpler form required for the checkout process. Array.map would be perfect for this.
  return items.map(item => ({
    id: item.Id,
    price: item.FinalPrice,
    name: item.Name,
    quantity: 1,
  }));
}

const checkoutProcess = {
    key: "",
    outputSelector: "",
    list: [],
    itemTotal: 0,
    shipping: 0,
    tax: 0,
    orderTotal: 0,
    init: function (key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = getLocalStorage(key);
        this.calculateItemSummary();
    },
  calculateItemSummary: function() {
    // calculate and display the total amount of the items in the cart, and the number of items.
    const itemTotal = this.list.reduce((total, item) => {
      return total + item.FinalPrice;
    }, 0);
    this.itemTotal = itemTotal;
    const itemCount = this.list.length;
    const el = qs(`${this.outputSelector}` + " #num-items");
    const itemTotalEl = qs(`${this.outputSelector}` + " #item-subtotal");
    //console.log("Line 25: ", el);
    
    el.innerText = itemCount;
    itemTotalEl.innerText = `$${itemTotal.toFixed(2)}`;
    /*const htmlString = `<p>Item Subtotal(${itemCount}): $${this.itemTotal.toFixed(2)}</p>
              <p>Shipping: $0.00</p>
              <p>Tax: $0.00</p>
              <p>Order Total: $0.00</p>`;
    el.insertAdjacentHTML("afterbegin", htmlString);*/

    //console.log("Line 15: Subtotal Items: ", this.itemTotal);
    //console.log("Line 26: Item Count: ", itemCount);
    //console.log("Line 27 element: ", el);
  },
  calculateOrdertotal: function() {
    // calculate the shipping and tax amounts. Then use them to along with the cart total to figure out the order total
    this.shipping = 10 + (this.list.length - 1) * 2;
    this.tax = (this.itemTotal * 0.06).toFixed(2);;
    this.orderTotal = (this.itemTotal + parseFloat(this.shipping) + parseFloat(this.tax)).toFixed(2);
    //console.log("Line 37: Shipping: ", this.shipping);
    //console.log("Line 38: Tax: ", this.tax);
    //console.log("Line 39: Order Total: ", this.orderTotal);
    // display the totals.
    this.displayOrderTotals();
  },
  displayOrderTotals: function() {
    // once the totals are all calculated display them in the order summary page
    const elShipping = qs(`${this.outputSelector}` + " #shipping");
    const elTax = qs(`${this.outputSelector}` + " #tax");
    const elOrderTotal = qs(`${this.outputSelector}` + " #orderTotal");
    //console.log("Line 45: ", elShipping);
    //console.log("Line 45: ", elTax);
    //console.log("Line 45: ", elOrderTotal);
    elShipping.innerText = `$${this.shipping}`;
    elTax.innerText = `$${this.tax}`;
    elOrderTotal.innerText = `$${this.orderTotal}`;
  },
  checkout: async function(form) {
    // build the data object from the calculated fields, the items in the cart, and the information entered into the form
    const formData = formDataToJSON(form);
    formData.orderDate = new Date();
    formData.orderTotal = this.orderTotal;
    formData.shipping = this.shipping;
    formData.tax = this.tax;
    formData.items = packageItems(this.list);
    // call the checkout method in our externalServices module and send it our data object.
    try {
      await checkout(formData);
      localStorage.removeItem("so-cart");
      window.location.href = "/checkout/success.html";
    } catch (err) {
      const errorDetail =
        err?.message?.message ||
        err?.message?.error ||
        err?.message ||
        "Please check your information and try again.";
      const errorMessage =
        typeof errorDetail === "string"
          ? errorDetail
          : JSON.stringify(errorDetail);
      alertMessage(`Checkout failed: ${errorMessage}`);

      const errorEl = qs("#checkout-message");
      errorEl.textContent = `Error: ${errorMessage}`;
      errorEl.classList.add("checkout-error");
    }
  }
  
}
export default checkoutProcess;