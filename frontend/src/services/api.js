const BASE_URL = "http://localhost:8080";

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/api/products`);
  return res.json();
}
