export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  toWalletId?: string | null;
  amount: number;
  fee: number;
  currencyId: string;
  date: string;
  note: string | null;
  category: string | null;
  monthPeriodId: string;
  mustPayTransactionId?: string | null;
  transactionTypeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  walletId?: string | undefined;
  delegatedWalletId?: string | undefined;
  amount: number;
  currencyId?: string | undefined;
  date?: number | undefined;
  note: string;
  categoryId?: string | undefined;
  monthPeriodId?: string | undefined;
  mustPayTransactionId?: string | undefined;
}

export interface TransferRequest {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  fee?: number;
  currencyId?: string;
  monthPeriodId?: string;
  note: string;
}
