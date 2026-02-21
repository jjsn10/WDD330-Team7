import { loadHeaderFooter } from "./utils.mjs";
import checkoutProcess from "./checkoutProcess.mjs";

loadHeaderFooter();

function initCheckoutPage() {
	checkoutProcess.init("so-cart", "#checkout-form");
	const checkoutForm = document.querySelector("#checkout-form");
	const zipInput = document.querySelector("#zip");

	zipInput.addEventListener("input", () => {
		if (zipInput.value.trim()) {
			checkoutProcess.calculateOrdertotal();
		} else {
			checkoutProcess.shipping = 0;
			checkoutProcess.tax = 0;
			checkoutProcess.orderTotal = 0;
			checkoutProcess.displayOrderTotals();
		}
	});

	checkoutForm.addEventListener("submit", async (event) => {
		event.preventDefault();
		if (!checkoutForm.checkValidity()) {
			checkoutForm.reportValidity();
			return;
		}

		if (!checkoutProcess.orderTotal && checkoutProcess.itemTotal) {
			checkoutProcess.calculateOrdertotal();
		}

		try {
			await checkoutProcess.checkout(checkoutForm);
			localStorage.removeItem("so-cart");
			window.location.href = "../index.html";
		} catch {
			alert("Sorry, there was a problem submitting your order. Please try again.");
		}
	});
}

initCheckoutPage();
