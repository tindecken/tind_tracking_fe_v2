<template>
  <div>
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="2em" />
    </div>

    <div v-else>
      <div class="row items-center q-mb-sm">
        <span class="text-subtitle1 text-weight-medium">Must Pay</span>
        <q-space />
        <q-btn flat round icon="add" color="primary" @click="openDialog()" />
      </div>

      <q-list bordered separator>
        <q-item v-for="mp in store.mustPayItems" :key="mp.id">
          <q-item-section>
            <q-item-label>{{ mp.name }}</q-item-label>
            <q-item-label caption>
              {{ formatNumber(mp.remainingAmount) }} / {{ formatNumber(mp.targetAmount) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round icon="edit" size="sm" @click="openDialog(mp)" />
            <q-btn flat round icon="delete" size="sm" color="negative" @click="confirmDelete(mp)" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">{{ editing ? 'Edit' : 'Add' }} Must Pay</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input v-model="form.name" label="Name" dense :rules="[(v: string) => !!v || 'Required']" />
          <q-input v-model.number="form.targetAmount" type="number" label="Target Amount" dense />
          <q-input v-if="editing" v-model.number="form.remainingAmount" type="number" label="Remaining Amount" dense />
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
import type { MustPayItem } from '@/models/MustPay';

const formatNumber = (value: number): string =>
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

const $q = useQuasar();
const store = useTrackingStore();
const loading = ref(false);
const saving = ref(false);
const dialog = ref(false);
const editing = ref<MustPayItem | null>(null);

const form = ref({
  name: '',
  targetAmount: null as number | null,
  remainingAmount: null as number | null,
});

function openDialog(mp?: MustPayItem) {
  editing.value = mp ?? null;
  if (mp) {
    form.value.name = mp.name;
    form.value.targetAmount = mp.targetAmount;
    form.value.remainingAmount = mp.remainingAmount;
  } else {
    form.value = { name: '', targetAmount: null, remainingAmount: null };
  }
  dialog.value = true;
}

async function save() {
  if (!form.value.name || form.value.targetAmount == null) return;
  saving.value = true;
  try {
    if (editing.value) {
      const updatePayload: Record<string, unknown> = {
        id: editing.value.id,
        name: form.value.name,
        targetAmount: form.value.targetAmount,
      };
      if (form.value.remainingAmount != null) updatePayload.remainingAmount = form.value.remainingAmount;
      await store.updateMustPay(updatePayload as any);
      $q.notify({ type: 'positive', message: 'Must pay updated!' });
    } else {
      await store.createMustPay({
        name: form.value.name,
        targetAmount: form.value.targetAmount,
      });
      $q.notify({ type: 'positive', message: 'Must pay created!' });
    }
    dialog.value = false;
    await fetchData();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message ?? 'Failed' });
  } finally {
    saving.value = false;
  }
}

async function confirmDelete(mp: MustPayItem) {
  $q.dialog({
    title: 'Delete Must Pay',
    message: `Delete "${mp.name}"?`,
    cancel: true,
  }).onOk(async () => {
    try {
      await store.deleteMustPay(mp.id);
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
    await store.fetchMustPay();
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchData();
});
</script>
