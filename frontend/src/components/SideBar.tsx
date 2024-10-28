import { IconContext } from "react-icons";
import { GoHomeFill, GoHome } from "react-icons/go";
import { MdManageAccounts, MdOutlineManageAccounts } from "react-icons/md";
import {
  RiBankFill,
  RiBankLine,
  RiSendPlane2Fill,
  RiSendPlane2Line,
} from "react-icons/ri";
import { FaUsersCog } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import {
  TbArrowsExchange,
  TbCreditCardPay,
  TbCreditCardRefund,
} from "react-icons/tb";
import {} from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";

type IsActiveType = boolean | undefined;
type PropsType = {
  toggled: boolean;
  deskToggled: boolean;
  onToggle: () => void;
};

const SideBar = ({ toggled, onToggle, deskToggled }: PropsType) => {
  const location = useLocation();
  const menus = [
    {
      title: "Menu",
      links: [
        {
          name: "Dashboard",
          path: "/admin/dashboard",
          icon: (isActive: IsActiveType) =>
            isActive ? <GoHomeFill /> : <GoHome />,
        },
        {
          name: "Manage Plans",
          path: "/admin/plans",
          icon: (isActive: IsActiveType) =>
            isActive ? <MdManageAccounts /> : <MdOutlineManageAccounts />,
        },
        {
          name: "Bank Account",
          path: "/admin/bank-account",
          icon: (isActive: IsActiveType) =>
            isActive ? <RiBankFill /> : <RiBankLine />,
        },
      ],
    },
    {
      title: "Manage Users",
      links: [
        {
          name: "All Users",
          path: "/admin/users",
          icon: (isActive: IsActiveType) =>
            isActive ? <FaUsersCog /> : <FaUsersCog />,
        },
        {
          name: "Active Users",
          path: "/admin/users/active",
          icon: (isActive: IsActiveType) =>
            isActive ? <FaUsersCog /> : <FaUsersCog />,
        },
        {
          name: "Banned Users",
          path: "/admin/users/banned",
          icon: (isActive: IsActiveType) =>
            isActive ? <FaUsersCog /> : <FaUsersCog />,
        },
      ],
    },
    {
      title: "Deposits",
      links: [
        {
          name: "Pending Deposits",
          path: "/admin/deposits/pending",
          icon: (isActive: IsActiveType) =>
            isActive ? <TbCreditCardRefund /> : <TbCreditCardRefund />,
        },
        {
          name: "Approved Deposits",
          path: "/admin/deposits/approved",
          icon: (isActive: IsActiveType) =>
            isActive ? <TbCreditCardRefund /> : <TbCreditCardRefund />,
        },
        {
          name: "Declined Deposits",
          path: "/admin/deposits/declined",
          icon: (isActive: IsActiveType) =>
            isActive ? <TbCreditCardRefund /> : <TbCreditCardRefund />,
        },
        {
          name: "All Deposits",
          path: "/admin/deposits",
          icon: (isActive: IsActiveType) =>
            isActive ? <TbCreditCardRefund /> : <TbCreditCardRefund />,
        },
      ],
    },
    {
      title: "Withdrawals",
      links: [
        {
          name: "Pending",
          path: "/admin/withdrawals/pending",
          icon: (isActive: IsActiveType) =>
            isActive ? <TbCreditCardPay /> : <TbCreditCardPay />,
        },
        {
          name: "Approved",
          path: "/admin/withdrawals/approved",
          icon: (isActive: IsActiveType) =>
            isActive ? <TbCreditCardPay /> : <TbCreditCardPay />,
        },
        {
          name: "Declined",
          path: "/admin/withdrawals/declined",
          icon: (isActive: IsActiveType) =>
            isActive ? <TbCreditCardPay /> : <TbCreditCardPay />,
        },
        {
          name: "All Withdraws",
          path: "/admin/withdrawals",
          icon: (isActive: IsActiveType) =>
            isActive ? <TbCreditCardPay /> : <TbCreditCardPay />,
        },
      ],
    },
    {
      title: "Report",
      links: [
        {
          name: "Investments",
          path: "/admin/report/investments",
          icon: (isActive: IsActiveType) =>
            isActive ? <RiSendPlane2Fill /> : <RiSendPlane2Line />,
        },
        {
          name: "Transactions",
          path: "/admin/report/transactions",
          icon: (isActive: IsActiveType) =>
            isActive ? <TbArrowsExchange /> : <TbArrowsExchange />,
        },
      ],
    },
  ];

  return (
    <div
      className={`bg-blue-950 flex flex-col w-3/5 duration-300 fixed md:static h-screen overflow-x-hidden overflow-y-auto scrollbar-track-blue-950 scrollbar-thumb-my-t-white-1 hover:scrollbar-thumb-my-t-white-2 scrollbar-thumb-rounded-full scrollbar scrollbar-h-1 scrollbar-w-1 ${
        toggled ? "left-0" : " -left-[100rem]"
      } ${
        deskToggled ? "lg:w-[14rem] md:w-0" : "md:w-[14rem] lg:w-0"
      } top-0 bottom-0 z-20`}
    >
      <div className="bg-blue-950 flex justify-between items-center p-4">
        <img
          src="http://res.cloudinary.com/dc0tvk5bx/image/upload/v1717181268/nolgs5roa1oxnwqlcpaa.png"
          alt="logo"
          className="w-36 text-white"
        />
        <span className="cursor-pointer md:hidden" onClick={onToggle}>
          <IconContext.Provider
            value={{ className: "font-bold text-2xl text-white" }}
          >
            <IoIosArrowBack />
          </IconContext.Provider>
        </span>
      </div>
      <div className="bg-blue-950 flex flex-col gap-6 py-5 text-sm w-56 p-3 flex-1">
        {menus.map((menu) => (
          <div className="flex flex-col gap-2 justify-center" key={menu.title}>
            <div className="text-white">{menu.title}</div>
            {menu.links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={`${
                  link.path == location.pathname &&
                  "bg-gradient-to-b from-sky-500 to-blue-500"
                } flex gap-3 p-3 rounded-lg items-center duration-500`}
                onClick={onToggle}
              >
                <IconContext.Provider
                  value={{
                    className: `${
                      link.path == location.pathname
                        ? "text-white"
                        : "text-gray-300 text-opacity-70"
                    } text-sm font-bold`,
                  }}
                >
                  {link.icon(link.path == location.pathname)}
                </IconContext.Provider>
                <span
                  className={`${
                    link.path == location.pathname
                      ? "text-white"
                      : "text-slate-400 text-sm"
                  }`}
                >
                  {link.name}
                </span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
