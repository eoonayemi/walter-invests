import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export type InvestmentStatus = "running" | "ended";

export interface InvestmentType {
  _id?: string;
  userId: string;
  userName: string;
  userInviteCode: string;
  planId: string;
  planName: string;
  capital: number;
  amountEarned: number;
  dailyReturn: number;
  endDate: string;
  daysSpent: number;
  totalDays: number;
  totalReturn: number;
  returnType: string;
  status: InvestmentStatus;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

const investmentSchema = new mongoose.Schema<InvestmentType>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userInviteCode: { type: String, required: true },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    capital: { type: Number, required: true },
    amountEarned: { type: Number, required: true },
    dailyReturn: { type: Number, required: true },
    endDate: { type: String, required: true },
    totalDays: { type: Number, required: true },
    totalReturn: { type: Number, required: true },
    returnType: { type: String, required: true },
    status: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

investmentSchema.plugin(mongoosePaginate);

const Investment = mongoose.model<
  InvestmentType,
  PaginateModel<InvestmentType>
>("Investment", investmentSchema);

export default Investment;
