<template>
  <q-card flat bordered class="q-mt-md">
    <q-card-section>
      <div class="text-h6">Transactions</div>
    </q-card-section>
    <q-card-section v-if="!hasTransactions" class="text-grey text-center q-pa-lg">
      No transactions yet
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
const hasTransactions = false;
</script>
