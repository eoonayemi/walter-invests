import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../api-clients";
import { useAppContext } from "../../contexts/AppContext";
import {
  onLogInError,
  onLogInStart,
  onLogInSuccess,
} from "../../redux/adminSlice";
import { useAppDispatch } from "../../redux/hooks";

export type AdminLoginFormData = {
  email: string;
  password: string;
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>();

  const { mutate, isLoading } = useMutation(apiClient.LogAdminIn, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries("validateAdminToken");
      dispatch(onLogInSuccess(data));
      showToast({ type: "SUCCESS", message: "Login successful" });
      navigate("/admin/dashboard");
    },
    onError: (err: Error) => {
      dispatch(onLogInError(err));
      showToast({ type: "ERROR", message: err.message });
    },
  });

  const onSubmit = handleSubmit((data) => {
    dispatch(onLogInStart());
    mutate(data);
  });

  return (
    <div className=" bg-blue-950 min-h-screen flex justify-center items-center">
      <div className="bg-my-blue hidden md:flex justify-center items-center w-[450px] h-[450px] rounded-tl-2xl rounded-bl-2xl">
        <img
          src="http://res.cloudinary.com/dc0tvk5bx/image/upload/v1717181117/vivquib7xngw5glwbwem.png"
          alt="logo"
          className=" w-36"
        />
      </div>

      <div className="bg-white mx-5 md:mx-0 justify-center flex flex-col p-10 w-[450px] h-[450px] gap-5 rounded-2xl md:rounded-none md:rounded-tr-2xl md:rounded-br-2xl">
        {" "}
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="md:text-lg flex justify-center items-center gap-1 font-semibold">
            <span>Welcome to</span>
            <img
              src="http://res.cloudinary.com/dc0tvk5bx/image/upload/v1718487907/xotuwlmnykfusnhfolvs.png"
              alt="logo"
              className="md:w-36 w-2/5"
            />
          </span>
          <span className="text-sm text-gray-400">
            Admin login to dashboard
          </span>

          <span className="mx-auto text-sm flex flex-col justify-center items-center text-gray-400">
            <span>Admin Login Details</span>
          <span>Email: super@mygmail.com</span>
          <span>Password: super123</span>
          </span>
        </div>
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center gap-3 text-sm"
        >
          <div className="flex flex-col gap-1 relative">
            <label className="font-semibold">Email Address</label>
            <input
              placeholder="Email address"
              type="email"
              className="outline-none duration-300 focus:border bg-gray-50 placeholder:text-gray-300 rounded-lg px-12 py-3 text-xs focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
            <IconContext.Provider
              value={{
                className: "text-xl absolute top-[2.2rem] left-4 text-gray-300",
              }}
            >
              <MdEmail />
            </IconContext.Provider>
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="font-semibold">Password</label>
            <input
              placeholder="Password"
              type="password"
              className="outline-none focus:border duration-300 bg-gray-50 placeholder:text-gray-300 rounded-lg px-12 py-3 text-xs focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 6,
                  message: "Password must have at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-y">
                {errors.password.message}
              </span>
            )}
            <IconContext.Provider
              value={{
                className: "text-xl absolute top-[2.2rem] left-4 text-gray-300",
              }}
            >
              <RiLockPasswordFill />
            </IconContext.Provider>
          </div>

          <Link className="text-my-blue text-xs" to="/admin/reset-password">
            Forgot password?
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="font-semibold bg-my-blue text-white rounded-lg py-3 hover:bg-blue-500"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};
export default AdminLogin;
