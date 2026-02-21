const baseUrl =
  import.meta.env.VITE_SERVER_URL || "http://server-nodejs.cit.byui.edu:3000/";

function fixBaseUrl(url) {
  return url.endsWith("/") ? url : `${url}/`;
}

function convertToJson(response) {
  if (!response.ok) {
    throw new Error("Bad Response");
  }
  return response.json();
}

export async function getProductsByCategory(category = "tents") {
  const selectedCategory = category || "tents";

  try {
    const response = await fetch(
      fixBaseUrl(baseUrl) + `products/search/${selectedCategory}`,
    );
    const data = await convertToJson(response);
    return data.Result;
  } catch {
    const localResponse = await fetch(`/json/${selectedCategory}.json`);
    return convertToJson(localResponse);
  }
}

export async function findProductById(id) {
  try {
    const response = await fetch(fixBaseUrl(baseUrl) + `product/${id}`);
    const product = await convertToJson(response);
    return product.Result;
  } catch {
    const categories = ["tents", "sleeping-bags", "backpacks", "hammocks"];

    for (const category of categories) {
      const localResponse = await fetch(`/json/${category}.json`);
      if (!localResponse.ok) {
        continue;
      }
      const products = await localResponse.json();
      const foundProduct = products.find((item) => item.Id === id);
      if (foundProduct) {
        return foundProduct;
      }
    }

    throw new Error("Product not found");
  }
}

export async function checkout(order) {
  const response = await fetch(fixBaseUrl(baseUrl) + "checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  return convertToJson(response);
}
