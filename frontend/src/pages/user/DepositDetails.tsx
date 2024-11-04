import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { IconContext } from "react-icons";
import { IoIosArrowDropleft } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";
import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { useMutation, useQuery } from "react-query";
import * as apiClient from "../../api-clients";
import { randomCode } from "../../utils";
import NoTabLayout from "../../layouts/NoTabLayout";
import { CgSpinner } from "react-icons/cg";

export type DepositFormData = {
  amount: number;
  refId: string;
  type: string;
  senderName: string;
};

const DepositDetails = () => {
  const navigate = useNavigate();

  const [senderName, setSenderName] = useState<string | undefined>();
  const [senderNameErr, setSenderNameErr] = useState<string | undefined>();
  const [code, setCode] = useState<string>(localStorage.getItem("refID") || "");

  const { showToast } = useAppContext();

  useEffect(() => {
    const nCode = randomCode();
    setCode(nCode);
    localStorage.setItem("refID", nCode);
  }, [setCode]);

  const [searchParams] = useSearchParams();
  const amount = searchParams.get("amount") as string;

  const handleCopy = (text: number | string) => {
    showToast({ type: "SUCCESS", message: "Copied to clipboard" });
    const textStr = text?.toString();
    navigator.clipboard.writeText(textStr);
  };

  const { data: adminBankAcct, isLoading } = useQuery(
    "adminBankAcct",
    apiClient.getAdminBankAcct
  );

  const { accountNumber, accountName, bankName } = adminBankAcct || {};

  const { mutate, isLoading: isProcessing } = useMutation(
    apiClient.makeDeposit,
    {
      onSuccess: () => {
        showToast({ type: "SUCCESS", message: "Deposit successful" });
        navigate("/user/deposit/records");
      },

      onError: (err: Error) => {
        if (err.message === "You have a pending deposit") {
          showToast({ type: "ERROR", message: err.message });
          return navigate("/user/deposit/records");
        }
        showToast({ type: "ERROR", message: err.message });
        console.log(err);
      },
    }
  );

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!senderName) {
      return setSenderNameErr("Sender's name is required");
    }

    const data: DepositFormData = {
      amount: parseInt(amount),
      refId: code,
      type: "deposit",
      senderName,
    };
    mutate(data);
  };

  if (!amount) {
    showToast({ type: "ERROR", message: "Deposit amount is required" });
    return <Navigate to="/user/deposit" />;
  }

  if (isLoading)
    return <NoTabLayout title="Deposit Details" subtitle="Loading" />;

  return (
    <div className="bg-white min-h-screen pt-16 flex flex-col gap-1">
      <div className="flex py-3 px-3 gap-2 items-center bg-my-blue fixed top-0 left-0 xl:left-[30rem] right-0  xl:right-[30rem] lg:left-[25rem] lg:right-[25rem] md:left-[15rem] md:right-[15rem] text-white font-bold">
        <span
          className="hover:bg-my-t-white rounded-full p-1"
          onClick={() => navigate(-1)}
        >
          <IconContext.Provider value={{ className: "text-3xl font-bold" }}>
            <IoIosArrowDropleft />
          </IconContext.Provider>
        </span>
        <span className="font-semibold tracking-wide">Deposit Details</span>
      </div>

      <div className="shadow-my-shadow rounded-xl flex flex-col mx-3 overflow-hidden mt-2">
        <p className="font-semibold bg-my-blue text-white px-4 py-4">
          Step 1: Copy account and make transfer
        </p>
        <div className="flex flex-col px-4 py-2">
          <span className="flex justify-between py-2">
            <span className="font-semibold">Bank Name</span>
            <span className="flex gap-1 justify-center items-center">
              <span>{bankName || "Null"}</span>

              <MdOutlineContentCopy
                className="text-lg font-semibold active:text-my-blue"
                onClick={() => handleCopy(bankName)}
              />
            </span>
          </span>
          <span className="flex justify-between py-2">
            <span className="font-semibold">Recipient Name</span>
            <span className="flex gap-1 justify-center items-center">
              <span>{accountName || "Null"}</span>

              <MdOutlineContentCopy
                className="text-lg font-semibold active:text-my-blue"
                onClick={() => handleCopy(accountName)}
              />
            </span>
          </span>
          <span className="flex justify-between py-2">
            <span className="font-semibold">Account Number</span>
            <span className="flex gap-1 justify-center items-center">
              <span>{accountNumber || "Null"}</span>

              <MdOutlineContentCopy
                className="text-lg font-semibold active:text-my-blue"
                onClick={() => handleCopy(accountNumber)}
              />
            </span>
          </span>
          <span className="flex justify-between py-2">
            <span className="font-semibold">Deposit Amount</span>
            <span className="flex gap-1 justify-center items-center">
              <span>{`N${amount}`}</span>
              <MdOutlineContentCopy
                className="text-lg font-semibold active:text-my-blue"
                onClick={() => handleCopy(amount)}
              />
            </span>
          </span>
        </div>
      </div>

      <div className="shadow-my-shadow rounded-xl flex flex-col mx-3 overflow-hidden mt-2">
        <p className="font-semibold bg-my-blue text-white px-4 py-4">
          Step 2: Copy transfer narration
        </p>
        <div className="flex flex-col px-4 py-2">
          <span className="flex justify-between py-2">
            <span className="font-semibold">Narration</span>
            <span className="flex gap-1 justify-center items-center">
              <span>{code}</span>
              <MdOutlineContentCopy
                className="text-lg font-semibold active:text-my-blue"
                onClick={() => handleCopy(code)}
              />
            </span>
          </span>
        </div>
      </div>

      <div className="shadow-my-shadow rounded-xl flex flex-col mx-3 overflow-hidden mt-2">
        <p className="font-semibold bg-my-blue text-white px-4 py-4">
          Step 3: Input the sender name
        </p>
        <div className="flex flex-col px-4 py-4">
          <input
            placeholder="Enter the sender's name"
            type="text"
            className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
            onChange={(e) => {
              setSenderName(e.target.value);
              setSenderNameErr(undefined);
            }}
          />
          {senderNameErr && (
            <span className="text-red-500 text-sm">{senderNameErr}</span>
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={isProcessing}
        className="bg-my-blue active:bg-white active:border active:border-my-blue active:text-my-blue text-white font-semibold mx-3 rounded-xl py-2 mt-2"
        onClick={handleSubmit}
      >
        {isProcessing ? (
          <span>
            <CgSpinner className="animate-spin font-extrabold text-lg inline-block mr-2" />
            {"Please wait..."}
          </span>
        ) : (
          "Submit"
        )}
      </button>

      <div className="flex flex-col mx-3 rounded-xl overflow-hidden my-5 shadow-my-shadow">
        <h1 className="bg-my-blue text-center text-white py-4 font-semibold">
          Recharge Instructions
        </h1>
        <div className="flex flex-col px-6 gap-2 pb-6 pt-4">
          <span>
            The recharge order amount must be consistent with the final payment
            amount. Inconsistency will result in failure
          </span>
          <hr />
          <span>
            The minimum recharge amount is N2000. If the amount is lower than
            the minimum amount, it will not be credited
          </span>
          <hr />
          <span>
            Please check the account information carefully when transferring
            money to avoid payment errors
          </span>
          <hr />
          <span>
            Please operate according to the recharge rules. If you fail to
            recharge in accordance with the platform rules and cause property
            damage, the company will not be held responsible
          </span>
          <hr />
          <span>
            After the transfer is successful, please upload the payment voucher
            and wait for 20-30 minutes. If your payment does not arrive for a
            long time, please contact online customer service
          </span>
          <hr />
          <span>
            Do not transfer money to strangers. Official personnel will not
            proactively ask you for your account number and password
          </span>
        </div>
      </div>
    </div>
  );
};

export default DepositDetails;
