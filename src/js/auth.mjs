import { jwtDecode } from "jwt-decode";
import { loginRequest } from "./externalServices.mjs";
import { alertMessage, getLocalStorage, setLocalStorage } from "./utils.mjs";

const tokenKey = "so-token";

// Checks a JWT string for existence and expiration.
// Returns true if the token is present and not yet expired, false otherwise.
export function isTokenValid(token) {
  if (token) {
    const decoded = jwtDecode(token);
    const currentDate = new Date();
    // JWT exp is in seconds; currentDate.getTime() is in milliseconds
    if (decoded.exp * 1000 < currentDate.getTime()) {
      console.log("Token expired.");
      return false;
    } else {
      console.log("Valid token");
      return true;
    }
  } else return false;
}

// Sends credentials to the server. On success, stores the returned token
// in localStorage and redirects to the requested page (or home by default).
export async function login(creds, redirect = "/") {
  try {
    const token = await loginRequest(creds);
    setLocalStorage(tokenKey, token);
    window.location = redirect;
  } catch (err) {
    alertMessage(err.message.message);
  }
}

// Reads the stored token, validates it, and redirects to the login page
// (with the current path as a redirect param) if the token is missing or expired.
// Returns the token if it is valid.
export function checkLogin() {
  const token = getLocalStorage(tokenKey);
  if (!isTokenValid(token)) {
    localStorage.removeItem(tokenKey);
    const currentPath = window.location.pathname;
    window.location = `/login/index.html?redirect=${currentPath}`;
  }
  return token;
}
