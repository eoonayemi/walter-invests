import mongoose, { FilterQuery } from "mongoose";
import bcrypt from "bcryptjs";

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
    bonus: number;
    status: "active" | "inactive";
  };
  createdAt: Date;
  updatedAt: Date;
};

const bankSchema = new mongoose.Schema<BankType>({
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  accountName: { type: String, required: true },
});

const adminSchema = new mongoose.Schema<AdminType>(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    bankAccount: bankSchema,
    withdrawalCharge: { type: Number, default: 0 },
    imageUrl: { type: String },
    telegramGroup: { type: String },
    telegramChannel: { type: String },
    dailyBonus: {
      bonus: { type: Number, default: 0 },
      status: { type: String, default: "inactive" },
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const Admin = mongoose.model<AdminType>("Admin", adminSchema);

export default Admin;
