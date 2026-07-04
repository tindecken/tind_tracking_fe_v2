import { defineStore } from "pinia";
import { api } from "../boot/axios";
import type { GenericResponseData } from "@/models/GenericResponseData";
import type { Wallet } from "@/models/Wallet";
import type { MustPayItem } from "@/models/MustPay";
import type { Category } from "@/models/Category";
import type { MonthPeriod } from "@/models/MonthPeriod";
import type {
  CreateTransactionRequest,
  Transaction,
  TransferRequest,
} from "@/models/Transaction";
import type { PayMustpayRequest } from "@/models/MustPay";

export interface WalletSummaryData {
  have: number;
  mustpay: number;
  dayRemaining: number;
  balance: number;
  perDay: number;
  wallets: { name: string; balance: number }[];
  delegatedWallets: { name: string; balance: number }[];
  mustPayItems: { name: string; amount: number }[];
  endPeriodDate: string;
}

export const useTrackingStore = defineStore("tracking", {
  state: () => ({
    wallets: [] as Wallet[],
    totalBalance: 0,
    perDay: 0,
    dayLeft: 0,
    mustPayItems: [] as MustPayItem[],
    summary: null as WalletSummaryData | null,
    transactions: [] as Transaction[],
    totalTransactions: 0,
    categories: [] as Category[],
    currentMonthPeriod: null as MonthPeriod | null,
    loading: false,
  }),

  actions: {
    async fetchWallets() {
      try {
        const res = await api.get("/tind_tracking/wallets", {
          withCredentials: true,
        });
        const data = res.data as GenericResponseData<Wallet[]>;
        if (data.success) {
          this.wallets = data.data;
        }
        return data;
      } catch (error) {
        console.error("Failed to fetch wallets:", error);
      }
    },

    async fetchWalletSummary() {
      this.loading = true;
      try {
        const res = await api.get("/tind_tracking/wallets/summary", {
          withCredentials: true,
        });
        const data = res.data as GenericResponseData<WalletSummaryData>;
        if (data.success) {
          this.summary = data.data;
        }
        return data;
      } catch (error) {
        console.error("Failed to fetch wallet summary:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchMustPay(monthPeriodId?: string) {
      try {
        const params = monthPeriodId ? { monthPeriodId } : {};
        const res = await api.get("/tind_tracking/mustpay", {
          params,
          withCredentials: true,
        });
        const data = res.data as GenericResponseData<MustPayItem[]>;
        if (data.success) {
          this.mustPayItems = data.data;
        }
        return data;
      } catch (error) {
        console.error("Failed to fetch must-pay items:", error);
      }
    },

    async createTransaction(request: CreateTransactionRequest[]) {
      try {
        const res = await api.post("/tind_tracking/transactions", request, {
          withCredentials: true,
        });
        return res.data as GenericResponseData<any>;
      } catch (error) {
        console.error("Failed to create transaction:", error);
        throw error;
      }
    },

    async payMustpay(request: PayMustpayRequest[]) {
      try {
        const res = await api.post(
          "/tind_tracking/mustpay-transactions/pay",
          request,
          {
            withCredentials: true,
          },
        );
        return res.data as GenericResponseData<any>;
      } catch (error) {
        console.error("Failed to pay must-pay:", error);
        throw error;
      }
    },

    async transfer(request: TransferRequest) {
      try {
        const res = await api.post("/tind_tracking/transfer", request, {
          withCredentials: true,
        });
        return res.data as GenericResponseData<any>;
      } catch (error) {
        console.error("Failed to transfer:", error);
        throw error;
      }
    },

    async reconcileWallets(items: { walletId: string; balance: number }[]) {
      try {
        const res = await api.post("/tind_tracking/transactions/reconcile", items, {
          withCredentials: true,
        });
        return res.data as GenericResponseData<any>;
      } catch (error) {
        console.error("Failed to reconcile:", error);
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

    async fetchTransactions() {
      this.loading = true;
      try {
        const res = await api.get("/tind_tracking/transactions", {
          withCredentials: true,
        });
        const data = res.data as GenericResponseData<Transaction[]>;
        if (data.success) {
          this.transactions = data.data;
          this.totalTransactions = data.totalRecords ?? 0;
        }
        return data;
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      try {
        const res = await api.get("/tind_tracking/categories", {
          params: { limit: '100' },
          withCredentials: true,
        });
        const data = res.data as GenericResponseData<Category[]>;
        if (data.success) {
          this.categories = data.data;
        }
        return data;
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    },

    async fetchCurrentMonthPeriod() {
      try {
        const res = await api.get("/tind_tracking/month-periods/current", {
          withCredentials: true,
        });
        const data = res.data as GenericResponseData<MonthPeriod>;
        if (data.success) {
          this.currentMonthPeriod = data.data;
        }
        return data;
      } catch (error) {
        console.error("Failed to fetch current month period:", error);
      }
    },
  },
});
