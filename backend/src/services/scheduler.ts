import cron from "node-cron";
import { updateInvestmentDaily } from "../middlewares/investmentsUpdater";

// Schedule the task to run every 24 hours
cron.schedule("0 0 * * *", async () => {
  console.log("Running the investment update task...");
  try {
    await updateInvestmentDaily();
    console.log("Investment update task completed successfully.");
  } catch (error) {
    console.error("Error running the investment update task:", error);
  }
});
