<template>
  <q-layout>
    <q-page-container>
      <q-page class="row items-center justify-center">
        <div class="login-card">
          <p class="text-h5 q-mb-md text-grey-7 text-center">Tind Tracking</p>

          <q-tabs v-model="tab" dense no-caps class="q-mb-md">
            <q-tab name="email" label="Email" />
            <q-tab name="google" label="Google" />
          </q-tabs>
          <q-separator class="q-mb-md" />
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="email" class="q-pa-none">
              <q-form @submit="signInWithEmail" class="q-gutter-md">
                <q-input
                  v-model="form.email"
                  type="email"
                  label="Email"
                  :rules="[(val: string) => !!val || 'Required']"
                  outlined
                  dense
                />
                <q-input
                  v-model="form.password"
                  type="password"
                  label="Password"
                  :rules="[(val: string) => !!val || 'Required']"
                  outlined
                  dense
                />
                <q-checkbox
                  v-model="form.rememberMe"
                  label="Remember me"
                  dense
                />
                <q-btn
                  color="primary"
                  label="Sign In"
                  type="submit"
                  class="full-width"
                  :loading="loading"
                  no-caps
                />
              </q-form>
            </q-tab-panel>

            <q-tab-panel name="google" class="q-pa-none">
              <q-btn
                color="primary"
                icon="login"
                label="Login with Google Account"
                no-caps
                class="full-width"
                @click="signInWithGoogle"
              />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQuasar } from "quasar";
import { authClient } from "@/boot/auth";

const authUrl = import.meta.env.API_URL;
const $q = useQuasar();
const tab = ref("email");
const loading = ref(false);
const form = ref({
  email: "",
  password: "",
  rememberMe: false
});

const signInWithEmail = async () => {
  loading.value = true;
  try {
    await authClient.signIn.email({
      email: form.value.email,
      password: form.value.password,
      rememberMe: form.value.rememberMe
    });
  } catch (err: any) {
    const message =
      err?.response?.data?.message ?? err?.message ?? "Login failed";
    $q.notify({ type: "negative", message });
  } finally {
    loading.value = false;
  }
};

const signInWithGoogle = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: window.location.href
  });
};
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 360px;
  padding: 32px 24px;
}
</style>
