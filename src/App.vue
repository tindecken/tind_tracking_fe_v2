<template>
  <router-view />
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authClient } from '@/boot/auth';

const router = useRouter();
const route = useRoute();
const session = authClient.useSession();

watch(
  () => session.value.data,
  (data) => {
    if (data && route.path === '/login') {
      void router.push('/');
    } else if (!data && route.path !== '/login') {
      void router.push('/login');
    }
  },
  { immediate: true },
);
</script>
