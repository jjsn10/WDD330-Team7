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
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

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
export function getParam(param){
  const urlParams = new URLSearchParams(window.location.search);
  //console.log("Line 26: urlParams: ", urlParams);
  return urlParams.get(param);
}
export function renderList(fn, products, el) {
    //const productListElement = document.getElementById(category);
    //const firstFour = products.slice(0, 4);
    //el.innerHTML =firstFour.map(fn).join("");
    /*if (clear) {
        el.innerHTML = "";
    }*/
    el.insertAdjacentHTML("afterbegin", products.map(fn).join(""));
}

 async function loadTemplate(path) {
   const res = await fetch(path);
    if (res.ok) {
      const html = await res.text();
      return html;
    }
}

export function renderWithTemplate(templateFn, parentElement, data, callback, position="afterbegin", clear=true) {
    // get template using function...no need to loop this time.
    if (clear) {
        parentElement.innerHTML = "";
    }
    parentElement.insertAdjacentHTML(position, templateFn);
    if(callback) {
        callback(data);
    }
}
export async function loadHeaderFooter(){
  const headerTemplateFn = await loadTemplate("/partials/header.html");
  const footerTemplateFn = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  //console.log("Line 63: headerElement: ", headerElement); 

  renderWithTemplate(headerTemplateFn, headerElement);
  renderWithTemplate(footerTemplateFn, footerElement);
}