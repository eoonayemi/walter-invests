import mongoose, { PaginateModel, FilterQuery } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import bcrypt from "bcryptjs";

export type BankDetailsType = {
  _id?: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankType: string;
};

type Referral = {
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
  lastBonus?: string;
  referral: Referral;
  createdAt: string;
  updatedAt: string;
};

const bankSchema = new mongoose.Schema<BankDetailsType>({
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  accountName: { type: String, required: true },
  bankType: { type: String, required: true },
});

const userSchema = new mongoose.Schema<UserType>(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    inviteCode: { type: String, required: true },
    referredBy: { type: String, required: false },
    imageUrl: { type: String, required: false },
    status: { type: String, required: true },
    bankDetails: [bankSchema],
    depositBalance: { type: Number, default: 0 },
    withdrawableBalance: { type: Number, required: true },
    lastBonus: { type: String, required: false },
    referral: {
      firstRefer: {
        bonus: { type: Number, required: true, default: 0 },
        members: { type: Number, required: true, default: 0 },
      },
      secondRefer: {
        bonus: { type: Number, required: true, default: 0 },
        members: { type: Number, required: true, default: 0 },
      },
      thirdRefer: {
        bonus: { type: Number, required: true, default: 0 },
        members: { type: Number, required: true, default: 0 },
      },
    },
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePaginate);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model<UserType, PaginateModel<UserType>>(
  "User",
  userSchema
);

export default User;
