import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type TransactType = {
  totalIncome: number;
  totalRecharge: number;
  totalAssets: number;
  totalWithdraw: number;
  todayIncome: number;
  teamIncome: number;
};

interface TransactState {
  isLoading: boolean;
  transact: TransactType | null;
  error: null | string;
}

// Define the initial state using that type
const initialState = {
  isLoading: false,
  transact: null,
  error: null,
} as TransactState;

export const transactSlice = createSlice({
  name: "transact",
  initialState,
  reducers: {
    onTransactLoad: (state) => {
      state.isLoading = true;
    },
    onTransactSuccess: (state, action: PayloadAction<TransactType>) => {
      state.isLoading = false;
      state.transact = action.payload;
      state.error = null;
    },
    onTransactError: (state, action: PayloadAction<Error>) => {
      state.isLoading = false;
      state.error = action.payload.message;
      
    },
    onUserLogout:  (state) => {
      state.transact = null;
      state.error = null;
      state.isLoading = false;
  },
}
});

export const {
    onTransactLoad,
    onTransactSuccess,
    onTransactError,
    onUserLogout
} = transactSlice.actions;

export default transactSlice.reducer;
