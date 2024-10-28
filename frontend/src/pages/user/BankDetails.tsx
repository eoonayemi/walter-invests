import { useQuery } from "react-query";
import * as apiClient from "../../api-clients";
import NoTabLayout from "../../layouts/NoTabLayout";

const BankDetails = () => {
  const { data: bankDetails, isLoading } = useQuery(
    "getBankDetails",
    apiClient.getBankDetails
  );

  if (isLoading)
    return <NoTabLayout title="Transaction Records" subtitle="Loading..." />;
  if (!BankDetails || bankDetails.length === 0)
    return (
      <NoTabLayout title="Transaction Records" subtitle="No Bank Details" />
    );

  return (
    <NoTabLayout title="Transaction Records">
      <>
        {bankDetails.map((bank: apiClient.BankDetailsType) => (
          <div className="flex flex-col shadow-my-shadow mx-3 px-6 rounded-xl my-2 bg-white">
            <p className="py-3 font-semibold  text-center">Bank Details</p>
            <hr />
            <div className="flex flex-col my-2">
              <div className="flex justify-between py-2">
                <span className="font-semibold">Bank Name</span>
                <span>{bank.bankName}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-semibold">Account Number</span>
                <span>{bank.accountNumber}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-semibold">Account Name</span>
                <span>{bank.accountName}</span>
              </div>
              <div className="flex justify-between py-2 capitalize">
                <span className="font-semibold">Bank Type</span>
                <span>{`${bank.bankType} Bank`}</span>
              </div>
            </div>
          </div>
        ))}
      </>
    </NoTabLayout>
  );
};
export default BankDetails;
