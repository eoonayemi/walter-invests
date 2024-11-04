import { IoIosArrowDropleft } from "react-icons/io";
import { IconContext } from "react-icons";
import { Link, useNavigate } from "react-router-dom";
import { TbHistoryToggle } from "react-icons/tb";
import { useRef, useState } from "react";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

const MakeDeposit = () => {
  const navigate = useNavigate();

  const [rechargeAmount, setRechargeAmount] = useState<string | undefined>();
  const [active, setActive] = useState<number | null>(null);
  const [minimumDepositErr, setMinimumDepositErr] = useState<
    string | undefined
  >();

  const rechargeAmounts = [
    "2,000",
    "4,000",
    "8,000",
    "12,000",
    "17,500",
    "25,000",
    "60,000",
    "80,000",
    "100,000",
    "250,000",
    "350,000",
    "500,000",
  ];

  const convertToNum = (amt: string) => amt && amt.replace(",", "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rechargeAmount) {
      return setMinimumDepositErr("Amount is required");
    }

    if (parseInt(rechargeAmount) < 2000) {
      return setMinimumDepositErr("Minimum deposit is N2,000");
    }

    navigate(`/user/deposit/deposit-details?amount=${rechargeAmount}`);
  };

  const rechargeAmountRef = useRef<HTMLInputElement>(null);

  const handleRechargeAmountClick = (amt: string) => {
    const numericValue = convertToNum(amt);
    if (rechargeAmountRef.current) {
      rechargeAmountRef.current.value = numericValue.toString();
      setRechargeAmount(numericValue);
      setMinimumDepositErr(undefined);
    }
  };

  const handleRechargeAmountChange = () => {
    const inputValue = rechargeAmountRef.current?.value;
    if (inputValue) {
      const numericValue = convertToNum(inputValue);
      setRechargeAmount(numericValue);
      setMinimumDepositErr(undefined);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-16 flex flex-col gap-2">
      <div className="flex py-3 px-3 gap-1 justify-between items-center bg-my-blue fixed top-0 left-0 xl:left-[30rem] right-0  xl:right-[30rem] lg:left-[25rem] lg:right-[25rem] md:left-[15rem] md:right-[15rem] text-white font-bold">
        <span
          className="hover:bg-my-t-white rounded-full p-1"
          onClick={() => navigate(`/dashboard`)}
        >
          <IconContext.Provider value={{ className: "text-3xl font-bold" }}>
            <IoIosArrowDropleft />
          </IconContext.Provider>
        </span>

        <span className="font-semibold tracking-wide">Recharge</span>

        <Link
          className="hover:bg-my-t-white rounded-full p-1"
          to="/user/deposit/records"
        >
          <IconContext.Provider value={{ className: "text-3xl font-bold" }}>
            <TbHistoryToggle />
          </IconContext.Provider>
        </Link>
      </div>
      <div className="flex flex-col gap-2 mx-3">
        <div className="mt-4">
          <span className="font-semibold">Deposit amount</span>
          {" (Minimum deposit is N2,000)"}
        </div>

        <div className="items-center grid grid-cols-4 gap-2 mb-4">
          {rechargeAmounts.map((amt, i) => (
            <div
              key={i}
              className={`${
                active === i
                  ? "bg-my-blue text-white"
                  : "bg-white border border-my-blue text-my-blue"
              } text-center hover:bg-my-blue py-4 rounded-lg text-sm font-semibold hover:text-white`}
              onClick={() => {
                handleRechargeAmountClick(amt);
                setActive(i);
              }}
            >
              {`N${amt}`}
            </div>
          ))}
        </div>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="font-semibold mx-3">Deposit amount</label>
        <input
          type="text"
          className="outline-none bg-gray-50 placeholder:text-gray-300 placeholder:text-sm rounded-md px-4 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue mx-3"
          ref={rechargeAmountRef}
          onChange={handleRechargeAmountChange}
          placeholder="Enter amount"
        />

        {minimumDepositErr && (
          <div className="text-red-500 mx-3">{minimumDepositErr}</div>
        )}

        <button
          type="submit"
          className="active:bg-white active:border active:border-my-blue active:text-my-blue font-semibold bg-my-blue text-white rounded-md py-3 mx-3"
        >
          Recharge
        </button>
      </form>

      <div className="mx-3 rounded-xl overflow-hidden my-5 shadow-lg">
        <h1 className="bg-my-blue text-center text-white py-4 font-bold">
          Recharge Instructions
        </h1>
        <div className="flex gap-2 p-4">
          <IconContext.Provider
            value={{ className: "font-bold text-3xl text-my-blue" }}
          >
            <IoCheckmarkDoneCircle />
          </IconContext.Provider>
          <span>
            The recharge order amount must be consistent with the final payment
            amount. Inconsistency will result in failure
          </span>
        </div>
        <div className="flex gap-2 p-4">
          <IconContext.Provider
            value={{ className: "font-bold text-3xl text-my-blue" }}
          >
            <IoCheckmarkDoneCircle />
          </IconContext.Provider>
          <span>
            The minimum recharge amount is N2000. If the amount is lower than
            the minimum amount, it will not be credited
          </span>
        </div>
        <div className="flex gap-2 p-4">
          <IconContext.Provider
            value={{ className: "font-bold text-3xl text-my-blue" }}
          >
            <IoCheckmarkDoneCircle />
          </IconContext.Provider>
          <span>
            Please check the account information carefully when transferring
            money to avoid payment errors
          </span>
        </div>
        <div className="flex gap-2 p-4">
          <IconContext.Provider
            value={{
              className: "font-bold text-[3rem] text-my-blue self-start",
            }}
          >
            <IoCheckmarkDoneCircle />
          </IconContext.Provider>
          <span>
            Please operate according to the recharge rules. If you fail to
            recharge in accordance with the platform rules and cause property
            damage, the company will not be held responsible
          </span>
        </div>
        <div className="flex gap-2 p-4">
          <IconContext.Provider
            value={{
              className: "font-bold text-[3rem] text-my-blue self-start",
            }}
          >
            <IoCheckmarkDoneCircle />
          </IconContext.Provider>
          <span>
            After the transfer is successful, please upload the payment voucher
            and wait for 20-30 minutes. If your payment does not arrive for a
            long time, please contact online customer service
          </span>
        </div>
        <div className="flex gap-2 p-4">
          <IconContext.Provider
            value={{
              className: "font-bold text-3xl text-my-blue self-start",
            }}
          >
            <IoCheckmarkDoneCircle />
          </IconContext.Provider>
          <span>
            Do not transfer money to strangers. Official personnel will not
            proactively ask you for your account number and password
          </span>
        </div>
      </div>
    </div>
  );
};
export default MakeDeposit;
