// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
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
  return urlParams.get(param);
}
export function renderList(fn, products, el) {
    //const productListElement = document.getElementById(category);
    const firstFour = products.slice(0, 4);
    //el.innerHTML =firstFour.map(fn).join("");
    el.insertAdjacentHTML("afterbegin", firstFour.map(fn).join(""));
}

export function renderWithTemplate(template, parentElement, data, callback, position="afterbegin", clear=true) {
    // get template using function...no need to loop this time.
    if (clear) {
        parentElement.innerHTML = "";
    }
    parentElement.insertAdjacentHTML(position, template);
    if(callback) {
        callback(data);
    }
}

 async function loadTemplate(path) {
   const res = await fetch(path);
    if (res.ok) {
      const html = await res.text();
      return html;
    }
}
 
export async function loadHeaderFooter() {
  const headerTemplateFn = await loadTemplate("/partials/header.html");
  const footerTemplateFn = await loadTemplate("/partials/footer.html");

  renderWithTemplate(headerTemplateFn, document.querySelector('#main-header'));
  renderWithTemplate(footerTemplateFn, document.querySelector('#main-footer'));
}