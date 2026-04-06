// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function alertMessage(message, scroll = true) {
  const main = document.querySelector("main");
  if (!main) return;

  const existingAlert = main.querySelector(".alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  const alert = document.createElement("div");
  alert.classList.add("alert");

  const text = document.createElement("p");
  text.textContent = message;

  const close = document.createElement("span");
  close.classList.add("close-alert");
  close.setAttribute("aria-label", "Close alert");
  close.textContent = "X";

  alert.append(text, close);

  alert.addEventListener("click", function (e) {
    if (e.target.classList.contains("close-alert")) {
      main.removeChild(this);
    }
  });

  main.prepend(alert);

  if (scroll) {
    window.scrollTo(0, 0);
  }
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });

  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function formatCategory(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function renderList(fn, products, el) {
  el.insertAdjacentHTML("afterbegin", products.map(fn).join(""));
}

async function loadTemplate(path) {
  const res = await fetch(path);

  if (res.ok) {
    const html = await res.text();
    return html;
  }
}

export function renderWithTemplate(
  templateFn,
  parentElement,
  data,
  callback,
  position = "afterbegin",
  clear = true
) {
  if (clear) {
    parentElement.innerHTML = "";
  }

  parentElement.insertAdjacentHTML(position, templateFn);

  if (callback) {
    callback(data);
  }
}

export async function loadHeaderFooter() {
  const headerTemplateFn = await loadTemplate("/partials/header.html");
  const footerTemplateFn = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplateFn, headerElement);
  renderWithTemplate(footerTemplateFn, footerElement);

  /* ---------------- Product Search ---------------- */
  document.querySelector('.prod-search').addEventListener("submit", (e) => {
    e.preventDefault();
    const query = document.querySelector("#search").value.trim();

    if (query) {
      window.location.href = `/product-list/index.html?q=${encodeURIComponent(query)}`;
    }
  });

  updateCartCount();
}

/* ---------------- CART COUNT FEATURE ---------------- */

export function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
  const cartCount = document.querySelector(".cart-count");

  if (cartCount) {
    cartCount.textContent = cartItems.length;
  }
}

/* ---------------- CART ANIMATION FEATURE ---------------- */

export function animateCart() {
  const cart = document.querySelector(".cart");
  if (!cart) return;

  cart.classList.add("animate");

  setTimeout(() => {
    cart.classList.remove("animate");
  }, 500);
}

