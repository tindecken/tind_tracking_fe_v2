<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-select
      v-model="selectedMustpay"
      :options="mustPayOptions"
      label="Select Must Pay"
      option-value="id"
      option-label="name"
      emit-value
      map-options
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>{{ scope.opt.name }}</q-item-label>
            <q-item-label caption>
              {{ formatNumber(scope.opt.remainingAmount) }} / {{ formatNumber(scope.opt.targetAmount) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-select
      v-model="form.walletId"
      :options="walletOptions"
      label="Pay from Wallet"
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
        label="Pay"
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

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const $q = useQuasar();
const store = useTrackingStore();

const form = ref({
  amount: null as number | null,
  note: '',
  walletId: null as string | null,
});
const selectedMustpay = ref<string | null>(null);
const isSubmitting = ref(false);

const mustPayOptions = computed(() => store.mustPayItems);
const walletOptions = computed(() => store.wallets);

const formValid = computed(() => {
  return form.value.amount !== null && form.value.walletId !== null && selectedMustpay.value !== null;
});

const onSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const payload = [{
      payWalletId: form.value.walletId!,
      mustpayTransactionId: selectedMustpay.value!,
      amount: form.value.amount!,
      note: form.value.note,
    }];
    const response = await store.payMustpay(payload);
    if (response?.success) {
      $q.notify({ type: 'positive', message: 'Must-pay paid!' });
      form.value = { amount: null, note: '', walletId: null };
      selectedMustpay.value = null;
      await store.fetchInitialData();
    }
  } catch {
    $q.notify({ type: 'negative', message: 'Failed to pay must-pay' });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
