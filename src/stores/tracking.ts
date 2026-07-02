import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import type { GenericResponseData } from '@/models/GenericResponseData';
import type { Wallet } from '@/models/Wallet';
import type { MustPayItem } from '@/models/MustPay';
import type { CreateTransactionRequest, TransferRequest } from '@/models/Transaction';
import type { PayMustpayRequest } from '@/models/MustPay';

export const useTrackingStore = defineStore('tracking', {
  state: () => ({
    wallets: [] as Wallet[],
    totalBalance: 0,
    perDay: 0,
    dayLeft: 0,
    mustPayItems: [] as MustPayItem[],
    loading: false,
  }),

  actions: {
    async fetchWallets() {
      try {
        const res = await api.get('/tind_tracking/wallets', { withCredentials: true });
        const data = res.data as GenericResponseData<Wallet[]>;
        if (data.success) {
          this.wallets = data.data;
        }
        return data;
      } catch (error) {
        console.error('Failed to fetch wallets:', error);
      }
    },

    async fetchWalletSummary() {
      try {
        const res = await api.get('/tind_tracking/wallets/summary', { withCredentials: true });
        const data = res.data as GenericResponseData<any>;
        return data;
      } catch (error) {
        console.error('Failed to fetch wallet summary:', error);
      }
    },

    async fetchMustPay(monthPeriodId?: string) {
      try {
        const params = monthPeriodId ? { monthPeriodId } : {};
        const res = await api.get('/tind_tracking/mustpay', {
          params,
          withCredentials: true,
        });
        const data = res.data as GenericResponseData<MustPayItem[]>;
        if (data.success) {
          this.mustPayItems = data.data;
        }
        return data;
      } catch (error) {
        console.error('Failed to fetch must-pay items:', error);
      }
    },

    async createTransaction(request: CreateTransactionRequest[]) {
      try {
        const res = await api.post('/tind_tracking/transactions', request, {
          withCredentials: true,
        });
        return res.data as GenericResponseData<any>;
      } catch (error) {
        console.error('Failed to create transaction:', error);
        throw error;
      }
    },

    async payMustpay(request: PayMustpayRequest[]) {
      try {
        const res = await api.post('/tind_tracking/mustpay-transactions/pay', request, {
          withCredentials: true,
        });
        return res.data as GenericResponseData<any>;
      } catch (error) {
        console.error('Failed to pay must-pay:', error);
        throw error;
      }
    },

    async transfer(request: TransferRequest) {
      try {
        const res = await api.post('/tind_tracking/transfer', request, {
          withCredentials: true,
        });
        return res.data as GenericResponseData<any>;
      } catch (error) {
        console.error('Failed to transfer:', error);
        throw error;
      }
    },

    async fetchInitialData() {
      this.loading = true;
      try {
        await Promise.all([
          this.fetchWallets(),
          this.fetchMustPay(),
          this.fetchWalletSummary(),
        ]);
      } finally {
        this.loading = false;
      }
    },
  },
});
