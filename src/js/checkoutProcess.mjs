import { getLocalStorage } from "./utils.mjs";
import { checkout as submitCheckout } from "./externalServices.mjs";

function packageItems(items) {
  const groupedItems = {};

  items.forEach((item) => {
    const id = item.Id;
    if (!groupedItems[id]) {
      groupedItems[id] = {
        id,
        name: item.Name,
        price: Number(item.FinalPrice),
        quantity: 0,
      };
    }
    groupedItems[id].quantity += 1;
  });

  return Object.values(groupedItems);
}
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}
const checkoutProcess = {
  key: "",
  outputSelector: "",
  outputElement: null,
  list: [],
  itemTotal: 0,
  itemCount: 0,
  shipping: 0,
  tax: 0,
  orderTotal: 0,
  init: function (key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.outputElement = document.querySelector(outputSelector);
    this.list = getLocalStorage(key) || [];
    this.calculateItemSummary();
  },
  calculateItemSummary: function () {
    this.itemCount = this.list.length;
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + Number(item.FinalPrice || 0),
      0,
    );
    this.displayOrderTotals();
  },
  calculateOrdertotal: function () {
    this.tax = this.itemTotal * 0.06;
    this.shipping = this.itemCount > 0 ? 10 + (this.itemCount - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  },
  displayOrderTotals: function () {
    if (!this.outputElement) {
      return;
    }

    const subtotalEl = this.outputElement.querySelector("#summary-subtotal");
    const shippingEl = this.outputElement.querySelector("#summary-shipping");
    const taxEl = this.outputElement.querySelector("#summary-tax");
    const totalEl = this.outputElement.querySelector("#summary-total");

    if (subtotalEl) {
      subtotalEl.textContent = `$${this.itemTotal.toFixed(2)}`;
    }
    if (shippingEl) {
      shippingEl.textContent = `$${this.shipping.toFixed(2)}`;
    }
    if (taxEl) {
      taxEl.textContent = `$${this.tax.toFixed(2)}`;
    }
    if (totalEl) {
      totalEl.textContent = `$${this.orderTotal.toFixed(2)}`;
    }
  },
  checkout: async function (form) {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
    if (!this.orderTotal && this.itemTotal) {
      this.calculateOrdertotal();
    }

    const formData = formDataToJSON(form);
    const order = {
      orderDate: new Date().toISOString(),
      ...formData,
      items: packageItems(this.list),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    return submitCheckout(order);
  },
};

export default checkoutProcess;