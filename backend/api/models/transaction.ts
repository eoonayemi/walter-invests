import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export type TransactionStatus =
  | "Approved"
  | "Declined"
  | "Pending"
  | "Paid"
  | "Success";

export interface TransactionType {
  _id: string;
  userId: string;
  userName?: string;
  refId?: string;
  type: string;
  amount: number;
  status: TransactionStatus;
  paymentProof?: string;
  charge?: number;
  senderName?: string;
  returnAmt?: number;
  bankType?: string;
  subType?: string;
  createdAt: string;
  updatedAt: string;
}

const transactionSchema = new mongoose.Schema<TransactionType>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: false },
    refId: { type: String, required: false },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    paymentProof: { type: String, required: false },
    charge: { type: Number, required: false },
    senderName: { type: String, required: false },
    returnAmt: { type: Number, required: false },
    bankType: { type: String, required: false },
    subType: { type: String, required: false },
  },
  { timestamps: true }
);

transactionSchema.plugin(mongoosePaginate);

const Transaction = mongoose.model<
  TransactionType,
  PaginateModel<TransactionType>
>("Transaction", transactionSchema);
export default Transaction;
