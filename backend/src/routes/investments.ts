import express, { Request, Response } from "express";
import Investment from "../models/investment";
import mongoose from "mongoose";
import { isStrNum } from "../utils";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const currentPage = Number(req.query.currentPage) || 1;

    const options = {
      page: currentPage,
      limit: 100,
      sort: { createdAt: -1 },
    };

    const investments = await Investment.paginate({}, options);

    if (!investments) {
      return res.status(404).json({ message: "No investments found" });
    }

    res.status(200).json({
      investments: investments.docs,
      pageCount: investments.totalPages,
      message: "Investments fetched successfully",
    });
  } catch (error) {
    if ((error as mongoose.Error).name === "CastError") {
      return res.status(400).json({ message: "Invalid query parameter" });
    } else {
      console.error(error);
      return res.status(500).json({ message: "Error fetching investments" });
    }
  }
});

router.get("/search", async (req, res) => {
  const { query, page = 1, limit = 100 } = req.query;
  const options = {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
    sort: { createdAt: -1 },
  };

  try {
    const filter: any = {
      $or: isStrNum(query as string)
        ? [
            { capital: query },
            { amountEarned: query },
            { dailyReturn: query },
            { daysSpent: query },
            { totalDays: query },
            { totalReturn: query },
          ]
        : [
            { userName: { $regex: query as string, $options: "i" } },
            { userInviteCode: { $regex: query as string, $options: "i" } },
            { planName: { $regex: query as string, $options: "i" } },
            { endDate: { $regex: query as string, $options: "i" } },
            { endDate: { $regex: query as string, $options: "i" } },
            { returnType: { $regex: query as string, $options: "i" } },
            { status: { $regex: query as string, $options: "i" } },
          ],
    };

    const result = await Investment.paginate(filter, options);

    if (result.docs.length === 0) {
      return res
        .status(404)
        .json({ message: "No investment matches your search" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
