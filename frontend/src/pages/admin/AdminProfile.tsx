import { FaCircleUser } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useForm } from "react-hook-form";
import * as apiClient from "../../api-clients";
import { useMutation } from "react-query";
import { useAppContext } from "../../contexts/AppContext";
import {
  onEditError,
  onEditStart,
  onEditSuccess,
} from "../../redux/adminSlice";
import { useRef, useState } from "react";
import { uploadImage } from "../../hooks";
import { IoIosArrowForward } from "react-icons/io";

export type AdminProfileType = {
  userName: string | null;
  email: string | null;
  newPassword: string | null;
  confirmPassword: string | null;
  withdrawalCharge: number | null;
  telegramGroup: string | null;
  telegramChannel: string | null;
  dailyBonus: number | null;
  bonusStatus: string | null;
};

const AdminProfile = () => {
  const { admin } = useAppSelector((state) => state.admin);
  const { showToast } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(
    null
  );
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AdminProfileType>({
    defaultValues: {
      userName: admin?.userName || null,
      email: admin?.email || null,
      withdrawalCharge: admin?.withdrawalCharge || null,
      telegramGroup: admin?.telegramGroup || null,
      telegramChannel: admin?.telegramChannel || null,
      dailyBonus: admin?.dailyBonus.bonus || null,
      bonusStatus: admin?.dailyBonus.status || null,
      newPassword: null,
      confirmPassword: null,
    },
  });

  const editAdminMutation = useMutation(apiClient.editAdmin, {
    onSuccess: async (data) => {
      dispatch(onEditSuccess(data));
      showToast({ type: "SUCCESS", message: "Admin details updated" });
    },
    onError: (error: Error) => {
      dispatch(onEditError(error));
      showToast({ type: "ERROR", message: error.message });
    },
  });

  const editAdmin = handleSubmit((data) => {
    if (errors.newPassword || errors.confirmPassword) {
      console.log("Password error", errors.newPassword, errors.confirmPassword);
      return showToast({
        type: "ERROR",
        message: "Please fill necessary fields",
      });
    }

    if (selectedStatus == "Select An Option") {
      return setNoSOptionErr("Please select a status");
    }

    if (data.newPassword !== data.confirmPassword) {
      console.log("Password error", errors.newPassword, errors.confirmPassword);
      return showToast({ type: "ERROR", message: "Passwords do not match" });
    }

    if (data.newPassword && data.newPassword.length < 6) {
      console.log("Password error", errors.newPassword, errors.confirmPassword);
      return showToast({
        type: "ERROR",
        message: "Password must be at least 6 characters",
      });
    }

    dispatch(onEditStart());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newData: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== "" && value !== " ") {
        newData[key] = typeof value === "string" ? value.trim() : value;
      } else {
        delete newData[key];
      }
    }

    editAdminMutation.mutate({ data: newData, adminId: admin?._id });
  });

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      console.log("file", file);
      setImageUrl(URL.createObjectURL(file));
      handleImageUpload(file);
    } else {
      showToast({ type: "ERROR", message: "Invalid file type" });
    }
  };

  const handleImageUpload = async (imageFile: File) => {
    if (!imageFile) return;
    try {
      showToast({ type: "SUCCESS", message: "Uploading image..." });
      const downloadURL = await uploadImage(imageFile);
      if (downloadURL !== "") {
        setImageUrl(downloadURL);
        setImageUploadProgress(null);
        editAdminMutation.mutate({
          data: { imageUrl: downloadURL },
          adminId: admin?._id,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error); // Log the error to a centralized service
      showToast({ type: "ERROR", message: "Error uploading image" });
    }
  };

  const statusOptions = [
    { value: "", label: "Select An Option" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  type ErrType = string | undefined;
  const [selectedStatus, setSelectedStatus] = useState(
    admin?.dailyBonus.status || "Select An Option"
  );
  const [showSDropDown, setShowSDropDown] = useState(false);
  const [noSOptionErr, setNoSOptionErr] = useState<ErrType>();

  return (
    <div className="mx-4 flex flex-col gap-5 flex-1">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">Admin Profile</span>
      </div>
      <div className="flex flex-col md:flex-row gap-10 justify-center md:items-center shadow-my-shadow rounded-lg p-10">
        <div className="flex-1 flex justify-center">
          {" "}
          <div className="relative flex justify-center items-center">
            <input
              type="file"
              name="profile pic"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imageUrl || admin?.imageUrl ? (
              <img
                src={imageUrl || admin?.imageUrl}
                onClick={handleCameraClick}
                alt="profile image"
                className={`border-8 ${
                  imageUploadProgress && "animate-pulse"
                } object-cover border-my-blue rounded-full w-52 aspect-square`}
              />
            ) : (
              <FaCircleUser
                onClick={handleCameraClick}
                className={`border-8 ${
                  imageUploadProgress && "animate-pulse"
                } border-my-blue rounded-full text-[10rem] text-gray-300`}
              />
            )}
          </div>
        </div>
        <form
          className="md:grid md:grid-cols-2 flex flex-col gap-4 flex-1 text-sm"
          onSubmit={editAdmin}
        >
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Username</label>
            <input
              placeholder="Username"
              type="text"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-xs focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("userName", {
                required: "This field is required",
              })}
            />

            {errors.userName && (
              <span className="text-red-500 text-[11px]">
                {errors.userName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Email</label>
            <input
              placeholder="Email"
              type="email"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-xs focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("email", {
                required: "This field is required",
              })}
            />

            {errors.email && (
              <span className="text-red-500 text-[11px]">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Withdrawal Charge (%)</label>
            <input
              placeholder="Withdrawal Charge"
              type="text"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-xs focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("withdrawalCharge", {
                required: "This field is required",
                pattern: {
                  value: /^[0-9]*(\.[0-9]+)?$/,
                  message: "Please enter a valid number",
                },
              })}
            />

            {errors.withdrawalCharge && (
              <span className="text-red-500 text-[11px]">
                {errors.withdrawalCharge.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Telegram Group</label>
            <input
              placeholder="Telegram Group"
              type="url"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-xs focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("telegramGroup", {
                required: "This field is required",
              })}
            />

            {errors.telegramGroup && (
              <span className="text-red-500 text-[11px]">
                {errors.telegramGroup.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-semibold">Telegram Channel</label>
            <input
              placeholder="Telegram Channel"
              type="url"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-xs focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("telegramChannel", {
                required: "This field is required",
              })}
            />
            {errors.telegramChannel && (
              <span className="text-red-500 text-[11px]">
                {errors.telegramChannel.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-semibold">Daily Bonus</label>
            <input
              placeholder="Daily Bonus"
              type="text"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-xs focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("dailyBonus", {
                required: "This field is required",
              })}
            />
            {errors.dailyBonus && (
              <span className="text-red-500 text-[11px]">
                {errors.dailyBonus.message}
              </span>
            )}
          </div>

          <div className="relative flex flex-col gap-1 md:col-span-2">
            <label className="font-semibold">Bonus Status</label>
            <div
              onClick={() => setShowSDropDown(!showSDropDown)}
              className={`${
                selectedStatus == "Select An Option"
                  ? "text-gray-300"
                  : "text-black"
              } flex capitalize text-xs justify-between items-center rounded-md px-4 py-2 text-[11px] bg-gray-50 hover:ring ring-blue-400 ring-offset-0 hover:bg-white hover:border-my-blue`}
            >
              <span>{selectedStatus}</span>
              <IoIosArrowForward className="font-bold text-sm" />
            </div>
            {noSOptionErr && (
              <p className="text-red-500 text-[11px]">{noSOptionErr}</p>
            )}
            {showSDropDown && (
              <div className="absolute shadow-my-shadow text-sm w-full z-10 top-[4.5rem] rounded-xl overflow-hidden -mt-2">
                {statusOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSelectedStatus(option.label);
                      setValue("bonusStatus", option.value);
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

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-semibold">New Password</label>
            <input
              placeholder="Password"
              type="password"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-xs focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("newPassword", {
                minLength: {
                  value: 6,
                  message: "Password must have at least 6 characters",
                },
              })}
            />
            {errors.newPassword && (
              <span className="text-red-500 text-xs">
                {errors.newPassword.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-semibold">Confirm New Password</label>
            <input
              placeholder="Confirm New Password"
              type="password"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-xs focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("confirmPassword", {
                validate: (val) => {
                  if (watch("newPassword") && !val) {
                    return "Confirm password is required";
                  } else if (watch("newPassword") !== val) {
                    return "Passwords do not match";
                  }
                },
              })}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div className="col-span-2 flex gap-2">
            <button
              type="submit"
              disabled={editAdminMutation.isLoading}
              className="font-semibold bg-my-blue text-white rounded-md py-3 hover:bg-blue-500 flex-1"
            >
              {editAdminMutation.isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
