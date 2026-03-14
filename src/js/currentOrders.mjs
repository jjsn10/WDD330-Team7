import { getOrders } from "./externalServices.mjs";

export default async function currentOrders(selector, token) {
  try {
    const orders = await getOrders(token);
    console.log("Fetched orders: ", orders);
    const parent = document.querySelector(`${selector} tbody`);
    parent.innerHTML = orders.map(orderTemplate).join("");
  } catch (err) {
    console.log(err);
  }
}

function orderTemplate(order) {
  return `<tr><td>${order.id}</td>
  <td>${new Date(order.orderDate).toLocaleDateString("en-US")}</td>
  <td>${order.items?.length ?? 0}</td>
  <td>${order.orderTotal}</td></tr>`;
}