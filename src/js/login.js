import { loadHeaderFooter, getParam } from "./utils.mjs";
import { login } from "./auth.mjs";

loadHeaderFooter();

const redirect = getParam("redirect");

document.querySelector("#login-button").addEventListener("click", async (e) => {
  e.preventDefault();
  const creds = {
    email: document.querySelector("#email").value,
    password: document.querySelector("#password").value,
  };
  await login(creds, redirect);
});
