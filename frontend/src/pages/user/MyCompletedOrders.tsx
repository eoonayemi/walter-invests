import { IoIosArrowDropleft } from "react-icons/io";
import { IconContext } from "react-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import * as apiClient from "../../api-clients";
import NoTabLayout from "../../layouts/NoTabLayout";
import { useAppContext } from "../../contexts/AppContext";
import { addCommas } from "../../utils/addCommas";
import { getNextDay } from "../../utils/dateUtils";

export type InvestmentStatus = "running" | "ended";

export interface InvestmentType {
  _id?: string;
  userId: string;
  userName: string;
  userInviteCode: string;
  planId: string;
  planName: string;
  capital: number;
  amountEarned: number;
  dailyReturn: number;
  endDate: string;
  daysSpent: number;
  totalDays: number;
  totalReturn: number;
  returnType: string;
  status: InvestmentStatus;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

const MyOrders = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { pathname } = useLocation();

  const {
    data: investments,
    isLoading: fetchingInvestments,
    refetch: refetchInvestments,
  } = useQuery("getMyInvestments", () => apiClient.getMyInvestments("ended"));

  const { mutate: createInvestment, isLoading: isInvesting } = useMutation(
    apiClient.createInvestment,
    {
      onSuccess: () => {
        refetchInvestments();
        showToast({
          type: "SUCCESS",
          message: "Investment created successfully",
        });
      },
      onError: (error: Error) => {
        showToast({ type: "ERROR", message: error.message });
      },
    }
  );

  if (fetchingInvestments)
    return <NoTabLayout title="Investments" subtitle="Loading..." />;
  if (!investments || investments?.length === 0)
    return (
      <NoTabLayout title="Investments" subtitle="No investments yet">
        <div className="flex justify-center mx-3 items-center bg-white rounded-full p-2 text-sm">
          <Link
            to="/user/investments"
            className={`${
              pathname === "/user/investments"
                ? "bg-my-blue text-white"
                : "bg-none text-slate-400"
            } rounded-full flex-1 p-2 text-center`}
          >
            Running
          </Link>
          <Link
            to="/user/investments/ended"
            className={`${
              pathname === "/user/investments/ended"
                ? "bg-my-blue text-white"
                : "bg-none text-slate-400"
            } rounded-full flex-1 p-2 text-center`}
          >
            Ended
          </Link>
        </div>
      </NoTabLayout>
    );

  return (
    <div className="bg-gray-100 min-h-screen pt-[4.5rem] pb-4 flex flex-col gap-3">
      <div className="flex py-3 px-3 gap-1 items-center bg-my-blue fixed top-0 left-0 xl:left-[30rem] right-0  xl:right-[30rem] lg:left-[25rem] lg:right-[25rem] md:left-[15rem] md:right-[15rem] text-white font-semibold">
        <span
          className="hover:bg-my-t-white rounded-full p-1"
          onClick={() => navigate(-1)}
        >
          <IconContext.Provider value={{ className: "text-3xl font-semibold" }}>
            <IoIosArrowDropleft />
          </IconContext.Provider>
        </span>
        <span>My Orders</span>
      </div>

      <div className="flex justify-center mx-3 items-center bg-white rounded-full p-2 text-sm">
        <Link
          to="/user/investments"
          className={`${
            pathname === "/user/investments"
              ? "bg-my-blue text-white"
              : "bg-none text-slate-400"
          } rounded-full flex-1 p-2 text-center`}
        >
          Running
        </Link>
        <Link
          to="/user/investments/ended"
          className={`${
            pathname === "/user/investments/ended"
              ? "bg-my-blue text-white"
              : "bg-none text-slate-400"
          } rounded-full flex-1 p-2 text-center`}
        >
          Ended
        </Link>
      </div>

      {investments.map((investment: InvestmentType) => (
        <div
          key={investment._id}
          className="bg-white mx-3 p-4 rounded-xl flex flex-col gap-3 text-[14px]"
        >
          <img
            src={investment.imageUrl}
            alt={investment.planName}
            className="rounded-xl"
          />
          <div className="flex justify-between">
            <span className="flex flex-col gap-1">
              <span className="font-semibold text-base">
                {investment.planName}
              </span>
              <span className="flex flex-col text-gray-400">
                <span>{`Daily Income: N${addCommas(
                  investment.dailyReturn
                )}`}</span>
                <span>{`Order Price: N${addCommas(investment.capital)}`}</span>
                {/* <span>{`Earning Days: ${investment.totalDays} days`}</span>
                <span>{`Total Income: N${investment.totalReturn}`}</span>
                <span>{`Checked In: ${refDateTime(
                  investment.createdAt
                )}`}</span>
                <span>{`Checking Out: ${refDateTime(
                  investment.endDate
                )}`}</span>
                <span>{`Countdown: ${countdown(
                  new Date(investment.createdAt),
                  investment.totalDays
                )()}`}</span> */}
                <span>{`Amount Earned: N${addCommas(
                  investment.amountEarned
                )}`}</span>
                <span>{`Next Earn: ${getNextDay(investment.updatedAt)}`}</span>
              </span>
            </span>
            <span
              className={`border capitalize ${
                investment.status === "ended"
                  ? "border-green-500 text-green-500"
                  : " border-my-blue text-my-blue"
              } self-start rounded-full px-2 py-1`}
            >
              {investment.status}
            </span>
          </div>
          <button
            disabled={isInvesting}
            onClick={() => createInvestment(investment.planId)}
            className="text-white font-semibold bg-my-blue py-2 px-5 rounded-3xl text-center"
          >
            Buy Again
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
