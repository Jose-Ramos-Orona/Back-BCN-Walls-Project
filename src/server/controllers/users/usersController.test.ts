import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../database/models/User";
import { loginUser, registerUser } from "./usersController";
import { userRegisterMock, userLoginMock } from "../../../mocks/userMock";
import type { Credentials } from "../../types";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a registerUser controller", () => {
  const registerData = userRegisterMock;

  const req: Partial<Request> = {
    body: registerData,
  };

  describe("When it receives a request with username 'Manolito', password '2323' and email 'm@nolo' and is not in the database", () => {
    test("Then its method status should be called with a 201 and its method json should be called with 'Manolo' data", async () => {
      const expectedStatusCode = 201;
      const hashedPassword = "2323";
      const userId = new mongoose.Types.ObjectId();

      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      User.create = jest.fn().mockResolvedValue({
        ...registerData,
        password: hashedPassword,
        _id: userId,
      });
      const expectedMessage = {
        message: "The user Manolito has been created correctly",
      };
      await registerUser(req as Request, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });

  describe("When it receives a request with username 'Manolito', password '2323' and email 'm@nolo' and it already is in the database", () => {
    test("Then it should call the next function with a CustomError", async () => {
      const error = new Error("");

      User.create = jest.fn().mockRejectedValue(error);

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a loginUser controller", () => {
  describe("When it receives a request with username 'Paco' that is not in the database", () => {
    test("Then it should call the next function with an error", async () => {
      const loginData: Credentials = {
        username: "Paco",
        password: "asasd",
      };
      const req: Partial<Request> = {
        body: loginData,
      };
      const expectedMessage = new Error("Username not found");

      User.findOne = jest.fn();

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedMessage);
    });
  });

  describe("When it receives a request with username 'Paco' and an incorrect password 'sssss'", () => {
    test("Then it should call the next function with an error", async () => {
      const loginData: Credentials = {
        username: "Paco",
        password: "sssss",
      };
      const req: Partial<Request> = {
        body: loginData,
      };
      const expectedMessage = new Error("Password is incorrect");
      bcrypt.hash = jest.fn().mockReturnValue("sssss");

      User.findOne = jest.fn().mockResolvedValue(userLoginMock);

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedMessage);
    });
  });

  describe("When it receives a request with username 'Paco' and the correct password 'paquito'", () => {
    const loginData = userLoginMock;
    const req: Partial<Request> = {
      body: loginData,
    };

    test("Then it should call its response method status with a 200", async () => {
      const expectedStatusCode = 200;
      const userId = new mongoose.Types.ObjectId();
      bcrypt.compare = jest.fn().mockReturnValue(true);

      User.findOne = jest
        .fn()
        .mockResolvedValue({ ...userLoginMock, _id: userId });

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call its method json with a token", async () => {
      const token = jwt.sign(userRegisterMock, "secretshh");

      const userId = new mongoose.Types.ObjectId();
      User.findOne = jest
        .fn()
        .mockResolvedValue({ ...userLoginMock, _id: userId });
      bcrypt.compare = jest.fn().mockReturnValue(true);
      jwt.sign = jest.fn().mockReturnValue(token);

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(res.json).toHaveBeenCalledWith({ token });
    });
  });
});
