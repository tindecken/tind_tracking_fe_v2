import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  baseURL: `${import.meta.env.API_URL}/tind_tracking/auth`,
  fetchOptions: {
    credentials: "include",
  },
});
