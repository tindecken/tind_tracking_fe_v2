<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div v-for="wallet in wallets" :key="wallet.id">
      <q-input
        v-model.number="form.balances[wallet.id]"
        type="number"
        :label="wallet.name"
        dense
      >
        <template v-slot:prepend>
          <q-icon name="account_balance_wallet" />
        </template>
      </q-input>
    </div>

    <div class="q-mt-lg">
      <q-btn
        label="Reconcile"
        type="submit"
        color="primary"
        class="full-width"
        :disable="isSubmitting"
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
const isSubmitting = ref(false);

const wallets = computed(() => store.wallets);

const form = ref<{ balances: Record<string, number | null> }>({
  balances: {},
});

function initBalances() {
  const balances: Record<string, number | null> = {};
  store.wallets.forEach((w) => {
    balances[w.id] = w.balance;
  });
  form.value.balances = { ...balances };
}

watch(
  () => store.wallets,
  () => {
    initBalances();
  },
  { immediate: true },
);

const onSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const items = store.wallets
      .filter((w) => form.value.balances[w.id] != null)
      .map((w) => ({
        walletId: w.id,
        balance: form.value.balances[w.id] as number,
      }));
    const response = await store.reconcileWallets(items);
    if (response?.success) {
      $q.notify({ type: 'positive', message: 'Reconciled successfully!' });
      await store.fetchInitialData();
    }
  } catch {
    $q.notify({ type: 'negative', message: 'Reconcile failed' });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  initBalances();
});
</script>
