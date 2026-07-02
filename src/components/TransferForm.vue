<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-select
      v-model="form.fromWalletId"
      :options="wallets"
      label="From Wallet"
      option-value="id"
      option-label="name"
      emit-value
      map-options
    />

    <q-select
      v-model="form.toWalletId"
      :options="wallets"
      label="To Wallet"
      option-value="id"
      option-label="name"
      emit-value
      map-options
    />

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

    <q-input v-model="form.note" label="Note" />

    <div class="q-mt-lg">
      <q-btn
        label="Transfer"
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
  fromWalletId: null as string | null,
  toWalletId: null as string | null,
  amount: null as number | null,
  note: '',
});
const isSubmitting = ref(false);

const wallets = computed(() => store.wallets);

const formValid = computed(() => {
  return form.value.fromWalletId !== null
    && form.value.toWalletId !== null
    && form.value.amount !== null
    && form.value.fromWalletId !== form.value.toWalletId;
});

const onSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const response = await store.transfer({
      fromWalletId: form.value.fromWalletId!,
      toWalletId: form.value.toWalletId!,
      amount: form.value.amount!,
      note: form.value.note,
    });
    if (response?.success) {
      $q.notify({ type: 'positive', message: 'Transfer completed!' });
      form.value = { fromWalletId: null, toWalletId: null, amount: null, note: '' };
      await store.fetchInitialData();
    }
  } catch {
    $q.notify({ type: 'negative', message: 'Transfer failed' });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
