import Investment from "../models/investment";
import Transaction from "../models/transaction";
import User from "../models/user";

export async function updateInvestmentDaily(): Promise<void> {
  try {
    const activeInvestments = await Investment.find({ status: "running" });

    for (const investment of activeInvestments) {
      const currentDate = new Date();
      const investmentEndDate = new Date(investment.endDate);

      if (currentDate >= investmentEndDate) {
        investment.status = "ended";
        investment.daysSpent = investment.totalDays;
        investment.amountEarned = investment.totalReturn;
      } else {
        investment.daysSpent++;
        investment.amountEarned += investment.dailyReturn;
      }

      const user = await User.findById(investment.userId);
      if (user) {
        user.withdrawableBalance += investment.dailyReturn;
        await user.save();

        const newIncome = {
          userId: user._id,
          amount: investment.dailyReturn,
          type: "income",
          status: "Success",
          subType: "Daily ROI",
        };

        await Transaction.create(newIncome);
      }

      await investment.save();
    }
  } catch (error) {
    console.error("Error updating investments:", error);
    throw error;
  }
}
