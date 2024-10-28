import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Pagination from "../../components/Pagination";
import * as apiClient from "../../api-clients";
import { IconContext } from "react-icons";
import { useAppContext } from "../../contexts/AppContext";
import { FaSearch, FaTimes } from "react-icons/fa";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";
import { refDateTime } from "../../utils";

export type TransactionStatus = "Approved" | "Declined" | "Pending" | "Paid";

export interface TransactionType {
  _id: string;
  userId: string;
  userName: string;
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

const ApprovedWithdrawals = () => {
  const [pageCount, setPageCount] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem("searchAWithdrawalsQuery") || ""
  );
  const [filteredWithdrawals, setFilteredWithdrawals] = useState(
    [] as TransactionType[]
  );
  const { showToast } = useAppContext();

  const {
    data,
    isLoading,
    refetch: refetchWithdrawals,
  } = useQuery(
    "getApprovedWithdrawals",
    () => apiClient.getWithdrawals({ currentPage, status: "Paid" }),
    {
      onSuccess: (data) => {
        setPageCount(data.pageCount);
      },
      onError: (err: Error) => {
        console.log(err.message);
        setFilteredWithdrawals([]);
        showToast({ type: "ERROR", message: err.message });
      },
    }
  );

  const { refetch: refetchSearch, isLoading: sIsLoading } = useQuery(
    "searchApprovedWithdrawals",
    () =>
      apiClient.searchTransactions({
        searchQuery,
        currentPage,
        status: "Paid",
        type: "withdrawal",
      }),
    {
      enabled: false,
      onSuccess: (data) => {
        setFilteredWithdrawals(data.docs);
        setPageCount(data.totalPages);
      },
      onError: (err: Error) => {
        console.log(err.message);
        setFilteredWithdrawals([]);
        showToast({ type: "ERROR", message: err.message });
      },
    }
  );

  const withdrawals =
    filteredWithdrawals.length >= 1
      ? filteredWithdrawals
      : data && data.withdrawals.length > 0
      ? data.withdrawals
      : [];

  const { mutate: determineTransact, isLoading: isProcessing } = useMutation(
    ({ status, id }: { status: string; id: string }) =>
      apiClient.processTransanct(status, id, "withdrawal"),
    {
      onSuccess: (data) => {
        refetchWithdrawals();
        showToast({ type: "SUCCESS", message: data.message });
      },
      onError: (err: Error) => {
        showToast({ type: "ERROR", message: err.message });
      },
    }
  );

  const handleTransact = (status: string, id: string) => {
    determineTransact({ status, id });
  };

  useEffect(() => {
    if (searchQuery === "") {
      refetchWithdrawals();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
      let id: any;
      clearTimeout(id);
      id = setTimeout(() => refetchSearch(), 1000);
    }
  }, [currentPage, refetchWithdrawals, refetchSearch, searchQuery]);

  const onPageChange = (e: { selected: number }) => {
    setCurrentPage(e.selected);
  };

  const handleSearch = () => {
    refetchSearch();
    localStorage.setItem("searchAWithdrawalsQuery", searchQuery);
  };

  if (isLoading) {
    return (
      <div className="mx-4 flex flex-col gap-5 flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Approved Withdrawals</span>
        </div>
        <div className="flex justify-center items-center font-semibold text-lg h-full">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!data && withdrawals.length === 0) {
    return (
      <div className="mx-4 flex flex-col gap-5 flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Approved Withdrawals</span>
        </div>
        <div className="flex justify-center items-center font-semibold text-lg h-full">
          <span>No Approved Withdrawals</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 flex flex-col gap-5 flex-1">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">Approved Withdrawals</span>
      </div>

      <div className="flex self-end">
        <input
          type="text"
          className="px-5 py-2 flex-1 outline-none bg-gray-500 bg-opacity-10 text-sm focus:border focus:bg-white focus:border-my-blue"
          placeholder="Search by username, email or phone number"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            localStorage.setItem("searchAWithdrawalsQuery", searchQuery);
            if (e.target.value === "") {
              setFilteredWithdrawals([]);
              localStorage.removeItem("searchAWithdrawalsQuery");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button
          onClick={handleSearch}
          className="p-4 bg-my-blue flex justify-center items-center text-white"
        >
          {sIsLoading ? (
            <CgSpinner className="animate-spin font-extrabold text-lg" />
          ) : (
            <FaSearch />
          )}
        </button>
      </div>

      <div className="overflow-x-auto shadow-my-shadow">
        <table className="border-collapse text-sm overflow-hidden w-full">
          <thead className="bg-my-blue">
            <tr className="bg-my-blue text-white">
              <th className="text-center py-4 px-6 font-semibold">Username</th>
              <th className="text-center py-4 px-6 font-semibold">Amount</th>
              <th className="text-center py-4 px-6 font-semibold">Charge</th>
              <th className="text-center py-4 px-6 font-semibold">Return Amount</th>
              <th className="text-center py-4 px-6 font-semibold">Time</th>
              <th className="text-center py-4 px-6 font-semibold">Status</th>
              <th className="text-center py-4 px-6 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {withdrawals.map((withdrawal: TransactionType, i: number) => (
              <tr
                key={i}
                className={`${
                  i < withdrawals.length - 1 && "border-b border-slate-200"
                } py-4 text-slate-600`}
              >
                <td className="text-center py-4 px-6 capitalize">
                  {withdrawal.userName}
                </td>
                <td className="text-center py-4 px-6">
                  {withdrawal.amount}
                </td>
                <td className="text-center py-4 px-6">
                  {withdrawal.charge}
                </td>
                <td className="text-center py-4 px-6">
                  {withdrawal.returnAmt}
                </td>
                <td className="text-center py-4 px-6">
                  {refDateTime(withdrawal.createdAt)}
                </td>
                <td className="text-center py-4 px-6">
                  <span
                    className={`mx-auto ${
                      withdrawal.status === "Approved" ||
                      withdrawal.status === "Paid"
                        ? "border border-green-500 text-green-500 bg-green-500"
                        : withdrawal.status === "Pending"
                        ? "border border-blue-500 text-blue-500 bg-blue-500"
                        : "border border-red-500 text-red-500 bg-red-500"
                    } rounded-full text-xs px-5 py-1 bg-opacity-10`}
                  >
                    {withdrawal.status}
                  </span>
                </td>
                <td
                  className={`text-center py-4 px-6 flex gap-2 justify-center items-center`}
                >
                  {withdrawal.status === "Pending" ? (
                     <>
                     <button
                       className="bg-green-500 p-2 rounded-md"
                       onClick={() => {
                         handleTransact("approve", withdrawal._id);
                         console.log(withdrawal._id);
                       }}
                       disabled={isProcessing}
                     >
                       <IconContext.Provider
                         value={{ className: "font-bold text-white" }}
                       >
                         <IoCheckmarkDoneSharp />
                       </IconContext.Provider>
                     </button>
                     <button
                       className="bg-red-500 p-2 rounded-md"
                       onClick={() => handleTransact("decline", withdrawal._id)}
                       disabled={isProcessing}
                     >
                       <IconContext.Provider
                         value={{ className: "font-bold text-white" }}
                       >
                         <FaTimes />
                       </IconContext.Provider>
                     </button>
                   </>
                  ) : (
                    `Withdrawal ${withdrawal.status}`
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount && pageCount > 1 && (
        <Pagination pageCount={pageCount} onPageChange={onPageChange} />
      )}
    </div>
  );
};

export default ApprovedWithdrawals;
