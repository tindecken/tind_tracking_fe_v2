<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Tind Tracking</q-toolbar-title>
        <q-btn flat icon="logout" @click="goToLogout" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="mobile-container">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goToLogout() {
  void router.push('/logout');
}
</script>

<style scoped>
.mobile-container {
  max-width: 480px;
  margin: 0 auto;
  padding: 0 16px;
}
</style>
