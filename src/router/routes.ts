import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("@/pages/IndexPage.vue") },
      { path: "settings", component: () => import("@/pages/SettingsPage.vue") },
    ],
  },

  {
    path: "/login",
    component: () => import("@/pages/Login.vue"),
  },

  {
    path: "/logout",
    component: () => import("@/pages/Logout.vue"),
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("@/pages/ErrorNotFound.vue"),
  },
];

export default routes;
