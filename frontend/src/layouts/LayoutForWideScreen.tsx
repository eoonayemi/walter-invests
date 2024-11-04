import { Outlet } from "react-router-dom";

const LayoutForWideScreen = () => {
  return (
    <div className="xl:mx-[30rem] lg:mx-[25rem] md:mx-[15rem] bg-white overflow-hidden relative min-h-screen">
      <Outlet />
    </div>
  );
};

// left-0 xl:left-[30rem] right-0  xl:right-[30rem] lg:left-[25rem] lg:right-[25rem] md:left-[15rem] md:right-[15rem]

export default LayoutForWideScreen;
