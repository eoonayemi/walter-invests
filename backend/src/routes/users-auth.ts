import express, { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middlewares/verifyToken";
import { createError } from "../utils";

const router = express.Router();

router.post(
  "/login",
  [
    check("phone", "Phone number must be 10 digits").isLength({
      min: 11,
      max: 11,
    }),
    check("password", "Password must have at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      const { phone, password } = req.body;

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }
      const user = await User.findOne({ phoneNumber: `+234${phone.slice(1)}` });
      if (!user) {
        return res.status(400).send({ message: "User not found" });
      }

      if (user?.status === "banned") {
        next(createError(400, "User is banned"));
      }

      const validatePassword = await bcrypt.compare(password, user.password);
      if (!validatePassword) {
        return res.status(400).send({ message: "Invalid password" });
      }
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("user_auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        maxAge: 86400000,
      });

      const { password: pwd, ...rest } = user.toObject();
      return res.status(200).json(rest);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Login failed" });
    }
  }
);

router.post("/login-as-user", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).send({ message: "UserId is compulsory" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY as string, {
      expiresIn: "1d",
    });
    res.cookie("user_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      maxAge: 86400000,
    });

    const { password: pwd, ...rest } = user.toObject();

    return res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Login failed" });
  }
});

router.get(
  "/validate-token",
  verifyToken,
  async (req: Request, res: Response) => {
    return res.status(200).send({ userId: req.userId });
  }
);

router.post("/logout", (req: Request, res: Response) => {
  try {
    res.clearCookie("user_auth_token");
    res.status(200).send({ message: "Log out successful" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Logged out failed" });
  }
});

export default router;
