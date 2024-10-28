import TabBar from "../../components/TabBar";
import { IoIosArrowDropleft } from "react-icons/io";
import { IconContext } from "react-icons";
import { Link, useNavigate } from "react-router-dom";
import {
  AiFillEye,
  AiFillSafetyCertificate,
  AiFillEyeInvisible,
} from "react-icons/ai";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { TbTransfer } from "react-icons/tb";
import {
  PiArrowSquareUpRightFill,
  PiArrowSquareDownLeftFill,
} from "react-icons/pi";
import { BiSolidUserPlus } from "react-icons/bi";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useQuery } from "react-query";
import * as apiClient from "../../api-clients";
import { TransactType, onTransactSuccess } from "../../redux/transactSlice";
import { TransactionType } from "./DepositRecords";
import NoTabLayout from "../../layouts/NoTabLayout";
import { onLogInSuccess } from "../../redux/userSlice";
import { addCommas } from "../../utils/addCommas";

const Wallet = () => {
  const navigate = useNavigate();
  const [hideBS, setHideBS] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const { transact } = useAppSelector((state) => state.transact);
  const { withdrawableBalance, depositBalance } = user || {};
  const acctBalance =
    (withdrawableBalance as number) + (depositBalance as number);
  const dispatch = useAppDispatch();

  const { isLoading: isFetching } = useQuery(
    "getTransactions",
    apiClient.getMyTransactions,
    {
      onSuccess: (data) => {
        dispatch(onLogInSuccess(data.user));
        const transactSums: TransactType = {
          totalIncome: data.transactions.reduce(
            (acc: number, cur: TransactionType) => {
              if (cur.type == "income" && cur.status === "Success")
                return acc + cur.amount;
              return acc;
            },
            0
          ),
          totalRecharge: data.transactions.reduce(
            (acc: number, cur: TransactionType) => {
              if (cur.type == "deposit" && cur.status === "Approved")
                return acc + cur.amount;
              return acc;
            },
            0
          ),
          totalWithdraw: data.transactions.reduce(
            (acc: number, cur: TransactionType) => {
              if (cur.type === "withdrawal" && cur.status === "Paid")
                return acc + cur.amount;
              return acc;
            },
            0
          ),
          totalAssets: user?.withdrawableBalance as number,
          todayIncome: data.transactions.reduce(
            (acc: number, cur: TransactionType) => {
              if (cur.type == "income" && cur.status === "Success") {
                const date = new Date(cur.createdAt);
                const today = new Date();
                if (date.getDate() == today.getDate()) {
                  return acc + cur.amount;
                }
              }

              return acc;
            },
            0
          ),
          teamIncome: data.transactions.reduce(
            (acc: number, cur: TransactionType) => {
              if (
                cur.type == "income" &&
                cur.subType === "team income" &&
                cur.status === "Success"
              ) {
                return acc + cur.amount;
              }
              return acc;
            },
            0
          ),
        };
        dispatch(onTransactSuccess(transactSums));
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const hideBalance = () => {
    setHideBS(!hideBS);
    localStorage.setItem("hideBalance", hideBS.toString());
  };

  const hideB = localStorage.getItem("hideBalance") === "true" ? true : false;

  const walletBalances = [
    {
      name: "Account Balance",
      amount: `${acctBalance}.00`,
      historyLink: "/user/transaction/records",
      linkName: "Transaction",
      action: "Add Money",
      actionLink: "/user/deposit",
    },
    {
      name: "Deposit Balance",
      amount: `${depositBalance}.00`,
      historyLink: "/user/deposit/records",
      linkName: "Deposit",
      action: "Recharge",
      actionLink: "/user/deposit",
    },
  ];

  const totalIncomes = [
    {
      name: "Total income",
      amount: `${transact?.totalIncome || 0}.00`,
    },
    {
      name: "Total recharge",
      amount: `${transact?.totalRecharge || 0}.00`,
    },
    {
      name: "Total assets",
      amount: `${transact?.totalAssets || 0}.00`,
    },
    {
      name: "Total withdraw",
      amount: `${transact?.totalWithdraw || 0}.00`,
    },
    {
      name: "Todays's income",
      amount: `${transact?.todayIncome || 0}.00`,
    },
    {
      name: "Team Income",
      amount: `${transact?.teamIncome || 0}.00`,
    },
  ];

  if (isFetching) return <NoTabLayout title="Wallet" subtitle="Loading..." />;

  return (
    <div className="bg-gray-100 min-h-screen pt-14 flex flex-col gap-3 overflow-y-auto sm:pb-[3rem]">
      <div className="flex py-3 px-3 gap-1 items-center bg-white fixed top-0 right-0 left-0 font-semibold">
        <span
          className="hover:bg-my-t-white rounded-full p-1"
          onClick={() => navigate(-1)}
        >
          <IconContext.Provider value={{ className: "text-3xl font-semibold" }}>
            <IoIosArrowDropleft />
          </IconContext.Provider>
        </span>
        <span>Wallet</span>
      </div>

      <div className="flex flex-col gap-[0.5px] rounded-xl mx-3 mt-4 overflow-y-auto">
        {walletBalances.map((wallet, i) => (
          <div
            key={i}
            className="bg-my-blue flex justify-between p-4 items-center text-[11px] text-white"
          >
            <div className="flex flex-col gap-3">
              <span className="flex gap-1 items-center">
                <IconContext.Provider
                  value={{ className: "font-semibold text-white" }}
                >
                  <AiFillSafetyCertificate />
                </IconContext.Provider>
                <span>{wallet.name}</span>
                <span onClick={hideBalance}>
                  <IconContext.Provider
                    value={{ className: "font-semibold text-white" }}
                  >
                    {hideB ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </IconContext.Provider>
                </span>
              </span>
              <span className="font-semibold text-lg">
                {hideB ? "****" : `N${addCommas(wallet.amount)}`}
              </span>
            </div>

            <div className="flex flex-col justify-end items-center gap-3">
              <Link
                to={wallet.historyLink}
                className="flex justify-center items-center"
              >
                <span>{`${wallet.linkName} History`}</span>
                <IconContext.Provider
                  value={{ className: "font-semibold text-xl" }}
                >
                  <MdOutlineKeyboardArrowRight />
                </IconContext.Provider>{" "}
              </Link>
              <Link
                to={wallet.actionLink}
                className="bg-white text-my-blue px-4 py-2 rounded-3xl font-semibold"
              >
                {wallet.action}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white flex justify-between p-4 items-center text-[12px] mx-3 rounded-xl font-semibold overflow-y-auto">
        <Link
          to="/user/transaction/records"
          className="flex flex-col justify-center items-center gap-1"
        >
          <span className="bg-blue-100 rounded-md p-2">
            <IconContext.Provider
              value={{ className: "font-semibold text-2xl text-my-blue" }}
            >
              <TbTransfer />
            </IconContext.Provider>
          </span>
          <span className="text-gray-400">Transaction</span>
        </Link>
        <Link
          to="/user/withdraw"
          className="flex flex-col justify-center items-center gap-1"
        >
          <span className="bg-blue-100 rounded-md p-2">
            <IconContext.Provider
              value={{ className: "text-2xl text-my-blue" }}
            >
              <PiArrowSquareUpRightFill />
            </IconContext.Provider>
          </span>
          <span className="text-gray-400">Withdraw</span>
        </Link>
        <Link
          to="/user/deposit"
          className="flex flex-col justify-center items-center gap-1"
        >
          <span className="bg-blue-100 rounded-md p-2">
            <IconContext.Provider
              value={{ className: "font-semibold text-2xl text-my-blue" }}
            >
              <PiArrowSquareDownLeftFill />
            </IconContext.Provider>
          </span>
          <span className="text-gray-400">Recharge</span>
        </Link>
        <Link
          to="/team"
          className="flex flex-col justify-center items-center gap-1"
        >
          <span className="bg-blue-100 rounded-md p-2">
            <IconContext.Provider
              value={{ className: "font-semibold text-2xl text-my-blue" }}
            >
              <BiSolidUserPlus />
            </IconContext.Provider>
          </span>
          <span className="text-gray-400">Refer Friends</span>
        </Link>
      </div>

      <div className="items-center text-[12px] mx-3 grid grid-cols-3 gap-3 sm:pb-[4rem]">
        {totalIncomes.map((income, i) => (
          <div
            key={i}
            className="text-center bg-white flex flex-col gap-1 py-4 rounded-xl font-semibold"
          >
            <span className="text-gray-400">{income.name}</span>
            <span className="text-base text-my-blue">
              N{addCommas(income.amount)}
            </span>
          </div>
        ))}
      </div>

      <TabBar />
    </div>
  );
};

export default Wallet;
