import type { Response } from "express";
import CustomError from "../../CustomError/CustomError";
import { endpointNotFound, generalError } from "./error";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given a endpointNotFound middleware", () => {
  describe("When its receives a response", () => {
    test("Then it should call its method status with 404", () => {
      const statusCode = 404;

      endpointNotFound(null, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });

    test("Then it should call its method json with a 'Endpoint not found', message", () => {
      const errorResponse = {
        message: "Endpoint not found",
      };

      endpointNotFound(null, res as Response);

      expect(res.json).toHaveBeenCalledWith(errorResponse);
    });
  });
});

describe("Given a generalError middleware", () => {
  describe("When it receives a response with customError and staus 500", () => {
    test("Then it should call its method status with 500", () => {
      const expectedStatus = 500;
      const error = new CustomError(expectedStatus, "", "General Error");

      generalError(error, null, res as Response, () => {});

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a response with customError and a publicMessage 'General Error' ", () => {
    test("Then it should return the method json with the message received", () => {
      const error = new CustomError(300, "", "General Error");

      const expectedMessage = "General Error";

      generalError(error, null, res as Response, () => {});

      expect(res.json).toHaveBeenCalledWith({ error: expectedMessage });
    });
  });

  describe("When it receives a response with customError and no status", () => {
    test("Then it should return the status 500", () => {
      const error = new Error("");

      const expectedStatus = 500;

      generalError(error as CustomError, null, res as Response, () => {});

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a response and a customError with no message", () => {
    test("Then it should return the method json with the public message 'Opps...Data error'", () => {
      const error = new Error("");

      const expectedMessage = "Opps...Data error";

      generalError(error as CustomError, null, res as Response, () => {});

      expect(res.json).toHaveBeenCalledWith({ error: expectedMessage });
    });
  });
});
