import { createAuthClient } from "better-auth/vue";
if (import.meta.env.API_URL) {
  console.log(`import.meta.env.API_URL: ${import.meta.env.API_URL}`);
}
export const authClient = createAuthClient({
  baseURL: import.meta.env.API_URL,
});
