import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Pagination from "../../components/Pagination";
import * as apiClient from "../../api-clients";
import { useAppContext } from "../../contexts/AppContext";
import { CgSpinner } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import InvestmentTable from "../../components/InvestmentTable";

export type InvestmentStatus = "running" | "ended";

export interface InvestmentType {
  _id: string;
  userId: string;
  userName: string;
  userInviteCode: string;
  planName: string;
  capital: number;
  amountEarned: number;
  dailyReturn: number;
  elapseDate: string;
  daysSpent: number;
  totalDays: number;
  totalReturn: number;
  interestType: string;
  status: InvestmentStatus;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

const Investments = () => {
  const [pageCount, setPageCount] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem("searchInvestmentsQuery") || ""
  );
  const [filteredInvestments, setFilteredInvestments] = useState(
    [] as InvestmentType[]
  );
  const { showToast } = useAppContext();

  const {
    data,
    isLoading,
    refetch: refInvests,
  } = useQuery(
    "getInvestments",
    () => apiClient.getInvestments({ currentPage }),
    {
      onSuccess: (data) => {
        setPageCount(data.pageCount);
      },
      onError: (err: Error) => {
        console.log(err.message);
        setFilteredInvestments([]);
        showToast({ type: "ERROR", message: err.message });
      },
      enabled: false,
    }
  );

  const { refetch: refetchSearch, isLoading: sIsLoading } = useQuery(
    "searchAllInvestments",
    () => apiClient.searchInvestments({ searchQuery, currentPage }),
    {
      enabled: false,
      onSuccess: (data) => {
        setFilteredInvestments(data.docs);
        setPageCount(data.totalPages);
      },
      onError: (err: Error) => {
        console.log(err.message);
        setFilteredInvestments([]);
        showToast({ type: "ERROR", message: err.message });
      },
    }
  );

  const investments =
    filteredInvestments.length >= 1
      ? filteredInvestments
      : data && data.investments.length > 0
      ? data.investments
      : [];

  console.log(data)

  useEffect(() => {
    if (searchQuery === "") {
      refInvests();
    } else {
       // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
       let id: any;
       clearTimeout(id)
       id = setTimeout(() => refetchSearch(), 1000)
    }
  }, [currentPage, refInvests, refetchSearch, searchQuery]);

  const onPageChange = (e: { selected: number }) => {
    setCurrentPage(e.selected);
  };

  const handleSearch = () => {
    refetchSearch();
    localStorage.setItem("searchInvestmentsQuery", searchQuery);
  };

  if (isLoading) {
    return (
      <div className="mx-4 flex flex-col gap-5 flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">All Investments</span>
        </div>
        <div className="flex justify-center items-center font-semibold text-lg h-full">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!data && investments.length === 0) {
    return (
      <div className="mx-4 flex flex-col gap-5 flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">All Investments</span>
        </div>
        <div className="flex justify-center items-center font-semibold text-lg h-full">
          <span>No Investments</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 flex flex-col gap-5 flex-1">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">All Investments</span>
      </div>

      <div className="flex self-end">
        <input
          type="text"
          className="px-5 py-2 flex-1 outline-none bg-gray-500 bg-opacity-10 text-sm focus:border focus:bg-white focus:border-my-blue"
          placeholder="Search by username, email or phone number"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            localStorage.setItem("searchInvestmentsQuery", searchQuery);
            if (e.target.value === "") {
              setFilteredInvestments([]);
              localStorage.removeItem("searchInvestmentsQuery");
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

      <InvestmentTable userInvestments={investments} />

      {pageCount && pageCount > 1 && (
        <Pagination pageCount={pageCount} onPageChange={onPageChange} />
      )}
    </div>
  );
};

export default Investments;
