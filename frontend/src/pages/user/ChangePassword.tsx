import { useForm } from "react-hook-form";
import { IoIosArrowDropleft } from "react-icons/io";
import { IconContext } from "react-icons";
import { useMutation } from "react-query";
import * as apiClient from "../../api-clients";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type ChangePasswordFormData = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const ChangePassword = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>();

  const mutation = useMutation(apiClient.changePassword, {
    onSuccess: async () => {
      showToast({ type: "SUCCESS", message: "Password has been changed" });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      showToast({ type: "ERROR", message: error.message });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
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

          <div>Change Password</div>
        </div>
      </div>
      <div className="mt-20">
        <form className="flex flex-col mx-5 gap-4 -z-50" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Old Password</label>
            <input
              placeholder="Old Password"
              type="password"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("oldPassword", {
                required: "Bank Name is required",
              })}
            />
            {errors.oldPassword && (
              <span className="text-red-500 text-sm">
                {errors.oldPassword.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">New Password</label>
            <input
              placeholder="New Password"
              type="password"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("newPassword", {
                required: "This field is required",
                minLength: {
                  value: 6,
                  message: "Invalid account",
                },
              })}
            />
            {errors.newPassword && (
              <span className="text-red-500 text-sm">
                {errors.newPassword.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold">Confirm New Password</label>
            <input
              placeholder="Confirm New Password"
              type="password"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-4 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("confirmNewPassword", {
                required: "This field is required",
                validate: (val) => {
                  if (!val) {
                    return "Confirm password is required";
                  } else if (watch("newPassword") !== val) {
                    return "Passwords do not match";
                  }
                },
              })}
            />
            {errors.confirmNewPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmNewPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="font-bold bg-my-blue text-white rounded-md py-3 hover:bg-blue-500"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
