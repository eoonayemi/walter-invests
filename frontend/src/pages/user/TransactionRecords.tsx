import { IconContext } from "react-icons";
import {
  BsArrowDownLeftCircleFill,
  BsArrowUpRightCircleFill,
} from "react-icons/bs";
import { GiReceiveMoney } from "react-icons/gi";
import { useQuery } from "react-query";
import { TransactionType } from "./DepositRecords";
import * as apiClient from "../../api-clients";
import NoTabLayout from "../../layouts/NoTabLayout";
import { refDateTime } from "../../utils";
import { useAppDispatch } from "../../redux/hooks";
import { onTransactLoad } from "../../redux/transactSlice";

const TransactionRecords = () => {
  const dispatch = useAppDispatch();

  const { data, isLoading } = useQuery(
    "getTransactions",
    apiClient.getMyTransactions
  );

  const transactions = data?.transactions || [];

  if (isLoading) {
    dispatch(onTransactLoad());
    return <NoTabLayout title="Transaction Records" subtitle="Loading..." />;
  }
  if (!transactions || transactions?.length == 0)
    return (
      <NoTabLayout title="Transaction Records" subtitle="No Transactions" />
    );

  return (
    <NoTabLayout title="Transaction Records">
      <div className="flex flex-col gap-[2px] bg-gray-100">
        {transactions?.map((transact: TransactionType, i: number) => (
          <div
            className="flex justify-between items-center bg-white py-5 px-6"
            key={i}
          >
            <div className="flex justify-between items-center gap-3">
              <IconContext.Provider
                value={{ className: "font-bold text-my-blue text-3xl" }}
              >
                {transact.type == "income" ? (
                  <GiReceiveMoney />
                ) : transact.type == "withdrawal" ? (
                  <BsArrowUpRightCircleFill />
                ) : (
                  <BsArrowDownLeftCircleFill />
                )}
              </IconContext.Provider>
              <div className="flex flex-col justify-center capitalize">
                <p>{transact.type}</p>
                <p className="text-gray-400 text-[13px]">
                  {refDateTime(transact.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="font-semibold tracking-wide">{`${
                transact.type == "withdrawal" ? "-" : "+"
              }N${transact.amount}`}</p>
              <p
                className={`${
                  transact.status == "Success" ||
                  transact.status == "Paid" ||
                  transact.status == "Approved"
                    ? "text-green-400"
                    : transact.status == "Pending"
                    ? "text-my-blue"
                    : "text-red-400"
                } text-[13px]`}
              >
                {transact.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </NoTabLayout>
  );
};
export default TransactionRecords;
