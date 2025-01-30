import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "./userModel";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  //   database call
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(
        400,
        "User with this email already present"
      );
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, `Error while getting user: ${err} `));
  }
  // hashing password
  const hashPassword = await bcrypt.hash(password, 10);

  let newUser: User;
  // creating new user
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashPassword
    });
  } catch (error) {
    return next(createHttpError(500, `Error while creating user: ${error} `));
  }

  try {
    // jwt token generation
    const token = sign({ sub: newUser._id }, config.jwt_secret_key as string, {
      expiresIn: "7d",
      algorithm: "HS256"
    });

    res.status(201).json({
      accessToken: token
    });
  } catch (error) {
    return next(createHttpError(500, `Error while signing token: ${error} `));
  }
};

export { createUser };
