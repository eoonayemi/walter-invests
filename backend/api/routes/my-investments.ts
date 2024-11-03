import express, { Request, Response } from "express";
import Investment, { InvestmentStatus } from "../models/investment";
import verifyToken from "../middlewares/verifyToken";
import Plan, { PlanType } from "../models/plan";
import User, { UserType } from "../models/user";
import Transaction from "../models/transaction";

const router = express.Router();

router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { planId } = req.body;
    const userId = req.userId;

    const plan: PlanType | null = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.depositBalance < plan.price) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.depositBalance -= plan.price;
    await user.save();

    const dailyReturn =
      plan.returnType === "percent"
        ? (plan.dailyReturn * plan.price) / 100
        : plan.dailyReturn;

    const investment = new Investment({
      userId: user._id,
      userName: user.userName,
      userInviteCode: user.inviteCode,
      planId: plan._id,
      planName: plan.name,
      capital: plan.price,
      amountEarned: 0,
      dailyReturn,
      endDate: new Date(
        new Date().getTime() + plan.totalDays * 24 * 60 * 60 * 1000
      ).toISOString(),
      daysSpent: 0,
      totalDays: plan.totalDays,
      totalReturn: plan.totalReturn,
      returnType: plan.returnType,
      status: "running",
      imageUrl: plan.imageUrl,
    });

    await investment.save();

    const referringUserId = user.referredBy;

    if (referringUserId) {
      const { firstRefer, secondRefer, thirdRefer } = plan.commission;
      const referringUser = await User.findOneAndUpdate(
        { _id: referringUserId },
        {
          $inc: {
            "referral.firstRefer.bonus": (firstRefer * plan.price) / 100,
          },
        },
        {
          new: true,
        }
      );
      if (referringUser) {
        const newIncome = {
          userId: referringUser._id,
          amount: (firstRefer * plan.price) / 100,
          type: "income",
          status: "Success",
          subType: "team income",
        };

        await Transaction.create(newIncome);
      }

      const { referredBy } = referringUser as UserType;
      if (referredBy) {
        const referringUser2 = await User.findOneAndUpdate(
          { _id: referredBy },
          {
            $inc: {
              "referral.secondRefer.bonus": (secondRefer * plan.price) / 100,
            },
          },
          {
            new: true,
          }
        );

        if (referringUser2) {
          const newIncome = {
            userId: referringUser2._id,
            amount: (secondRefer * plan.price) / 100,
            type: "income",
            status: "Success",
            subType: "team income",
          };

          await Transaction.create(newIncome);
        }

        const { referredBy: referredBy2 } = referringUser2 as UserType;
        if (referredBy2) {
          const referringUser3 = await User.findOneAndUpdate(
            { _id: referredBy2 },
            {
              $inc: {
                "referral.thirdRefer.bonus": (thirdRefer * plan.price) / 100,
              },
            }
          );

          if (referringUser3) {
            const newIncome = {
              userId: referringUser3._id,
              amount: (thirdRefer * plan.price) / 100,
              type: "income",
              status: "Success",
              subType: "team income",
            };

            await Transaction.create(newIncome);
          }
        }
      }
    }

    return res.status(201).json(investment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const status = req.query.status as InvestmentStatus;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    const investments = await Investment.find({ userId, status })
      .sort({ updatedAt: -1 })
      .exec();
    res.status(200).json(investments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching investments" });
  }
});

export default router;
