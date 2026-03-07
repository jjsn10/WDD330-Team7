import { getOrders } from "./externalServices.mjs";
import { renderList } from "./utils.mjs";

function orderCardTemplate(order) {
  const date = new Date(order.orderDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const itemRows = order.items
    ? order.items
        .map(
          (item) => `
        <tr>
          <td>${item.name}</td>
          <td class="order-card__qty">x${item.quantity ?? 1}</td>
          <td class="order-card__price">$${Number(item.price).toFixed(2)}</td>
        </tr>`
        )
        .join("")
    : `<tr><td colspan="3">No items</td></tr>`;

  return `
  <li class="order-card">
    <div class="order-card__header">
      <span class="order-card__id">Order #${order.id}</span>
      <span class="order-card__date">${date}</span>
    </div>
    <div class="order-card__body">
      <div class="order-card__customer">
        <h3>${order.fname} ${order.lname}</h3>
        <address>
          ${order.street}<br>
          ${order.city}, ${order.state} ${order.zip}
        </address>
      </div>
      <div class="order-card__items">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
      </div>
    </div>
    <div class="order-card__footer">
      <span>Shipping: $${Number(order.shipping).toFixed(2)}</span>
      <span>Tax: $${Number(order.tax).toFixed(2)}</span>
      <strong>Total: $${Number(order.orderTotal).toFixed(2)}</strong>
    </div>
  </li>`;
}

const currentOrders = {
  outputSelector: "",
  init: async function (outputSelector, token) {
    this.outputSelector = outputSelector;
    const orders = await getOrders(token);
    const el = document.querySelector(this.outputSelector);
    if (orders && orders.length) {
      renderList(orderCardTemplate, orders, el);
    } else {
      el.innerHTML = "<li class='order-card__empty'>No current orders found.</li>";
    }
  },
};

export default currentOrders;

