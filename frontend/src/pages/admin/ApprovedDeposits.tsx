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

const ApprovedDeposits = () => {
  const [pageCount, setPageCount] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem("searchADepositsQuery") || ""
  );
  const [filteredDeposits, setFilteredDeposits] = useState(
    [] as TransactionType[]
  );
  const { showToast } = useAppContext();

  const {
    data,
    isLoading,
    refetch: refetchDeposits,
  } = useQuery(
    "getApprovedDeposits",
    () => apiClient.getDeposits({ currentPage, status: "Approved" }),
    {
      onSuccess: (data) => {
        setPageCount(data.pageCount);
      },
      onError: (err: Error) => {
        console.log(err.message);
        setFilteredDeposits([]);
        showToast({ type: "ERROR", message: err.message });
      },
    }
  );

  const { refetch: refetchSearch, isLoading: sIsLoading } = useQuery(
    "searchAllDeposits",
    () =>
      apiClient.searchTransactions({
        searchQuery,
        currentPage,
        status: "Approved",
        type: "deposit",
      }),
    {
      enabled: false,
      onSuccess: (data) => {
        setFilteredDeposits(data.docs);
        setPageCount(data.totalPages);
      },
      onError: (err: Error) => {
        console.log(err.message);
        setFilteredDeposits([]);
        showToast({ type: "ERROR", message: err.message });
      },
    }
  );

  const deposits =
    filteredDeposits.length >= 1
      ? filteredDeposits
      : data && data.deposits.length > 0
      ? data.deposits
      : [];

  const { mutate: determineTransact, isLoading: isProcessing } = useMutation(
    ({ status, id }: { status: string; id: string }) =>
      apiClient.processTransanct(status, id, "deposit"),
    {
      onSuccess: (data) => {
        refetchDeposits();
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
      refetchDeposits();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
      let id: any;
      clearTimeout(id);
      id = setTimeout(() => refetchSearch(), 1000);
    }
  }, [currentPage, refetchDeposits, refetchSearch, searchQuery]);

  const onPageChange = (e: { selected: number }) => {
    setCurrentPage(e.selected);
  };

  const handleSearch = () => {
    refetchSearch();
    localStorage.setItem("searchADepositsQuery", searchQuery);
  };

  if (isLoading) {
    return (
      <div className="mx-4 flex flex-col gap-5 flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Approved Deposits</span>
        </div>
        <div className="flex justify-center items-center font-semibold text-lg h-full">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!data && deposits.length === 0) {
    return (
      <div className="mx-4 flex flex-col gap-5 flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Approved Deposits</span>
        </div>
        <div className="flex justify-center items-center font-semibold text-lg h-full">
          <span>No Approved Deposits</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 flex flex-col gap-5 flex-1">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">Approved Deposits</span>
      </div>

      <div className="flex self-end">
        <input
          type="text"
          className="px-5 py-2 flex-1 outline-none bg-gray-500 bg-opacity-10 text-sm focus:border focus:bg-white focus:border-my-blue"
          placeholder="Search by username, ref ID or status"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            localStorage.setItem("searchADepositsQuery", searchQuery);
            if (e.target.value === "") {
              setFilteredDeposits([]);
              localStorage.removeItem("searchADepositsQuery");
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
              <th className="text-center py-4 px-6 font-semibold">Ref ID</th>
              <th className="text-center py-4 px-6 font-semibold">Amount</th>
              <th className="text-center py-4 px-6 font-semibold">
                Payment Proof
              </th>
              <th className="text-center py-4 px-6 font-semibold">Time</th>
              <th className="text-center py-4 px-6 font-semibold">Status</th>
              <th className="text-center py-4 px-6 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {deposits.map((deposit: TransactionType, i: number) => (
              <tr
                key={i}
                className={`${
                  i < deposits.length - 1 && "border-b border-slate-200"
                } py-4 text-slate-600`}
              >
                <td className="text-center py-4 px-6 capitalize">{deposit.userName}</td>
                <td className="text-center py-4 px-6">{deposit.refId}</td>
                <td className="text-center py-4 px-6">{deposit.amount}</td>
                <td className="text-center py-4 px-6">
                  {deposit.paymentProof ? (
                    <img
                      src={deposit.paymentProof}
                      alt="payment's proof"
                      className="mx-auto w-16 h-8"
                    />
                  ) : (
                    "No prove"
                  )}
                </td>
                <td className="text-center py-4 px-6">{refDateTime(deposit.createdAt)}</td>
                <td className="text-center py-4 px-6">
                  <span
                    className={`mx-auto ${
                      deposit.status === "Approved"
                        ? "border border-green-500 text-green-500 bg-green-500"
                        : deposit.status === "Pending"
                        ? "border border-blue-500 text-blue-500 bg-blue-500"
                        : "border border-red-500 text-red-500 bg-red-500"
                    } rounded-full text-xs px-5 py-1 bg-opacity-10`}
                  >
                    {deposit.status}
                  </span>
                </td>
                <td
                  className={`text-center py-4 px-6 flex gap-2 justify-center items-center`}
                >
                  {deposit.status === "Pending" ? (
                    <>
                      <button
                        className="bg-green-500 p-2 rounded-md"
                        onClick={() => {
                          handleTransact("approve", deposit._id);
                          console.log(deposit._id);
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
                        onClick={() => handleTransact("decline", deposit._id)}
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
                    `Deposit ${deposit.status}`
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

export default ApprovedDeposits;
