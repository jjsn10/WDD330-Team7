import { loadHeaderFooter, getLocalStorage, setLocalStorage } from "./utils.mjs";
import productList from "./productList.mjs";
import loadAlerts from "./alerts.mjs";

// Load header and footer
loadHeaderFooter();

// Load alerts from alerts.json
loadAlerts();

// Only run productList if the element exists
const list = document.querySelector(".product-list");

if (list) {
  productList(".product-list", "tents");
}

// Show registration modal on first visit
if (!getLocalStorage("so-visited")) {
  setLocalStorage("so-visited", true);
  document.getElementById("registration-modal").classList.add("modal--visible");
}

function closeModal() {
  document.getElementById("registration-modal").classList.remove("modal--visible");
}

document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-dismiss").addEventListener("click", closeModal);
document.getElementById("registration-modal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// Newsletter sign-up
const newsletterForm = document.getElementById("newsletter-form");
const newsletterMessage = document.getElementById("newsletter-message");

if (getLocalStorage("so-newsletter")) {
  newsletterForm.innerHTML = `<p class="newsletter-message newsletter-message--success">You're already subscribed — thanks for being part of the SleepOutside community!</p>`;
}

newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("newsletter-email").value.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newsletterMessage.textContent = "Please enter a valid email address.";
    newsletterMessage.className = "newsletter-message newsletter-message--error";
    return;
  }

  setLocalStorage("so-newsletter", email);
  newsletterForm.reset();
  newsletterMessage.textContent = `Thanks! ${email} has been added to our newsletter.`;
  newsletterMessage.className = "newsletter-message newsletter-message--success";
});
