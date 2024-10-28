import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowDropleft } from "react-icons/io";
import { IconContext } from "react-icons";
import { RiLockPasswordFill } from "react-icons/ri";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../api-clients";
import { useAppContext } from "../../contexts/AppContext";
import { useAppDispatch } from "../../redux/hooks";
import {
  onLogInError,
  onLogInStart,
  onLogInSuccess,
} from "../../redux/userSlice";
import { CgSpinner } from "react-icons/cg";
import { FaPhoneAlt } from "react-icons/fa";

export type LoginFormData = {
  phone: string;
  password: string;
};

const LogIn = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const { mutate, isLoading } = useMutation(apiClient.LogIn, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries("validateToken");
      showToast({ type: "SUCCESS", message: "Login successful" });
      dispatch(onLogInSuccess(data));
      navigate("/dashboard");
    },
    onError: (err: Error) => {
      showToast({ type: "ERROR", message: err.message });
      dispatch(onLogInError(err));
    },
  });

  const onSubmit = handleSubmit((data) => {
    dispatch(onLogInStart());
    mutate(data);
  });

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 text-center bg-my-blue text-white py-4 font-bold text-lg text-pretty">
        <div className="flex items-center gap-2 mx-10">
          <div onClick={() => navigate(-1)}>
            <IconContext.Provider value={{ className: "text-3xl font-bold" }}>
              <IoIosArrowDropleft />
            </IconContext.Provider>
          </div>

          <div>Log In</div>
        </div>
      </div>
      <div className="min-h-screen flex justify-center items-center">
        {/* <div className="flex justify-center items-center ">
        <img src="../src/assets/logo.png" className="mx-auto w-3/5" />

        </div> */}
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center w-full mx-10 gap-4"
        >
          <div className="flex flex-col gap-1 mb-5 mt-14">
            <img
              src="http://res.cloudinary.com/dc0tvk5bx/image/upload/v1718487907/xotuwlmnykfusnhfolvs.png"
              className="mx-auto w-3/5"
            />
            <div className="text-center text-gray-400 ml-2">
              Welcome back! Login here
            </div>
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="font-bold">Phone Number</label>
            <input
              placeholder="Phone Number"
              type="tel"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-12 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("phone", {
                required: "Phone Number is required",
                validate: (val) => {
                  if (val.includes("+")) return "No need of country code";
                  else if (val.length !== 11) return "Invalid Phone Number";
                },
              })}
            />
            {errors.phone && (
              <span className="text-red-500 text-sm">
                {errors.phone.message}
              </span>
            )}
            <IconContext.Provider
              value={{
                className: "text-xl absolute top-10 left-4 text-gray-300",
              }}
            >
              <FaPhoneAlt />
            </IconContext.Provider>
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="font-bold">Password</label>
            <input
              placeholder="Password"
              type="password"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-12 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 6,
                  message: "Password must have at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
            <IconContext.Provider
              value={{
                className: "text-xl absolute top-10 left-4 text-gray-300",
              }}
            >
              <RiLockPasswordFill />
            </IconContext.Provider>
          </div>

          <div className="text-sm">
            Don't have an account?{" "}
            <Link className="text-my-blue" to="/register">
              Create an account here
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="font-bold bg-my-blue text-white rounded-md py-3 hover:bg-blue-500"
          >
            {isLoading ? (
              <span>
                <CgSpinner className="animate-spin font-extrabold text-lg inline-block mr-2" />
                {"Logging..."}
              </span>
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
