const baseUrl = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export async function getData(category = "tents") {
  /*return fetch(`../json/${category}.json`)
    .then(await convertToJson)
    .then((data) => data);*/
    //console.log(baseUrl + `products/search/${category}`);
   return fetch(baseUrl + `products/search/${category}`)
    .then(await convertToJson)
    .then((data) => data.Result);
}

export async function findProductById(id) {
  const response = await fetch(baseUrl + `product/${id}`);
  const product = await convertToJson(response);
  return product.Result;
}
