import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import Plan, { PlanType } from "../models/plan";
import multer from "multer";
import mongoose from "mongoose";
import { createError, isStrNum, uploadImage } from "../utils";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/generate-url",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const image = req.file as Express.Multer.File;

      const imageUrl = await uploadImage(image, req);

      res.status(201).json({ message: imageUrl });
    } catch (error) {
      console.error("Error adding plan:", error);
      res.status(500).json({ message: "Plan couldn't be added" });
    }
  }
);

router.post(
  "/add-plan",
  upload.single("image"),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").notEmpty().withMessage("Price is required"),
    body("dailyReturn").notEmpty().withMessage("Interest Amount is required"),
    body("returnType").notEmpty().withMessage("Return Type is required"),
    body("totalDays").notEmpty().withMessage("Total Days is required"),
    body("status").notEmpty().withMessage("Status is required"),
    body("firstRefer")
      .notEmpty()
      .withMessage("First Refer Commission is required"),
    body("secondRefer")
      .notEmpty()
      .withMessage("Second Refer Commission is required"),
    body("thirdRefer")
      .notEmpty()
      .withMessage("Third Refer Commission is required"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(createError(400, errors.array()[0].msg));
      }
      const {
        name,
        price,
        totalDays,
        returnType,
        status,
        dailyReturn,
        firstRefer,
        secondRefer,
        thirdRefer,
      } = req.body;
      const planImage = req.file as Express.Multer.File;

      const imageUrl = await uploadImage(planImage, req);

      const newPlan = new Plan({
        name,
        price,
        totalDays,
        returnType,
        status,
        dailyReturn,
        commission: {
          firstRefer,
          secondRefer,
          thirdRefer,
        },
        imageUrl,
        totalReturn: dailyReturn * totalDays,
      });
      if (returnType === "percent") {
        newPlan.totalReturn = ((dailyReturn * price) / 100) * totalDays;
      }
      await newPlan.save();

      res.status(201).json({ message: "Plan added successfully" });
    } catch (error) {
      console.error("Error adding plan:", error);
      res.status(500).json({ message: "Plan couldn't be added" });
    }
  }
);

router.get("/", async (req: Request, res: Response) => {
  try {
    const options = {
      page: Number(req.query.currentPage) || 1,
      limit: 100,
      sort: { price: 1 },
    };

    const plans = await Plan.paginate({}, options);

    if (!plans) {
      return res.status(404).json({ message: "No plans found" });
    }

    res.status(200).json({
      plans: plans.docs,
      pageCount: plans.totalPages,
      message: "Plans fetched successfully",
    });
  } catch (error) {
    if ((error as mongoose.Error).name === "CastError") {
      return res.status(400).json({ message: "Invalid query parameter" });
    } else {
      console.error(error);
      return res.status(500).json({ message: "Error fetching plans" });
    }
  }
});

router.get("/products", async (req: Request, res: Response) => {
  try {
    const products = await Plan.find({ status: "active" });

    if (!products) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching products" });
  }
});

export type PlanFormData = {
  name: string;
  price: number;
  totalDays: number;
  returnType: string;
  status: string;
  dailyReturn: number;
  firstRefer: number;
  secondRefer: number;
  thirdRefer: number;
  image?: File;
};

router.put(
  "/edit-plan",
  upload.single("image"),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").notEmpty().withMessage("Price is required"),
    body("dailyReturn").notEmpty().withMessage("Interest Amount is required"),
    body("returnType").notEmpty().withMessage("Return Type is required"),
    body("totalDays").notEmpty().withMessage("Total Days is required"),
    body("status").notEmpty().withMessage("Status is required"),
    body("firstRefer")
      .notEmpty()
      .withMessage("First Refer Commission is required"),
    body("secondRefer")
      .notEmpty()
      .withMessage("Second Refer Commission is required"),
    body("thirdRefer")
      .notEmpty()
      .withMessage("Third Refer Commission is required"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(createError(400, errors.array()[0].msg));
      }

      const {
        name,
        price,
        totalDays,
        returnType,
        status,
        dailyReturn,
        firstRefer,
        secondRefer,
        thirdRefer,
      } = req.body as PlanFormData;

      const planId = req.body._id;

      const existingPlan = await Plan.findById(planId);
      if (!existingPlan) {
        return res.status(404).json({ message: "Plan not found" });
      }

      let imageUrl;
      if (req.file) {
        const imageFile = req.file;
        imageUrl = await uploadImage(imageFile, req);
      }

      const updatedPlan = await Plan.findByIdAndUpdate(
        planId,
        {
          name,
          price,
          totalDays,
          returnType,
          status,
          dailyReturn,
          commission: {
            firstRefer,
            secondRefer,
            thirdRefer,
          },
          imageUrl,
          totalReturn:
            returnType === "percent"
              ? ((dailyReturn * price) / 100) * totalDays
              : dailyReturn * totalDays,
        },
        {
          new: true,
        }
      );

      res
        .status(200)
        .json({ message: "Plan updated successfully", plan: updatedPlan });
    } catch (error) {
      console.error("Error updating plan:", error);
      res.status(500).json({ message: "Update failed" });
    }
  }
);

router.delete("/delete-plan", async (req: Request, res: Response) => {
  try {
    const { planId } = req.query;

    const deletedPlan = await Plan.findByIdAndDelete(planId);

    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting plan" });
  }
});

router.get("/search", async (req, res) => {
  const { query, page = 1, limit = 100 } = req.query;
  const options = {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
    sort: { createdAt: -1 },
  };

  console.log(isStrNum(query as string));

  try {
    const result = await Plan.paginate(
      {
        $or: isStrNum(query as string)
          ? [
              { price: query },
              { dailyReturn: query },
              { totalReturn: query },
              { totalDays: query },
            ]
          : [
              { name: { $regex: query as string, $options: "i" } },
              { status: { $regex: query as string, $options: "i" } },
              { returnType: { $regex: query as string, $options: "i" } },
            ],
      },
      options
    );

    if (result.docs.length === 0) {
      return res.status(404).json({ message: "No plans matches your search" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
