import type { NextFunction, Request, Response } from "express";
import debugCreator from "debug";
import chalk from "chalk";
import type CustomError from "../../CustomError/CustomError.js";
import environtment from "../../loadEnvironments.js";

const { debugdb } = environtment;

const debug = debugCreator(`${debugdb}middlewares`);

export const endpointNotFound = (req: Request, res: Response) => {
  res.status(404).json({ message: "Endpoint not found" });
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.statusCode ?? 500;
  debug(chalk.red(`Error ${error.message}`));
  const message = error.publicMessage || "Opps...Data error";

  res.status(status).json({ error: message });
  next();
};
