import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { IoIosArrowDropleft } from "react-icons/io";
import { IconContext } from "react-icons";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa6";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../api-clients";
import { useAppContext } from "../../contexts/AppContext";

export type RegisterFormData = {
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  inviteCode?: string;
  confirmPassword: string;
};

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // Access the query parameters
  const inviteCode = searchParams.get("inviteCode");

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const { mutate, isLoading } = useMutation(apiClient.register, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      showToast({ type: "SUCCESS", message: "Registration successful" });
      navigate("/login");
    },
    onError: (err: Error) => {
      showToast({ type: "ERROR", message: err.message });
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (inviteCode) {
      data.inviteCode = inviteCode;
    }
    mutate(data);
  });

  return (
    <div>
      <div className="fixed top-0 left-0 xl:left-[30rem] right-0  xl:right-[30rem] lg:left-[25rem] lg:right-[25rem] md:left-[15rem] md:right-[15rem] text-center bg-my-blue text-white py-4 font-semibold text-lg text-pretty z-50">
        <div className="flex items-center gap-2 mx-10">
          <div onClick={() => navigate(-1)}>
            <IconContext.Provider
              value={{ className: "text-3xl font-semibold" }}
            >
              <IoIosArrowDropleft />
            </IconContext.Provider>
          </div>
          <div>Register</div>
        </div>
      </div>
      <div className="min-h-screen flex justify-center items-center">
        <form
          onSubmit={onSubmit}
          className={
            errors
              ? "flex flex-col justify-center w-full mx-10 my-10 gap-4"
              : "flex flex-col justify-center w-full mx-10 gap-4"
          }
        >
          <div className="flex flex-col gap-1 mb-5 mt-14">
            <img
              src="http://res.cloudinary.com/dc0tvk5bx/image/upload/v1718487907/xotuwlmnykfusnhfolvs.png"
              className="mx-auto w-3/5"
            />
            <div className="text-center text-gray-400 ml-2">
              Register an account here
            </div>
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="font-semibold">Username</label>
            <input
              placeholder="Username"
              type="text"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-12 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("userName", { required: "Username is required" })}
            />
            {errors.userName && (
              <span className="text-red-500 text-sm">
                {errors.userName.message}
              </span>
            )}
            <IconContext.Provider
              value={{
                className: "text-xl absolute top-10 left-4 text-gray-300",
              }}
            >
              <FaUser />
            </IconContext.Provider>
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="font-semibold">Email Address</label>
            <input
              placeholder="Email address"
              type="email"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-12 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
            <IconContext.Provider
              value={{
                className: "text-xl absolute top-10 left-4 text-gray-300",
              }}
            >
              <MdEmail />
            </IconContext.Provider>
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="font-semibold">Phone Number</label>
            <input
              placeholder="Phone Number"
              type="tel"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 placeholder:text-sm rounded-md px-20 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("phoneNumber", {
                required: "Phone Number is required",
                minLength: {
                  value: 10,
                  message: "Phone Number must have at least 10 characters",
                },
                maxLength: {
                  value: 10,
                  message: "Phone Number must have at most 10 characters",
                },
              })}
            />

            {errors.phoneNumber && (
              <span className="text-red-500 text-sm">
                {errors.phoneNumber.message}
              </span>
            )}

            <span className="absolute top-10 left-4 flex gap-2 justify-center items-center">
              <IconContext.Provider
                value={{
                  className: "text-lg text-gray-300",
                }}
              >
                <FaPhoneAlt />
              </IconContext.Provider>
              <span className="text-sm">+234</span>
            </span>
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="font-semibold">Password</label>
            <input
              placeholder="Password"
              type="password"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-12 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("password", {
                required: "Password is required",
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

          <div className="flex flex-col gap-1 relative">
            <label className="font-semibold">Confirm Password</label>
            <input
              placeholder="Confirm Password"
              type="password"
              className="outline-none focus:border bg-gray-50 placeholder:text-gray-300 rounded-md px-12 py-3 text-sm focus:ring ring-blue-400 ring-offset-0 focus:bg-white focus:border-my-blue"
              {...register("confirmPassword", {
                validate: (val) => {
                  if (!val) {
                    return "Confirm password is required";
                  } else if (watch("password") !== val) {
                    return "Passwords do not match";
                  }
                },
              })}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
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
            Already have an account?{" "}
            <Link className="text-my-blue" to="/login">
              Login here
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="font-semibold bg-my-blue text-white rounded-md py-3 hover:bg-blue-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
