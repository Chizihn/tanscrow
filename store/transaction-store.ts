import { Transaction } from "@/types/transaction";
import { create } from "zustand";

interface TransactionState {
  transaction: Partial<Transaction> | null;
  setTransaction: (transaction: Partial<Transaction> | null) => void;
}

export const useTransactionStore = create<TransactionState>()((set) => ({
  transaction: null,
  setTransaction: (transaction) =>
    set((state) => ({
      ...state,
      transaction,
    })),
}));
