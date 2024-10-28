import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Pagination from "../../components/Pagination";
import * as apiClient from "../../api-clients";
import { useAppContext } from "../../contexts/AppContext";
import { CgSpinner } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import { refDateTime } from "../../utils";

export type TransactionStatus = "Approved" | "Declined" | "Pending";

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

const Transactions = () => {
  const [pageCount, setPageCount] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem("searchTransactionsQuery") || ""
  );
  const [filteredTransactions, setFilteredTransactions] = useState(
    [] as TransactionType[]
  );
  const { showToast } = useAppContext();

  const {
    data,
    isLoading,
    refetch: refetchTransacts,
  } = useQuery(
    "getTransactions",
    () => apiClient.getTransactions({ currentPage, status: "All" }),
    {
      onSuccess: (data) => {
        setPageCount(data.pageCount);
      },
      onError: (err: Error) => {
        console.log(err.message);
        setFilteredTransactions([]);
        showToast({ type: "ERROR", message: err.message });
      },
      enabled: false,
    }
  );

  const { refetch: refetchSearch, isLoading: sIsLoading } = useQuery(
    "searchAllTransactions",
    () =>
      apiClient.searchTransactions({
        searchQuery,
        currentPage,
        status: "All",
        type: "transaction",
      }),
    {
      enabled: false,
      onSuccess: (data) => {
        setFilteredTransactions(data.docs);
        setPageCount(data.totalPages);
      },
      onError: (err: Error) => {
        console.log(err.message);
        setFilteredTransactions([]);
        showToast({ type: "ERROR", message: err.message });
      },
    }
  );

  const transactions =
    filteredTransactions.length >= 1
      ? filteredTransactions
      : data && data.transactions.length > 0
      ? data.transactions
      : [];

  useEffect(() => {
    if (searchQuery === "") {
      refetchTransacts();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
      let id: any;
      clearTimeout(id);
      id = setTimeout(() => refetchSearch(), 1000);
    }
  }, [currentPage, refetchTransacts, refetchSearch, searchQuery]);

  const onPageChange = (e: { selected: number }) => {
    setCurrentPage(e.selected);
  };

  const handleSearch = () => {
    refetchSearch();
    localStorage.setItem("searchTransactionsQuery", searchQuery);
  };

  if (isLoading) {
    return (
      <div className="mx-4 flex flex-col gap-5 flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">All Transactions</span>
        </div>
        <div className="flex justify-center items-center font-semibold text-lg h-full">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!data && transactions.length === 0) {
    return (
      <div className="mx-4 flex flex-col gap-5 flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">All Transactions</span>
        </div>
        <div className="flex justify-center items-center font-semibold text-lg h-full">
          <span>No Transactions</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 flex flex-col gap-5 flex-1">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">All Transactions</span>
      </div>

      <div className="flex self-end">
        <input
          type="text"
          className="px-5 py-2 flex-1 outline-none bg-gray-500 bg-opacity-10 text-sm focus:border focus:bg-white focus:border-my-blue"
          placeholder="Search by username, email or phone number"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            localStorage.setItem("searchTransactionsQuery", searchQuery);
            if (e.target.value === "") {
              setFilteredTransactions([]);
              localStorage.removeItem("searchTransactionsQuery");
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
              <th className="text-center py-4 px-6 font-semibold">Type</th>
              <th className="text-center py-4 px-6 font-semibold">Amount</th>
              <th className="text-center py-4 px-6 font-semibold">Time</th>
              <th className="text-center py-4 px-6 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {transactions.map((transaction: TransactionType, i: number) => (
              <tr
                key={i}
                className={`${
                  i < transactions.length - 1 && "border-b border-slate-200"
                } py-4 text-slate-600`}
              >
                <td className="text-center py-4 px-6 capitalize">
                  {transaction.userName}
                </td>
                <td className="text-center py-4 px-6 capitalize">{transaction.type}</td>
                <td className="text-center py-4 px-6">{transaction.amount}</td>
                <td className="text-center py-4 px-6">
                  {refDateTime(transaction.createdAt)}
                </td>
                <td className="text-center py-4 px-6">
                  <span
                    className={`mx-auto ${
                      transaction.status === "Approved"
                        ? "border border-green-500 text-green-500 bg-green-500"
                        : transaction.status === "Pending"
                        ? "border border-blue-500 text-blue-500 bg-blue-500"
                        : "border border-red-500 text-red-500 bg-red-500"
                    } rounded-full text-xs px-5 py-1 bg-opacity-10`}
                  >
                    {transaction.status}
                  </span>
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

export default Transactions;
