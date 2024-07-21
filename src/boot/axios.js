import { boot } from "quasar/wrappers";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000", // URL de tu API
});

axiosInstance.defaults.withCredentials = true;

// axios.interceptors.request.use(async function (config) {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   if (!config.url.includes("/sanctum/csrf-cookie")) {
//     await axios.get("/sanctum/csrf-cookie");
//   }
//   return config;
// });

axiosInstance.interceptors.request.use(
  async function (config) {
    // Incluir token en el encabezado de autorización
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Obtener CSRF token si no es la solicitud de csrf-cookie
    if (!config.url.includes("/sanctum/csrf-cookie")) {
      await axiosInstance.get("/sanctum/csrf-cookie");
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axiosInstance;
});

export { axiosInstance };
