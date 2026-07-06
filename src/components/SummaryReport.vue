<template>
  <div>
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="2em" />
    </div>

    <div v-else-if="error" class="text-center q-pa-lg text-negative">
      <p>{{ error }}</p>
      <q-btn color="primary" label="Retry" @click="fetchSummary" no-caps flat />
    </div>

    <div v-else-if="!summary" class="text-center q-pa-lg text-grey">
      No data available
    </div>

    <div v-else class="row q-col-gutter-xs">
      <div class="col-auto">
        <q-table
          :rows="summaryRows"
          :columns="summaryColumns"
          :pagination="{ rowsPerPage: 0 }"
          hide-pagination
          hide-header
          hide-no-data
          flat
          bordered
          :rows-per-page-options="[0]"
          style="width: 150px"
          class="summary-table"
        >
          <template v-slot:top>
            <span class="text-subtitle2 text-weight-medium">Summary</span>
          </template>
          <template v-slot:body="props">
            <q-tr
              :props="props"
              :class="{
                'bg-grey-2': props.rowIndex % 2 === 0,
                'bg-white': props.rowIndex % 2 !== 0
              }"
            >
              <q-td>{{ props.row.label }}</q-td>
              <q-td
                :class="[
                  'text-right',
                  {
                    'text-primary': props.row.label === 'Per Day',
                    'text-h6': props.row.label === 'Per Day',
                    'bg-light-green-2': props.row.label === 'Per Day'
                  }
                ]"
              >
                {{ props.row.value }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <div v-if="summary.mustPayItems.length > 0" class="col-auto">
        <q-table
          :rows="mustPayRows"
          :columns="mustPayColumns"
          row-key="name"
          flat
          bordered
          hide-pagination
          hide-header
          hide-no-data
          :rows-per-page-options="[0]"
          style="width: 155px"
          class="mustpay-table"
        >
          <template v-slot:top>
            <span class="text-subtitle2 text-weight-medium">Must Pay</span>
            <q-space />
            <span class="text-subtitle2 text-weight-medium">{{
              formatNumber(store.summary?.mustpay ?? 0)
            }}</span>
          </template>
          <template v-slot:body="props">
            <q-tr
              :props="props"
              :class="{
                'bg-grey-2': props.rowIndex % 2 === 0,
                'bg-white': props.rowIndex % 2 !== 0
              }"
            >
              <q-td>{{ props.row.name }}</q-td>
              <q-td class="text-right">{{ props.row.amount }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
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
  }).format(value);
};

const store = useTrackingStore();
const loading = ref(false);
const error = ref<string | null>(null);

const summary = computed(() => store.summary);

const summaryColumns: QTableColumn[] = [
  { name: "label", label: "Label", field: "label", align: "left" },
  { name: "value", label: "Value", field: "value", align: "right" }
];

const summaryRows = computed(() => {
  if (!store.summary) return [];
  const s = store.summary;
  const rows: { label: string; value: string }[] = [];

  s.wallets.forEach(w => {
    rows.push({ label: w.name, value: formatNumber(w.balance) });
  });

  rows.push({ label: "Day Left", value: String(s.dayRemaining) });
  rows.push({ label: "Per Day", value: formatNumber(s.perDay) });

  return rows;
});

const mustPayColumns: QTableColumn[] = [
  { name: "name", label: "Name", field: "name", align: "left" },
  { name: "amount", label: "Amount", field: "amount", align: "right" }
];

const mustPayRows = computed(() => {
  if (!store.summary) return [];
  const rows = store.summary.mustPayItems.map(item => ({
    name: item.name,
    amount: formatNumber(item.amount)
  }));
  if (store.summary.delegatedWallets.length > 0) {
    store.summary.delegatedWallets.forEach(w => {
      rows.push({ name: `${w.name} (Del)`, amount: formatNumber(w.balance) });
    });
  }
  return rows;
});

async function fetchSummary() {
  loading.value = true;
  error.value = null;
  console.log("[SummaryReport] Calling fetchWalletSummary...");
  try {
    await store.fetchWalletSummary();
    console.log(
      "[SummaryReport] fetchWalletSummary done, summary:",
      store.summary
    );
  } catch (err) {
    console.error("[SummaryReport] fetchWalletSummary failed:", err);
    error.value = err instanceof Error ? err.message : "Failed to load summary";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchSummary();
});
</script>

<style scoped>
.mustpay-table :deep(.q-table__top) {
  padding: 8px 16px;
  display: flex;
  align-items: center;
}
.summary-table :deep(.q-table__top) {
  padding: 8px 16px;
  display: flex;
  align-items: center;
}
</style>
