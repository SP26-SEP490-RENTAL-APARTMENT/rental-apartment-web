export interface LandlordWallet {
  pendingBalance: number;
  availableBalance: number;
  totalBalance: number;
  updatedAt: string;
}

export interface LandlordPayout {
    payoutId: string;
    amount: number;
    status: string
    message: string;
    createdAt: string;
    updatedAt: string;
}