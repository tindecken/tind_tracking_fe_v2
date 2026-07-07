// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from "#q-app";

export default defineConfig((ctx) => {
  return {
    boot: ["axios", "auth"],

    css: ["app.scss"],

    extras: ["roboto-font", "material-icons"],

    build: {
      typescript: {
        strict: true,
        vueShim: true,
      },

      vueRouterMode: "hash",
      defineEnv: {
        API_URL: ctx.dev
          ? "http://192.168.1.3:8787"
          : "https://tindapi.tindecken.com",
      },
    },

    devServer: {
      open: false, // opens browser window automatically
    },

    framework: {
      config: {
        notify: {
          position: "bottom",
        },
      },

      plugins: ["Notify"],
    },

    animations: [],

    ssr: {
      prodPort: 3000,
      middlewares: ["render"],
      pwa: false,
    },

    pwa: {
      workboxMode: "GenerateSW",
    },

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      preloadScripts: ["electron-preload"],
      inspectPort: 5858,
      bundler: "packager",
      packager: {},
      builder: {
        appId: "tind_tracking_fe_v2",
      },
    },

    bex: {
      extraScripts: [],
    },
  };
});
