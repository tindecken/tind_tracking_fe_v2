<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model.number="form.amount"
      type="number"
      label="Amount"
      :rules="[(val: any) => (val !== null && val !== '') || 'Required']"
    >
      <template v-slot:prepend>
        <q-icon name="attach_money" />
      </template>
    </q-input>

    <q-input
      v-model="form.note"
      label="Note"
      :rules="[(val: any) => !!val || 'Required']"
    />

    <q-select
      v-model="form.walletId"
      :options="walletOptions"
      label="Wallet"
      option-value="id"
      option-label="name"
      emit-value
      map-options
    />

    <div class="q-mt-lg">
      <q-btn
        label="Add"
        type="submit"
        color="primary"
        class="full-width"
        :disable="!formValid || isSubmitting"
        :loading="isSubmitting"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTrackingStore } from '@/stores/tracking';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const store = useTrackingStore();

const form = ref({
  amount: null as number | null,
  note: '',
  walletId: null as string | null,
});
const isSubmitting = ref(false);

const walletOptions = computed(() => store.wallets);

const formValid = computed(() => {
  return form.value.amount !== null && form.value.note.trim() !== '' && form.value.walletId !== null;
});

const onSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const payload = [{
      walletId: form.value.walletId!,
      amount: form.value.amount!,
      note: form.value.note,
    }];
    const response = await store.createTransaction(payload);
    if (response?.success) {
      $q.notify({ type: 'positive', message: 'Transaction added!' });
      form.value = { amount: null, note: '', walletId: null };
      await store.fetchInitialData();
    }
  } catch {
    $q.notify({ type: 'negative', message: 'Failed to add transaction' });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
