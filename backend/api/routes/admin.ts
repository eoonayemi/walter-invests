import express, { NextFunction, Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import Admin, { AdminType, BankType } from "../models/admin";
import verifyAdminToken from "../middlewares/verifyAdminToken";
import mongoose from "mongoose";
import verifyToken from "../middlewares/verifyToken";
import Transaction from "../models/transaction";
import { errorController, hashPassword } from "../utils";

const router = express.Router();

router.post(
  "/register",
  [
    check("userName", "Username is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password must have at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      let admin = await Admin.findOne({
        email: req.body.email,
      });

      if (admin) {
        return res.status(400).send({ message: "Admin already exists" });
      }

      const newAdmin: AdminType = {
        ...req.body,
      };

      const allAdmins = await Admin.find({});
      if (allAdmins.length === 0) {
        newAdmin.role = "super-admin";
      } else {
        newAdmin.role = "admin";
      }

      admin = new Admin(newAdmin);
      await admin.save();

      const token = jwt.sign(
        { userId: admin._id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );
      res.cookie("admin_auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        maxAge: 86400000,
      });
      return res.status(200).send({ message: "Admin added successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.get("/bank", verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findOne({ _id: req.adminId });

    if (!admin || !admin.bankAccount) {
      return res.status(404).json({ message: "No bank account found" });
    }

    return res.status(200).json(admin.bankAccount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.post(
  "/add-bank",
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const { accountNumber } = req.body;
      const admin = await Admin.findOne({ _id: req.adminId });

      if (admin?.bankAccount) {
        return res
          .status(400)
          .json({ message: "Admin already has a bank account" });
      }

      const existingAccount = await Admin.findOne({ accountNumber });
      if (existingAccount) {
        return res
          .status(400)
          .json({ message: "Account number already exists" });
      }

      if (admin) {
        // Cast admin.bankAccount to the expected BankType interface (if defined)
        admin.bankAccount = req.body as BankType; // Assuming BankType interface exists
        await admin.save();

        return res
          .status(201)
          .json({ message: "Bank account added successfully" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  }
);

router.put(
  "/edit-bank",
  verifyAdminToken,
  async (req: Request, res: Response) => {
    try {
      const { bankName, accountNumber, accountName } = req.body;

      const admin = await Admin.findOne({ _id: req.adminId });

      if (!admin || !admin.bankAccount) {
        return res.status(404).json({ message: "No bank account found" });
      }

      const existingAccount = await Admin.findOne({ accountNumber });
      if (existingAccount) {
        return res
          .status(400)
          .json({ message: "Account number already exists" });
      }

      const updatedBank: BankType = {
        ...admin.bankAccount,
        bankName,
        accountNumber,
        accountName,
      };

      admin.bankAccount = updatedBank;
      await admin.save();

      return res
        .status(200)
        .json({ message: "Bank account updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  }
);

const validateChangePassword = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long"),
  check("confirmNewPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("New passwords do not match");
      }
      return true;
    }),
];

router.put(
  "/change-password",
  verifyAdminToken,
  validateChangePassword,
  async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword, confirmNewPassword } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const admin = await Admin.findOne({ _id: req.adminId }); // Assuming you have an adminId in the request

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        admin.password
      );
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Incorrect current password" });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "New passwords do not match" });
      }

      // No need to hash newPassword here, the pre-save hook will handle it
      admin.password = newPassword;
      await admin.save();

      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  }
);

router.put(
  "/edit-admin/:adminId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let adminId = req.params.adminId;
      if (!adminId) {
        adminId = req.adminId;
        if (!adminId) {
          return res.status(400).json({ message: "Admin ID is required" });
        }
      }

      const {
        userName,
        email,
        newPassword,
        withdrawalCharge,
        telegramGroup,
        telegramChannel,
        dailyBonus,
        bonusStatus,
      } = req.body;

      let hashedPass: string | null = null;
      if (
        newPassword &&
        newPassword.trim().length !== 0 &&
        newPassword !== undefined &&
        newPassword !== null &&
        newPassword !== ""
      ) {
        hashedPass = await hashPassword(newPassword);
      }

      const updateData: any = {
        userName,
        email,
        password: hashedPass,
        withdrawalCharge,
        telegramGroup,
        telegramChannel,
        "dailyBonus.bonus": dailyBonus,
        "dailyBonus.status": bonusStatus,
      };

      Object.keys(updateData).forEach((key) => {
        if (
          updateData[key].toString().trim().length === 0 ||
          !updateData[key] ||
          updateData[key] === undefined ||
          updateData[key] === null ||
          updateData[key] === ""
        ) {
          delete updateData[key];
        }
      });

      const updatedAdmin = await Admin.findOneAndUpdate(
        { _id: adminId },
        {
          $set: updateData,
        },
        { new: true, select: "-password" }
      );

      if (!updatedAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      return res.status(200).json(updatedAdmin);
    } catch (err) {
      console.error(err);
      next(errorController(err, "Email"));
    }
  }
);

router.get("/users", async (req: Request, res: Response) => {
  try {
    const currentPage = Number(req.query.currentPage) || 1;
    const queryFilter: any = {};

    if (req.query.status === "active") {
      queryFilter.status = "active";
    } else if (req.query.status === "banned") {
      queryFilter.status = "banned";
    }

    const options = {
      page: currentPage,
      limit: 100,
      sort: { createdAt: -1 },
    };

    const users = await User.paginate(queryFilter, options);

    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      users: users.docs,
      pageCount: users.totalPages,
      message: "Users fetched successfully",
    });
  } catch (error) {
    if ((error as mongoose.Error).name === "CastError") {
      return res.status(400).json({ message: "Invalid query parameter" });
    } else {
      console.error(error);
      return res.status(500).json({ message: "Error fetching users" });
    }
  }
});

router.post("/get-bonus", verifyToken, async (req: Request, res: Response) => {
  try {
    const superAdmin = await Admin.findOne({ role: "super-admin" });
    if (!superAdmin) {
      return res.status(400).json({ message: "Super admin not found" });
    }
    if (
      superAdmin.dailyBonus.bonus === 0 ||
      superAdmin.dailyBonus.status === "inactive"
    ) {
      return res.status(400).json({ message: "Bonus not available" });
    }

    const user = await User.findById(req.userId);
    const lastBonus = user?.lastBonus;
    const currentTime = new Date().getTime();
    const bonusTime = lastBonus && new Date(lastBonus).getTime();
    if (bonusTime && currentTime - bonusTime < 86400000) {
      return res.status(404).json({ message: "Bonus already claimed" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.userId },
      {
        $inc: { withdrawableBalance: superAdmin.dailyBonus.bonus },
        lastBonus: new Date().toISOString(),
      },
      { new: true }
    );

    await Transaction.create({
      userId: req.userId,
      amount: superAdmin.dailyBonus.bonus,
      status: "Success",
      type: "income",
      subType: "daily-bonus",
    });

    if (!updatedUser) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/get-link", verifyToken, async (req: Request, res: Response) => {
  try {
    const superAdmin = await Admin.findOne({ role: "super-admin" });
    if (!superAdmin) {
      return res.status(400).json({ message: "Super admin not found" });
    }

    const user = await User.findById(req.userId);

    res.status(200).json({
      linkC: superAdmin.telegramChannel,
      linkG: superAdmin.telegramGroup,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
