import type { NextFunction, Request, Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import type { GraffitiStructure } from "../../../database/models/Graffiti.js";
import { Graffiti } from "../../../database/models/Graffiti.js";

export const getAllGraffitis = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const graffitis = await Graffiti.find();
    res.status(200).json({ graffitis });
  } catch (error: unknown) {
    const throwError = new CustomError(
      500,
      (error as Error).message,
      "Graffitis are missing!"
    );
    next(throwError);
  }
};

export const deleteGraffiti = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idGraffiti } = req.params;

    const graffiti = await Graffiti.findByIdAndDelete(idGraffiti);
    res.status(200).json({ graffiti });
  } catch (error: unknown) {
    const throwError = new CustomError(
      500,
      (error as Error).message,
      "Graffiti is missing!"
    );
    next(throwError);
  }
};

export const createGraffiti = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const receivedGraffiti = req.body as GraffitiStructure;

  try {
    const newGraffiti = await Graffiti.create(receivedGraffiti);

    res.status(201).json({ graffiti: { newGraffiti } });
  } catch (error: unknown) {
    const throwError = new CustomError(
      500,
      (error as Error).message,
      "Graffiti is missing!"
    );
    next(throwError);
  }
};

export const getGraffitiById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idGraffiti } = req.params;
  try {
    const graffiti = await Graffiti.findById(idGraffiti);
    res.status(200).json({ graffiti });
  } catch (error: unknown) {
    const throwError = new CustomError(
      500,
      (error as Error).message,
      "Graffiti is missing!"
    );
    next(throwError);
  }
};
