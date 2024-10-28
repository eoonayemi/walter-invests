import { useState } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";

interface Props {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
  const [toggled, setToggled] = useState(false);
  const [ deskToggled, setDeskToggled ] = useState(true);
  const onToggle = () => {
  setToggled(!toggled)
  };
  const onDeskToggle = () => {
    setDeskToggled(!deskToggled)
  }

  return (
    <div className="md:flex block bg-white duration-500 overflow-y-auto h-screen">
      <SideBar toggled={toggled} deskToggled={deskToggled} onToggle={onToggle} />
      <div className="flex flex-col flex-1 gap-5 overflow-y-auto pb-5 pt-20 md:pt-0">
        <NavBar onToggle={onToggle} onDeskToggle={onDeskToggle} />
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
