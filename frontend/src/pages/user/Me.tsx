import TabBar from "../../components/TabBar";
import { RiCustomerServiceFill, RiBankFill } from "react-icons/ri";
import { IconContext } from "react-icons";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { PiArrowSquareUpRightFill } from "react-icons/pi";
import { CgOrganisation } from "react-icons/cg";
import { TbCreditCardRefund } from "react-icons/tb";
import { PiNotepadFill } from "react-icons/pi";
import { IoIosArrowForward } from "react-icons/io";
import { IoBagCheck } from "react-icons/io5";
import { BsFillCreditCard2BackFill } from "react-icons/bs";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "react-query";
import * as apiClient from "../../api-clients";
import { useAppContext } from "../../contexts/AppContext";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { onLogOutError, onLogOutSuccess } from "../../redux/userSlice";
import { onUserLogout } from "../../redux/transactSlice";
import { FaUserCircle } from "react-icons/fa";
import { addCommas } from "../../utils/addCommas";

const Me = () => {
  const [hideBS, setHideBS] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { withdrawableBalance, depositBalance } = user || {};
  const acctBalance =
    (withdrawableBalance as number) + (depositBalance as number);

  const hideBalance = () => {
    setHideBS(!hideBS);
    localStorage.setItem("hideBalance", hideBS.toString());
  };

  const hideB = localStorage.getItem("hideBalance") === "true" ? true : false;

  const profileActivities = [
    {
      name: "My Orders",
      link: "/user/investments",
      icon: () => <IoBagCheck />,
    },
    {
      name: "Withdrawal Records",
      link: "/user/withdraw/records",
      icon: () => <PiNotepadFill />,
    },
    {
      name: "Deposit Records",
      link: "/user/deposit/records",
      icon: () => <PiNotepadFill />,
    },
    {
      name: "Add Bank Account",
      link: "/user/add-bank",
      icon: () => <RiBankFill />,
    },
    {
      name: "Bank Account Details",
      link: "/user/bank-details",
      icon: () => <BsFillCreditCard2BackFill />,
    },
    {
      name: "Change Password",
      link: "/user/change-password",
      icon: () => <RiLockPasswordFill />,
    },
  ];

  const { mutate, isLoading } = useMutation(apiClient.logOut, {
    onSuccess: () => {
      dispatch(onLogOutSuccess());
      dispatch(onUserLogout());
      showToast({ type: "SUCCESS", message: "Logged out successfully" });
      navigate("/login");
    },
    onError: (err: Error) => {
      dispatch(onLogOutError(err));
      showToast({ type: "ERROR", message: err.message });
    },
  });

  const onLogOut = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col gap-2 pb-32">
      <div className="fixed py-4 px-4 top-0 left-0 xl:left-[30rem] right-0  xl:right-[30rem] lg:left-[25rem] lg:right-[25rem] md:left-[15rem] md:right-[15rem] bg-my-blue text-white flex justify-between items-center">
        <div className="flex gap-3">
          <FaUserCircle className="w-12 h-12 rounded-full" />
          <div className="flex flex-col">
            <span className="font-semibold capitalize">
              Hi, {user?.userName}
            </span>
            <span className="text-sm">User ID: {user?.inviteCode}</span>
          </div>
        </div>
        <IconContext.Provider
          value={{ className: "font-semibold text-3xl text-white" }}
        >
          <RiCustomerServiceFill />
        </IconContext.Provider>
      </div>

      <div className="bg-my-blue text-white flex flex-col mt-12 px-6 py-10 rounded-3xl text-[11.5px]">
        <div className="flex gap-2 items-center">
          <span>Account Balance</span>
          <span onClick={hideBalance}>
            <IconContext.Provider
              value={{ className: "font-semibold text-white text-sm" }}
            >
              {hideB ? <AiFillEye /> : <AiFillEyeInvisible />}
            </IconContext.Provider>
          </span>
        </div>
        <p className="font-semibold text-2xl">
          {hideB ? "****" : `N${addCommas(acctBalance)}.00`}
        </p>
      </div>

      <div className="bg-white flex justify-between p-4 items-center text-[11px] mx-3 rounded-xl text-center">
        <Link
          to="/user/deposit"
          className="flex flex-col justify-center items-center text-[11px] gap-1"
        >
          <span className="bg-blue-100 rounded-md p-2">
            <IconContext.Provider
              value={{ className: "font-semibold text-2xl text-my-blue" }}
            >
              <TbCreditCardRefund />
            </IconContext.Provider>
          </span>
          <span className="text-gray-400 font-semibold">
            Deposit
            <br /> Online
          </span>
        </Link>
        <Link
          to="/user/withdraw"
          className="flex flex-col justify-center items-center text-[11px] gap-1"
        >
          <span className="bg-blue-100 rounded-md p-2">
            <IconContext.Provider
              value={{ className: "font-semibold text-2xl text-my-blue" }}
            >
              <PiArrowSquareUpRightFill />
            </IconContext.Provider>
          </span>
          <span className="text-gray-400 font-semibold">
            Withdraw
            <br />
            Money
          </span>
        </Link>
        <Link
          to="/user/transaction/records"
          className="flex flex-col justify-center items-center text-[11px] gap-1"
        >
          <span className="bg-blue-100 rounded-md p-2">
            <IconContext.Provider
              value={{ className: "font-semibold text-2xl text-my-blue" }}
            >
              <PiNotepadFill />
            </IconContext.Provider>
          </span>
          <span className="text-gray-400 font-semibold">
            Account
            <br /> Records
          </span>
        </Link>
        <div className="flex flex-col justify-center items-center text-[11px] gap-1">
          <span className="bg-blue-100 rounded-md p-2">
            <IconContext.Provider
              value={{ className: "font-semibold text-2xl text-my-blue" }}
            >
              <CgOrganisation />
            </IconContext.Provider>
          </span>
          <span className="text-gray-400 font-semibold">
            About
            <br /> Us
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center bg-white p-5 mx-3 rounded-xl gap-6 text-sm">
        {profileActivities.map((task, i) => (
          <Link
            key={i}
            to={task.link}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-5">
              <IconContext.Provider
                value={{ className: "text-xl text-my-blue" }}
              >
                {task.icon()}
              </IconContext.Provider>
              <span>{task.name}</span>
            </div>
            <IconContext.Provider value={{ className: "" }}>
              <IoIosArrowForward />
            </IconContext.Provider>
          </Link>
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-my-blue text-white font-semibold mx-3 py-3 rounded-xl"
        onClick={onLogOut}
      >
        Log Out
      </button>

      <TabBar />
    </div>
  );
};

export default Me;
