import TabBar from "../../components/TabBar";
import { IconContext } from "react-icons";
import { RiCustomerServiceFill } from "react-icons/ri";
import DashboardWallet from "../../components/DashboardWallet";
import DashboardIconsLayout from "../../components/DashboardIconsLayout";
import { Link } from "react-router-dom";
import PopUp from "../../components/PopUp";

const Dashboard = () => {
  const { linkG } = JSON.parse(localStorage.getItem("links") as string) || {};

  return (
    <div className="min-h-screen bg-gray-100 pt-14 mb-14 sm:pb-[3rem]">
      <div className="bg-white flex justify-between items-center px-6 py-4 fixed right-0 left-0 top-0 z-0">
        <img
          src="http://res.cloudinary.com/dc0tvk5bx/image/upload/v1718487907/xotuwlmnykfusnhfolvs.png"
          alt="logo"
          className="w-36"
        />
        <Link to={linkG || "/dashboard"}>
          <IconContext.Provider value={{ className: "text-2xl font-semibold" }}>
            <RiCustomerServiceFill />
          </IconContext.Provider>
        </Link>
      </div>

      <DashboardWallet />

      <DashboardIconsLayout />

      <PopUp TGLink={linkG} />

      <TabBar />
    </div>
  );
};

export default Dashboard;
