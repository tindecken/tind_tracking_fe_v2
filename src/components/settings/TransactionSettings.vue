<template>
  <div>
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="2em" />
    </div>

    <div v-else>
      <div class="row items-center q-mb-sm">
        <span class="text-subtitle1 text-weight-medium">Transactions</span>
        <q-space />
        <span class="text-caption text-grey">{{ store.totalTransactions }} total</span>
      </div>

      <q-list bordered separator>
        <q-item v-for="t in store.transactions" :key="t.id">
          <q-item-section>
            <q-item-label>{{ formatDate(t.date) }} - {{ t.note }}</q-item-label>
            <q-item-label caption>
              <span :class="t.amount > 0 ? 'text-negative' : 'text-positive'">
                {{ formatNumber(t.amount) }}
              </span>
              <q-badge v-if="t.toWalletId" color="warning" class="q-ml-xs">Del</q-badge>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round icon="undo" size="sm" color="warning" @click="confirmUndo(t)">
              <q-tooltip>Undo</q-tooltip>
            </q-btn>
            <q-btn flat round icon="delete" size="sm" color="negative" @click="confirmDelete(t)">
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="text-center q-mt-sm text-grey" v-if="store.transactions.length === 0">
        No transactions
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useTrackingStore } from '@/stores/tracking';
import type { Transaction } from '@/models/Transaction';

const formatNumber = (value: number): string =>
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(value));

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return String(d.getDate());
};

const $q = useQuasar();
const store = useTrackingStore();
const loading = ref(false);

function confirmUndo(t: Transaction) {
  $q.dialog({
    title: 'Undo Transaction',
    message: `Undo "${t.note}" (${formatNumber(t.amount)})?`,
    cancel: true,
  }).onOk(async () => {
    try {
      await store.undoCTransactions([t.id]);
      $q.notify({ type: 'positive', message: 'Transaction undone!' });
      await fetchData();
    } catch (err: any) {
      $q.notify({ type: 'negative', message: err?.response?.data?.message ?? 'Failed' });
    }
  });
}

function confirmDelete(t: Transaction) {
  $q.dialog({
    title: 'Delete Transaction',
    message: `Delete "${t.note}" (${formatNumber(t.amount)})? This cannot be undone.`,
    cancel: true,
  }).onOk(async () => {
    try {
      await store.deleteTransactions([t.id]);
      $q.notify({ type: 'positive', message: 'Transaction deleted!' });
      await fetchData();
    } catch (err: any) {
      $q.notify({ type: 'negative', message: err?.response?.data?.message ?? 'Failed' });
    }
  });
}

async function fetchData() {
  loading.value = true;
  try {
    await store.fetchTransactions();
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchData();
});
</script>
