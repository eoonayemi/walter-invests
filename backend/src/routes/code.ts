import express, { Request, Response } from "express";
import { generateUniqueCode } from "../utils";

const router = express.Router();

router.get("/random-code", async (req: Request, res: Response) => {
  try {
    const code = await generateUniqueCode();
    res.status(200).json(code);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching code" });
  }
});

export default router;
