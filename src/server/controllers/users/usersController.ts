import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type {
  Credentials,
  RegisterData,
  UserTokenPayload,
} from "../../types.js";
import User from "../../../database/models/User.js";
import CustomError from "../../../CustomError/CustomError.js";
import environtment from "../../../loadEnvironments.js";

const { salt, secret } = environtment;

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email } = req.body as RegisterData;

  try {
    const passwordHashed = await bcrypt.hash(password, +salt);

    const newUser = await User.create({
      username,
      password: passwordHashed,
      email,
    });

    res.status(201).json({
      message: `The user ${newUser.username} has been created correctly`,
    });
  } catch (error: unknown) {
    const errorObject = error as Error;

    let message = "Something went wrong with the user creation";

    if (errorObject.message.includes("duplicate key error")) {
      message = "Database error: duplicate key";
    }

    const customError = new CustomError(409, errorObject.message, message);

    next(customError);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as Credentials;

  const user = await User.findOne({ username });

  if (!user) {
    const error = new CustomError(
      401,
      "Username not found",
      "Wrong credentials"
    );
    next(error);
    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    const error = new CustomError(
      401,
      "Password is incorrect",
      "Wrong credentials"
    );

    next(error);
    return;
  }

  const tokenPayload: UserTokenPayload = {
    id: user._id.toString(),
    username,
  };

  const token = jwt.sign(tokenPayload, secret);

  res.status(200).json({ token });
};
