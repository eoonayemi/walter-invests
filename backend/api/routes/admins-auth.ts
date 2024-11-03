import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middlewares/verifyToken";
import Admin from "../models/admin";
import verifyAdminToken from "../middlewares/verifyAdminToken";

const router = express.Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password  must have at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      const { email, password } = req.body;

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).send({ message: "Admin not found" });
      }
      const validatePassword = await bcrypt.compare(password, admin.password);
      if (!validatePassword) {
        return res.status(400).send({ message: "Invalid password" });
      }
      const token = jwt.sign(
        { userId: admin._id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("admin_auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        maxAge: 86400000,
      });

      const { password: pwd, ...rest } = admin.toObject();
      res.status(200).json(rest);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Login failed" });
    }
  }
);

router.get(
  "/validate-token",
  verifyAdminToken,
  async (req: Request, res: Response) => {
    return res.status(200).send({ adminId: req.adminId });
  }
);

router.post("/logout", (req: Request, res: Response) => {
  try {
    res.clearCookie("admin_auth_token");
    res.status(200).send({ message: "Log out successful" });
  } catch(err) {
    console.log(err);
    res.status(500).send({ message: "Logged out failed"})
  }
});

export default router;
