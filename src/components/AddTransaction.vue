<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model.number="form.amount"
      type="number"
      label="Amount"
      hint="Positive = expense, negative = income"
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
      clearable
      hint="Leave empty for default wallet"
    />

    <q-select
      v-model="form.delegatedWalletId"
      :options="delegatedWalletOptions"
      label="Delegated Wallet"
      option-value="id"
      option-label="name"
      emit-value
      map-options
      clearable
      hint="Optional"
    />

    <q-select
      v-model="form.categoryId"
      :options="categoryOptions"
      label="Category"
      option-value="id"
      option-label="name"
      emit-value
      map-options
      clearable
      hint="Leave empty for Uncategorized"
    />

    <q-input
      v-model="currentMonthPeriodName"
      label="Month Period"
      readonly
      disable
    />

    <q-input
      v-model="form.date"
      type="date"
      label="Date"
      hint="Leave empty for today"
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
import { ref, computed, onMounted } from 'vue';
import { useTrackingStore } from '@/stores/tracking';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const store = useTrackingStore();

const today = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const form = ref({
  amount: null as number | null,
  note: '',
  walletId: null as string | null,
  delegatedWalletId: null as string | null,
  categoryId: null as string | null,
  date: today(),
});
const isSubmitting = ref(false);

const walletOptions = computed(() =>
  store.wallets.filter((w) => !w.isDelegated)
);

const delegatedWalletOptions = computed(() =>
  store.wallets.filter((w) => w.isDelegated)
);

const categoryOptions = computed(() => store.categories);

const currentMonthPeriodName = computed(() =>
  store.currentMonthPeriod?.name ?? ''
);

const formValid = computed(() => {
  return form.value.amount !== null && form.value.note.trim() !== '';
});

const onSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const payload = [{
      amount: form.value.amount!,
      note: form.value.note,
      walletId: form.value.walletId ?? undefined,
      delegatedWalletId: form.value.delegatedWalletId ?? undefined,
      categoryId: form.value.categoryId ?? undefined,
      monthPeriodId: store.currentMonthPeriod?.id ?? undefined,
      date: form.value.date ? new Date(form.value.date).getTime() : undefined,
    }];
    const response = await store.createTransaction(payload as any);
    if (response?.success) {
      $q.notify({ type: 'positive', message: 'Transaction added!' });
      form.value = { amount: null, note: '', walletId: null, delegatedWalletId: null, categoryId: null, date: today() };
      await store.fetchInitialData();
    }
  } catch {
    $q.notify({ type: 'negative', message: 'Failed to add transaction' });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  store.fetchWallets();
  store.fetchCategories();
  store.fetchCurrentMonthPeriod();
});
</script>
