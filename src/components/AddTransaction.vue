<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-select
      v-model="form.mustPayTransactionId"
      :options="mustPayOptions"
      label="Must Pay"
      option-value="id"
      option-label="name"
      emit-value
      map-options
      clearable
      dense
      :readonly="!!form.delegatedWalletId"
      :disable="!!form.delegatedWalletId"
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>{{ scope.opt.name }}</q-item-label>
            <q-item-label caption>
              {{ formatNumber(scope.opt.remainingAmount) }} /
              {{ formatNumber(scope.opt.targetAmount) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input
      v-model="form.note"
      label="Note"
      dense
      :rules="[(val: any) => !!val || 'Required']"
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

    <q-select
      v-model="form.walletId"
      :options="walletOptions"
      label="Wallet"
      option-value="id"
      option-label="name"
      emit-value
      map-options
      dense
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
      dense
      :readonly="!!form.mustPayTransactionId"
      :disable="!!form.mustPayTransactionId"
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
      dense
    />

    <q-input
      v-model="currentMonthPeriodName"
      label="Month Period"
      readonly
      disable
      dense
    />

    <q-input v-model="form.date" type="date" label="Date" :max="maxDate" dense />

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
import { ref, computed, onMounted, watch } from "vue";
import { useTrackingStore } from "@/stores/tracking";
import { useQuasar } from "quasar";

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const $q = useQuasar();
const store = useTrackingStore();

const today = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const form = ref({
  amount: null as number | null,
  note: "",
  walletId: null as string | null,
  delegatedWalletId: null as string | null,
  categoryId: null as string | null,
  mustPayTransactionId: null as string | null,
  date: today()
});
const isSubmitting = ref(false);

const walletOptions = computed(() => store.wallets.filter(w => !w.isDelegated));

const delegatedWalletOptions = computed(() =>
  store.wallets.filter(w => w.isDelegated)
);

const categoryOptions = computed(() => store.categories);

const mustPayOptions = computed(() =>
  store.mustPayItems.filter(m => m.remainingAmount !== 0)
);

const currentMonthPeriodName = computed(
  () => store.currentMonthPeriod?.name ?? ""
);

const maxDate = today();

const formValid = computed(() => {
  return form.value.amount !== null && form.value.note.trim() !== "";
});

const onSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const payload = [
      {
        amount: form.value.amount!,
        note: form.value.note,
        walletId: form.value.walletId ?? undefined,
        delegatedWalletId: form.value.delegatedWalletId ?? undefined,
        categoryId: form.value.categoryId ?? undefined,
        mustPayTransactionId: form.value.mustPayTransactionId ?? undefined,
        monthPeriodId: store.currentMonthPeriod?.id ?? undefined,
        date: form.value.date ? new Date(form.value.date).getTime() : undefined
      }
    ];
    const response = await store.createTransaction(payload as any);
    if (response?.success) {
      $q.notify({ type: "positive", message: "Transaction added!" });
      form.value = {
        amount: null,
        note: "",
        walletId: null,
        delegatedWalletId: null,
        categoryId: null,
        mustPayTransactionId: null,
        date: today()
      };
      await store.fetchInitialData();
    }
  } catch {
    $q.notify({ type: "negative", message: "Failed to add transaction" });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  store.fetchWallets();
  store.fetchCategories();
  store.fetchCurrentMonthPeriod();
  store.fetchMustPay();
});

watch(
  () => store.wallets,
  wallets => {
    if (!form.value.walletId && wallets.length > 0) {
      const defaultWallet = wallets.find(w => w.isDefault && !w.isDelegated);
      if (defaultWallet) {
        form.value.walletId = defaultWallet.id;
      }
    }
  },
  { immediate: true }
);

watch(
  () => form.value.mustPayTransactionId,
  val => {
    if (val) {
      form.value.delegatedWalletId = null;
    }
  }
);

watch(
  () => form.value.delegatedWalletId,
  val => {
    if (val) {
      form.value.mustPayTransactionId = null;
    }
  }
);

watch(
  () => store.categories,
  categories => {
    if (!form.value.categoryId && categories.length > 0) {
      const defaultCategory = categories.find(c => c.isDefault);
      if (defaultCategory) {
        form.value.categoryId = defaultCategory.id;
      }
    }
  },
  { immediate: true }
);
</script>
