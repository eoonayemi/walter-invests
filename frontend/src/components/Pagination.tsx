// import { useState } from "react";
import { IconContext } from "react-icons";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  onPageChange: (selectItem: { selected: number }) => void;
  pageCount?: number;
}

const Pagination = ({ onPageChange, pageCount }: PaginationProps) => {
  return (
    <ReactPaginate
      breakLabel={
        <span className="shadow-my-shadow text-center text-slate-600 w-10 h-10 rounded-full flex justify-center items-center">
          ...
        </span>
      }
      nextLabel={
        <span className="shadow-my-shadow hover:bg-gray-100 text-center w-10 h-10 rounded-full flex justify-center items-center">
          <IconContext.Provider value={{ className: "text-slate-600" }}>
            <IoIosArrowForward />
          </IconContext.Provider>
        </span>
      }
      onPageChange={onPageChange}
      pageRangeDisplayed={5}
      pageCount={pageCount || 0}
      previousLabel={
        <span className="shadow-my-shadow hover:bg-gray-100 text-center w-10 h-10 rounded-full flex justify-center items-center">
          <IconContext.Provider value={{ className: "text-slate-600" }}>
            <IoIosArrowBack />
          </IconContext.Provider>
        </span>
      }
      containerClassName="flex justify-end gap-4 items-center text-slate-500"
      pageClassName="block text-center text-sm w-10 h-10 rounded-full shadow-my-shadow duration-100 flex justify-center items-center"
      activeClassName="bg-my-blue text-white shadow-xl"
      renderOnZeroPageCount={null}
    />
  );
};

export default Pagination;
