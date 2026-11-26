<template>
  <div>
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="2em" />
    </div>

    <div v-else>
      <div class="row items-center q-mb-sm">
        <span class="text-subtitle1 text-weight-medium">Wallets</span>
        <q-space />
        <q-btn flat round icon="add" color="primary" @click="openDialog" />
      </div>

      <q-list bordered separator>
        <q-item v-for="w in store.wallets" :key="w.id">
          <q-item-section>
            <q-item-label>{{ w.name }}</q-item-label>
            <q-item-label caption>
              {{ formatNumber(w.balance) }}
              <q-badge v-if="w.isDefault" color="positive" class="q-ml-xs">Default</q-badge>
              <q-badge v-if="w.isDelegated" color="secondary" class="q-ml-xs">Delegated</q-badge>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round icon="delete" size="sm" color="negative" @click="confirmDelete(w)" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Add Wallet</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input v-model="form.name" label="Name" dense :rules="[(v: string) => !!v || 'Required']" />
          <q-input v-model.number="form.balance" type="number" label="Balance" dense />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Save" @click="save" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useTrackingStore } from '@/stores/tracking';
import type { Wallet } from '@/models/Wallet';

const formatNumber = (value: number): string =>
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

const $q = useQuasar();
const store = useTrackingStore();
const loading = ref(false);
const saving = ref(false);
const dialog = ref(false);

const form = ref({
  name: '',
  balance: null as number | null,
});

function openDialog() {
  form.value = { name: '', balance: null };
  dialog.value = true;
}

async function save() {
  if (!form.value.name || form.value.balance == null) return;
  saving.value = true;
  try {
    await store.createWallet({
      name: form.value.name,
      balance: form.value.balance,
    });
    $q.notify({ type: 'positive', message: 'Wallet created!' });
    dialog.value = false;
    await fetchData();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message ?? 'Failed' });
  } finally {
    saving.value = false;
  }
}

async function confirmDelete(w: Wallet) {
  $q.dialog({
    title: 'Delete Wallet',
    message: `Delete "${w.name}"?`,
    cancel: true,
  }).onOk(async () => {
    try {
      await store.deleteWallet(w.id);
      $q.notify({ type: 'positive', message: 'Deleted!' });
      await fetchData();
    } catch (err: any) {
      $q.notify({ type: 'negative', message: err?.response?.data?.message ?? 'Failed' });
    }
  });
}

async function fetchData() {
  loading.value = true;
  try {
    await store.fetchWallets();
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchData();
});
</script>
