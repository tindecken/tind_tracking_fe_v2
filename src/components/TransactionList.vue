<template>
  <div>
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="2em" />
    </div>

    <div v-else-if="error" class="text-center q-pa-lg text-negative">
      <p>{{ error }}</p>
      <q-btn color="primary" label="Retry" @click="fetchData" no-caps flat />
    </div>

    <div v-else-if="!hasTransactions" class="text-center q-pa-lg text-grey">
      No transactions yet
    </div>

    <q-table
      v-else
      :rows="formattedTransactions"
      :columns="columns"
      row-key="id"
      :pagination="pagination"
      flat
      bordered
      class="q-mt-md transaction-table"
    >
      <template v-slot:top>
        <div class="text-h6">Transactions ({{ store.totalTransactions }})</div>
      </template>

      <template v-slot:body-cell-amount="props">
        <q-td :props="props">
          <span :class="props.row.amount > 0 ? 'text-negative' : 'text-positive'">
            {{ formatNumber(props.value) }}
          </span>
        </q-td>
      </template>

      <template v-slot:body-cell-date="props">
        <q-td :props="props">
          {{ formatDate(props.value) }}
        </q-td>
      </template>

      <template v-slot:body-cell-walletId="props">
        <q-td :props="props">
          {{ getWalletName(props.row.walletId) }}
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useTrackingStore } from '@/stores/tracking';
import type { QTableColumn } from 'quasar';

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
};

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return String(d.getDate());
};

const store = useTrackingStore();
const loading = ref(false);
const error = ref<string | null>(null);

const hasTransactions = computed(() => store.transactions.length > 0);

const columns: QTableColumn[] = [
  {
    name: 'date',
    required: true,
    label: 'Date',
    align: 'left',
    field: 'date',
    sortable: true,
    style: 'max-width: 70px',
  },
  {
    name: 'note',
    required: true,
    label: 'Note',
    align: 'left',
    field: 'note',
    sortable: true,
    style: 'max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis',
  },
  {
    name: 'amount',
    label: 'Amount',
    field: 'amount',
    align: 'right',
    sortable: true,
  },
];

const pagination = {
  rowsPerPage: 20,
};

const formattedTransactions = computed(() => {
  return store.transactions.map((t) => ({
    ...t,
  }));
});

function getWalletName(walletId: string): string {
  const wallet = store.wallets.find((w) => w.id === walletId);
  return wallet?.name ?? walletId;
}

async function fetchData() {
  loading.value = true;
  error.value = null;
  try {
    await store.fetchTransactions();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load transactions';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  store.fetchWallets();
  fetchData();
});
</script>

<style scoped>
.transaction-table :deep(.q-table__top) {
  padding: 8px 16px;
}

.transaction-table :deep(.q-table__title) {
  font-size: 1rem;
  font-weight: 500;
}

.transaction-table :deep(.q-table__card) {
  box-shadow: none;
  border: 1px solid #e0e0e0;
}
</style>
