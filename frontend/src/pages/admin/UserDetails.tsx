import { FaSearch, FaUserCircle } from "react-icons/fa";
import { Button } from "../../components/Button";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import * as apiClient from "../../api-clients";
import ResetPasswordForm from "../../forms/ResetPasswordForm";
import { useState } from "react";
import InvestmentTable from "../../components/InvestmentTable";
import Pagination from "../../components/Pagination";

export type BankDetailsType = {
  _id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankType: string;
};

export type UserType = {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  inviteCode: string;
  status: string;
  password?: string;
  bankDetails?: BankDetailsType[];
  createdAt: Date;
  lastUpdatedAt: Date;
};

type locationStateType = {
  pathname: string;
};

const UserDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useAppContext();
  const { userId } = useParams();
  const location = useLocation();
  const { pathname } =
    (location.state !== null && location.state) || ({} as locationStateType);
  const navigate = useNavigate();

  const { data: orgUser, refetch } = useQuery(
    "getUserById",
    () => apiClient.getUserById(userId),
    {
      onSuccess: (data) => {
        setValue("userName", data.userName);
        setValue("email", data.email);
        setValue("phoneNumber", data.phoneNumber);
        setValue("inviteCode", data.inviteCode);
        setValue("status", data.status);
        setValue("password", data.password);
      },
      onError: (error: Error) => {
        showToast({ type: "ERROR", message: error.message });
      },
    }
  );

  const user = {
    ...orgUser,
    createdAt: orgUser?.createdAt.split("T")[0],
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserType>({
    defaultValues: {
      userName: user?.userName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      inviteCode: user?.inviteCode || "",
      status: user?.status || "",
      password: user?.password || "",
    },
  });

  const editUserMutation = useMutation(apiClient.editUser, {
    onSuccess: (data) => {
      refetch();
      showToast({ type: "SUCCESS", message: data.message });
    },
    onError: (error: Error) => {
      showToast({ type: "ERROR", message: error.message });
    },
  });

  const { mutate: deleteUser, isLoading: isDeleting } = useMutation(
    apiClient.deleteUser,
    {
      onSuccess: () => {
        showToast({ type: "SUCCESS", message: "User deleted" });
        navigate(pathname);
      },
      onError: (error: Error) => {
        showToast({ type: "ERROR", message: error.message });
      },
    }
  );

  const editUser = (msg: string) =>
    handleSubmit((data) => {
      const { userName, email, phoneNumber, inviteCode, status, password } =
        user;
      if (
        userName === data.userName &&
        email === data.email &&
        phoneNumber === data.phoneNumber &&
        inviteCode === data.inviteCode &&
        status === data.status &&
        password === data.password
      ) {
        showToast({ type: "ERROR", message: "No changes made" });
        return;
      }
      editUserMutation.mutate({ data, userId, msg });
    });

  const changeStatus = (status: string) => {
    if (user.status === status) {
      showToast({ type: "ERROR", message: `User already ${status}` });
      return;
    }
    setValue("status", status);
    editUser(`User has been ${status === "active" ? "activated" : status}`)();
  };

  const resetPassword = (password: string) => {
    setValue("password", password);
    editUser("Password updated")();
  };

  const handleDeleteUser = () => {
    setShowModal(false);
    deleteUser(userId);
  };

  return (
    <div className="mx-4 flex flex-col gap-5 flex-1">
      <div className="flex flex-col md:flex-row md:justify-between justify-center gap-4">
        <h1 className="font-semibold text-lg">User Details</h1>
        <div className="flex gap-2">
          <Button
            text="Ban"
            onClick={() => changeStatus("banned")}
            className="bg-orange-500 text-white hover:bg-orange-600 flex-1 w-full"
          />
          <Button
            text="Activate"
            onClick={() => changeStatus("active")}
            className="bg-green-500 text-white hover:bg-green-600 flex-1 w-full "
          />
          <div className="relative flex-1 w-full">
            <Button
              text="Delete"
              onClick={() => setShowModal((preValue) => !preValue)}
              className="bg-red-500 text-white hover:bg-red-600 w-full flex-1"
            />
            <div
              className={`flex flex-col ${
                showModal ? "block" : "hidden"
              } gap-2 absolute right-0 bg-white rounded-md shadow-my-shadow p-4 text-center`}
            >
              <span>Are you sure you?</span>
              <div className="flex gap-2">
                <Button
                  text="Ok"
                  onClick={handleDeleteUser}
                  className="bg-my-blue flex-1 text-white"
                  disabled={isDeleting}
                />
                <Button
                  text="Cancel"
                  onClick={() => setShowModal(false)}
                  className="border border-my-blue flex-1 text-my-blue"
                  disabled={editUserMutation.isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex text-sm flex-col gap-5 md:gap-10 bg-white rounded-lg shadow-my-shadow justify-center md:justify-normal py-10 px-8">
        <div className="flex md:flex-row flex-col gap-5">
          <div className="self-center flex justify-center items-center flex-1">
            {user && user.imageUrl ? (
              <img
                className="rounded-full h-40 w-40"
                src={user.imageUrl}
                alt="profile's image"
              />
            ) : (
              <FaUserCircle className="text-[10rem] text-gray-400 md:mb-0 mb-5" />
            )}
          </div>
          <div className="flex flex-col gap-3 flex-1 md:shadow-my-shadow">
            <div className="flex flex-col md:bg-my-blue md:text-center md:py-4">
              <h2 className="font-semibold text-lg md:text-sm text-my-blue md:text-white">
                Account Summary
              </h2>
            </div>
            <hr className="md:hidden" />
            <div className="py-4 md:px-6 flex flex-col gap-4 text-my-blue">
              <div className="font-semibold flex flex-col">
                <p>Account Balance</p>
                <p className="text-gray-600 text-lg">{`N ${0}`}</p>
              </div>
              <hr />
              <div className="font-semibold flex flex-col">
                <p>Referral Bonus</p>
                <p className="text-gray-600 text-lg">{`N ${0}`}</p>
              </div>
              <hr />
              <div className="flex flex-col">
                <p className="font-semibold ">Date Created</p>
                <p className="text-gray-600">{user.createdAt}</p>
              </div>
              <hr />
              <div className="font-semibold flex flex-col gap-2">
                <p>Status</p>
                <p
                  className={`px-2 py-1 w-[4rem] text-center border capitalize bg-opacity-10 rounded-full text-xs ${
                    user?.status === "active"
                      ? "border border-green-500 text-green-500 bg-green-500"
                      : "border border-red-500 text-red-500 bg-red-500"
                  }`}
                >{`${user?.status}`}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          <form
            className="flex flex-col gap-4 flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              return editUser("Users details updated")();
            }}
          >
            <div className="flex flex-col gap-1">
              <label className="font-semibold">Username</label>
              <input
                placeholder="Username"
                type="text"
                className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
                {...register("userName")}
              />
              {errors.userName && (
                <span className="text-red-500 text-sm">
                  {errors.userName.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold">Email</label>
              <input
                placeholder="Email"
                type="email"
                className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold">Phone Number</label>
              <input
                placeholder="Phone Number"
                type="text"
                className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <span className="text-red-500 text-sm">
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold">Invite Code</label>
              <input
                placeholder="Invite Code"
                type="text"
                readOnly
                className="outline-none bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-sm"
                {...register("inviteCode")}
              />
            </div>

            <button
              type="submit"
              className="font-bold bg-my-blue text-white rounded-md py-3 hover:bg-blue-500"
            >
              Save
            </button>
          </form>
          <ResetPasswordForm
            title="Reset User Password"
            buttonTag="Reset Password"
            resetPassword={resetPassword}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex md:flex-row flex-col justify-between gap-3">
          <h2 className="font-semibold text-lg">User Investments</h2>
          <div className="flex">
            {" "}
            <input
              type="text"
              className="px-5 py-2 flex-1 outline-none bg-gray-500 bg-opacity-10 text-sm focus:border focus:bg-white focus:border-my-blue"
              placeholder="Search by username, date"
            />
            <button className="p-4 bg-my-blue flex justify-center items-center text-white">
              <FaSearch />
            </button>
          </div>
        </div>
        <InvestmentTable userInvestments={[]} />
        <Pagination pageCount={0} onPageChange={() => {}} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex md:flex-row flex-col justify-between gap-3">
          <h2 className="font-semibold text-lg">Bank Accounts</h2>
        </div>
        <div className={`overflow-x-auto shadow-my-shadow`}>
          <table className="border-collapse text-sm overflow-hidden w-full">
            <thead className="bg-my-blue">
              <tr className="bg-my-blue text-white">
                <th className="text-center py-4 px-6 font-semibold">
                  Bank Name
                </th>
                <th className="text-center py-4 px-6 font-semibold">
                  Account Name
                </th>
                <th className="text-center py-4 px-6 font-semibold">
                  Account Number
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {user?.bankDetails?.map((bank: BankDetailsType, i: number) => (
                <tr
                  key={i}
                  className={`${
                    i < user?.bankDetails.length - 1 &&
                    "border-b border-slate-200"
                  } py-4 text-slate-600`}
                >
                  <td className="text-center py-4 px-6 font-semibold">
                    {bank.bankName}
                  </td>
                  <td className="text-center py-4 px-6 font-semibold">
                    {bank.accountName}
                  </td>
                  <td className="text-center py-4 px-6 font-semibold">
                    {bank.accountNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
