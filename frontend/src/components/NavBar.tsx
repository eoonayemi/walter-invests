import {
  IoMdNotificationsOutline,
  IoIosArrowDropdownCircle,
} from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { IconContext } from "react-icons";
import AdminProfileMenu from "./AdminProfileMenu";
import { useEffect, useRef, useState } from "react";

const NavBar = ({
  onToggle,
  onDeskToggle,
}: {
  onToggle: () => void;
  onDeskToggle: () => void;
}) => {
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const onClick = () => {
    setShowAdminProfile(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAdminProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white shadow-my-shadow flex justify-between items-center p-4 z-10 fixed right-0 left-0 top-0 md:static">
      <span
        className="cursor-pointer"
        onClick={() => {
          onToggle();
          onDeskToggle();
        }}
      >
        <IconContext.Provider
          value={{ className: "text-2xl text-blue-950 font-bold" }}
        >
          <IoMenu />
        </IconContext.Provider>
      </span>

      <div className="flex gap-4 justify-center items-center relative">
        <span className="relative">
          <IconContext.Provider
            value={{ className: "text-xl text-my-blue font-bold" }}
          >
            <IoMdNotificationsOutline />
          </IconContext.Provider>
          <span className="absolute flex justify-center items-center h-2 w-2 top-0 right-0">
            <span className="animate-ping absolute inline-flex h-[0.7rem] w-[0.7rem] rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
        </span>

        <div
          ref={menuRef}
          onClick={() => setShowAdminProfile(!showAdminProfile)}
          className="flex gap-2 justify-center items-center text-sm text-white bg-my-blue px-2 py-1 rounded-md"
        >
          <span>
            <IconContext.Provider
              value={{ className: "text-sm font-bold text-white" }}
            >
              <FaUserCircle />
            </IconContext.Provider>
          </span>
          <span>Admin</span>
          <span>
            <IconContext.Provider
              value={{ className: "text-sm font-bold text-white" }}
            >
              <IoIosArrowDropdownCircle />
            </IconContext.Provider>
          </span>

          {showAdminProfile && (
            <AdminProfileMenu setShowAdminProfile={onClick} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
