import { IconContext } from "react-icons";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { useQuery } from "react-query";
import * as apiClient from "../../api-clients";
import { TransactionType } from "./DepositRecords";
import NoTabLayout from "../../layouts/NoTabLayout";
import { refDateTime } from "../../utils";

const WithdrawalRecords = () => {
  const { data: withdrawals, isLoading } = useQuery(
    "getWithdrawals",
    apiClient.getMyWithdrawals
  );

  if (isLoading)
    return <NoTabLayout title="Withdrawal Records" subtitle="Loading..." />;
  if (!withdrawals || withdrawals.length == 0)
    return (
      <NoTabLayout title="Withdrawal Records" subtitle="No withdrawals" />
    );

  return (
    <NoTabLayout title="Withdrawal Records">
      <div className="flex flex-col gap-[2px] bg-gray-100">
        {withdrawals.map((withdrawal: TransactionType, i: number) => (
          <div
            className="flex justify-between items-center bg-white py-5 px-6"
            key={i}
          >
            <div className="flex justify-between items-center gap-3">
              <IconContext.Provider
                value={{ className: "font-bold text-my-blue text-3xl" }}
              >
                <BsArrowUpRightCircleFill />
              </IconContext.Provider>
              <div className="flex flex-col justify-center">
                <p>Withdrawal</p>
                <p className="text-gray-400 text-[13px]">
                  {refDateTime(withdrawal.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="font-semibold tracking-wide">{`+N${withdrawal.amount}`}</p>
              <p
                className={`${
                  withdrawal.status == "Success" || withdrawal.status == "Paid" || withdrawal.status == "Approved"
                  ? "text-green-400" : withdrawal.status == "Pending" ? "text-my-blue"
                  : "text-red-400"
                } text-[13px]`}
              >
                {withdrawal.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </NoTabLayout>
  );
};
export default WithdrawalRecords;
