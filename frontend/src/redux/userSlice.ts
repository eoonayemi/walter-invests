import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type BankDetailsType = {
  _id?: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankType: string;
};

export type Referral = {
  firstRefer: {
    bonus: number;
    members: number;
  };
  secondRefer: {
    bonus: number;
    members: number;
  };
  thirdRefer: {
    bonus: number;
    members: number;
  };
};

export type UserType = {
  _id?: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  inviteCode: string;
  referredBy?: string;
  imageUrl?: string;
  status: string;
  bankDetails?: BankDetailsType[];
  depositBalance: number;
  withdrawableBalance: number;
  referral: Referral;
  createdAt: string;
  updatedAt: string;
};

interface userState {
  isLoading: boolean;
  user: UserType | null;
  error: null | string;
}

// Define the initial state using that type
const initialState = {
  isLoading: false,
  user: null,
  error: null,
} as userState;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    onLogInStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.user = null;
    },
    onLogInSuccess: (state, action: PayloadAction<UserType>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    },
    onLogInError: (state, action: PayloadAction<Error>) => {
      state.isLoading = false;
      state.error = action.payload.message;
      state.user = null;
    },
    onEditStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    onEditSuccess: (state, action: PayloadAction<UserType>) => {
      state.isLoading = false;
      state.user = action.payload;
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
      state.user = null;
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
} = userSlice.actions;

export default userSlice.reducer;
