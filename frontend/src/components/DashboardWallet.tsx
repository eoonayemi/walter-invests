import { IconContext } from "react-icons";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { addCommas } from "../utils/addCommas";

const DashboardWallet = () => {
  const [hideBS, setHideBS] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const { withdrawableBalance, depositBalance } = user || {};
  const acctBalance =
    (withdrawableBalance as number) + (depositBalance as number);

  const hideBalance = () => {
    setHideBS(!hideBS);
    localStorage.setItem("hideBalance", hideBS.toString());
  };

  const hideB = localStorage.getItem("hideBalance") === "true" ? true : false;

  const walletBalances = [
    {
      name: "Account Balance",
      amount: `${acctBalance || 0}`,
      historyLink: "/user/transaction/records",
      linkName: "Transaction",
      action: "Add Money",
      actionLink: "/user/deposit",
    },
    {
      name: "Deposit Balance",
      amount: `${depositBalance || 0}`,
      historyLink: "/user/deposit/records",
      linkName: "Deposit",
      action: "Recharge",
      actionLink: "/user/deposit",
    },
    {
      name: "Withdrawal Balance",
      amount: `${withdrawableBalance || 0}`,
      historyLink: "/user/withdraw/records",
      linkName: "Withdrawal",
      action: "Withdraw",
      actionLink: "/user/withdraw",
    },
  ];

  return (
    <div className="flex flex-col gap-[0.5px] rounded-xl mx-3 my-4 overflow-hidden">
      {walletBalances.map((wallet, i) => (
        <div
          className="bg-my-blue flex justify-between text-white p-4 items-center text-[11px]"
          key={i}
        >
          <div className="flex flex-col gap-3">
            <span className="flex gap-1 items-center">
              <IconContext.Provider
                value={{ className: "font-semibold text-sm" }}
              >
                <AiFillSafetyCertificate />
              </IconContext.Provider>
              <span>{wallet.name}</span>
              <span onClick={hideBalance}>
                <IconContext.Provider
                  value={{ className: "font-semibold text-sm" }}
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
  );
};

export default DashboardWallet;
