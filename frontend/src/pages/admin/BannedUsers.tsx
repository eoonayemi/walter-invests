import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Pagination from "../../components/Pagination";
import * as apiClient from "../../api-clients";
import { IconContext } from "react-icons";
import { MdMonitor } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { CgSpinner } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import { refDateTime } from "../../utils";
import { useAppDispatch } from "../../redux/hooks";
import {
  onLogInError,
  onLogInStart,
  onLogInSuccess,
} from "../../redux/userSlice";
import { IoLogIn } from "react-icons/io5";

export type BankDetailsType = {
  _id?: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankType: string;
};

type Referral = {
  firstRefer: {
    bonus: number;
    members: number;
  };
  secondRefer: {
    bonus: number;
    members: number;
  };
  thirdRefer: {
    bonus: number;
    members: number;
  };
};

export type UserType = {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  inviteCode: string;
  referredBy?: string;
  imageUrl?: string;
  status: string;
  bankDetails?: BankDetailsType[];
  depositBalance: number;
  withdrawableBalance: number;
  referral: Referral;
  createdAt: string;
  updatedAt: string;
};

const BannedUsers = () => {
  const [pageCount, setPageCount] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem("searchBannedUsersQuery") || ""
  );
  const [filteredUsers, setFilteredUsers] = useState([] as UserType[]);
  const location = useLocation();
  const { pathname } = location;
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    refetch: refetchUsers,
  } = useQuery(
    "getBannedUsers",
    () => apiClient.getUsers({ currentPage, status: "banned" }),
    {
      onSuccess: (data) => {
        setPageCount(data.pageCount);
      },
      onError: (err: Error) => {
        setFilteredUsers([]);
        showToast({ type: "ERROR", message: err.message });
      },
    }
  );

  const { mutate: loginAsUser, isLoading: isLogging } = useMutation(
    apiClient.loginAsUser,
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries("validateToken");
        dispatch(onLogInSuccess(data));
        navigate("/dashboard");
        showToast({
          type: "SUCCESS",
          message: "Logged in as user successfully",
        });
      },
      onError: (err: Error) => {
        dispatch(onLogInError(err));
        console.log(err.message);
        showToast({ type: "ERROR", message: err.message });
      },
    }
  );

  const { refetch: refetchSearch, isLoading: sIsLoading } = useQuery(
    "searchBannedUsers",
    () => apiClient.searchUsers({ searchQuery, currentPage, status: "banned" }),
    {
      enabled: false,
      onSuccess: (data) => {
        setFilteredUsers(data.docs);
        setPageCount(data.totalPages);
      },
      onError: (err: Error) => {
        setFilteredUsers([]);
        showToast({ type: "ERROR", message: err.message });
      },
    }
  );

  const users =
    filteredUsers.length >= 1
      ? filteredUsers
      : data && data.users.length > 0
      ? data.users
      : [];

  useEffect(() => {
    if (searchQuery === "") {
      refetchUsers();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
      let id: any;
      clearTimeout(id);
      id = setTimeout(() => refetchSearch(), 1000);
    }
  }, [currentPage, refetchUsers, refetchSearch, searchQuery]);

  const onPageChange = (e: { selected: number }) => {
    setCurrentPage(e.selected);
  };

  const handleSearch = () => {
    refetchSearch();
    localStorage.setItem("searchBannedUsersQuery", searchQuery);
  };
  if (isLoading) {
    return (
      <div className="mx-4 flex flex-col gap-5 flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Banned Users</span>
        </div>
        <div className="flex justify-center items-center font-semibold text-lg h-full">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!data && users?.length === 0) {
    return (
      <div className="mx-4 flex flex-col gap-5 flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Banned Users</span>
        </div>
        <div className="flex justify-center items-center font-semibold text-lg h-full">
          <span>No Banned Users</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 flex flex-col gap-5 flex-1">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">Banned Users</span>
      </div>

      <div className="flex self-end">
        <input
          type="text"
          className="px-5 py-2 flex-1 outline-none bg-gray-500 bg-opacity-10 text-sm focus:border focus:bg-white focus:border-my-blue"
          placeholder="Search by username, email or phone number"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            localStorage.setItem("searchBannedUsersQuery", searchQuery);
            if (e.target.value === "") {
              setFilteredUsers([]);
              localStorage.removeItem("searchBannedUsersQuery");
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
              <th className="text-center py-4 px-6 font-semibold">Email</th>
              <th className="text-center py-4 px-6 font-semibold">
                Phone Number
              </th>
              <th className="text-center py-4 px-6 font-semibold">Status</th>
              <th className="text-center py-4 px-6 font-semibold">
                Created At
              </th>
              <th className="text-center py-4 px-6 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {users.map((user: UserType, i: number) => (
              <tr
                key={i}
                className={`${
                  i < users?.length - 1 && "border-b border-slate-200"
                } py-4 text-slate-600`}
              >
                <td className="text-center py-4 px-6 capitalize">
                  {user.userName}
                </td>
                <td className="text-center py-4 px-6">{user.email}</td>
                <td className="text-center py-4 px-6">{user.phoneNumber}</td>
                <td className="text-center py-4 px-6">
                  <span
                    className={`mx-auto ${
                      user.status === "active"
                        ? "border border-green-500 text-green-500 bg-green-500"
                        : "border border-red-500 text-red-500 bg-red-500"
                    } rounded-full text-xs px-5 py-1 bg-opacity-10 capitalize`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="text-center py-4 px-6">
                  {refDateTime(user.createdAt)}
                </td>
                <td className="flex justify-center items-center py-4 px-6 gap-3">
                  <Link
                    to={`/admin/users/${user._id}`}
                    state={{ pathname }}
                    className="bg-my-blue p-2 rounded-md"
                  >
                    <IconContext.Provider
                      value={{ className: "font-bold text-white" }}
                    >
                      <MdMonitor />
                    </IconContext.Provider>
                  </Link>
                  <button
                    disabled={isLogging}
                    onClick={() => {
                      loginAsUser(user._id);
                      dispatch(onLogInStart());
                    }}
                    className="bg-my-blue p-2 rounded-md"
                  >
                    <IoLogIn className="font-bold text-white text-lg" />
                  </button>
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

export default BannedUsers;
