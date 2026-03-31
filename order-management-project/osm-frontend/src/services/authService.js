import API from "./api";

export const registerUser = async (user) => API.post("/auth/register", user);
export const loginUser = async (data) => API.post("/auth/login", data);