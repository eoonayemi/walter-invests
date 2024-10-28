import { RiRefundFill } from "react-icons/ri";
import { IconContext } from "react-icons";
import { PiArrowSquareUpRightFill } from "react-icons/pi";
import { BiSolidGift } from "react-icons/bi";
import { IoBagCheck } from "react-icons/io5";
import { RiCustomerServiceFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { FaMoneyBill } from "react-icons/fa";
import { getBonus, getLink } from "../api-clients";
import { useMutation, useQuery } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import { CgSpinner } from "react-icons/cg";
import { onLogInSuccess } from "../redux/userSlice";
import { useAppDispatch } from "../redux/hooks";

const DashboardIconsLayout = () => {
  const dispatch = useAppDispatch();
  // const { user } = useAppSelector((state) => state.user);
  const { mutate, isLoading } = useMutation(getBonus, {
    onSuccess: (data) => {
      dispatch(onLogInSuccess(data.user));
      return showToast({ type: "SUCCESS", message: "Bonus claimed" });
    },
    onError: (err: Error) => {
      return showToast({ type: "ERROR", message: err.message });
    },
  });

  const { data: links, isLoading: isLoadingLink } = useQuery(
    "getLink",
    getLink,
    {
      onSuccess: (data) => {
        dispatch(onLogInSuccess(data.user));
        localStorage.setItem("links", JSON.stringify(data));
      },
      onError: () => {},
    }
  );

  const { linkC } = links || {};
  const { showToast } = useAppContext();

  const onGetBonus = () => {
    mutate();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white flex justify-between p-4 items-center text-[12px] mx-3 rounded-xl text-center text-gray-400">
        <Link
          to="/user/deposit"
          className="flex flex-col justify-center items-center gap-1"
        >
          <span className="bg-blue-100 rounded-md p-2">
            <IconContext.Provider
              value={{ className: "font-bold text-2xl text-my-blue" }}
            >
              <RiRefundFill />
            </IconContext.Provider>
          </span>
          <span>
            Make
            <br /> Deposit
          </span>
        </Link>
        <Link
          to="/user/withdraw"
          className="flex flex-col justify-center items-center gap-1"
        >
          <span className="bg-blue-100 rounded-md p-2">
            <IconContext.Provider
              value={{ className: "font-bold text-2xl text-my-blue" }}
            >
              <PiArrowSquareUpRightFill />
            </IconContext.Provider>
          </span>
          <span>
            Withdraw
            <br /> Money
          </span>
        </Link>
        <Link
          to="/user/income/records"
          className="flex flex-col justify-center items-center gap-1"
        >
          <span className="bg-blue-100 rounded-md p-2">
            <IconContext.Provider
              value={{ className: "font-bold text-2xl text-my-blue" }}
            >
              <FaMoneyBill />
            </IconContext.Provider>
          </span>
          <span>
            Income
            <br /> Records
          </span>
        </Link>
      </div>

      <div className="bg-white flex justify-between p-4 items-center text-[12px] mx-3 rounded-xl text-center text-gray-400">
        <button
          disabled={isLoading}
          onClick={onGetBonus}
          className="flex flex-col justify-center items-center gap-1"
        >
          <span className="bg-blue-100 rounded-md p-2">
            <IconContext.Provider
              value={{ className: "font-bold text-2xl text-my-blue" }}
            >
              <BiSolidGift />
            </IconContext.Provider>
          </span>
          <span>
            My
            <br /> Bonus
          </span>
        </button>
        <Link
          to="/user/investments"
          className="flex flex-col justify-center items-center gap-1"
        >
          <span className="bg-blue-100 rounded-md p-2">
            <IconContext.Provider
              value={{ className: "font-bold text-2xl text-my-blue" }}
            >
              <IoBagCheck />
            </IconContext.Provider>
          </span>
          <span>
            My
            <br /> Orders
          </span>
        </Link>
        <Link
          to={linkC || "/dashboard"}
          className="flex flex-col justify-center items-center gap-1"
        >
          <span className="bg-blue-100 rounded-md p-2">
            <IconContext.Provider
              value={{ className: "font-bold text-2xl text-my-blue" }}
            >
              {isLoadingLink ? (
                <CgSpinner className="animate-spin font-extrabold text-lg" />
              ) : (
                <RiCustomerServiceFill />
              )}
            </IconContext.Provider>
          </span>
          <span>
            Customer
            <br /> Service
          </span>
        </Link>
      </div>
    </div>
  );
};

export default DashboardIconsLayout;
