import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export type PlanStatus = "active" | "disabled";

type Commission = {
  firstRefer: number;
  secondRefer: number;
  thirdRefer: number;
};

export interface PlanType {
  _id: string;
  name: string;
  price: number;
  dailyReturn: number;
  totalReturn: number;
  returnType: string;
  status: PlanStatus;
  imageUrl: string;
  totalDays: number;
  commission: Commission;
  createdAt: string;
  updatedAt: string;
}

const planSchema = new mongoose.Schema<PlanType>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    dailyReturn: { type: Number, required: true },
    returnType: { type: String, required: true },
    totalReturn: { type: Number, required: true },
    status: { type: String, required: true },
    imageUrl: { type: String, required: true },
    totalDays: { type: Number, required: true },
    commission: {
      firstRefer: { type: Number, required: true, default: 0 },
      secondRefer: { type: Number, required: true, default: 0 },
      thirdRefer: { type: Number, required: true, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

planSchema.plugin(mongoosePaginate);

const Plan = mongoose.model<PlanType, PaginateModel<PlanType>>(
  "Plan",
  planSchema
);

export default Plan;
