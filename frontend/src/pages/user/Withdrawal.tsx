import { IoIosArrowDropleft, IoIosArrowForward } from "react-icons/io";
import { IconContext } from "react-icons";
import { Link, useNavigate } from "react-router-dom";
import { TbHistoryToggle } from "react-icons/tb";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { useAppContext } from "../../contexts/AppContext";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import * as apiClient from "../../api-clients";
import { removeCommas } from "../../utils";
import { useAppSelector } from "../../redux/hooks";

export type WithdrawFormData = {
  type: string;
  amount: number;
  bankType: string;
};

const Withdraw = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { user } = useAppSelector((state) => state.user);
  const options = [
    { value: "", label: "Select Bank" },
    { value: "local", label: "Local Bank" },
    { value: "digital", label: "Digital Bank" },
  ];

  const { data: bankDetails, isLoading } = useQuery(
    "getBankDetails",
    apiClient.getBankDetails
  );

  type ErrType = string | undefined;

  const [minimumDepositErr, setMinimumDepositErr] = useState<ErrType>();
  const [withdrawalAmount, setWithdrawalAmount] = useState<ErrType>();
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("Select Bank");
  const [showDropDown, setShowDropDown] = useState(false);
  const [noOptionErr, setNoOptionErr] = useState<ErrType>();

  const { mutate } = useMutation(apiClient.makeWithdrawal, {
    onSuccess: () => {
      showToast({ type: "SUCCESS", message: "Withdrawal successful" });
      navigate("/user/withdraw/records");
    },

    onError: (err: Error) => {
      showToast({ type: "ERROR", message: err.message });
      console.log(err);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!withdrawalAmount) {
      return setMinimumDepositErr("Amount is required");
    }

    if (parseInt(withdrawalAmount) < 1000) {
      return setMinimumDepositErr("Minimum deposit is N2,000");
    }

    if (selectedValue === "") {
      return setNoOptionErr("Please select a bank");
    }

    if (isLoading) {
      return showToast({ type: "ERROR", message: "Bank Accounts Loading..." });
    }

    if (user && user?.withdrawableBalance < 1000) {
      return showToast({ type: "ERROR", message: "Insufficient balance" });
    }

    const data: WithdrawFormData = {
      amount: parseInt(removeCommas(withdrawalAmount)),
      bankType: selectedValue,
      type: "withdrawal",
    };
    mutate(data);
  };

  return (
    <div className="bg-white min-h-screen pt-16 flex flex-col gap-2">
      <div className="flex py-3 px-3 gap-1 justify-between items-center bg-my-blue fixed top-0 left-0 xl:left-[30rem] right-0  xl:right-[30rem] lg:left-[25rem] lg:right-[25rem] md:left-[15rem] md:right-[15rem] text-white font-semibold z-20">
        <span
          className="hover:bg-my-t-white rounded-full p-1"
          onClick={() => navigate(-1)}
        >
          <IconContext.Provider value={{ className: "text-3xl font-semibold" }}>
            <IoIosArrowDropleft />
          </IconContext.Provider>
        </span>

        <span className="font-semibold tracking-wide">Withdraw</span>

        <Link
          className="hover:bg-my-t-white rounded-full p-1"
          to="/user/withdraw/records"
        >
          <IconContext.Provider value={{ className: "text-3xl font-semibold" }}>
            <TbHistoryToggle />
          </IconContext.Provider>
        </Link>
      </div>

      <div className="flex flex-col bg-my-blue rounded-xl mx-3 mt-4 text-xs py-4 px-6 text-white">
        <span>Withdrawal Balance</span>
        <p className="font-semibold text-2xl tracking-wide">{`N${user?.withdrawableBalance}.00`}</p>
      </div>

      <div className="relative flex flex-col mx-3">
        <label className="font-semibold text-sm">Choose Bank</label>
        <div
          onClick={() => setShowDropDown(!showDropDown)}
          className={`${
            selectedValue == "Select Bank" ? "text-gray-300" : "text-black"
          } flex justify-between items-center rounded-xl px-4 py-3 text-sm bg-gray-100 hover:ring ring-blue-400 ring-offset-0 hover:bg-white hover:border-my-blue`}
        >
          <span>{selectedLabel}</span>
          <IconContext.Provider value={{ className: "font-semibold text-lg" }}>
            <IoIosArrowForward />
          </IconContext.Provider>
        </div>
        {noOptionErr && <p className="text-red-500 text-sm">{noOptionErr}</p>}
        {showDropDown && (
          <div className="absolute shadow-my-shadow text-sm w-full z-10 top-[4rem] rounded-xl overflow-hidden">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  setSelectedValue(option.value);
                  setSelectedLabel(option.label);
                  setShowDropDown(false);
                  setNoOptionErr(undefined);
                }}
                className={`${
                  selectedValue == option.label
                    ? "bg-my-blue text-white"
                    : "bg-white text-black"
                } p-4 font-semibold`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {bankDetails &&
        bankDetails
          .filter(
            (bank: apiClient.BankDetailsType) => selectedValue == bank.bankType
          )
          .map((bank: apiClient.BankDetailsType) => (
            <div className="flex flex-col shadow-my-shadow mx-3 px-6 rounded-xl my-2">
              <p className="py-3 font-semibold  text-center">Bank Details</p>
              <hr />
              <div className="flex flex-col my-2">
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Bank Name</span>
                  <span>{bank.bankName}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Account Number</span>
                  <span>{bank.accountNumber}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Account Name</span>
                  <span>{bank.accountName}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-semibold">Bank Type</span>
                  <span>{bank.bankType}</span>
                </div>
              </div>
            </div>
          ))}

      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <label className="font-semibold mx-3 text-sm">Withdrawal Amount</label>
        <input
          type="text"
          className="outline-none bg-gray-100 placeholder:text-gray-300 placeholder:text-sm rounded-md px-4 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue mx-3"
          placeholder="Enter Amount"
          value={withdrawalAmount}
          onChange={(e) => {
            setWithdrawalAmount(e.target.value);
            setMinimumDepositErr(undefined);
          }}
        />

        {minimumDepositErr && (
          <div className="text-red-500 mx-3">{minimumDepositErr}</div>
        )}

        <button
          type="submit"
          className="active:bg-white active:border active:border-my-blue active:text-my-blue font-semibold bg-my-blue text-white rounded-md py-3 hover:bg-blue-500 mx-3 mt-2"
        >
          Withdraw
        </button>
      </form>

      <div className="bg-white mx-3 rounded-xl overflow-hidden my-5 shadow-lg">
        <h1 className="bg-my-blue text-center text-white py-4 font-semibold">
          Withdrawal Instructions
        </h1>
        <div className="flex gap-2 p-4">
          <IconContext.Provider
            value={{ className: "font-semibold text-sm text-my-blue" }}
          >
            <IoCheckmarkDoneCircle />
          </IconContext.Provider>
          <span>Minimum withdrawal amount N1000</span>
        </div>
        <div className="flex gap-2 p-4">
          <IconContext.Provider
            value={{
              className: "font-semibold text-lg text-my-blue self-start",
            }}
          >
            <IoCheckmarkDoneCircle />
          </IconContext.Provider>
          <span>The withdrawal fee is 10% of the withdrawal amount</span>
        </div>
        <div className="flex gap-2 p-4">
          <IconContext.Provider
            value={{
              className: "font-semibold text-2xl text-my-blue self-start",
            }}
          >
            <IoCheckmarkDoneCircle />
          </IconContext.Provider>
          <span>
            Withdrawal time is from 9:00 to 23:00, you can withdraw money at any
            time
          </span>
        </div>
        <div className="flex gap-2 p-4">
          <IconContext.Provider
            value={{
              className: "font-semibold text-[4rem] text-my-blue self-start",
            }}
          >
            <IoCheckmarkDoneCircle />
          </IconContext.Provider>
          <span>
            Withdrawals will be credited within 24 hours. The Finance Department
            will review and process the funds submitted by users of the Fund
            Supervision Department within 12 hours. The remittance will be made
            only after approval
          </span>
        </div>
        <div className="flex gap-2 p-4">
          <IconContext.Provider
            value={{
              className: "font-semibold text-[3rem] text-my-blue self-start",
            }}
          >
            <IoCheckmarkDoneCircle />
          </IconContext.Provider>
          <span>
            The platform has a complete risk management system and strictly
            reviews and monitors every transaction to ensure the safety and
            compliance of your funds
          </span>
        </div>
      </div>
    </div>
  );
};
export default Withdraw;
