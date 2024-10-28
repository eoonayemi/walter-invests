import TabBar from "../../components/TabBar";
import { IoIosArrowDropleft } from "react-icons/io";
import { IconContext } from "react-icons";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import * as apiClient from "../../api-clients";
import NoTabLayout from "../../layouts/NoTabLayout";
import { useAppContext } from "../../contexts/AppContext";
import { addCommas } from "../../utils/addCommas";

export type PlanStatus = "Active" | "Disabled";

type Commission = {
  firstRefer: number;
  secondRefer: number;
  thirdRefer: number;
};

export interface PlanType {
  _id: string;
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

const Products = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { data, isLoading } = useQuery(
    "getAllProducts",
    apiClient.getAllProducts
  );

  console.log(data);

  const { mutate: createInvestment, isLoading: isInvesting } = useMutation(
    apiClient.createInvestment,
    {
      onSuccess: () => {
        showToast({
          type: "SUCCESS",
          message: "Investment initialized",
        });
        navigate("/user/investments");
      },
      onError: (error: Error) => {
        showToast({ type: "ERROR", message: error.message });
      },
    }
  );

  const products = data || [];

  if (isLoading) return <NoTabLayout title="Products" subtitle="Loading..." />;
  if (!products || products?.length === 0)
    return <NoTabLayout title="Products" subtitle="No products yet" />;

  return (
    <div className="bg-gray-100 min-h-screen pt-[4.5rem] pb-32 flex flex-col gap-3">
      <div className="flex py-3 px-3 gap-1 items-center bg-my-blue fixed top-0 right-0 left-0 text-white font-semibold">
        <span
          className="hover:bg-my-t-white rounded-full p-1"
          onClick={() => navigate(-1)}
        >
          <IconContext.Provider value={{ className: "text-3xl font-bold" }}>
            <IoIosArrowDropleft />
          </IconContext.Provider>
        </span>
        <span>Products</span>
      </div>
      {products.map((product: PlanType) => (
        <div
          key={product._id}
          className="bg-white mx-3 p-4 rounded-xl flex flex-col gap-3 text-[14px]"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="rounded-xl"
          />
          <div className="flex justify-between">
            <span className="flex flex-col gap-1">
              <span className="font-semibold text-base">{product.name}</span>
              <span className="flex flex-col text-gray-400">
                <span>{`Daily Income: N${
                  addCommas(product.returnType === "percent"
                    ? (product.dailyReturn * product.price) / 100
                    : product.dailyReturn)
                }`}</span>
                <span>{`Earning Days: ${product.totalDays}days`}</span>
                <span>{`Total Income: N${addCommas(product.totalReturn)}`}</span>
              </span>
            </span>
            <span className="border capitalize border-green-500 text-green-500 self-start rounded-full px-2 py-1">
              {product.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-my-blue border border-my-blue rounded-3xl py-2 px-4">
              {`N${addCommas(product.price)}`}
            </span>
            <button
              disabled={isInvesting}
              onClick={() => createInvestment(product._id)}
              className="text-white bg-my-blue py-2 px-5 rounded-3xl"
            >
              Buy Now
            </button>
          </div>
        </div>
      ))}
      <TabBar />
    </div>
  );
};

export default Products;
