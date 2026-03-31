import API from "./api";

export const getProducts = async () => {
  return await API.get("/products");
};

export const addProduct = async (product) => {
  return await API.post("/products", product);
};