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

    <div v-else>
      <div class="q-gutter-sm q-mb-sm">
        <q-radio v-model="filter" val="me" label="Me" />
        <q-radio v-model="filter" val="delegated" label="Delegated" />
      </div>

      <q-table
        v-if="filteredTransactions.length > 0"
        :rows="filteredTransactions"
        :columns="columns"
        row-key="id"
        :pagination="pagination"
        flat
        bordered
        class="transaction-table"
        dense
      >
        <template v-slot:top>
          <span class="text-subtitle1 text-weight-medium"
            >Transactions ({{ filteredTotal }})</span
          >
          <q-space />
          <span class="text-subtitle1 text-weight-medium"
            >Total: {{ formatNumber(filteredSum) }}</span
          >
        </template>

        <template v-slot:body-cell-amount="props">
          <q-td :props="props">
            <span
              :class="props.row.amount > 0 ? 'text-negative' : 'text-positive'"
            >
              {{ formatNumber(props.value) }}
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-date="props">
          <q-td :props="props">
            {{ formatDate(props.value) }}
          </q-td>
        </template>
      </q-table>

      <div v-else class="text-center q-pa-lg text-grey"> No transactions </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useTrackingStore } from "@/stores/tracking";
import type { QTableColumn } from "quasar";

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.abs(value));
};

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return String(d.getDate());
};

const getWalletName = (walletId: string): string => {
  return store.wallets.find((w) => w.id === walletId)?.name ?? "";
};

const store = useTrackingStore();
const loading = ref(false);
const error = ref<string | null>(null);
const filter = ref<"me" | "delegated">("me");

const hasTransactions = computed(() => store.transactions.length > 0);

const filteredTransactions = computed(() => {
  if (filter.value === "me") {
    return store.transactions.filter(t => !t.toWalletId);
  }
  return store.transactions.filter(t => !!t.toWalletId);
});

const filteredTotal = computed(() => filteredTransactions.value.length);

const filteredSum = computed(() =>
  filteredTransactions.value.reduce((sum, t) => sum + t.amount, 0)
);

const columns: QTableColumn[] = [
  {
    name: "date",
    required: true,
    label: "Date",
    align: "left",
    field: "date",
    sortable: true,
    style: "max-width: 40px;",
    headerStyle: "max-width: 40px;"
  },
  {
    name: "note",
    required: true,
    label: "Note",
    align: "left",
    field: "note",
    sortable: true,
    style:
      "max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
  },
  {
    name: "wallet",
    label: "Wallet",
    field: (row: { walletId: string }) => getWalletName(row.walletId),
    align: "left",
    sortable: true
  },
  {
    name: "amount",
    label: "Amount",
    field: "amount",
    align: "right",
    sortable: true
  }
];

const pagination = {
  rowsPerPage: 0
};

async function fetchData() {
  loading.value = true;
  error.value = null;
  try {
    await store.fetchTransactions();
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to load transactions";
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
  display: flex;
  align-items: center;
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
