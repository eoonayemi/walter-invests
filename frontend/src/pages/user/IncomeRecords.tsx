import { IconContext } from "react-icons";
import { GiReceiveMoney } from "react-icons/gi";
import NoTabLayout from "../../layouts/NoTabLayout";
import * as apiClient from "../../api-clients";
import { useQuery } from "react-query";
import { TransactionType } from "./DepositRecords";
import { refDateTime } from "../../utils";

const IncomeRecords = () => {
  const { data: incomes, isLoading } = useQuery(
    "getIncomes",
    apiClient.getMyIncomes
  );

  if (isLoading)
    return <NoTabLayout title="Income Records" subtitle="Loading..." />;
  if (incomes?.length === 0)
    return <NoTabLayout title="Income Records" subtitle="No Incomes" />;

  return (
    <NoTabLayout title="Income Records">
      <div className="flex flex-col gap-[2px] bg-gray-100">
        {incomes?.map((income: TransactionType, i: number) => (
          <div
            className="flex justify-between items-center bg-white py-5 px-6"
            key={i}
          >
            <div className="flex justify-between items-center gap-3">
              <IconContext.Provider
                value={{ className: "font-bold text-my-blue text-3xl" }}
              >
                <GiReceiveMoney />
              </IconContext.Provider>
              <div className="flex flex-col justify-center">
                <p>Income</p>
                <p className="text-gray-400 text-[13px]">
                  {refDateTime(income.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="font-semibold tracking-wide">{`+N${income.amount}`}</p>
              <p
                className={`${
                  income.status == "Success" ||
                  income.status == "Paid" ||
                  income.status == "Approved"
                    ? "text-green-400"
                    : income.status == "Pending"
                    ? "text-my-blue"
                    : "text-red-400"
                } text-[13px]`}
              >
                {income.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </NoTabLayout>
  );
};
export default IncomeRecords;
