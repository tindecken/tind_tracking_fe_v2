<template>
  <div>
    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6 q-mb-sm">Wallets</div>
            <q-list dense>
              <q-item v-for="wallet in wallets" :key="wallet.id">
                <q-item-section>{{ wallet.name }}</q-item-section>
                <q-item-section side>
                  <span class="text-weight-bold">{{ formatNumber(wallet.balance) }}</span>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-if="mustPayItems.length > 0">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6 q-mb-sm">Must Pay</div>
          <q-list dense>
            <q-item v-for="item in mustPayItems" :key="item.id">
              <q-item-section>{{ item.name }}</q-item-section>
              <q-item-section side>
                <span class="text-weight-bold">{{ formatNumber(item.remainingAmount) }}</span>
                <span class="text-grey text-caption q-ml-xs">/ {{ formatNumber(item.targetAmount) }}</span>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTrackingStore } from '@/stores/tracking';

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const store = useTrackingStore();
const wallets = computed(() => store.wallets);
const mustPayItems = computed(() => store.mustPayItems);
</script>
