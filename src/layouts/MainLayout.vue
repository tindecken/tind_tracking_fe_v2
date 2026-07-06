<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div class="mobile-container">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.mobile-container {
  max-width: 480px;
  margin: 0 auto;
  padding: 0 5px;
}
</style>
