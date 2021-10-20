// Helpers
const baseURL = "http://localhost:8035";
const url = (path) => `${baseURL}${path}`;
const sessionTokenName = "expressjs-employees-app-token";
const getSessionToken = () => localStorage.getItem(sessionTokenName);

const checkIfUserIsLoggedIn = () => {
  const token = getSessionToken();
  console.log({ token });

  return !!token && typeof token === "string";
};

// Global Axios Defaults (only for restricted pages)
axios.defaults.headers.common["Authorization"] = `Bearer ${getSessionToken()}`;
