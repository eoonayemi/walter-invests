import { GoHome, GoHomeFill } from "react-icons/go";
import {
  IoWalletOutline,
  IoCartOutline,
  IoCart,
  IoWallet,
} from "react-icons/io5";
import {
  HiOutlineUserGroup,
  HiOutlineUser,
  HiUserGroup,
  HiUser,
} from "react-icons/hi2";
import { NavLink, useLocation } from "react-router-dom";
import { IconContext } from "react-icons";

const TabBar = () => {
  const location = useLocation();

  const menus = [
    {
      name: "Home",
      icon: (isActive: boolean) => (isActive ? <GoHomeFill /> : <GoHome />),
      path: "/dashboard",
    },
    {
      name: "Products",
      icon: (isActive: boolean) => (isActive ? <IoCart /> : <IoCartOutline />),
      path: "/products",
    },
    {
      name: "Wallet",
      icon: (isActive: boolean) =>
        isActive ? <IoWallet /> : <IoWalletOutline />,
      path: "/wallet",
    },
    {
      name: "Team",
      icon: (isActive: boolean) =>
        isActive ? <HiUserGroup /> : <HiOutlineUserGroup />,
      path: "/team",
    },
    {
      name: "Profile",
      icon: (isActive: boolean) => (isActive ? <HiUser /> : <HiOutlineUser />),
      path: "/user/profile",
    },
  ];

  const activeIndex = menus.findIndex(
    (menu) => menu.path === location.pathname
  );

  return (
    <div className="bg-white fixed -bottom-1 left-0 xl:left-[30rem] right-0  xl:right-[30rem] lg:left-[25rem] lg:right-[25rem] md:left-[15rem] md:right-[15rem] py-5 px-8 z-25 rounded-xl">
      <ul className="flex justify-between items-center relative">
        {menus.map((menu, i) => (
          <li key={i}>
            <NavLink
              to={menu.path}
              className="flex flex-col gap-2 text-center justify-center items-center duration-500"
            >
              <span
                className={`${
                  activeIndex == i
                    ? "bg-my-blue border-[0.45rem] border-gray-100 p-5 rounded-full -translate-y-10 absolute"
                    : ""
                } cursor-pointer duration-700`}
              >
                <IconContext.Provider
                  value={{
                    className: `${
                      activeIndex == i ? "text-white" : "text-gray-500"
                    } text-xl `,
                  }}
                >
                  {menu.icon(activeIndex == i)}
                </IconContext.Provider>
              </span>
              <span
                className={`${
                  activeIndex == i
                    ? " text-my-blue translate-y-2 font-bold duration-700 shadow-my-blue"
                    : "text-gray-500"
                } duration-500 text-sm`}
              >
                {menu.name}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabBar;
