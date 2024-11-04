import React from "react";
import { IconContext } from "react-icons";
import { IoIosArrowDropleft } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

function NoTabLayout({ title, subtitle, children }: Props) {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-gray-100 min-h-screen ${
        children && subtitle ? "pt-[4.5rem]" : "pt-16"
      } flex flex-col gap-3`}
    >
      <div className="flex py-3 px-3 gap-1 items-center bg-my-blue fixed top-0 left-0 xl:left-[30rem] right-0  xl:right-[30rem] lg:left-[25rem] lg:right-[25rem] md:left-[15rem] md:right-[15rem] text-white">
        <span
          className="hover:bg-my-t-white rounded-full p-1"
          onClick={() => navigate(-1)}
        >
          <IconContext.Provider value={{ className: "text-3xl font-bold" }}>
            <IoIosArrowDropleft />
          </IconContext.Provider>
        </span>
        <span className="font-semibold tracking-wide">{title}</span>
      </div>
      {children && subtitle && children}
      {subtitle && (
        <div className="bg-gray-100 min-h-screen flex justify-center items-center">
          <span>{subtitle}</span>
        </div>
      )}
      {children && !subtitle && children}
    </div>
  );
}

export default NoTabLayout;
