export interface Wallet {
  id: string;
  userId: string;
  name: string;
  isDefault: boolean;
  isDelegated: boolean;
  isSaving: boolean;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletSummary {
  wallets: Wallet[];
  totalBalance: number;
  perDay?: number;
  dayLeft?: number;
}
