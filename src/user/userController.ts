import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "./userModel";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  //   database call
  const user = await userModel.findOne({ email });
  if (user) {
    const error = createHttpError(400, "User with this email already present");
    return next(error);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    name,
    email,
    password: hashPassword
  });

  res.json({
    message: "User Registered"
  });
};

export { createUser };
