import express, { NextFunction, Request, Response } from "express";
import verifyToken from "../middlewares/verifyToken";
import { body } from "express-validator";
import Transaction, { TransactionType } from "../models/transaction";
import User from "../models/user";
import { validationResult } from "express-validator";
import { createError } from "../utils";
import Admin from "../models/admin";
import crypto from "crypto";

const router = express.Router();

type Params = {
  mchId: string;
  passageId: number;
  orderAmount: string;
  orderNo: string;
  notifyUrl: string;
  sign?: string;
};

export const generateSign = (params: Params, secretKey: string): string => {
  const sortedKeys = Object.keys(params).sort() as (keyof Params)[];

  let concatenatedString = "";
  for (const key of sortedKeys) {
    concatenatedString += `${key}=${params[key]}&`;
  }
  concatenatedString += `key=${secretKey}`;

  const hash = crypto
    .createHash("sha256")
    .update(concatenatedString)
    .digest("hex");

  return hash;
};

router.post("/create-payment", async (req, res) => {
  // const secretKey = "df92bb0db72648a0b8e96b76c5447d0c";

  const paymentData = {
    mchId: "6a836614",
    passageId: 101,
    orderAmount: "1000",
    orderNo: "2022110103221032890132",
    notifyUrl: "http://127.0.0.1:9000/test"
  } as Params;

  // const sign = generateSign(paymentData, secretKey);
  paymentData.sign = "df92bb0db72648a0b8e96b76c5447d0c";

  try {
    const response = await fetch("https://wg.gtrpay001.com/collect/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();
    if (response.ok) {
      res.status(200).json({ result, paymentData });
    } else {
      res.status(response.status).json({ result, paymentData });
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating payment", error });
  }
});

router.post(
  "/deposit",
  verifyToken,
  [
    body("amount").notEmpty().withMessage("Amount is required").isNumeric(),
    body("type").notEmpty().withMessage("Type is required"),
    body("refId").notEmpty().withMessage("Reference ID is required"),
    body("senderName").notEmpty().withMessage("Sender's name is required"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(400, errors.array()[0].msg));
      }

      const newTransaction: TransactionType = req.body;
      const user = await User.findById(req.userId);

      if (!user) return res.status(400).send({ message: "User not found" });

      const pendingDeposits = await Transaction.find({
        userId: req.userId,
        type: "deposit",
        status: "Pending",
      });

      if (pendingDeposits.length > 0) {
        return res.status(400).send({ message: "You have a pending deposit" });
      }

      newTransaction.userId = req.userId;
      newTransaction.userName = user?.userName;
      newTransaction.status = "Pending";

      const transaction = new Transaction(newTransaction);
      await transaction.save();

      res.status(201).send(transaction);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Deposit failed" });
    }
  }
);

router.get("/deposit", verifyToken, async (req: Request, res: Response) => {
  try {
    const projection = { userId: 0, _id: 0 };
    const deposits = await Transaction.find(
      { userId: req.userId, type: "deposit" },
      projection,
      { sort: { updatedAt: -1 } }
    );

    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deposits" });
  }
});

router.post(
  "/withdraw",
  verifyToken,
  [
    body("amount").notEmpty().withMessage("Amount is required").isNumeric(),
    body("type").notEmpty().withMessage("Type is required"),
    body("bankType").notEmpty().withMessage("Bank Type is required"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(400, errors.array()[0].msg));
      }

      const newTransaction: TransactionType = req.body;

      const pendingWithdrawals = await Transaction.find({
        userId: req.userId,
        type: "withdrawal",
        status: "Pending",
      });

      if (pendingWithdrawals.length > 0) {
        return res
          .status(400)
          .send({ message: "You have a pending withdrawal" });
      }

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      const admin = await Admin.findOne({ role: "super-admin" });
      if (!admin) {
        return res.status(404).send({ message: "Admin not found" });
      }
      const chargePercent = admin?.withdrawalCharge;
      const charge = (newTransaction.amount * chargePercent) / 100;

      newTransaction.userId = req.userId;
      newTransaction.userName = user?.userName;
      newTransaction.charge = charge;
      newTransaction.returnAmt = newTransaction.amount - charge;
      newTransaction.status = "Pending";

      const transaction = new Transaction(newTransaction);
      await transaction.save();

      res.status(201).send(transaction);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Withdrawal failed" });
    }
  }
);

router.get("/withdraw", verifyToken, async (req: Request, res: Response) => {
  try {
    const projection = { userId: 0, _id: 0 };
    const deposits = await Transaction.find(
      { userId: req.userId, type: "withdrawal" },
      projection
    )
      .sort({ updatedAt: -1 })
      .exec();

    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: "Error fetching withdrawals" });
  }
});

router.get("/income", verifyToken, async (req: Request, res: Response) => {
  try {
    const projection = { userId: 0, _id: 0 };
    const incomes = await Transaction.find(
      { userId: req.userId, type: "income" },
      projection
    )
      .sort({ updatedAt: -1 })
      .exec();

    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching incomes" });
  }
});

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const projection = { userId: 0, lastUpdated: 0, _id: 0 };
    const transactions = await Transaction.find(
      { userId: req.userId },
      projection
    )
      .sort({ updatedAt: -1 })
      .exec();

    const user = await User.findById(req.userId);

    res.json({ transactions, user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

export default router;
