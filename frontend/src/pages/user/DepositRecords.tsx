import { IconContext } from "react-icons";
import { BsArrowDownLeftCircleFill } from "react-icons/bs";
import { useQuery } from "react-query";
import * as apiClient from "../../api-clients";
import NoTabLayout from "../../layouts/NoTabLayout";
import { refDateTime } from "../../utils";

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
  charge?: string;
  returnAmt?: string;
  subType?: string;
  createdAt: string;
  updatedAt: string;
}

const DepositRecords = () => {
  const { data: deposits, isLoading } = useQuery(
    "getDeposits",
    apiClient.getMyDeposits
  );

  if (isLoading)
    return <NoTabLayout title="Deposit Records" subtitle="Loading..." />;
  if (!deposits || deposits.length == 0)
    return <NoTabLayout title="Deposit Records" subtitle="No deposits yet" />;

  return (
    <NoTabLayout title="Deposit Records">
      <div className="flex flex-col gap-[2px] bg-gray-100">
        {deposits.map((deposit: TransactionType, i: number) => (
          <div
            className="flex justify-between items-center bg-white py-5 px-6"
            key={i}
          >
            <div className="flex justify-between items-center gap-3">
              <IconContext.Provider
                value={{ className: "font-bold text-my-blue text-3xl" }}
              >
                <BsArrowDownLeftCircleFill />
              </IconContext.Provider>
              <div className="flex flex-col justify-center">
                <p>Deposit</p>
                <p className="text-gray-400 text-[13px]">
                  {refDateTime(deposit.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="font-semibold tracking-wide">{`+N${deposit.amount}`}</p>
              <p
                className={`${
                  deposit.status == "Success" ||
                  deposit.status == "Paid" ||
                  deposit.status == "Approved"
                    ? "text-green-400"
                    : deposit.status == "Pending"
                    ? "text-my-blue"
                    : "text-red-400"
                } text-[13px]`}
              >
                {deposit.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </NoTabLayout>
  );
};
export default DepositRecords;
