export interface MustPayItem {
  id: string;
  userId: string;
  monthPeriodId: string;
  name: string;
  targetAmount: number;
  remainingAmount: number;
  currencyId: string;
  categoryId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PayMustpayRequest {
  payWalletId: string;
  mustpayTransactionId: string;
  amount: number;
  note: string;
}
