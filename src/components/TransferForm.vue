<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-select
      v-model="form.fromWalletId"
      :options="walletOptions"
      label="From Wallet"
      option-value="id"
      option-label="name"
      emit-value
      map-options
      dense
    />

    <q-select
      v-model="form.toWalletId"
      :options="walletOptions"
      label="To Wallet"
      option-value="id"
      option-label="name"
      emit-value
      map-options
      dense
    />

    <q-input
      v-model.number="form.amount"
      type="number"
      label="Amount"
      dense
      :rules="[(val: any) => (val !== null && val !== '') || 'Required']"
    >
      <template v-slot:prepend>
        <q-icon name="attach_money" />
      </template>
    </q-input>

    <q-input
      v-model.number="form.fee"
      type="number"
      label="Fee"
      dense
    >
      <template v-slot:prepend>
        <q-icon name="attach_money" />
      </template>
    </q-input>

    <q-input v-model="form.note" label="Note" dense />

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
import { ref, computed, onMounted, watch } from 'vue';
import { useTrackingStore } from '@/stores/tracking';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const store = useTrackingStore();

const form = ref({
  fromWalletId: null as string | null,
  toWalletId: null as string | null,
  amount: null as number | null,
  fee: 0,
  note: '',
});
const isSubmitting = ref(false);

const walletOptions = computed(() => store.wallets);

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
      fee: form.value.fee,
      note: form.value.note,
    });
    if (response?.success) {
      $q.notify({ type: 'positive', message: 'Transfer completed!' });
      form.value = { fromWalletId: null, toWalletId: null, amount: null, fee: 0, note: '' };
      await store.fetchInitialData();
    }
  } catch {
    $q.notify({ type: 'negative', message: 'Transfer failed' });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  store.fetchWallets();
});

watch(
  () => store.wallets,
  wallets => {
    if (!form.value.fromWalletId && wallets.length > 0) {
      const defaultWallet = wallets.find(w => w.isDefault);
      if (defaultWallet) {
        form.value.fromWalletId = defaultWallet.id;
      }
    }
  },
  { immediate: true },
);
</script>
