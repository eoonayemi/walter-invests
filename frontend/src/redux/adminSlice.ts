import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type BankType = {
  _id?: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
};

export type AdminType = {
  _id: string;
  userName: string;
  email: string;
  password: string;
  role: string;
  bankAccount?: BankType;
  withdrawalCharge: number;
  imageUrl?: string;
  telegramGroup: string;
  telegramChannel: string;
  dailyBonus: {
    bonus: number,
    status: "active" | "inactive";
  };
  createdAt: Date;
  updatedAt: Date;
};

interface AdminState {
  isLoading: boolean;
  admin: AdminType | null;
  error: null | string;
}

// Define the initial state using that type
const initialState = {
  isLoading: false,
  admin: null,
  error: null,
} as AdminState;

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    onLogInStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.admin = null;
    },
    onLogInSuccess: (state, action: PayloadAction<AdminType>) => {
      state.isLoading = false;
      if (!action.payload.bankAccount) {
        state.admin = { ...action.payload, bankAccount: {} as BankType };
      } else {
        state.admin = action.payload;
      }
      state.error = null;
    },
    onLogInError: (state, action: PayloadAction<Error>) => {
      state.isLoading = false;
      state.error = action.payload.message;
      state.admin = null;
    },
    onEditStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    onEditSuccess: (state, action: PayloadAction<AdminType>) => {
      state.isLoading = false;
      state.admin = action.payload;
      state.error = null;
    },
    onEditError: (state, action: PayloadAction<Error>) => {
      state.isLoading = false;
      state.error = action.payload.message;
    },
    onLogOutStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    onLogOutSuccess: (state) => {
      state.isLoading = false;
      state.admin = null;
      state.error = null;
    },
    onLogOutError: (state, action: PayloadAction<Error>) => {
      state.isLoading = false;
      state.error = action.payload.message;
    },
  },
});

export const {
  onLogInStart,
  onLogInSuccess,
  onLogInError,
  onEditStart,
  onEditSuccess,
  onEditError,
  onLogOutStart,
  onLogOutSuccess,
  onLogOutError,
} = adminSlice.actions;

export default adminSlice.reducer;
