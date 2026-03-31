export const getRole = () => localStorage.getItem("role") || null;

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => !!localStorage.getItem("user");