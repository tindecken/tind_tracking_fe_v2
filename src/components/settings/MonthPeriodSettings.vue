<template>
  <div>
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="2em" />
    </div>

    <div v-else>
      <div class="row items-center q-mb-sm">
        <span class="text-subtitle1 text-weight-medium">Month Periods</span>
        <q-space />
        <q-btn flat round icon="add" color="primary" @click="openDialog()" />
      </div>

      <q-list bordered separator>
        <q-item v-for="mp in store.monthPeriods" :key="mp.id">
          <q-item-section>
            <q-item-label>{{ mp.name }}</q-item-label>
            <q-item-label caption>
              {{ formatDate(mp.startDate) }} - {{ formatDate(mp.endDate) }}
              <q-badge v-if="mp.isActive" color="positive" class="q-ml-xs">Active</q-badge>
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
          <div class="text-h6">{{ editing ? 'Edit' : 'Add' }} Month Period</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input v-model="form.name" label="Name" dense :rules="[(v: string) => !!v || 'Required']" />
          <q-input v-model="form.startDate" type="date" label="Start Date" dense />
          <q-input v-model="form.endDate" type="date" label="End Date" dense />
          <q-checkbox v-model="form.isActive" label="Active" dense />
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
import type { MonthPeriod } from '@/models/MonthPeriod';

const $q = useQuasar();
const store = useTrackingStore();
const loading = ref(false);
const saving = ref(false);
const dialog = ref(false);
const editing = ref<MonthPeriod | null>(null);

const form = ref({
  name: '',
  startDate: null as string | null,
  endDate: null as string | null,
  isActive: false,
});

const formatDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString('vi-VN');
};

function openDialog(mp?: MonthPeriod) {
  editing.value = mp ?? null;
  if (mp) {
    form.value.name = mp.name;
    form.value.startDate = new Date(mp.startDate).toISOString().split('T')[0]!;
    form.value.endDate = new Date(mp.endDate).toISOString().split('T')[0]!;
    form.value.isActive = mp.isActive;
  } else {
    form.value = { name: '', startDate: null, endDate: null, isActive: false };
  }
  dialog.value = true;
}

async function save() {
  if (!form.value.name) return;
  saving.value = true;
  try {
    if (editing.value) {
      const updatePayload: Record<string, unknown> = {
        id: editing.value.id,
        name: form.value.name,
        isActive: form.value.isActive,
      };
      if (form.value.startDate) updatePayload.startDate = new Date(form.value.startDate).getTime();
      if (form.value.endDate) updatePayload.endDate = new Date(form.value.endDate).getTime();
      await store.updateMonthPeriod(updatePayload as any);
      $q.notify({ type: 'positive', message: 'Month period updated!' });
    } else {
      await store.createMonthPeriod({
        name: form.value.name,
        startDate: new Date(form.value.startDate!).getTime(),
        endDate: new Date(form.value.endDate!).getTime(),
        isActive: form.value.isActive,
      });
      $q.notify({ type: 'positive', message: 'Month period created!' });
    }
    dialog.value = false;
    await fetchData();
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err?.response?.data?.message ?? 'Failed' });
  } finally {
    saving.value = false;
  }
}

async function confirmDelete(mp: MonthPeriod) {
  $q.dialog({
    title: 'Delete Month Period',
    message: `Delete "${mp.name}"?`,
    cancel: true,
  }).onOk(async () => {
    try {
      await store.deleteMonthPeriod(mp.id);
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
    await store.fetchAllMonthPeriods();
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchData();
});
</script>
