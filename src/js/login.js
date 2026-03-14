import { loadHeaderFooter, getParam } from "./utils.mjs";
import { login } from "./auth.mjs";

loadHeaderFooter();

const redirect = getParam("redirect");

document.querySelector("#loginButton").addEventListener("click", async (e) => {
  e.preventDefault(); // Prevent form submission and page reload

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  console.log(
    "Login button clicked with email: ",
    email,
    " and redirect: ",
    redirect,
  );
  try {
    await login({ email, password }, redirect);
  } catch (error) {
    console.error("Login failed: ", error);
  }
});
