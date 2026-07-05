import { defineBoot } from "#q-app";
import axios, { type AxiosInstance } from "axios";

declare module "vue" {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    "https://tindapi-production.tindecken.workers.dev",
  withCredentials: true,
});

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
