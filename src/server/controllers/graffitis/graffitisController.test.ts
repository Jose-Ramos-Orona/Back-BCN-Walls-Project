import type { NextFunction, Request, Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import { Graffiti } from "../../../database/models/Graffiti";
import graffitiMock from "../../../mocks/graffitiMock";
import graffitiMockCreate from "../../../mocks/graffitiMockCreate";
import {
  createGraffiti,
  deleteGraffiti,
  getAllGraffitis,
  getGraffitiById,
} from "./graffitisController";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn().mockReturnThis();

describe("Given a getAllGraffitis controller", () => {
  describe("When its receives a response", () => {
    test("Then it should call its method status with 200", async () => {
      const expectedStatus = 200;

      Graffiti.find = jest.fn();
      await getAllGraffitis(null, res as Response, null);

      expect(res.status).toHaveBeenLastCalledWith(expectedStatus);
    });

    describe("When it receives a response with an error", () => {
      test("Then it should call the next function with a customError", async () => {
        const customError = new CustomError(500, "", "Graffitis are missing!");

        Graffiti.find = jest.fn().mockRejectedValue(customError);
        await getAllGraffitis(null, res as Response, next as NextFunction);

        expect(next).toHaveBeenCalledWith(customError);
      });
    });
  });
});

describe("Given a deleteGraffiti constroller", () => {
  describe("When it receives a response", () => {
    test("Then it should call its method with status '200'", async () => {
      const expectedStatus = 200;
      const idMock = graffitiMock._id;

      const req: Partial<Request> = {
        params: { idGrafitti: idMock },
      };

      Graffiti.findByIdAndDelete = jest.fn().mockReturnValue(idMock);
      await deleteGraffiti(req as Request, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
    describe("When it receives a response with an error", () => {
      test("Then it should call the next function with a customError", async () => {
        const customError = new CustomError(500, "", "Graffiti is missing!");
        const req: Partial<Request> = {
          params: {},
        };

        Graffiti.findByIdAndDelete = jest.fn().mockRejectedValue(customError);
        await deleteGraffiti(
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(customError);
      });
    });
  });
});

describe("Given a createGraffiti controller", () => {
  describe("When it recieves a request body with the same shape as GraffitiStructure", () => {
    test("Then it should call a response with its method status '201'", async () => {
      const expectedStatus = 201;
      const graffiti = graffitiMockCreate;

      const req: Partial<Request> = {
        body: graffiti,
      };

      Graffiti.create = jest.fn().mockResolvedValue(graffiti);

      await createGraffiti(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });
  describe("When it receives a response with an error", () => {
    test("Then it should call the next function with a customError", async () => {
      const customError = new CustomError(500, "", "Graffiti is missing!");
      const req: Partial<Request> = {
        body: {},
      };

      Graffiti.create = jest.fn().mockRejectedValue(customError);
      await createGraffiti(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});

describe("Given a getGraffitiById constroller", () => {
  describe("When it receives a response", () => {
    test("Then it should call its method with status '200'", async () => {
      const expectedStatus = 200;
      const idMock = graffitiMock._id;

      const req: Partial<Request> = {
        params: { idGrafitti: idMock },
      };

      Graffiti.findById = jest.fn().mockReturnValue(idMock);
      await getGraffitiById(req as Request, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a response with an error", () => {
    test("Then it should call the next function with a customError", async () => {
      const customError = new CustomError(500, "", "Graffiti is missing!");
      const req: Partial<Request> = {
        params: {},
      };

      Graffiti.findById = jest.fn().mockRejectedValue(customError);
      await getGraffitiById(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
