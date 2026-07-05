import { createAuthClient } from "better-auth/vue";
if (import.meta.env.VITE_API_BASE_URL) {
  console.log(
    `import.meta.env.VITE_API_BASE_URL: ${import.meta.env.VITE_API_BASE_URL}`,
  );
}
export const authClient = createAuthClient({
  baseURL:
    (import.meta.env.VITE_API_BASE_URL ??
      "https://tindapi-production.tindecken.workers.dev") +
    "/tind_tracking/auth",
});
