<template>
  <q-page padding class="q-pt-md">
    <q-tabs v-model="tab" no-caps class="shadow-2">
      <q-tab name="summary" label="Summary" />
      <q-tab name="addTransaction" label="Add Transaction" />
      <q-tab name="transactions" label="Transactions" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="summary" class="q-pl-none q-pr-none">
        <summary-report />
      </q-tab-panel>

      <q-tab-panel name="addTransaction" class="q-pl-none q-pr-none">
        <div class="q-gutter-sm q-mb-sm">
          <q-radio v-model="radio" val="default" label="Default" />
          <q-radio v-model="radio" val="transfer" label="Transfer" />
          <q-radio v-model="radio" val="reconcile" label="Reconcile" />
        </div>
        <q-card v-if="radio === 'default'" class="q-pa-xs">
          <add-transaction />
        </q-card>
        <q-card v-if="radio === 'transfer'" class="q-pa-xs">
          <transfer-form />
        </q-card>
        <q-card v-if="radio === 'reconcile'" class="q-pa-xs">
          <reconcile-form />
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="transactions" class="q-pl-none q-pr-none">
        <transaction-list />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SummaryReport from "@/components/SummaryReport.vue";
import AddTransaction from "@/components/AddTransaction.vue";
import TransferForm from "@/components/TransferForm.vue";
import ReconcileForm from "@/components/ReconcileForm.vue";
import TransactionList from "@/components/TransactionList.vue";

const tab = ref("summary");
const radio = ref("default");
</script>
