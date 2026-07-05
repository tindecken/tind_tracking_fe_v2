import { createAuthClient } from "better-auth/vue";
if (import.meta.env.VITE_API_BASE_URL) {
  console.log(
    `import.meta.env.VITE_API_BASE_URL: ${import.meta.env.VITE_API_BASE_URL}`,
  );
}
export const authClient = createAuthClient({
  baseURL:
    (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787") +
    "/tind_tracking/auth",
});
