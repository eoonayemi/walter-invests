import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { FaPlus } from "react-icons/fa6";
import { BiEdit } from "react-icons/bi";
import { IconContext } from "react-icons";
import { useMutation, useQuery } from "react-query";
import * as apiClient from "../../api-clients";
import { useAppContext } from "../../contexts/AppContext";
import ManagePlanForm from "../../forms/ManagePlanForm";
import { MdDelete } from "react-icons/md";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { FaSearch } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

export type PlanStatus = "active" | "disabled";

type Commission = {
  firstRefer: number;
  secondRefer: number;
  thirdRefer: number;
};

export interface PlanType {
  _id?: string;
  name: string;
  price: number;
  dailyReturn: number;
  totalReturn: number;
  returnType: string;
  status: PlanStatus;
  imageUrl: string;
  totalDays: number;
  commission: Commission;
  createdAt: string;
  updatedAt: string;
}

const ManagePlans = () => {
  const [pageCount, setPageCount] = useState();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [active, setActive] = useState<string | undefined>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem("searchPlansQuery") || ""
  );
  const [filteredPlans, setFilteredPlans] = useState([] as PlanType[]);
  const { showToast } = useAppContext();
  const { data, refetch: refetchAllPlans } = useQuery(
    "getAllPlans",
    () => apiClient.getAllPlans(currentPage),
    {
      onSuccess: (data) => {
        setFilteredPlans(data.plans);
        setPageCount(data.pageCount);
      },
      onError: (err: Error) => {
        setFilteredPlans(data.plans);
        showToast({ type: "ERROR", message: err.message });
      },
    }
  );
  const { refetch: refetchSearch, isLoading: sIsLoading } = useQuery(
    "getSearchData",
    () => apiClient.searchPlans({ searchQuery, currentPage }),
    {
      enabled: false,
      onSuccess: (data) => {
        setFilteredPlans(data.docs);
        setPageCount(data.totalPages);
      },
      onError: (err: Error) => {
        setFilteredPlans(data.plans);
        showToast({ type: "ERROR", message: err.message });
      },
    }
  );

  const handleSearch = () => {
    refetchSearch();
    localStorage.setItem("searchPlansQuery", searchQuery);
  };

  const addPlanMutation = useMutation(apiClient.addPlan, {
    onSuccess: (data) => {
      refetchAllPlans();
      showToast({
        type: "SUCCESS",
        message: data.message,
      });
    },

    onError: (err: Error) => {
      showToast({ type: "ERROR", message: err.message });
    },
  });

  const editPlanMutation = useMutation(apiClient.editPlan, {
    onSuccess: (data) => {
      refetchAllPlans();
      showToast({
        type: "SUCCESS",
        message: data.message,
      });
    },

    onError: (err: Error) => {
      showToast({ type: "ERROR", message: err.message });
    },
  });

  const deletePlanMutation = useMutation(apiClient.deletePlan, {
    onSuccess: () => {
      refetchAllPlans();
      showToast({ type: "SUCCESS", message: "Plan deleted successfully" });
    },
    onError: (err: Error) => {
      showToast({ type: "ERROR", message: err.message });
    },
  });

  useEffect(() => {
    if (searchQuery === "") {
      refetchAllPlans();
    } else {
      const id = setTimeout(() => refetchSearch(), 20000);
      clearTimeout(id);
    }
  }, [currentPage, refetchAllPlans, refetchSearch, searchQuery]);

  const onPageChange = (e: { selected: number }) => {
    setCurrentPage(e.selected);
  };

  const onCloseAddPlan = () => {
    setShowAddPlan(false);
  };

  const onCloseEditPlan = () => {
    setActive(undefined);
  };

  const handleDeletePlan = (planId: string) => {
    setPlanToDelete(planId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (planToDelete) {
      deletePlanMutation.mutate(planToDelete);
      setShowConfirmDialog(false);
      setPlanToDelete(undefined);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setPlanToDelete(undefined);
  };

  return (
    <div className="mx-4 flex flex-col gap-5 flex-1">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">Subscription Plans</span>
        <button
          onClick={() => setShowAddPlan(true)}
          className="flex gap-1 bg-my-blue p-2 rounded-md text-white justify-center items-center text-xs font-semibold"
        >
          <IconContext.Provider
            value={{ className: "font-semibold text-sm text-white" }}
          >
            <FaPlus />
          </IconContext.Provider>
          <span>Add New</span>
        </button>
      </div>

      <div className="flex self-end">
        <input
          type="text"
          className="px-5 py-2 flex-1 outline-none bg-gray-500 bg-opacity-10 text-sm focus:border focus:bg-white focus:border-my-blue"
          placeholder="Search by plan name, price, status"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            localStorage.setItem("searchPlansQuery", searchQuery);
            if (e.target.value === "") {
              setFilteredPlans(data.plans);
              localStorage.removeItem("searchPlansQuery");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button
          onClick={handleSearch}
          disabled={sIsLoading}
          className="p-4 bg-my-blue flex justify-center items-center text-white"
        >
          {sIsLoading ? (
            <CgSpinner className="animate-spin font-extrabold text-lg" />
          ) : (
            <FaSearch />
          )}
        </button>
      </div>

      {filteredPlans ? (
        <div
          className={`overflow-x-auto shadow-my-shadow ${
            (filteredPlans == undefined || filteredPlans === undefined) &&
            "hidden"
          }`}
        >
          <table className="border-collapse text-sm overflow-hidden w-full">
            <thead className="bg-my-blue">
              <tr className="bg-my-blue text-white">
                <th className="text-center py-4 px-6 font-semibold">
                  Plan Name
                </th>
                <th className="text-center py-4 px-6 font-semibold">Image</th>
                <th className="text-center py-4 px-6 font-semibold">Price</th>
                <th className="text-center py-4 px-6 font-semibold">
                  Daily ROI
                </th>
                <th className="text-center py-4 px-6 font-semibold">
                  Validity Days
                </th>
                <th className="text-center py-4 px-6 font-semibold">
                  Total Return
                </th>
                <th className="text-center py-4 px-6 font-semibold">
                  ROI Type
                </th>
                <th className="text-center py-4 px-6 font-semibold">Status</th>
                <th className="text-center py-4 px-6 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredPlans.map((plan: PlanType, i: number) => (
                <tr
                  key={i}
                  className={`${
                    i < filteredPlans.length - 1 && "border-b border-slate-200"
                  } py-4 text-slate-600`}
                >
                  <td className="text-center py-4 px-6 ">{plan.name}</td>
                  <td className="text-center py-4 px-6 ">
                    <img
                      src={plan.imageUrl}
                      alt="plan's image"
                      className="mx-auto w-16 h-8"
                    />
                  </td>
                  <td className="text-center py-4 px-6 ">{`N${plan.price}`}</td>
                  <td className="text-center py-4 px-6 capitalize">{`${
                    plan.returnType == "fixed" ? "N" : ""
                  }${plan.dailyReturn}${
                    plan.returnType == "percent" ? "%" : ""
                  }`}</td>
                  <td className="text-center py-4 px-6">{plan.totalDays}</td>
                  <td className="text-center py-4 px-6">{`N${plan.totalReturn}`}</td>
                  <td className="text-center py-4 px-6 capitalize">{plan.returnType}</td>
                  <td className="text-center py-4 px-6">
                    <span
                      className={`mx-auto ${
                        plan.status === "active"
                          ? "border border-green-500 text-green-500 bg-green-500"
                          : "border border-red-500 text-red-500 bg-red-500"
                      } rounded-full text-xs px-5 py-1 bg-opacity-10 capitalize`}
                    >
                      {plan.status}
                    </span>
                  </td>
                  <td className="text-center py-4 px-6 flex gap-2 justify-center items-center">
                    <span
                      className="bg-my-blue p-2 rounded-md"
                      onClick={() => {
                        setActive(plan._id);
                      }}
                    >
                      <IconContext.Provider
                        value={{ className: " text-white" }}
                      >
                        <BiEdit />
                      </IconContext.Provider>
                    </span>
                    <span
                      className="bg-my-blue p-2 rounded-md"
                      onClick={() => handleDeletePlan(plan._id as string)}
                    >
                      <IconContext.Provider
                        value={{ className: " text-white" }}
                      >
                        <MdDelete />
                      </IconContext.Provider>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-center items-center font-semibold text-lg h-full">
          <span>No Plans</span>
        </div>
      )}

      {pageCount && pageCount > 1 && (
        <Pagination pageCount={pageCount} onPageChange={onPageChange} />
      )}

      {showAddPlan && (
        <ManagePlanForm
          mutateFn={addPlanMutation.mutate}
          onClose={onCloseAddPlan}
          buttonTag="Add Plan"
          title="Add New Plan"
        />
      )}

      {showConfirmDialog && (
        <ConfirmationDialog
          title="Confirm Delete"
          message="Are you sure want to delete?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {data?.plans.map((plan: PlanType) => (
        <div
          className={`${plan._id === active ? "block" : "hidden"}`}
          key={plan._id}
        >
          <ManagePlanForm
            mutateFn={editPlanMutation.mutate}
            plan={plan}
            onClose={onCloseEditPlan}
            buttonTag="Save Plan"
            title="Edit Plan"
          />
        </div>
      ))}
    </div>
  );
};

export default ManagePlans;
