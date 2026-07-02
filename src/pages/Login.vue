<template>
  <q-page class="row items-center justify-center">
    <div class="text-center">
      <p class="text-h5 q-mb-lg text-grey-7">Tind Tracking</p>
      <q-btn
        color="primary"
        icon="login"
        label="Login with Google Account"
        no-caps
        size="lg"
        @click="signInWithGoogle"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { authClient } from '@/boot/auth';

const signInWithGoogle = async () => {
  await authClient.signIn.social({
    provider: 'google',
    callbackURL: window.location.origin,
  });
};
</script>
