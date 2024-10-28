export type InvestmentStatus = "running" | "ended";

export interface InvestmentType {
  _id?: string;
  userId: string;
  userName: string;
  userInviteCode: string;
  planId: string;
  planName: string;
  capital: number;
  amountEarned: number;
  dailyReturn: number;
  endDate: string;
  daysSpent: number;
  totalDays: number;
  totalReturn: number;
  returnType: string;
  status: InvestmentStatus;
  imageUrl: string;
  createdAt?: string;
  UpdatedAt?: string;
}

export interface InvestmentTableProps {
  userInvestments: InvestmentType[];
}

const InvestmentTable = ({ userInvestments }: InvestmentTableProps) => {
  return (
    <div className={`overflow-x-auto shadow-my-shadow`}>
      <table className="border-collapse text-[12px] overflow-hidden w-full">
        <thead className="bg-my-blue">
          <tr className="bg-my-blue text-white">
            <th className="text-center py-4 px-6 font-semibold">User Name</th>
            <th className="text-center py-4 px-6 font-semibold">
              User Invite Code
            </th>
            <th className="text-center py-4 px-6 font-semibold">Plan</th>
            <th className="text-center py-4 px-6 font-semibold">Capital</th>
            <th className="text-center py-4 px-6 font-semibold">
              Amount Earned
            </th>
            <th className="text-center py-4 px-6 font-semibold">
              Daily Return
            </th>
            <th className="text-center py-4 px-6 font-semibold">Elapse Date</th>
            <th className="text-center py-4 px-6 font-semibold">Total Days</th>
            <th className="text-center py-4 px-6 font-semibold">Days Spent</th>
            <th className="text-center py-4 px-6 font-semibold">
              Total Return
            </th>
            <th className="text-center py-4 px-6 font-semibold">
              Interest Type
            </th>
            <th className="text-center py-4 px-6 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {userInvestments.map((investment: InvestmentType, i: number) => (
            <tr
              key={i}
              className={`${
                i < userInvestments.length - 1 && "border-b border-slate-200"
              } py-4 text-slate-600`}
            >
              <td className="text-center py-4 px-6 capitalize">
                {investment.userName}
              </td>
              <td className="text-center py-4 px-6">
                {investment.userInviteCode}
              </td>
              <td className="text-center py-4 px-6 capitalize">
                {investment.planName}
              </td>
              <td className="text-center py-4 px-6">{investment.capital}</td>
              <td className="text-center py-4 px-6">
                {investment.amountEarned}
              </td>
              <td className="text-center py-4 px-6">
                {investment.dailyReturn}
              </td>
              <td className="text-center py-4 px-6">{investment.endDate}</td>
              <td className="text-center py-4 px-6">{investment.daysSpent}</td>
              <td className="text-center py-4 px-6">{investment.totalDays}</td>
              <td className="text-center py-4 px-6">
                {investment.totalReturn}
              </td>
              <td className="text-center py-4 px-6 capitalize">
                {investment.returnType}
              </td>
              <td className="text-center py-4 px-6">
                <span
                  className={`mx-auto ${
                    investment.status === "running"
                      ? "border border-blue-500 text-blue-500 bg-blue-500"
                      : "border border-green-500 text-green-500 bg-green-500"
                  } rounded-full text-xs px-5 py-1 bg-opacity-10`}
                >
                  {investment.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvestmentTable;
