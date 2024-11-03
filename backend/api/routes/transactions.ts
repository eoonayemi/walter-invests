import express, { Request, Response } from "express";
import Transaction from "../models/transaction";
import mongoose from "mongoose";
import User from "../models/user";
import { isStrNum } from "../utils";

const router = express.Router();

router.get("/dashboard-data", async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find({
      type: { $in: ["deposit", "withdrawal"] },
    });
    const sumData = {
      depositsSum: 0,
      withdrawalsSum: 0,
      totalWithdrawCharges: 0,
      pendingDeposits: 0,
      approvedDeposits: 0,
      pendingWithdrawals: 0,
      paidWithdrawals: 0,
      totalUsers: 0,
    };

    for (const transaction of transactions) {
      if (transaction.type === "deposit") {
        sumData.depositsSum += transaction.amount;
        if (transaction.status === "Pending") {
          sumData.pendingDeposits += 1;
        }
        if (transaction.status === "Approved") {
          sumData.approvedDeposits += 1;
        }
      } else if (transaction.type === "withdrawal") {
        sumData.withdrawalsSum += transaction.amount;
        sumData.totalWithdrawCharges += transaction.charge as number;
        if (transaction.status === "Pending") {
          sumData.pendingWithdrawals += 1;
        }
        if (transaction.status === "Paid") {
          sumData.paidWithdrawals += 1;
        }
      }
    }

    const users = await User.find();
    sumData.totalUsers = users.length;

    res.status(200).json(sumData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const currentPage = Number(req.query.currentPage) || 1;
    let queryFilter: any = {
      type: { $in: ["withdrawal", "deposit"] },
    };

    if (req.query.status === "Approved") {
      queryFilter.status = "Approved";
    } else if (req.query.status === "Declined") {
      queryFilter.status = "Declined";
    } else if (req.query.status === "Pending") {
      queryFilter.status = "Pending";
    }

    const options = {
      page: currentPage,
      limit: 100,
      sort: { createdAt: -1 },
    };

    const transactions = await Transaction.paginate(queryFilter, options);

    if (!transactions) {
      return res.status(404).json({ message: "No transactions found" });
    }

    res.status(200).json({
      transactions: transactions.docs,
      pageCount: transactions.totalPages,
      message: "Transactions fetched successfully",
    });
  } catch (error) {
    if ((error as mongoose.Error).name === "CastError") {
      return res.status(400).json({ message: "Invalid query parameter" });
    } else {
      console.error(error);
      return res.status(500).json({ message: "Error fetching transactions" });
    }
  }
});

router.get("/deposits", async (req: Request, res: Response) => {
  try {
    const currentPage = Number(req.query.currentPage) || 1;
    let queryFilter: any = { type: "deposit" };

    if (req.query.status === "Approved") {
      queryFilter.status = "Approved";
    } else if (req.query.status === "Declined") {
      queryFilter.status = "Declined";
    } else if (req.query.status === "Pending") {
      queryFilter.status = "Pending";
    }

    const options = {
      page: currentPage,
      limit: 100,
      sort: { createdAt: -1 },
    };

    const deposits = await Transaction.paginate(queryFilter, options);

    if (!deposits) {
      return res.status(404).json({ message: "No deposits found" });
    }

    res.status(200).json({
      deposits: deposits.docs,
      pageCount: deposits.totalPages,
      message: "Deposits fetched successfully",
    });
  } catch (error) {
    if ((error as mongoose.Error).name === "CastError") {
      return res.status(400).json({ message: "Invalid query parameter" });
    } else {
      console.error(error);
      return res.status(500).json({ message: "Error fetching deposits" });
    }
  }
});

