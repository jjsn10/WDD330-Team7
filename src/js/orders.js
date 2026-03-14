import { loadHeaderFooter } from "./utils.mjs";
import { checkLogin } from "./auth.mjs";
import currentOrders from "./currentOrders.mjs";

loadHeaderFooter();

const token = checkLogin();
console.log("Token from checkLogin: ", token);
currentOrders("#current-orders", token);
