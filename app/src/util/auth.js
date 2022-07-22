export const authMiddleware = (navigate) => {
  const authToken = localStorage.getItem("auth-token");
  if (authToken === null) {
    navigate("/login");
  }
};