router.get("/withdrawals", async (req: Request, res: Response) => {
  try {
    const currentPage = Number(req.query.currentPage) || 1;
    let queryFilter: any = { type: "withdrawal" };

    if (req.query.status === "Paid") {
      queryFilter.status = "Paid";
    } else if (req.query.status === "Declined") {
      queryFilter.status = "Declined";
    } else if (req.query.status === "Pending") {
      queryFilter.status = "Pending";
    }

    const options = {
      page: currentPage,
      limit: 100,
      sort: { createdAt: -1 },
    };

    const withdrawals = await Transaction.paginate(queryFilter, options);

    if (!withdrawals) {
      return res.status(404).json({ message: "No withdrawals found" });
    }

    const modifiedWithdrawals = await Promise.all(
      withdrawals.docs.map(async (withdrawal) => {
        const user = await User.findOne({ _id: withdrawal.userId });
    
        if (!user || !user.bankDetails) {
          return {
            ...withdrawal.toObject(),
            bankAccount: null,
          };
        }
    
        const userBank = user.bankDetails.filter(
          (bank) => bank.bankType === withdrawal.bankType
        );
    
        const bankAccount = userBank.length > 0 ? userBank[0] : {};
    
        return {
          ...withdrawal.toObject(),
          bankAccount: bankAccount,
        };
      })
    );
    

    res.status(200).json({
      withdrawals: modifiedWithdrawals,
      pageCount: withdrawals.totalPages,
      message: "withdrawals fetched successfully",
    });
  } catch (error) {
    if ((error as mongoose.Error).name === "CastError") {
      return res.status(400).json({ message: "Invalid query parameter" });
    } else {
      console.error(error);
      return res.status(500).json({ message: "Error fetching withdrawals" });
    }
  }
});

router.put("/process-transact", async (req: Request, res: Response) => {
  try {
    const { status: action, transactId, type } = req.body;

    if (!action && !transactId && !type) {
      console.log(req.body);
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transaction = await Transaction.findOne({ _id: transactId });

    if (type === "deposit") {
      if (!transaction) {
        return res.status(404).json({ message: "Deposit not recorded" });
      }

      if (transaction.type !== "deposit") {
        return res
          .status(400)
          .json({ message: "It's not a deposit transaction" });
      }

      const user = await User.findById(transaction.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (transaction.status !== "Pending") {
        return res.status(400).json({ message: "Deposit already processed" });
      }

      if (action === "approve") {
        user.depositBalance += transaction.amount;
        await user.save();
        transaction.status = "Approved";
        await transaction.save();
        return res.status(200).json({ message: "Deposit approved" });
      }

      if (action === "decline") {
        transaction.status = "Declined";
        await transaction.save();
        return res.status(200).json({ message: "Deposit declined" });
      }
    }

    if (type === "withdrawal") {
      if (!transaction) {
        return res.status(404).json({ message: "Withdrawal not recorded" });
      }

      if (transaction.type !== "withdrawal") {
        return res
          .status(400)
          .json({ message: "It's not a withdrawal transaction" });
      }

      const user = await User.findById(transaction.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (transaction.status !== "Pending") {
        return res
          .status(400)
          .json({ message: "Withdrawal already processed" });
      }

      if (action === "approve") {
        user.withdrawableBalance -= transaction.amount;
        await user.save();
        transaction.status = "Paid";
        await transaction.save();
        return res.status(200).json({ message: "Withdrawal approved" });
      }

      if (action === "decline") {
        transaction.status = "Declined";
        await transaction.save();
        return res.status(200).json({ message: "Withdrawal declined" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing transaction" });
  }
});

router.get("/search", async (req, res) => {
  const { query, page = 1, status, type, limit = 100 } = req.query;
  const options = {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
    sort: { createdAt: -1 },
  };

  try {
    const filter: any = {
      $or: isStrNum(query as string)
        ? [{ amount: query }, { charge: query }, { returnAmt: query }]
        : [
            { userName: { $regex: query as string, $options: "i" } },
            { refId: { $regex: query as string, $options: "i" } },
            { type: { $regex: query as string, $options: "i" } },
            { status: { $regex: query as string, $options: "i" } },
            { senderName: { $regex: query as string, $options: "i" } },
            { bankType: { $regex: query as string, $options: "i" } },
          ],
    };

    if (status !== "All") {
      filter.status = status;
    }

    if (type !== "transaction") {
      filter.type = type;
    } else {
      filter.type = { $not: "income" };
    }

    const result = await User.paginate(filter, options);

    if (result.docs.length === 0) {
      return res.status(404).json({ message: "No user matches your search" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
