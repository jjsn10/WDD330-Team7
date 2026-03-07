import { loadHeaderFooter } from "./utils.mjs";
import { checkLogin } from "./auth.mjs";
import currentOrders from "./currentOrders.mjs";

loadHeaderFooter();
const token = checkLogin();

currentOrders.init("#orders-list", token);
