import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IconContext } from "react-icons";
import { useMutation, useQuery } from "react-query";
import * as apiClient from "../../api-clients";
import { useAppContext } from "../../contexts/AppContext";
import BankAccountForm, { BankType } from "../../forms/BankAccountForm";
import { BiEdit } from "react-icons/bi";

const BankAccount = () => {
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const { showToast } = useAppContext();

  const { data: bank, refetch } = useQuery(
    "getAdminBank",
    apiClient.getAdminBank
  );

  // Combine add and edit mutation logic for cleaner handling
  const handleBankMutation = useMutation(
    (formData: BankType) =>
      formData?._id
        ? apiClient.editAdminBank(formData)
        : apiClient.addAdminBank(formData),
    {
      onSuccess: (data) => {
        refetch();
        showToast({ type: "SUCCESS", message: data.message });
      },
      onError: (err: Error) => {
        console.error("Error saving bank details:", err); // Consider more robust error handling
        showToast({
          type: "ERROR",
          message: err.message,
        });
        console.log(err);
      },
    }
  );

  const onCloseModal = () => {
    setIsAddingBank(false);
    setIsEditingBank(false);
  };

  const handleOpenAddBank = () => setIsAddingBank(true);
  const handleOpenEditBank = () => setIsEditingBank(true);

  return (
    <div className="mx-4 flex flex-col gap-5 flex-1">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">Bank Account</span>
        {bank ? (
          <button
            onClick={handleOpenEditBank}
            className="flex gap-1 bg-my-blue p-2 rounded-md text-white justify-center items-center text-xs font-semibold"
          >
            <IconContext.Provider
              value={{ className: "font-bold text-sm text-white" }}
            >
              <BiEdit />
            </IconContext.Provider>
            <span>Edit Bank</span>
          </button>
        ) : (
          <button
            onClick={handleOpenAddBank}
            className="flex gap-1 bg-my-blue p-2 rounded-md text-white justify-center items-center text-xs font-semibold"
          >
            <IconContext.Provider
              value={{ className: "font-bold text-sm text-white" }}
            >
              <FaPlus />
            </IconContext.Provider>
            <span>Add New</span>
          </button>
        )}
      </div>

      {bank ? (
        <div className="flex flex-col shadow-my-shadow mx-3 px-6 rounded-xl my-2 bg-white">
          <p className="py-3 font-semibold text-center">Bank Account</p>
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
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center font-semibold text-lg h-full">
          <span>No Bank Added</span>
        </div>
      )}

      {isAddingBank && (
        <BankAccountForm
          mutateFn={handleBankMutation.mutate}
          onClose={onCloseModal}
          buttonTag="Add Bank"
          title="Add Bank"
        />
      )}

      {isEditingBank && (
        <BankAccountForm
          mutateFn={handleBankMutation.mutate} // Pass the combined mutation function
          onClose={onCloseModal}
          bank={bank} // Pass the existing bank data for editing
          buttonTag="Save Bank" // Update button text for editing
          title="Edit Bank"
        />
      )}
    </div>
  );
};

export default BankAccount;
