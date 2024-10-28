import { IconContext } from "react-icons";
import { TbCreditCardPay, TbCreditCardRefund } from "react-icons/tb";
import { MdOutlineCreditCardOff } from "react-icons/md";
import { HiOutlineUserGroup, HiMiniArrowUpOnSquare } from "react-icons/hi2";
import { BsCloudArrowDownFill, BsFileEarmarkCheckFill } from "react-icons/bs";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { getDashboardData } from "../../api-clients";
import { useQuery } from "react-query";
import NoTabLayout from "../../layouts/NoTabLayout";
import { Link } from "react-router-dom";
import { addCommas } from "../../utils/addCommas";

const AdminDashboard = () => {
  const { data, isLoading } = useQuery("getDashboardData", getDashboardData);

  const {
    depositsSum,
    withdrawalsSum,
    totalWithdrawCharges,
    pendingDeposits,
    approvedDeposits,
    pendingWithdrawals,
    paidWithdrawals,
    totalUsers,
  } = data || {};

  const cards = [
    {
      title: "Total Users",
      value: addCommas(totalUsers),
      icon: <HiOutlineUserGroup />,
      prefix: "users",
      link: "/admin/users",
    },
    {
      title: "Total Deposit",
      value: addCommas(depositsSum),
      icon: <TbCreditCardPay />,
      prefix: "N",
      link: "/admin/deposits",
    },
    {
      title: "Total Withdraw",
      value: addCommas(withdrawalsSum),
      icon: <TbCreditCardRefund />,
      prefix: "N",
      link: "/admin/withdrawals",
    },
    {
      title: "Total Withdraw Charge",
      value: addCommas(totalWithdrawCharges),
      icon: <MdOutlineCreditCardOff />,
      link: "/admin/dashboard",
    },
  ];

  const pendingRecords = [
    {
      title: "Pending Deposits",
      value: addCommas(pendingDeposits),
      icon: <BsCloudArrowDownFill />,
      link: "/admin/deposits/pending",
    },
    {
      title: "Pending Withdrawals",
      value: addCommas(pendingWithdrawals),
      icon: <HiMiniArrowUpOnSquare />,
      link: "/admin/withdrawals/pending",
    },
    {
      title: "Approved Deposits",
      value: addCommas(approvedDeposits),
      icon: <IoCheckmarkDoneCircle />,
      link: "/admin/deposits/approved",
    },
    {
      title: "Approved Withdrawals",
      value: addCommas(paidWithdrawals),
      icon: <BsFileEarmarkCheckFill />,
      link: "/admin/withdrawals/approved",
    },
  ];

  if (isLoading) return <NoTabLayout title="Dashboard" subtitle="Loading..." />;

  return (
    <div className="flex flex-col px-5 gap-3">
      <div className="font-semibold text-lg">Dashboard</div>
      <div className="flex flex-col md:flex-row gap-5 text-sm">
        {cards.map((card, i) => (
          <div
            key={i}
            className="flex flex-col justify-between hover:bg-blue-900 h-40 gap-5 bg-gradient-to-br from-blue-600 to-my-blue rounded-xl p-4 w-full text-sm relative overflow-hidden"
          >
            <div className="flex gap-2 items-center">
              <span className=" bg-opacity-30 bg-white p-2 rounded-full">
                <IconContext.Provider
                  value={{ className: `text-sm font-bold text-white` }}
                >
                  {card.icon}
                </IconContext.Provider>
              </span>

              <span className="text-white">{card.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-white">
                {`${card.title !== "Total Users" ? "N" : ""}${card.value}${
                  card.title == "Total Users" ? " Users" : ""
                }`}
              </span>
              <Link
                to={card.link}
                className="bg-white hover:bg-transparent hover:border hover:border-white hover:text-white rounded-md text-my-blue px-2 py-1 font-semibold text-[10px]"
              >
                View All
              </Link>
            </div>
            <IconContext.Provider
              value={{
                className: `text-[8rem] font-bold text-white opacity-10 absolute -bottom-6 -left-5`,
              }}
            >
              {card.icon}
            </IconContext.Provider>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-5 mt-2 justify-center items-center">
        {pendingRecords.map((record, i) => (
          <Link
            to={record.link}
            key={i}
            className="bg-white hover:bg-gray-100 shadow-my-shadow p-5 rounded-lg w-full flex flex-col gap-5 justify-center items-center"
          >
            <div className="bg-my-blue p-5 rounded-full">
              <IconContext.Provider
                value={{ className: `text-[4rem] font-bold text-white` }}
              >
                {record.icon}
              </IconContext.Provider>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-[2rem] font-semibold">{record.value}</span>
              <span className="font-light text-sm">{record.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
