import { createAuthClient } from 'better-auth/vue';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:8787/tind_tracking/auth',
});
