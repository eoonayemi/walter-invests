import { useState } from "react";
import { useForm } from "react-hook-form";
import { IconContext } from "react-icons";
import { IoIosArrowForward } from "react-icons/io";
import { UseMutateFunction } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import { IoCloudDone } from "react-icons/io5";

export type PlanFormData = {
  name: string | null;
  price: number | null;
  totalDays: number | null;
  returnType: string | null;
  status: string | null;
  dailyReturn: number | null;
  firstRefer: number | null;
  secondRefer: number | null;
  thirdRefer: number | null;
  image: File | null;
};

export type PlanStatus = "active" | "disabled";

type Commission = {
  firstRefer: number;
  secondRefer: number;
  thirdRefer: number;
};

export interface PlanType {
  _id?: string;
  name: string;
  price: number;
  dailyReturn: number;
  totalReturn: number;
  returnType: string;
  status: PlanStatus;
  imageUrl: string;
  totalDays: number;
  commission: Commission;
  createdAt: string;
  updatedAt: string;
}

type ManagePlanFormPropsType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutateFn: UseMutateFunction<any, Error, FormData, unknown>;
  onClose: () => void;
  buttonTag: string;
  title: string;
  plan?: PlanType;
};

const ManagePlanForm = ({
  mutateFn,
  plan,
  onClose,
  buttonTag,
  title,
}: ManagePlanFormPropsType) => {
  const { showToast } = useAppContext();
  const interestTypeOptions = [
    { value: "", label: "Select An Option" },
    { value: "percent", label: "Percent" },
    { value: "fixed", label: "Fixed" },
  ];

  const statusOptions = [
    { value: "", label: "Select An Option" },
    { value: "active", label: "Active" },
    { value: "disabled", label: "Disabled" },
  ];

  type ErrType = string | undefined;

  const [selectedReturnType, setSelectedReturnType] = useState(
    plan?.returnType || "Select An Option"
  );
  const [selectedStatus, setSelectedStatus] = useState(
    plan?.status || "Select An Option"
  );
  const [showITDropDown, setShowITDropDown] = useState(false);
  const [noITOptionErr, setNoITOptionErr] = useState<ErrType>();
  const [showSDropDown, setShowSDropDown] = useState(false);
  const [noSOptionErr, setNoSOptionErr] = useState<ErrType>();
  const [noImageErr, setNoImageErr] = useState<ErrType>(undefined);
  const [imageUrl, setImageUrl] = useState(plan?.imageUrl || null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PlanFormData>({
    defaultValues: {
      name: plan?.name || null,
      price: plan?.price || null,
      totalDays: plan?.totalDays || null,
      returnType: plan?.returnType || null,
      dailyReturn: plan?.dailyReturn || null,
      status: plan?.status || null,
      firstRefer: plan?.commission?.firstRefer || null,
      secondRefer: plan?.commission?.secondRefer || null,
      thirdRefer: plan?.commission?.thirdRefer || null,
      image: null,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      console.log("file", file);
      setImageUrl(URL.createObjectURL(file));
      setValue("image", file);
    } else {
      showToast({ type: "ERROR", message: "Invalid file type" });
    }
  };

  const onSubmit = handleSubmit((data) => {
    if (selectedReturnType == "Select An Option") {
      return setNoITOptionErr("Please select an interest type");
    }
    if (selectedStatus == "Select An Option") {
      return setNoSOptionErr("Please select a status");
    }

    if (!plan?.imageUrl) {
      if (!data.image) {
        return setNoImageErr("Package image is compulsory");
      }
    }

    if (title === "Add New Plan") {
      for (const [key, value] of Object.entries(data)) {
        if (value === null) {
          return showToast({
            type: "ERROR",
            message: `${key} field is required`,
          });
        }
      }
    }

    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value !== null) {
        formData.append(key, value as string | Blob);
      } else {
        formData.delete(key);
      }
    }

    if (title === "Add New Plan") {
      mutateFn(formData);
      onClose();
    }

    if (title === "Edit Plan") {
      formData.append("_id", plan?._id || "");
      mutateFn(formData);
      onClose();
    }
  });

  return (
    <div
      className={`fixed inset-0 items-center justify-center min-h-screen z-50 flex bg-black/75 overflow-y-auto text-[11px]`}
    >
      <div className="overflow-y-auto flex justify-center items-center rounded-xl w-full pb-[2rem]">
        <form
          className={`${ !imageUrl && "mt-[20rem]"} bg-white mt-[28rem] rounded-xl px-10 py-5 shadow-md flex flex-col gap-4 overflow-hidden md:w-2/6 w-5/6`}
          onSubmit={onSubmit}
        >
          <div className="font-semibold text-center text-sm">{title}</div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Name</label>
            <input
              placeholder="Name"
              type="text"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-2 text-[11px] focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("name", { required: "Plan Name is required" })}
            />
            {errors.name && (
              <span className="text-red-500 text-[11px]">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Price (N)</label>
            <input
              placeholder="Price"
              type="text"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-2 text-[11px] focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("price", {
                required: "This field is required",
                pattern: {
                  value: /^[0-9]*(\.[0-9]+)?$/,
                  message: "Please enter a valid number",
                },
              })}
            />
            {errors.price && (
              <span className="text-red-500 text-[11px]">
                {errors.price.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Validity Days</label>
            <input
              placeholder="Total Days"
              type="text"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-2 text-[11px] focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("totalDays", {
                required: "This field is required",
                pattern: {
                  value: /^[0-9]*(\.[0-9]+)?$/,
                  message: "Please enter a valid number",
                },
              })}
            />
            {errors.totalDays && (
              <span className="text-red-500 text-[11px]">
                {errors.totalDays.message}
              </span>
            )}
          </div>

          <div className="relative flex flex-col gap-1">
            <label className="font-semibold">Return Type</label>
            <div
              onClick={() => setShowITDropDown(!showITDropDown)}
              className={`${
                selectedReturnType == "Select An Option"
                  ? "text-gray-300"
                  : "text-black"
              } flex justify-between items-center rounded-md px-4 py-2 text-[11px] bg-gray-50 hover:ring ring-blue-400 ring-offset-0 hover:bg-white hover:border-my-blue`}
            >
              <span>{selectedReturnType}</span>
              <IconContext.Provider value={{ className: "font-bold text-sm" }}>
                <IoIosArrowForward />
              </IconContext.Provider>
            </div>
            {noITOptionErr && (
              <p className="text-red-500 text-[11px]">{noITOptionErr}</p>
            )}
            {showITDropDown && (
              <div className="absolute shadow-my-shadow text-xs w-full z-10 top-[4.5rem] rounded-xl overflow-hidden -mt-5">
                {interestTypeOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSelectedReturnType(option.label);
                      setValue("returnType", option.value);
                      setShowITDropDown(false);
                      setNoITOptionErr(undefined);
                    }}
                    className={`${
                      selectedReturnType == option.label
                        ? "bg-my-blue text-white"
                        : "bg-white text-black"
                    } p-4 py-2 text-xs`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">{`Daily ROI (${
              selectedReturnType === "Percent" ? "%" : "N"
            })`}</label>
            <input
              placeholder="Daily Return"
              type="text"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-2 text-[11px] focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("dailyReturn", {
                required: "This field is required",
                pattern: {
                  value: /^[0-9]*(\.[0-9]+)?$/,
                  message: "Please enter a valid number",
                },
              })}
            />
            {errors.dailyReturn && (
              <span className="text-red-500 text-[11px]">
                {errors.dailyReturn.message}
              </span>
            )}
          </div>

          <div className="relative flex flex-col gap-1">
            <label className="font-semibold">Status</label>
            <div
              onClick={() => setShowSDropDown(!showSDropDown)}
              className={`${
                selectedStatus == "Select An Option"
                  ? "text-gray-300"
                  : "text-black"
              } flex justify-between items-center rounded-md px-4 py-2 text-[11px] bg-gray-50 hover:ring ring-blue-400 ring-offset-0 hover:bg-white hover:border-my-blue`}
            >
              <span>{selectedStatus}</span>
              <IconContext.Provider value={{ className: "font-bold text-sm" }}>
                <IoIosArrowForward />
              </IconContext.Provider>
            </div>
            {noSOptionErr && (
              <p className="text-red-500 text-[11px]">{noSOptionErr}</p>
            )}
            {showSDropDown && (
              <div className="absolute shadow-my-shadow text-sm w-full z-10 top-[4.5rem] rounded-xl overflow-hidden -mt-5">
                {statusOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSelectedStatus(option.label);
                      setValue("status", option.value);
                      setShowSDropDown(false);
                      setNoSOptionErr(undefined);
                    }}
                    className={`${
                      selectedStatus == option.label
                        ? "bg-my-blue text-white"
                        : "bg-white text-black"
                    } px-4 py-2 text-xs`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">{`First Refer Commission (%)`}</label>
            <input
              placeholder="Ex: 20"
              type="text"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-2 text-[11px] focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("firstRefer", {
                required: "This field is required",
                pattern: {
                  value: /^[0-9]*(\.[0-9]+)?$/,
                  message: "Please enter a valid number",
                },
              })}
            />
            {errors.firstRefer && (
              <span className="text-red-500 text-[11px]">
                {errors.firstRefer.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">{`Second Refer Commission (%)`}</label>
            <input
              placeholder="Ex: 20"
              type="text"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-2 text-[11px] focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("secondRefer", {
                required: "This field is required",
                pattern: {
                  value: /^[0-9]*(\.[0-9]+)?$/,
                  message: "Please enter a valid number",
                },
              })}
            />
            {errors.secondRefer && (
              <span className="text-red-500 text-[11px]">
                {errors.secondRefer.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">{`Third Refer Commission (%)`}</label>
            <input
              placeholder="Ex: 20"
              type="text"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-2 text-[11px] focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("thirdRefer", {
                required: "This field is required",
                pattern: {
                  value: /^[0-9]*(\.[0-9]+)?$/,
                  message: "Please enter a valid number",
                },
              })}
            />
            {errors.thirdRefer && (
              <span className="text-red-500 text-[11px]">
                {errors.thirdRefer.message}
              </span>
            )}
          </div>

          {/* Input field for selecting image */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Image</label>
            <div className="flex justify-center items-center bg-gray-100 hover:bg-gray-50 p-1 rounded-lg">
              <div
                className="relative flex justify-center items-center gap-2 overflow-hidden px-4 py-3 text-xs rounded-md text-gray-400 active:bg-opacity-80 border border-dashed border-gray-400 w-full"
              >
                <IconContext.Provider
                  value={{ className: "font-bold text-sm " }}
                >
                  <IoCloudDone />
                </IconContext.Provider>
                <span>Upload Image</span>

                <input
                  className="w-96 h-96 cursor-pointer opacity-0 absolute left-0 top-0 transform scale-150"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {noImageErr && (
              <span className="text-red-500 text-[11px]">{noImageErr}</span>
            )}
          </div>

          {
            imageUrl && <img src={imageUrl} alt="upload image" className="block object-contain h-32" />
          }

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
    </div>
  );
};

export default ManagePlanForm;
