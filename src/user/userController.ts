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

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  let user;
  try {
    user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      return next(createHttpError(400, "Invalid credentials"));
    }
  } catch (error) {
    return next(createHttpError(500, `Error while login: ${error} `));
  }

  try {
    const token = sign({ sub: user._id }, config.jwt_secret_key as string, {
      expiresIn: "7d",
      algorithm: "HS256"
    });

    res.status(201).json({
      accessToken: token
    });
  } catch (error) {
    return next(createHttpError(500, `Error while login: ${error} `));
  }
};

export { createUser, loginUser };
