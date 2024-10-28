import express, { NextFunction, Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { body, check, validationResult } from "express-validator";
import verifyToken from "../middlewares/verifyToken";
import bcrypt from "bcryptjs";
import { UserType } from "../models/user";
import {
  createError,
  errorController,
  generateUniqueCode,
  hashPassword,
} from "../utils";
import Transaction from "../models/transaction";
import Admin from "../models/admin";

const router = express.Router();

router.post(
  "/register",
  [
    check("userName", "Username is required").isString(),
    check("email", "Email is required").isEmail(),
    check("phoneNumber", "Phone number must be 10 digits").isLength({
      min: 10,
      max: 10,
    }),
    check("password", "Password must have at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(400, errors.array()[0].msg));
      }

      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return next(createError(400, "User already exists"));
      }

      const userWithPhoneNo = await User.findOne({
        phoneNumber: req.body.phoneNumber,
      });

      if (userWithPhoneNo) {
        return next(createError(400, "Phone number already exists"));
      }

      const newUser: UserType = {
        ...req.body,
        phoneNumber: `+234${req.body.phoneNumber}`,
        status: "active",
        inviteCode: await generateUniqueCode(),
        withdrawableBalance: 100,
      };

      const { inviteCode } = req.body;
      if (inviteCode) {
        const referringUser = await User.findOneAndUpdate(
          { inviteCode },
          {
            $inc: {
              "referral.firstRefer.members": 1,
            },
          },
          {
            new: true,
          }
        );

        newUser.referredBy = referringUser?._id;

        const { referredBy } = referringUser as UserType;
        if (referredBy) {
          const referredUser = await User.findOneAndUpdate(
            { _id: referredBy },
            {
              $inc: {
                "referral.secondRefer.members": 1,
              },
            },
            {
              new: true,
            }
          );

          const { referredBy: referredBy2 } = referredUser as UserType;
          if (referredBy2) {
            await User.findOneAndUpdate(
              { _id: referredBy2 },
              {
                $inc: {
                  "referral.thirdRefer.members": 1,
                },
              }
            );
          }
        }
      }

      user = new User(newUser);
      await user.save();

      const newTransaction = {
        userId: user._id,
        type: "income",
        amount: 100,
        status: "Success",
        subType: "reg-bonus",
      };

      const transact = new Transaction(newTransaction);
      await transact.save();

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );
      res.cookie("user_auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      const { password, ...rest } = user.toObject();
      return res.status(200).json(rest);
    } catch (err) {
      console.log(err);
      console.log((err as Error).message);
      return next(errorController(err, "Username or phone number"));
    }
  }
);

router.post(
  "/add-bank",
  verifyToken,
  [
    body("bankName").notEmpty().withMessage("Bank Name is required"),
    body("accountNumber").notEmpty().withMessage("Account Number is required"),
    body("accountName").notEmpty().withMessage("Account Name is required"),
    body("bankType").notEmpty().withMessage("Bank Type is required"),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { bankName, accountNumber, accountName, bankType } = req.body;

      const existingUser = await User.findOne({ _id: req.userId });

      if (!existingUser) {
        return res.status(400).json({ message: "User not found" });
      }

      const bankDetailsLength = existingUser.bankDetails?.length || 0;
      if (bankDetailsLength >= 2) {
        return res
          .status(400)
          .json({ message: "You can only add two bank accounts" });
      }

      if (bankDetailsLength === 1) {
        const existingBankType = existingUser.bankDetails![0].bankType;
        if (existingBankType === bankType) {
          return res.status(400).json({
            message: `You already added a ${existingBankType.toLowerCase()}`,
          });
        }
      }

      if (bankDetailsLength === 1) {
        const existingAccountNo = existingUser.bankDetails![0].accountNumber;
        if (existingAccountNo === accountNumber) {
          return res.status(400).json({
            message: `Account number already exists`,
          });
        }
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: req.userId },
        {
          $push: {
            bankDetails: { bankName, accountNumber, accountName, bankType },
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(400).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "Bank details added successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Transaction failed" });
    }
  }
);

router.get(
  "/bank-details",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const projection = { lastUpdated: 0, _id: 0 };
      const user = await User.findOne({ _id: req.userId }, projection);

      if (!user) {
        return res.status(400).json({ message: "user not found" });
      }

      const bankDetails = user.bankDetails;

      res.json(bankDetails);
    } catch (error) {
      res.status(500).json({ message: "Error fetching deposits" });
    }
  }
);

router.get("/admin-bank-account", async (req: Request, res: Response) => {
  try {
    const superAdmin = await Admin.findOne({ role: "super-admin" });
    if (!superAdmin) {
      return res.status(400).json({ message: "Super admin not found" });
    }

    if (!superAdmin.bankAccount) {
      return res.status(400).json({ message: "Bank account not found" });
    }
    const { bankAccount } = superAdmin?.toObject();

    res.json(bankAccount);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deposits" });
  }
});

router.put(
  "/change-password",
  verifyToken,
  [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New Password is required"),
  ],
  async (req: Request, res: Response) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await User.findOne({ _id: req.userId });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      if (!newPassword) {
        return res.status(400).json({ message: "New password is required" });
      }

      if (newPassword.trim().length === 0) {
        return res
          .status(400)
          .send({ message: "Password shouldn't start or end with spaces" });
      }

      if (user) {
        const validatePassword = await bcrypt.compare(
          oldPassword,
          user.password
        );
        if (!validatePassword) {
          return res
            .status(400)
            .send({ message: "Old password doesn't match" });
        }
      }

      if (newPassword) {
        const hashedPass = await hashPassword(newPassword);
        await User.findOneAndUpdate(
          { _id: req.userId },
          {
            $set: { password: hashedPass },
          }
        );
      }

      return res.status(200).json({ message: "Password has been changed" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Could not change password" });
    }
  }
);

router.get("/search", async (req, res) => {
  const { query, page = 1, status, limit = 100 } = req.query;
  const options = {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
    sort: { createdAt: -1 },
  };

  try {
    const filter: any = {
      $or: [
        { userName: { $regex: query as string, $options: "i" } },
        { email: { $regex: query as string, $options: "i" } },
        { phoneNumber: { $regex: query as string, $options: "i" } },
        { inviteCode: { $regex: query as string, $options: "i" } },
        { status: { $regex: query as string, $options: "i" } },
      ],
    };

    if (status === "active") {
      filter.status = "active";
    } else if (status === "banned") {
      filter.status = "banned";
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

router.put("/edit-user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const message = req.query.msg;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const updateData: any = {};
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== "") {
        updateData[key] = req.body[key];
      }
    });

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      {
        new: true,
        select: "-password",
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update user details" });
  }
});

router.delete("/delete-user", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new Error("User ID is required");
    }

    const user = await User.findById(userId, { password: 0 });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;
