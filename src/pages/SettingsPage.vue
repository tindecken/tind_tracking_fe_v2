<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <q-btn flat round icon="arrow_back" @click="$router.push('/')" />
      <span class="text-h6 q-ml-sm">Settings</span>
    </div>
    <q-tabs v-model="tab" no-caps class="shadow-2">
      <q-tab name="monthPeriods" label="Month Periods" />
      <q-tab name="mustPay" label="Must Pay" />
      <q-tab name="transactions" label="Transactions" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="monthPeriods" class="q-pl-none q-pr-none">
        <month-period-settings />
      </q-tab-panel>
      <q-tab-panel name="mustPay" class="q-pl-none q-pr-none">
        <mustpay-settings />
      </q-tab-panel>
      <q-tab-panel name="transactions" class="q-pl-none q-pr-none">
        <transaction-settings />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MonthPeriodSettings from '@/components/settings/MonthPeriodSettings.vue';
import MustpaySettings from '@/components/settings/MustpaySettings.vue';
import TransactionSettings from '@/components/settings/TransactionSettings.vue';

const tab = ref('monthPeriods');
</script>
