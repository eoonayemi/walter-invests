import { useForm } from "react-hook-form";
import { IoIosArrowDropleft, IoIosArrowForward } from "react-icons/io";
import { IconContext } from "react-icons";
import { useMutation } from "react-query";
import * as apiClient from "../../api-clients";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export type BankDetailsFormData = {
  bankName: string;
  accountNumber: number;
  accountName: string;
};

const AddBank = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const options = [
    { value: "", label: "Select Bank" },
    { value: "local", label: "Local Bank" },
    { value: "digital", label: "Digital Bank" },
  ];

  type ErrType = string | undefined;

  const [selectedValue, setSelectedValue] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("Select Bank");
  const [showDropDown, setShowDropDown] = useState(false);
  const [noOptionErr, setNoOptionErr] = useState<ErrType>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BankDetailsFormData>();

  const { mutate } = useMutation(apiClient.addBank, {
    onSuccess: (data) => {
      showToast({
        type: "SUCCESS",
        message: data.message,
      });
      navigate("/user/bank-details");
    },

    onError: (err: Error) => {
      showToast({ type: "ERROR", message: err.message });
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (selectedValue == "") {
      return setNoOptionErr("Please select a bank");
    }

    const { accountNumber } = data;

    const newData = {
      ...data,
      bankType: selectedValue,
      accountNumber: accountNumber.toString(),
    };
    mutate(newData);
  });

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 text-center bg-my-blue text-white py-4 font-semibold text-lg text-pretty z-100">
        <div className="flex items-center gap-2 mx-5">
          <div onClick={() => navigate(-1)}>
            <IconContext.Provider value={{ className: "text-3xl font-bold" }}>
              <IoIosArrowDropleft />
            </IconContext.Provider>
          </div>

          <div>Add Bank</div>
        </div>
      </div>
      <div className="mt-20">
        <form className="flex flex-col mx-5 gap-4 -z-50" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Bank Name</label>
            <input
              placeholder="Bank Name"
              type="text"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("bankName", { required: "Bank Name is required" })}
            />
            {errors.bankName && (
              <span className="text-red-500 text-sm">
                {errors.bankName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Account Number</label>
            <input
              placeholder="Account Number"
              type="text"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("accountNumber", {
                required: "This field is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Account number must be 10 characters long",
                },
              })}
            />
            {errors.accountNumber && (
              <span className="text-red-500 text-sm">
                {errors.accountNumber.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Account Name</label>
            <input
              placeholder="Account Name"
              type="text"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("accountName", {
                required: "This field is required",
              })}
            />
            {errors.accountName && (
              <span className="text-red-500 text-sm">
                {errors.accountName.message}
              </span>
            )}
          </div>

          <div className="relative flex flex-col">
            <label className="font-semibold">Bank Type</label>
            <div
              onClick={() => setShowDropDown(!showDropDown)}
              className={`${
                selectedValue == "Select Bank" ? "text-gray-300" : "text-black"
              } flex justify-between items-center rounded-xl px-4 py-3 text-sm bg-gray-50 hover:ring ring-blue-400 ring-offset-0 hover:bg-white hover:border-my-blue`}
            >
              <span>{selectedLabel}</span>
              <IconContext.Provider value={{ className: "font-bold text-lg" }}>
                <IoIosArrowForward />
              </IconContext.Provider>
            </div>
            {noOptionErr && (
              <p className="text-red-500 text-sm">{noOptionErr}</p>
            )}
            {showDropDown && (
              <div className="absolute shadow-my-shadow text-sm w-full z-10 top-[4.5rem] rounded-xl overflow-hidden">
                {options.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSelectedLabel(option.label);
                      setSelectedValue(option.value);
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

          <button
            type="submit"
            className="font-bold bg-my-blue text-white rounded-md py-3 hover:bg-blue-500"
          >
            Add Bank
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBank;
