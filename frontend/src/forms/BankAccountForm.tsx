import { useForm } from "react-hook-form";
import { UseMutateFunction } from "react-query";

export type BankFormData = {
  bankName: string;
  accountNumber: string;
  accountName: string;
};

export interface BankType {
  _id?: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

type ManagePlanFormPropsType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutateFn: UseMutateFunction<any, unknown, BankType, unknown>;
  onClose: () => void;
  buttonTag: string;
  title: string;
  bank?: BankType;
};

const BankAccountForm = ({
  mutateFn,
  bank,
  onClose,
  buttonTag,
  title,
}: ManagePlanFormPropsType) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BankFormData>({
    defaultValues: {
      bankName: bank?.bankName || "",
      accountName: bank?.accountName || "",
      accountNumber: bank?.accountNumber || "",
    },
  });

  const onSubmit = handleSubmit((data: BankFormData) => { // Type checking added here
    if (title === "Add Bank") {
      mutateFn(data);
      onClose();
    }

    if (title === "Edit Bank") {
      const newData = {
        ...data,
        _id: bank?._id,
      };

      mutateFn(newData);
      onClose();
    }
  });

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/75 overflow-y-auto text-[11px]`}
    >
      <form
        className="bg-white rounded-xl px-10 py-5 shadow-md flex flex-col gap-4 md:w-2/6 w-5/6"
        onSubmit={onSubmit}
      >
        <div className="font-semibold text-center text-sm">{title}</div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Bank Name</label>
          <input
            placeholder="Bank Name"
            type="text"
            className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-2 text-[11px] focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
            {...register("bankName", { required: "Plan Name is required" })}
          />
          {errors.bankName && (
            <span className="text-red-500 text-[11px]">
              {errors.bankName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold">Account Number</label>
          <input
            placeholder="Account Number"
            type="text"
            className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-2 text-[11px] focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
            {...register("accountNumber", {
              required: "This field is required",
            })}
          />
          {errors.accountNumber && (
            <span className="text-red-500 text-[11px]">
              {errors.accountNumber.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold">Account Name</label>
          <input
            placeholder="Account Name"
            type="text"
            className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-2 text-[11px] focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
            {...register("accountName", {
              required: "This field is required",
            })}
          />
          {errors.accountName && (
            <span className="text-red-500 text-[11px]">
              {errors.accountName.message}
            </span>
          )}
        </div>

        <div className="flex gap-3 mb-2">
          <button
            type="button"
            className="font-bold border text-my-blue border-my-blue rounded-md py-2 flex-1"
            onClick={() => onClose()}
          >
            Close
          </button>

          <button
            type="submit"
            className="font-bold bg-my-blue text-white rounded-md hover:bg-blue-500 flex-1"
          >
            {buttonTag}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BankAccountForm;
