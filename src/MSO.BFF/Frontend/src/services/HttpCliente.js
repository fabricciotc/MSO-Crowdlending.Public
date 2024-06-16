import axios from "axios";
axios.defaults.baseURL = "/api";

axios.interceptors.request.use(
  (config) => {
    const tokenSeguridad = window.localStorage.getItem("tokenSeguridad");
    if (tokenSeguridad) {
      config.headers.Authorization = "Bearer " + tokenSeguridad;
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

const requestGenerico = {
  get: (url) => axios.get(url),
  post: (url, body) => axios.post(url, body),
  put: (url, body) => axios.put(url, body),
  delete: (url) => axios.delete(url),
};
export default requestGenerico;
