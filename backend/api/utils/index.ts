import bcrypt from "bcryptjs";
import Code from "../models/code";
import crypto from "crypto";
import CustomError from "../classes";
import { Request } from "express"
import { v2 as cloudinary } from "cloudinary";

export function generateInviteCode(): string {
  return crypto.randomBytes(3).toString("hex").slice(0, 6);
}

export const createError = (
  statusCode: number,
  message: string
): CustomError => {
  return new CustomError(statusCode, message);
};

export const errorController = (err: any, msgPrefix: string) => {
  if (err.code === 11000) {
    return createError(409, `${msgPrefix} already exists`);
  } else if (err.name === "ValidationError") {
    return createError(400, `Required fields missing`);
  } else {
    return createError(500, "Something went wrong");
  }
};

export async function generateUniqueCode(): Promise<string> {
  let code: string = generateInviteCode();
  let isUnique = false;

  while (!isUnique) {
    code = generateCode();
    const existingCode = await Code.findOne({ code });
    isUnique = !existingCode;
  }

  await Code.create({ code });

  return code.toUpperCase();
}

function generateCode(): string {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const charSet = letters + numbers;

  let code = "";

  // Start with a random letter
  code += letters[Math.floor(Math.random() * letters.length)];

  // Add 1 more random letter
  code += letters[Math.floor(Math.random() * letters.length)];

  // Add 1 random number
  code += numbers[Math.floor(Math.random() * numbers.length)];

  // Add 1 more random letter
  code += letters[Math.floor(Math.random() * letters.length)];

  // Add 1 more random number
  code += numbers[Math.floor(Math.random() * numbers.length)];

  return code;
}

export function getCompletionDate(
  investmentStartDate: Date,
  daysInvestment: number
): Date {
  const completionDate = new Date(
    investmentStartDate.getTime() + daysInvestment * 24 * 60 * 60 * 1000
  );
  return completionDate;
}

export function isStrNum(str: string): boolean {
  return !isNaN(Number(str));
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function uploadImage(imageFile: Express.Multer.File, req: Request) {
  try {
    const protocol = req.protocol;
    const b64 = Buffer.from(imageFile.buffer).toString("base64");
    const dataURI = "data:" + imageFile.mimetype + ";base64," + b64;
    const res = await cloudinary.uploader.upload(dataURI);
    const secureUrl = protocol === "https" ? res.secure_url : res.url;
    return secureUrl;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Error uploading image to Cloudinary");
  }
}