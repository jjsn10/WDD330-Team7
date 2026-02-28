const baseUrl = import.meta.env.VITE_SERVER_URL;

console.log("Line 3: baseUrl: ", baseUrl);
console.log("Line 4: ",import.meta.env)

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: "servicesError", message: jsonResponse };
  }
}

export async function getProductsByCategory(category = "tents") {
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

export async function checkout(data) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  return await fetch(baseUrl + "checkout/", options)
    .then(convertToJson)
}
